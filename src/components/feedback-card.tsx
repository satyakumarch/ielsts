import type { Feedback } from "@/lib/ielts/ai.functions";
import { formatBand } from "@/lib/ielts/bands";

export function FeedbackCard({ f }: { f: Feedback }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-hero p-6 text-hero-foreground">
        <div className="text-sm opacity-70">Estimated band (AI)</div>
        <div className="font-display text-5xl text-gold">{formatBand(f.overall)}</div>
        <p className="mt-2 text-xs opacity-70">AI estimate for practice only — not an official IELTS score.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {f.criteria.map((c) => (
          <div key={c.name} className="rounded-lg border bg-card p-4">
            <div className="flex justify-between font-medium"><span>{c.name}</span><span>{formatBand(c.band)}</span></div>
            <p className="mt-1 text-sm text-muted-foreground">{c.comment}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border bg-card p-4">
          <div className="font-medium">Strengths</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{f.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="font-medium">How to improve</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{f.improvements.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      </div>
      {f.improved_version && (
        <div className="rounded-lg border bg-card p-4">
          <div className="font-medium">Model answer</div>
          <p className="mt-2 whitespace-pre-wrap text-sm">{f.improved_version}</p>
        </div>
      )}
    </div>
  );
}

export function useCountdown() {
  return null;
}
