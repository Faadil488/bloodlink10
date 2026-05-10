import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/bloodlink/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login | BloodLink Kerala" },
      { name: "description", content: "Login to manage your BloodLink Kerala donor dashboard." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function login(formData: FormData) {
    setLoading(true);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Welcome back!");
      navigate({ to: "/dashboard" });
    }
  }

  async function googleLogin() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) toast.error(String(result.error.message ?? result.error));
  }

  return (
    <PageShell>
      <section className="hero-bg px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-card)]">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
            <LogIn className="h-5 w-5" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-black sm:text-4xl">Welcome back</h1>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            Sign in to manage requests, availability, and your donor profile.
          </p>
          <form action={login} className="mt-6 space-y-3">
            <Field label="Email">
              <input name="email" type="email" required className={inputCls} placeholder="you@example.com" />
            </Field>
            <Field label="Password">
              <input name="password" type="password" required className={inputCls} placeholder="••••••••" />
            </Field>
            <button
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-black text-primary-foreground shadow-[var(--shadow-glow)] transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign in
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <button
            onClick={googleLogin}
            className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm font-bold text-foreground transition hover:-translate-y-0.5 hover:bg-secondary"
          >
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm font-semibold text-muted-foreground">
            New donor?{" "}
            <Link to="/register" className="font-black text-primary hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}

const inputCls =
  "w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm font-semibold outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-black uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
