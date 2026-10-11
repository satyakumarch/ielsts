import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Highlighter, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTest, allQuestions, QTYPE_LABEL } from "@/lib/ielts/reading-bank";
import { isCorrect } from "@/lib/ielts/answers";
import { rawToBand, ACADEMIC_READING_TABLE, formatBand, roundToHalfBand } from "@/lib/ielts/bands";
import { uid } from "@/lib/ielts/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/reading/$testId")({
  validateSearch: (s: Record<string, unknown>) => ({ scope: typeof s["scope"] === "string" ? s["scope"] : "full" }),
  loader: ({ params }) => {
    const test = getTest(params.testId);
    if (!test) throw notFound();
    return { test };
  },
  head: () => ({ meta: [{ title: "Reading test — IELTS Mastery AI" }, { name: "description", content: "Timed IELTS Reading test." }] }),
  component: TestPage,
});

function TestPage() {
  const { test } = Route.useLoaderData();
  const { scope } = Route.useSearch();
  const passages = scope === "full" ? test.passages : test.passages.filter((p) => p.id === scope);
  const questions = useMemo(() => allQuestions(test, scope === "full" ? undefined : scope), [test, scope]);
  const totalSeconds = scope === "full" ? test.minutes * 60 : 20 * 60;
  const [active, setActive] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [left, setLeft] = useState(totalSeconds);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);
  const qc = useQueryClient();

  useEffect(() => {
    if (submitted) return undefined;
    const t = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(t);
  }, [submitted]);
  useEffect(() => {
    if (left === 0 && !submitted) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  function highlight() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !articleRef.current?.contains(sel.anchorNode)) return toast("Select text in the passage first");
    try {
      const mark = document.createElement("mark");
      mark.className = "hl";
      sel.getRangeAt(0).surroundContents(mark);
      sel.removeAllRanges();
    } catch {
      toast("Highlight within a single paragraph");
    }
  }

  const correctCount = questions.filter((q) => isCorrect(answers[q.n], q.answers)).length;
  // Partial tests are scaled to 40 for an estimate.
  const band = scope === "full"
    ? rawToBand(correctCount, ACADEMIC_READING_TABLE)
    : roundToHalfBand(rawToBand(Math.round((correctCount / questions.length) * 40), ACADEMIC_READING_TABLE));

  async function submit() {
    if (submitted || saving) return;
    setSaving(true);
    try {
      const user_id = await uid();
      const byType: Record<string, { correct: number; total: number }> = {};
      for (const q of questions) {
        const r = (byType[q.type] ??= { correct: 0, total: 0 });
        r.total++;
        if (isCorrect(answers[q.n], q.answers)) r.correct++;
      }
      const { error } = await supabase.from("reading_attempts").insert({
        user_id, test_id: test.id, scope, mode: "practice", answers, by_type: byType,
        correct: correctCount, total: questions.length, band, seconds_spent: totalSeconds - left,
      });
      if (error) throw error;
      const wrong = questions.filter((q) => !isCorrect(answers[q.n], q.answers));
      if (wrong.length) {
        await supabase.from("mistakes").insert(wrong.map((q) => ({
          user_id, skill: "reading", category: QTYPE_LABEL[q.type], question_type: q.type,
          question: q.prompt, user_answer: answers[q.n] || null, correct_answer: q.answers[0] ?? "", explanation: q.explanation,
        })));
      }
      await supabase.from("skill_scores").insert({ user_id, skill: "reading", band, source: "reading-test" });
      qc.invalidateQueries();
      setSubmitted(true);
      window.scrollTo({ top: 0 });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save results");
    } finally {
      setSaving(false);
    }
  }

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const passage = passages[active] ?? passages[0]!;

  if (submitted) {
    const byType = new Map<string, { c: number; t: number }>();
    questions.forEach((q) => {
      const r = byType.get(q.type) ?? { c: 0, t: 0 };
      r.t++; if (isCorrect(answers[q.n], q.answers)) r.c++;
      byType.set(q.type, r);
    });
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-xl bg-hero p-8 text-hero-foreground">
          <div className="text-sm opacity-70">{test.title}{scope !== "full" && ` · ${passage.title}`}</div>
          <div className="mt-2 flex flex-wrap items-end gap-8">
            <div><div className="text-sm opacity-70">Score</div><div className="font-display text-5xl">{correctCount}/{questions.length}</div></div>
            <div><div className="text-sm opacity-70">Estimated band</div><div className="font-display text-5xl text-gold">{formatBand(band)}</div></div>
          </div>
          <p className="mt-4 text-xs opacity-70">Band is an estimate{scope !== "full" ? ", scaled from a single passage" : ""}.</p>
        </div>
        <h2 className="mb-3 mt-8 text-2xl">By question type</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {[...byType].map(([t, r]) => (
            <div key={t} className="flex justify-between rounded-lg border bg-card p-3 text-sm">
              <span>{QTYPE_LABEL[t as keyof typeof QTYPE_LABEL]}</span><b>{r.c}/{r.t}</b>
            </div>
          ))}
        </div>
        <h2 className="mb-3 mt-8 text-2xl">Answers</h2>
        <div className="space-y-2">
          {questions.map((q) => {
            const ok = isCorrect(answers[q.n], q.answers);
            return (
              <div key={q.n} className={cn("rounded-lg border p-4 text-sm", ok ? "border-success/40" : "border-destructive/40")}>
                <p><b>{q.n}.</b> {q.prompt}</p>
                <p className="mt-1">Your answer: <span className={ok ? "text-success" : "text-destructive"}>{answers[q.n] || "—"}</span>{!ok && <> · Correct: <b>{q.answers[0]}</b></>}</p>
                <p className="mt-1 text-muted-foreground">{q.explanation}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-8 flex gap-2">
          <Button asChild><Link to="/mistakes">Review in Mistake Notebook</Link></Button>
          <Button asChild variant="outline"><Link to="/dashboard">Dashboard</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b bg-card px-4 py-2">
        <Link to="/reading" className="text-sm text-muted-foreground hover:text-foreground">← Exit</Link>
        <div className={cn("flex items-center gap-2 font-mono text-lg", left < 300 && "text-destructive")}>
          <Clock className="h-4 w-4" /> {mm}:{ss}
        </div>
        <Button size="sm" onClick={() => confirm("Submit your answers?") && submit()} disabled={saving}>Submit</Button>
      </header>
      {passages.length > 1 && (
        <div className="flex gap-1 border-b bg-muted px-4 py-1">
          {passages.map((p, i) => (
            <button key={p.id} onClick={() => setActive(i)} className={cn("rounded px-3 py-1 text-sm", active === i && "bg-card font-medium shadow-card")}>
              Passage {i + 1}
            </button>
          ))}
        </div>
      )}
      <div className="grid min-h-0 flex-1 md:grid-cols-2">
        <div ref={articleRef} className="overflow-y-auto border-r p-6 leading-relaxed">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-2xl">{passage.title}</h2>
            <Button size="sm" variant="outline" onMouseDown={(e) => e.preventDefault()} onClick={highlight}>
              <Highlighter className="mr-1 h-3.5 w-3.5" /> Highlight
            </Button>
          </div>
          {passage.paragraphs.map((p, i) => (
            <p key={`${passage.id}-${i}`} className="mb-4">{p.label && <b className="mr-2">{p.label}</b>}{p.text}</p>
          ))}
        </div>
        <div className="overflow-y-auto p-6">
          {passage.groups.map((g, gi) => (
            <div key={gi} className="mb-8">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{QTYPE_LABEL[g.type]}</div>
              <p className="mb-3 mt-1 text-sm italic">{g.instructions}</p>
              {g.options && g.type === "headings" && (
                <ul className="mb-3 rounded border bg-muted p-3 text-xs">{g.options.map((o) => <li key={o.value}><b>{o.value}</b> {o.label}</li>)}</ul>
              )}
              <div className="space-y-3">
                {g.questions.map((q) => {
                  const opts = q.options ?? g.options;
                  return (
                    <div key={q.n} className="text-sm">
                      <p><b>{q.n}.</b> {q.prompt}</p>
                      {opts ? (
                        <select className="mt-1 w-full rounded-md border bg-background p-2" value={answers[q.n] ?? ""} onChange={(e) => setAnswers({ ...answers, [q.n]: e.target.value })}>
                          <option value="">Choose…</option>
                          {opts.map((o) => <option key={o.value} value={o.value}>{g.type === "headings" ? o.value : o.label}</option>)}
                        </select>
                      ) : (
                        <Input className="mt-1" value={answers[q.n] ?? ""} onChange={(e) => setAnswers({ ...answers, [q.n]: e.target.value })} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
