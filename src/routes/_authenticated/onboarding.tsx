import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BAND_OPTIONS, roundToHalfBand } from "@/lib/ielts/bands";
import { READING_TESTS, allQuestions } from "@/lib/ielts/reading-bank";
import { isCorrect } from "@/lib/ielts/answers";
import { SKILLS, buildWeekPlan, uid } from "@/lib/ielts/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({ meta: [{ title: "Get started — IELTS Mastery AI" }, { name: "description", content: "Set your target band and take a short diagnostic." }] }),
  component: Onboarding,
});

const SELF_LEVELS = [
  { label: "Beginner", band: 4.5 },
  { label: "Intermediate", band: 5.5 },
  { label: "Upper-intermediate", band: 6.5 },
  { label: "Advanced", band: 7.5 },
];

function Onboarding() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [target, setTarget] = useState(7);
  const [testDate, setTestDate] = useState("");
  const [daily, setDaily] = useState(60);
  const [self, setSelf] = useState<Record<string, number>>({ listening: 5.5, writing: 5.5, speaking: 5.5 });
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const test = READING_TESTS[0];
  const passage = test.passages[0];
  const diag = useMemo(() => allQuestions(test, passage.id).slice(0, 8), [test, passage.id]);

  async function finish() {
    setBusy(true);
    try {
      const id = await uid();
      const correct = diag.filter((q) => isCorrect(answers[q.n], q.answers)).length;
      // Scale 8 diagnostic questions to an estimate (rough, labelled as such).
      const readingBand = roundToHalfBand(Math.min(9, 3 + (correct / diag.length) * 5));
      const weak = [...SKILLS]
        .map((s) => ({ s, b: s === "reading" ? readingBand : self[s] }))
        .sort((a, b) => a.b - b.b)
        .slice(0, 2)
        .map((x) => x.s);
      const current = roundToHalfBand((readingBand + self.listening + self.writing + self.speaking) / 4);
      const { error } = await supabase.from("profiles").upsert({
        id, display_name: name || null, target_band: target, test_date: testDate || null,
        daily_minutes: daily, exam_type: "academic", weak_skills: weak, current_band: current, onboarded: true,
      });
      if (error) throw error;
      await supabase.from("skill_scores").insert([
        { user_id: id, skill: "reading", band: readingBand, source: "diagnostic" },
        ...(["listening", "writing", "speaking"] as const).map((s) => ({ user_id: id, skill: s, band: self[s], source: "self-assessment" })),
      ]);
      await supabase.from("study_tasks").insert(buildWeekPlan({ weak, dailyMinutes: daily }).map((t) => ({ ...t, user_id: id })));
      await qc.invalidateQueries();
      toast.success(`Diagnostic done: ${correct}/${diag.length} correct`);
      navigate({ to: "/dashboard" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-gold" : "bg-muted")} />
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-6">
          <h1 className="text-4xl">Let's set your goal</h1>
          <div className="space-y-1.5">
            <Label>Your name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya" />
          </div>
          <div className="space-y-2">
            <Label>Target overall band</Label>
            <div className="flex flex-wrap gap-2">
              {BAND_OPTIONS.map((b) => (
                <button key={b} onClick={() => setTarget(b)} className={cn("rounded-md border px-3 py-1.5 text-sm", target === b && "border-gold bg-accent font-semibold")}>
                  {b.toFixed(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Test date (optional)</Label>
              <Input type="date" value={testDate} onChange={(e) => setTestDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Minutes per day</Label>
              <Input type="number" min={15} max={300} value={daily} onChange={(e) => setDaily(Number(e.target.value) || 60)} />
            </div>
          </div>
          <Button onClick={() => setStep(1)}>Next</Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <h1 className="text-4xl">How confident are you?</h1>
          <p className="text-muted-foreground">Rate the skills we can't test yet. We'll measure Reading in the next step.</p>
          {(["listening", "writing", "speaking"] as const).map((s) => (
            <div key={s}>
              <Label className="capitalize">{s}</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {SELF_LEVELS.map((l) => (
                  <button key={l.label} onClick={() => setSelf({ ...self, [s]: l.band })} className={cn("rounded-md border px-3 py-1.5 text-sm", self[s] === l.band && "border-gold bg-accent font-semibold")}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
            <Button onClick={() => setStep(2)}>Start diagnostic</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h1 className="text-4xl">Quick Reading diagnostic</h1>
          <p className="text-muted-foreground">Read the passage and answer 8 questions. About 10 minutes.</p>
          <article className="max-h-96 space-y-3 overflow-y-auto rounded-xl border bg-card p-5 text-sm leading-relaxed">
            <h2 className="text-xl">{passage.title}</h2>
            {passage.paragraphs.map((p, i) => (
              <p key={i}>{p.label && <b className="mr-2">{p.label}</b>}{p.text}</p>
            ))}
          </article>
          <div className="space-y-4">
            {diag.map((q) => (
              <div key={q.n} className="rounded-lg border p-4">
                <p className="text-sm"><b>{q.n}.</b> {q.prompt}</p>
                {q.options ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {q.options.map((o) => (
                      <button key={o.value} onClick={() => setAnswers({ ...answers, [q.n]: o.value })} className={cn("rounded border px-2.5 py-1 text-xs", answers[q.n] === o.value && "border-gold bg-accent font-semibold")}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <Input className="mt-2" value={answers[q.n] ?? ""} onChange={(e) => setAnswers({ ...answers, [q.n]: e.target.value })} />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={finish} disabled={busy}>{busy ? "Saving…" : "Finish & see my dashboard"}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
