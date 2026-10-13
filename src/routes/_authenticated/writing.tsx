import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FeedbackCard } from "@/components/feedback-card";
import { WRITING } from "@/lib/ielts/content";
import { evaluateWriting, type Feedback } from "@/lib/ielts/ai.functions";
import { wordCount } from "@/lib/ielts/answers";
import { formatBand } from "@/lib/ielts/bands";
import { submissionsQuery, uid } from "@/lib/ielts/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/writing")({
  head: () => ({ meta: [{ title: "Writing practice — IELTS Mastery AI" }, { name: "description", content: "IELTS Writing Task 1 and 2 with AI band feedback." }] }),
  component: Writing,
});

function Writing() {
  const [pid, setPid] = useState(WRITING[0]!.id);
  const p = WRITING.find((w) => w.id === pid)!;
  const [text, setText] = useState("");
  const [left, setLeft] = useState(p.minutes * 60);
  const [busy, setBusy] = useState(false);
  const [fb, setFb] = useState<Feedback | null>(null);
  const qc = useQueryClient();
  const { data: history } = useQuery(submissionsQuery("writing"));

  useEffect(() => { setLeft(p.minutes * 60); setText(""); setFb(null); }, [pid, p.minutes]);
  useEffect(() => {
    if (fb) return undefined;
    const t = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(t);
  }, [fb, pid]);

  const words = wordCount(text);

  async function submit() {
    if (words < 30) { toast("Write a bit more before asking for feedback."); return; }
    setBusy(true);
    try {
      const f = await evaluateWriting({ data: { task: p.task, prompt: p.prompt, response: text } });
      const user_id = await uid();
      await supabase.from("practice_submissions").insert({ user_id, skill: "writing", prompt: p.title, response: text, band: f.overall, feedback: f as never });
      await supabase.from("skill_scores").insert({ user_id, skill: "writing", band: f.overall, source: `writing-${p.task}` });
      qc.invalidateQueries();
      setFb(f);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Feedback failed");
    } finally { setBusy(false); }
  }

  return (
    <div>
      <PageHeader title="Writing" sub="Write under time, then get AI feedback on the four official criteria." />
      <div className="mb-4 flex flex-wrap gap-2">
        {WRITING.map((w) => (
          <Button key={w.id} size="sm" variant={w.id === pid ? "default" : "outline"} onClick={() => setPid(w.id)}>{w.title}</Button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-card">
          <p className="whitespace-pre-wrap text-sm">{p.prompt}</p>
        </div>
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className={cn(words < p.minWords ? "text-muted-foreground" : "text-success")}>{words} / {p.minWords} words</span>
            <span className={cn(left < 120 && "text-destructive")}>{String(Math.floor(left / 60)).padStart(2, "0")}:{String(left % 60).padStart(2, "0")}</span>
          </div>
          <Textarea rows={16} value={text} onChange={(e) => setText(e.target.value)} disabled={!!fb} placeholder="Start writing here…" />
          <div className="mt-3 flex gap-2">
            {!fb ? <Button onClick={submit} disabled={busy}>{busy ? "Marking…" : "Get AI feedback"}</Button>
              : <Button variant="outline" onClick={() => { setFb(null); setText(""); setLeft(p.minutes * 60); }}>Write again</Button>}
          </div>
        </div>
      </div>
      {fb && <div className="mt-8"><FeedbackCard f={fb} /></div>}
      {!!history?.length && (
        <div className="mt-10">
          <h2 className="mb-3 text-xl">Past essays</h2>
          <div className="divide-y rounded-xl border bg-card">
            {history.slice(0, 10).map((h) => (
              <div key={h.id} className="flex justify-between p-3 text-sm">
                <span>{h.prompt} · {new Date(h.created_at).toLocaleDateString()}</span>
                <span className="font-medium">{formatBand(h.band)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
