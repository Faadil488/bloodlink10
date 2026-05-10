import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { PageShell } from "@/components/bloodlink/AppShell";
import { bloodGroups, keralaDistricts } from "@/lib/bloodlink-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Become a Donor | BloodLink Kerala" },
      { name: "description", content: "Register as a Kerala blood donor and manage your availability." },
    ],
  }),
  component: RegisterPage,
});

const schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  password: z.string().min(8).max(72),
  blood_group: z.enum(bloodGroups),
  district: z.string().min(1),
  area: z.string().trim().min(2).max(120),
  last_donation: z.string().optional(),
});

function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function register(formData: FormData) {
    setLoading(true);
    const parsed = schema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      toast.error("Please complete all fields correctly. Password must be 8+ characters.");
      setLoading(false);
      return;
    }
    const data = parsed.data;
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { emailRedirectTo: window.location.origin, data: { full_name: data.full_name } },
    });
    if (error || !signUpData.user) {
      toast.error(error?.message ?? "Registration failed.");
      setLoading(false);
      return;
    }
    const userId = signUpData.user.id;
    await supabase
      .from("profiles")
      .insert({ user_id: userId, full_name: data.full_name, email: data.email, phone: data.phone });
    await supabase.from("user_roles").insert({ user_id: userId, role: "donor" });
    await supabase.from("donors").insert([
      {
        user_id: userId,
        blood_group: data.blood_group,
        district: data.district,
        area: data.area,
        available: true,
        last_donation: data.last_donation || null,
      },
    ]);
    setLoading(false);
    toast.success("Registration submitted! Check your email to confirm.");
    setTimeout(() => navigate({ to: "/login" }), 1400);
  }

  return (
    <PageShell>
      <section className="hero-bg px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
              <UserPlus className="h-5 w-5" />
            </div>
            <h1 className="mt-5 font-display text-4xl font-black sm:text-5xl">Become a donor</h1>
            <p className="mt-4 max-w-md text-base font-semibold leading-7 text-muted-foreground">
              Join Kerala&rsquo;s emergency-ready donor network. You&rsquo;ll control your
              availability and only get notified for matches in your district.
            </p>
            <ul className="mt-6 space-y-2 text-sm font-bold text-muted-foreground">
              <li>• Verified-first profiles</li>
              <li>• District-aware notifications</li>
              <li>• Emergency status toggle</li>
            </ul>
          </div>
          <form
            action={register}
            className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full name"><input name="full_name" required className={inputCls} /></Field>
              <Field label="Email"><input name="email" type="email" required className={inputCls} /></Field>
              <Field label="Phone"><input name="phone" required className={inputCls} /></Field>
              <Field label="Password"><input name="password" type="password" required className={inputCls} placeholder="8+ characters" /></Field>
              <Field label="Blood group">
                <select name="blood_group" required className={inputCls} defaultValue="">
                  <option value="" disabled>Select group</option>
                  {bloodGroups.map((g) => <option key={g}>{g}</option>)}
                </select>
              </Field>
              <Field label="District">
                <select name="district" required className={inputCls} defaultValue="">
                  <option value="" disabled>Select district</option>
                  {keralaDistricts.map((d) => <option key={d.name}>{d.name}</option>)}
                </select>
              </Field>
              <Field label="Area"><input name="area" required className={inputCls} placeholder="e.g. Kakkanad" /></Field>
              <Field label="Last donation"><input name="last_donation" type="date" className={inputCls} /></Field>
            </div>
            <button
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-black text-primary-foreground shadow-[var(--shadow-glow)] transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create donor account
            </button>
          </form>
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
