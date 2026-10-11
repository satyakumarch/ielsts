import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ACADEMIC_READING_TABLE, LISTENING_TABLE, BAND_OPTIONS, answersNeededFor, formatBand, overallBand, rawToBand } from "@/lib/ielts/bands";

export const Route = createFileRoute("/_authenticated/calculator")({
  head: () => ({ meta: [{ title: "Band score calculator — IELTS Mastery AI" }, { name: "description", content: "Convert raw scores to IELTS bands and calculate your overall band." }] }),
  component: Calc,
});

function Calc() {
  const [listening, setListening] = useState(28);
  const [reading, setReading] = useState(27);
  const [writing, setWriting] = useState(6);
  const [speaking, setSpeaking] = useState(6.5);
  const [target, setTarget] = useState(7);
  const lb = rawToBand(listening, LISTENING_TABLE);
  const rb = rawToBand(reading, ACADEMIC_READING_TABLE);
  const overall = overallBand([lb, rb, writing, speaking]);
  const bandSelect = (v: number, set: (n: number) => void) => (
    <select value={v} onChange={(e) => set(Number(e.target.value))} className="w-full rounded-md border bg-background p-2">
      {[...[3, 3.5], ...BAND_OPTIONS].map((b) => <option key={b} value={b}>{b.toFixed(1)}</option>)}
    </select>
  );
  return (
    <div>
      <PageHeader title="Band score calculator" sub="Academic module. Conversions are estimates based on published guidance." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5 rounded-xl border bg-card p-6 shadow-card">
          <div><Label>Listening — correct answers (0–40)</Label><Input type="number" min={0} max={40} value={listening} onChange={(e) => setListening(Number(e.target.value))} /><p className="mt-1 text-sm text-muted-foreground">Band {formatBand(lb)}</p></div>
          <div><Label>Reading — correct answers (0–40)</Label><Input type="number" min={0} max={40} value={reading} onChange={(e) => setReading(Number(e.target.value))} /><p className="mt-1 text-sm text-muted-foreground">Band {formatBand(rb)}</p></div>
          <div><Label>Writing band</Label>{bandSelect(writing, setWriting)}</div>
          <div><Label>Speaking band</Label>{bandSelect(speaking, setSpeaking)}</div>
          <div><Label>Target overall</Label>{bandSelect(target, setTarget)}</div>
        </div>
        <div className="rounded-xl bg-hero p-8 text-hero-foreground">
          <div className="text-sm opacity-70">Overall band</div>
          <div className="font-display text-7xl text-gold">{formatBand(overall)}</div>
          <p className="mt-2 text-sm opacity-80">{overall >= target ? "You meet your target." : `${(target - overall).toFixed(1)} below your target.`}</p>
          <div className="mt-6 space-y-1 text-sm opacity-90">
            <p>To reach {target.toFixed(1)} in Listening: {answersNeededFor(listening, target, LISTENING_TABLE) ?? "—"} more correct</p>
            <p>To reach {target.toFixed(1)} in Reading: {answersNeededFor(reading, target, ACADEMIC_READING_TABLE) ?? "—"} more correct</p>
          </div>
          <p className="mt-6 text-xs opacity-60">Overall = average of four skills, rounded to the nearest half band (.25 rounds up to .5, .75 up to the next band).</p>
        </div>
      </div>
    </div>
  );
}
