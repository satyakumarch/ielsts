import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

const INFO: Record<string, { title: string; desc: string }> = {
  listening: { title: "Listening", desc: "Four-section listening tests with audio, note completion and map labelling." },
  writing: { title: "Writing", desc: "Task 1 and Task 2 practice with AI feedback on the four official criteria." },
  speaking: { title: "Speaking", desc: "Part 1–3 practice with recording and AI examiner feedback." },
  vocabulary: { title: "Vocabulary", desc: "Academic word lists with spaced-repetition review." },
  "mock-tests": { title: "Mock tests", desc: "Full four-skill exams under real timing." },
  "ai-tutor": { title: "AI tutor", desc: "Ask questions about strategy, grammar and your mistakes." },
};

export const Route = createFileRoute("/_authenticated/soon/$section")({
  head: () => ({ meta: [{ title: "Coming soon — IELTS Mastery AI" }, { name: "description", content: "This section is coming in the next stage." }] }),
  component: Soon,
});

function Soon() {
  const { section } = Route.useParams();
  const info = INFO[section] ?? { title: "Coming soon", desc: "" };
  return (
    <div>
      <PageHeader title={info.title} sub="Coming in the next stage" />
      <div className="max-w-xl rounded-xl border bg-card p-8 shadow-card">
        <p>{info.desc}</p>
        <p className="mt-2 text-sm text-muted-foreground">Meanwhile, Reading practice and the study plan are ready to use.</p>
        <Button asChild className="mt-6"><Link to="/reading">Go to Reading</Link></Button>
      </div>
    </div>
  );
}
