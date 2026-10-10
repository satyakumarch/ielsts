import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Headphones, PenLine, Mic, Target, NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IELTS Mastery AI — Your personal IELTS Academic coach" },
      { name: "description", content: "Timed Reading tests, band score estimates, a mistake notebook and a study plan built around your target band." },
      { property: "og:title", content: "IELTS Mastery AI — Your personal IELTS Academic coach" },
      { property: "og:description", content: "Practise, track your band score and reach your target for university admission." },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: BookOpen, t: "Real-format Reading tests", d: "40 questions, 60 minutes, highlighting and instant marking with explanations." },
  { icon: Target, t: "Band score tracking", d: "See your estimated band per skill and how far you are from your target." },
  { icon: NotebookPen, t: "Mistake notebook", d: "Every wrong answer is saved so you can review it until it sticks." },
  { icon: Headphones, t: "Listening", d: "Coming next — section-by-section practice with audio." },
  { icon: PenLine, t: "Writing feedback", d: "Coming next — AI feedback on Task 1 and Task 2." },
  { icon: Mic, t: "Speaking practice", d: "Coming next — cue cards and AI examiner." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-hero text-hero-foreground">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <span className="font-display text-2xl">
            IELTS <span className="text-gold">Mastery</span> AI
          </span>
          <Link to="/auth" className="text-sm opacity-90 hover:opacity-100">Sign in</Link>
        </nav>
        <div className="mx-auto max-w-6xl px-6 pb-24 pt-12 md:pt-20">
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-gold">IELTS Academic preparation</p>
          <h1 className="max-w-3xl text-5xl leading-[1.05] md:text-7xl">Reach the band your university asks for.</h1>
          <p className="mt-6 max-w-xl text-lg opacity-80">
            Take realistic timed tests, see exactly where marks are lost, and follow a weekly plan built around your test date.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/auth">Start free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-hero-foreground/30 bg-transparent text-hero-foreground hover:bg-hero-foreground/10">
              <Link to="/calculator">Try the band calculator</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-20 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.t} className="rounded-xl border bg-card p-6 shadow-card">
            <f.icon className="h-6 w-6 text-gold" />
            <h3 className="mt-4 text-xl">{f.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
          </div>
        ))}
      </section>
      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        Band scores shown are estimates. IELTS is a registered trademark of its owners; this site is not affiliated with them.
      </footer>
    </div>
  );
}
