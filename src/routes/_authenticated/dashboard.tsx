import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { attemptsQuery, latestBySkill, mistakesQuery, profileQuery, scoresQuery, SKILLS, tasksQuery } from "@/lib/ielts/data";
import { formatBand, overallBand } from "@/lib/ielts/bands";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — IELTS Mastery AI" }, { name: "description", content: "Your IELTS progress at a glance." }] }),
  loader: async ({ context }) => {
    const profile = await context.queryClient.ensureQueryData(profileQuery);
    if (!profile?.onboarded) throw redirect({ to: "/onboarding" });
    await Promise.all([
      context.queryClient.ensureQueryData(scoresQuery),
      context.queryClient.ensureQueryData(attemptsQuery),
      context.queryClient.ensureQueryData(mistakesQuery),
      context.queryClient.ensureQueryData(tasksQuery),
    ]);
  },
  component: Dashboard,
});

function Dashboard() {
  const { data: profile } = useSuspenseQuery(profileQuery);
  const { data: scores } = useSuspenseQuery(scoresQuery);
  const { data: attempts } = useSuspenseQuery(attemptsQuery);
  const { data: mistakes } = useSuspenseQuery(mistakesQuery);
  const { data: tasks } = useSuspenseQuery(tasksQuery);

  const latest = latestBySkill(scores);
  const vals = SKILLS.map((s) => latest[s]).filter((v): v is number => v != null);
  const overall = vals.length === 4 ? overallBand(vals) : null;
  const target = profile?.target_band ?? null;
  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = tasks.filter((t) => t.task_date === today);
  const daysLeft = profile?.test_date ? Math.ceil((new Date(profile.test_date).getTime() - Date.now()) / 86400000) : null;
  const chart = [...attempts].reverse().filter((a) => a.band != null).map((a, i) => ({ n: i + 1, band: Number(a.band) }));
  const openMistakes = mistakes.filter((m) => m.status !== "mastered").length;

  return (
    <div>
      <PageHeader title={`Hello${profile?.display_name ? ", " + profile.display_name : ""}`} sub="Here's where you stand today.">
        <Button asChild><Link to="/reading">Start a Reading test</Link></Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-hero p-6 text-hero-foreground md:col-span-1">
          <div className="text-sm opacity-70">Estimated overall band</div>
          <div className="font-display text-6xl">{formatBand(overall)}</div>
          <div className="mt-2 text-sm opacity-80">Target {formatBand(target)}{overall != null && target != null && overall < target ? ` · ${(target - overall).toFixed(1)} to go` : ""}</div>
          {daysLeft != null && <div className="mt-4 text-sm text-gold">{daysLeft > 0 ? `${daysLeft} days until your test` : "Test date passed"}</div>}
        </div>
        <div className="grid grid-cols-2 gap-4 md:col-span-2 md:grid-cols-4">
          {SKILLS.map((s) => (
            <div key={s} className="rounded-xl border bg-card p-5 shadow-card">
              <div className="text-sm capitalize text-muted-foreground">{s}</div>
              <div className="font-display text-4xl">{formatBand(latest[s])}</div>
              {target != null && latest[s] != null && (
                <div className="mt-3 h-1.5 rounded-full bg-muted">
                  <div className="h-1.5 rounded-full bg-gold" style={{ width: `${Math.min(100, ((latest[s] ?? 0) / target) * 100)}%` }} />
                </div>
              )}
              {profile?.weak_skills?.includes(s) && <div className="mt-2 text-xs text-destructive">Focus area</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-card lg:col-span-2">
          <h2 className="text-xl">Reading band history</h2>
          {chart.length < 1 ? (
            <p className="mt-6 text-sm text-muted-foreground">Complete a Reading test to see your progress here.</p>
          ) : (
            <div className="mt-4 h-56">
              <ResponsiveContainer>
                <LineChart data={chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="n" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis domain={[0, 9]} stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="band" stroke="var(--color-gold)" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-xl">Today</h2>
            <Link to="/study-plan" className="text-xs text-muted-foreground hover:text-foreground">Full plan →</Link>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {todayTasks.length === 0 && <li className="text-muted-foreground">Nothing planned today.</li>}
            {todayTasks.map((t) => (
              <li key={t.id} className={t.done ? "text-muted-foreground line-through" : ""}>
                <span className="capitalize text-muted-foreground">{t.skill}:</span> {t.title} · {t.minutes}m
              </li>
            ))}
          </ul>
          <Link to="/mistakes" className="mt-6 block rounded-lg bg-accent p-4 text-sm">
            <b>{openMistakes}</b> mistakes to review in your notebook
          </Link>
        </div>
      </div>
    </div>
  );
}
