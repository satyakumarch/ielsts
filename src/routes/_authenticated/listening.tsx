import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Play, Square } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LISTENING } from "@/lib/ielts/content";
import { isCorrect } from "@/lib/ielts/answers";
import { rawToBand, LISTENING_TABLE, formatBand } from "@/lib/ielts/bands";
import { uid } from "@/lib/ielts/data";

export const Route = createFileRoute("/_authenticated/listening")({
  head: () => ({ meta: [{ title: "Listening practice — IELTS Mastery AI" }, { name: "description", content: "IELTS Listening practice with audio and instant marking." }] }),
  component: Listening,
});

function Listening() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [playing, setPlaying] = useState<string | null>(null);
  const [plays, setPlays] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ correct: number; total: number; band: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();
  const questions = LISTENING.flatMap((s) => s.questions);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function play(id: string, script: string) {
    const synth = window.speechSynthesis;
    if (!synth) return toast.error("Your browser can't play audio for this test. Try Chrome or Edge.");
    if (playing) { synth.cancel(); setPlaying(null); return; }
    if ((plays[id] ?? 0) >= 1) return toast("In the real test you hear the audio once only.");
    const u = new SpeechSynthesisUtterance(script);
    u.lang = "en-GB"; u.rate = 0.95;
    u.onend = () => setPlaying(null);
    setPlays((p) => ({ ...p, [id]: (p[id] ?? 0) + 1 }));
    setPlaying(id);
    synth.speak(u);
  }

  async function submit() {
    setSaving(true);
    try {
      const user_id = await uid();
      const correct = questions.filter((q) => isCorrect(answers[q.n], q.answers)).length;
      const band = rawToBand(Math.round((correct / questions.length) * 40), LISTENING_TABLE);
      const wrong = questions.filter((q) => !isCorrect(answers[q.n], q.answers));
      if (wrong.length) {
        await supabase.from("mistakes").insert(wrong.map((q) => ({
          user_id, skill: "listening", category: "Listening", question_type: q.options ? "multiple-choice" : "completion",
          question: q.prompt, user_answer: answers[q.n] || null, correct_answer: q.answers[0]!, explanation: "Listen again for the exact words in the recording.",
        })));
      }
      const { error } = await supabase.from("skill_scores").insert({ user_id, skill: "listening", band, source: "listening-test" });
      if (error) throw error;
      qc.invalidateQueries();
      setResult({ correct, total: questions.length, band });
      window.scrollTo({ top: 0 });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally { setSaving(false); }
  }

  return (
    <div>
      <PageHeader title="Listening" sub="Press play, listen once, and answer as you go." />
      {result && (
        <div className="mb-6 rounded-xl bg-hero p-6 text-hero-foreground">
          <div className="text-sm opacity-70">Score {result.correct}/{result.total} (scaled to 40)</div>
          <div className="font-display text-5xl text-gold">{formatBand(result.band)}</div>
          <Button variant="secondary" className="mt-4" onClick={() => { setResult(null); setAnswers({}); setPlays({}); }}>Try again</Button>
        </div>
      )}
      <div className="space-y-6">
        {LISTENING.map((s) => (
          <section key={s.id} className="rounded-xl border bg-card p-6 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl">{s.title}</h2>
              <Button variant="outline" onClick={() => play(s.id, s.script)}>
                {playing === s.id ? <><Square className="mr-2 h-4 w-4" />Stop</> : <><Play className="mr-2 h-4 w-4" />Play audio</>}
              </Button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{s.context}</p>
            <div className="mt-4 space-y-3">
              {s.questions.map((q) => {
                const ok = result ? isCorrect(answers[q.n], q.answers) : null;
                return (
                  <div key={q.n} className="flex flex-wrap items-center gap-3">
                    <span className="w-6 font-medium">{q.n}</span>
                    <span className="flex-1 text-sm">{q.prompt}</span>
                    {q.options ? (
                      <div className="flex gap-2">
                        {q.options.map((o) => (
                          <Button key={o} size="sm" disabled={!!result} variant={answers[q.n] === o ? "default" : "outline"} onClick={() => setAnswers((a) => ({ ...a, [q.n]: o }))}>{o}</Button>
                        ))}
                      </div>
                    ) : (
                      <Input className="w-48" disabled={!!result} value={answers[q.n] ?? ""} onChange={(e) => setAnswers((a) => ({ ...a, [q.n]: e.target.value }))} />
                    )}
                    {result && <span className={ok ? "text-success text-sm" : "text-destructive text-sm"}>{ok ? "✓" : `✗ ${q.answers[0]}`}</span>}
                  </div>
                );
              })}
            </div>
            {result && <details className="mt-4 text-sm"><summary className="cursor-pointer text-muted-foreground">Show transcript</summary><p className="mt-2">{s.script}</p></details>}
          </section>
        ))}
      </div>
      {!result && <Button className="mt-6" onClick={submit} disabled={saving}>{saving ? "Marking…" : "Submit answers"}</Button>}
    </div>
  );
}
