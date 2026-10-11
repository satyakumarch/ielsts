import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { mistakesQuery } from "@/lib/ielts/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/mistakes")({
  head: () => ({ meta: [{ title: "Mistake notebook — IELTS Mastery AI" }, { name: "description", content: "Review every question you got wrong." }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(mistakesQuery),
  component: Mistakes,
});

function Mistakes() {
  const { data } = useSuspenseQuery(mistakesQuery);
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"open" | "mastered" | "all">("open");
  const [cat, setCat] = useState("all");
  const cats = [...new Set(data.map((m) => m.category))];
  const rows = data.filter((m) => (filter === "all" || (filter === "mastered" ? m.status === "mastered" : m.status !== "mastered")) && (cat === "all" || m.category === cat));

  async function setStatus(id: string, status: string) {
    await supabase.from("mistakes").update({ status }).eq("id", id);
    qc.invalidateQueries({ queryKey: mistakesQuery.queryKey });
  }
  async function remove(id: string) {
    await supabase.from("mistakes").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: mistakesQuery.queryKey });
  }

  return (
    <div>
      <PageHeader title="Mistake notebook" sub="Wrong answers are saved here automatically." />
      <div className="mb-4 flex flex-wrap gap-2">
        {(["open", "mastered", "all"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn("rounded-full border px-3 py-1 text-sm capitalize", filter === f && "bg-primary text-primary-foreground")}>{f === "open" ? "To review" : f}</button>
        ))}
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-full border bg-background px-3 py-1 text-sm">
          <option value="all">All types</option>
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      {rows.length === 0 && <p className="text-muted-foreground">Nothing here yet.</p>}
      <div className="space-y-3">
        {rows.map((m) => (
          <div key={m.id} className="rounded-xl border bg-card p-5 shadow-card">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{m.skill} · {m.category}</div>
            <p className="mt-2">{m.question}</p>
            <p className="mt-2 text-sm">You: <span className="text-destructive">{m.user_answer || "—"}</span> · Correct: <b className="text-success">{m.correct_answer}</b></p>
            {m.explanation && <p className="mt-1 text-sm text-muted-foreground">{m.explanation}</p>}
            <div className="mt-3 flex gap-2">
              {m.status === "mastered"
                ? <Button size="sm" variant="outline" onClick={() => setStatus(m.id, "open")}>Review again</Button>
                : <Button size="sm" onClick={() => setStatus(m.id, "mastered")}>Mark as mastered</Button>}
              <Button size="sm" variant="ghost" onClick={() => remove(m.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
