import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { buildWeekPlan, profileQuery, tasksQuery, uid } from "@/lib/ielts/data";

export const Route = createFileRoute("/_authenticated/study-plan")({
  head: () => ({ meta: [{ title: "Study plan — IELTS Mastery AI" }, { name: "description", content: "Your weekly IELTS study plan." }] }),
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(tasksQuery), context.queryClient.ensureQueryData(profileQuery)]),
  component: Plan,
});

function Plan() {
  const { data: tasks } = useSuspenseQuery(tasksQuery);
  const { data: profile } = useSuspenseQuery(profileQuery);
  const qc = useQueryClient();
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = tasks.filter((t) => t.task_date >= today);
  const days = [...new Set(upcoming.map((t) => t.task_date))];
  const done = upcoming.filter((t) => t.done).length;

  async function toggle(id: string, v: boolean) {
    await supabase.from("study_tasks").update({ done: v }).eq("id", id);
    qc.invalidateQueries({ queryKey: tasksQuery.queryKey });
  }
  async function regenerate() {
    const user_id = await uid();
    await supabase.from("study_tasks").delete().gte("task_date", today).eq("done", false);
    await supabase.from("study_tasks").insert(buildWeekPlan({ weak: profile?.weak_skills ?? [], dailyMinutes: profile?.daily_minutes ?? 60 }).map((t) => ({ ...t, user_id })));
    qc.invalidateQueries({ queryKey: tasksQuery.queryKey });
    toast.success("New 7-day plan created");
  }

  return (
    <div>
      <PageHeader title="Study plan" sub={`${done}/${upcoming.length} tasks done · focus: ${(profile?.weak_skills ?? []).join(", ") || "balanced"}`}>
        <Button variant="outline" onClick={regenerate}>Generate next 7 days</Button>
      </PageHeader>
      {days.length === 0 && <p className="text-muted-foreground">No upcoming tasks. Generate a new week.</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {days.map((d) => (
          <div key={d} className="rounded-xl border bg-card p-5 shadow-card">
            <h2 className="text-lg">{d === today ? "Today" : new Date(d + "T00:00").toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</h2>
            <ul className="mt-3 space-y-2">
              {upcoming.filter((t) => t.task_date === d).map((t) => (
                <li key={t.id} className="flex items-center gap-3 text-sm">
                  <Checkbox checked={t.done} onCheckedChange={(v) => toggle(t.id, v === true)} />
                  <span className={t.done ? "text-muted-foreground line-through" : ""}>
                    <span className="capitalize text-muted-foreground">{t.skill}</span> · {t.title} <span className="text-muted-foreground">({t.minutes}m)</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
