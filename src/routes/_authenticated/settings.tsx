import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { profileQuery, uid } from "@/lib/ielts/data";
import { BAND_OPTIONS } from "@/lib/ielts/bands";
import { deleteMyAccount } from "@/lib/ielts/account.functions";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — IELTS Mastery AI" }, { name: "description", content: "Profile, theme and account settings." }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(profileQuery),
  component: SettingsPage,
});

function SettingsPage() {
  const { data: p } = useSuspenseQuery(profileQuery);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [name, setName] = useState(p?.display_name ?? "");
  const [target, setTarget] = useState(p?.target_band ?? 7);
  const [date, setDate] = useState(p?.test_date ?? "");
  const [daily, setDaily] = useState(p?.daily_minutes ?? 60);
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);

  function toggleDark(v: boolean) {
    setDark(v);
    document.documentElement.classList.toggle("dark", v);
    localStorage.setItem("theme", v ? "dark" : "light");
  }
  async function save() {
    const id = await uid();
    const { error } = await supabase.from("profiles").update({ display_name: name, target_band: target, test_date: date || null, daily_minutes: daily }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: profileQuery.queryKey });
    toast.success("Saved");
  }
  async function del() {
    if (!confirm("Permanently delete your account and all your progress?")) return;
    try {
      await deleteMyAccount();
      qc.clear();
      await supabase.auth.signOut();
      navigate({ to: "/", replace: true });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete account");
    }
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Settings" />
      <section className="space-y-4 rounded-xl border bg-card p-6 shadow-card">
        <h2 className="text-xl">Profile & goal</h2>
        <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div><Label>Target band</Label>
            <select value={target} onChange={(e) => setTarget(Number(e.target.value))} className="w-full rounded-md border bg-background p-2">
              {BAND_OPTIONS.map((b) => <option key={b} value={b}>{b.toFixed(1)}</option>)}
            </select>
          </div>
          <div><Label>Test date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div><Label>Minutes/day</Label><Input type="number" value={daily} onChange={(e) => setDaily(Number(e.target.value))} /></div>
        </div>
        <Button onClick={save}>Save changes</Button>
      </section>
      <section className="mt-6 flex items-center justify-between rounded-xl border bg-card p-6 shadow-card">
        <div><h2 className="text-xl">Dark mode</h2><p className="text-sm text-muted-foreground">Easier on the eyes at night.</p></div>
        <Switch checked={dark} onCheckedChange={toggleDark} />
      </section>
      <section className="mt-6 rounded-xl border border-destructive/40 bg-card p-6">
        <h2 className="text-xl">Delete account</h2>
        <p className="mt-1 text-sm text-muted-foreground">Removes your profile, scores, attempts, mistakes and plan permanently.</p>
        <Button variant="destructive" className="mt-4" onClick={del}>Delete my account</Button>
      </section>
    </div>
  );
}
