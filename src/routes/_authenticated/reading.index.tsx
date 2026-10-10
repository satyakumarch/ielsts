import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { READING_TESTS, allQuestions } from "@/lib/ielts/reading-bank";
import { attemptsQuery } from "@/lib/ielts/data";
import { formatBand } from "@/lib/ielts/bands";

export const Route = createFileRoute("/_authenticated/reading/")({
  head: () => ({ meta: [{ title: "Reading practice — IELTS Mastery AI" }, { name: "description", content: "Timed IELTS Academic Reading tests." }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(attemptsQuery),
  component: ReadingList,
});

function ReadingList() {
  const { data: attempts } = useSuspenseQuery(attemptsQuery);
  return (
    <div>
      <PageHeader title="Reading" sub="Full 60-minute tests or one passage at a time (20 minutes)." />
      <div className="grid gap-4">
        {READING_TESTS.map((t) => (
          <div key={t.id} className="rounded-xl border bg-card p-6 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl">{t.title}</h2>
                <p className="text-sm text-muted-foreground">{allQuestions(t).length} questions · {t.minutes} minutes · Verified answer key</p>
              </div>
              <Button asChild><Link to="/reading/$testId" params={{ testId: t.id }} search={{ scope: "full" }}>Start full test</Link></Button>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {t.passages.map((p, i) => (
                <Link key={p.id} to="/reading/$testId" params={{ testId: t.id }} search={{ scope: p.id }} className="rounded-lg border p-3 text-sm hover:bg-accent">
                  <div className="text-xs text-muted-foreground">Passage {i + 1} · {p.topic}</div>
                  <div className="font-medium">{p.title}</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <h2 className="mb-3 mt-10 text-2xl">Your attempts</h2>
      {attempts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No attempts yet.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-muted-foreground"><tr><th className="p-3">Date</th><th className="p-3">Scope</th><th className="p-3">Score</th><th className="p-3">Band</th></tr></thead>
            <tbody>
              {attempts.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-3">{new Date(a.created_at).toLocaleDateString()}</td>
                  <td className="p-3">{a.scope === "full" ? "Full test" : `Passage ${a.scope.replace("p", "")}`}</td>
                  <td className="p-3">{a.correct}/{a.total}</td>
                  <td className="p-3 font-semibold">{formatBand(a.band)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
