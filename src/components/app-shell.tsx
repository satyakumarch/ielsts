import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, BookOpen, Headphones, PenLine, Mic, Library, ClipboardList, NotebookPen,
  Calculator, CalendarCheck, Bot, Settings, LogOut, Menu, X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { profileQuery } from "@/lib/ielts/data";
import { formatBand } from "@/lib/ielts/bands";
import { cn } from "@/lib/utils";

type Item = { label: string; icon: typeof BookOpen; to: string; params?: Record<string, string>; soon?: boolean };

const NAV: Item[] = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Reading", icon: BookOpen, to: "/reading" },
  { label: "Listening", icon: Headphones, to: "/soon/$section", params: { section: "listening" }, soon: true },
  { label: "Writing", icon: PenLine, to: "/soon/$section", params: { section: "writing" }, soon: true },
  { label: "Speaking", icon: Mic, to: "/soon/$section", params: { section: "speaking" }, soon: true },
  { label: "Vocabulary", icon: Library, to: "/soon/$section", params: { section: "vocabulary" }, soon: true },
  { label: "Mock tests", icon: ClipboardList, to: "/soon/$section", params: { section: "mock-tests" }, soon: true },
  { label: "Mistake notebook", icon: NotebookPen, to: "/mistakes" },
  { label: "Band calculator", icon: Calculator, to: "/calculator" },
  { label: "Study plan", icon: CalendarCheck, to: "/study-plan" },
  { label: "AI tutor", icon: Bot, to: "/soon/$section", params: { section: "ai-tutor" }, soon: true },
  { label: "Settings", icon: Settings, to: "/settings" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data: profile } = useQuery(profileQuery);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const fullscreen = /^\/reading\/.+/.test(pathname) || pathname === "/onboarding";

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (fullscreen) return <div className="min-h-screen bg-background">{children}</div>;

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link to="/dashboard" className="font-display text-xl text-sidebar-foreground">
            IELTS <span className="text-sidebar-primary">Mastery</span> AI
          </Link>
          <button className="md:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to as "/dashboard"}
              params={item.params as never}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground font-medium" }}
              activeOptions={{ exact: false }}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.soon && (
                <span className="rounded bg-sidebar-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-sidebar-foreground/60">
                  Soon
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-4 text-sm">
          <div className="truncate font-medium">{profile?.display_name || "Student"}</div>
          <div className="text-xs text-sidebar-foreground/60">Target band {formatBand(profile?.target_band)}</div>
          <button onClick={signOut} className="mt-3 flex items-center gap-2 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground">
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-foreground/40 md:hidden" onClick={() => setOpen(false)} />}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b px-4 py-3 md:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display text-lg">IELTS Mastery AI</span>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl">{title}</h1>
        {sub && <p className="mt-1 text-muted-foreground">{sub}</p>}
      </div>
      {children}
    </div>
  );
}
