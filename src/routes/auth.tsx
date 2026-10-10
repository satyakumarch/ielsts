import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: typeof s.redirect === "string" ? s.redirect : undefined }),
  head: () => ({
    meta: [
      { title: "Sign in — IELTS Mastery AI" },
      { name: "description", content: "Sign in or create your free IELTS Mastery AI account." },
      { property: "og:title", content: "Sign in — IELTS Mastery AI" },
      { property: "og:description", content: "Sign in or create your free IELTS Mastery AI account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"in" | "up" | "forgot">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "up") {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/dashboard" } });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/reset-password" });
        if (error) throw error;
        toast.success("Password reset link sent.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if ("error" in res && res.error) toast.error(res.error.message);
    else if (!("redirected" in res && res.redirected)) navigate({ to: "/dashboard" });
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden bg-hero p-12 text-hero-foreground md:flex md:flex-col md:justify-between">
        <Link to="/" className="font-display text-2xl">IELTS <span className="text-gold">Mastery</span> AI</Link>
        <blockquote className="font-display text-3xl leading-snug">"Every wrong answer is a lesson you only need to learn once."</blockquote>
        <p className="text-sm opacity-70">Band scores are estimates based on published conversion guidance.</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl">{mode === "up" ? "Create your account" : mode === "forgot" ? "Reset password" : "Welcome back"}</h1>
          <Button variant="outline" className="mt-6 w-full" onClick={google} type="button">Continue with Google</Button>
          <div className="my-6 text-center text-xs text-muted-foreground">or with email</div>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {mode !== "forgot" && (
              <div className="space-y-1.5">
                <Label htmlFor="pw">Password</Label>
                <Input id="pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            )}
            <Button className="w-full" disabled={busy}>
              {mode === "up" ? "Sign up" : mode === "forgot" ? "Send reset link" : "Sign in"}
            </Button>
          </form>
          <div className="mt-4 flex justify-between text-sm text-muted-foreground">
            <button onClick={() => setMode(mode === "up" ? "in" : "up")} className="hover:text-foreground">
              {mode === "up" ? "Have an account? Sign in" : "New here? Sign up"}
            </button>
            {mode === "in" && <button onClick={() => setMode("forgot")} className="hover:text-foreground">Forgot password?</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
