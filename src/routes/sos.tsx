import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, HeartPulse, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { PageShell } from "@/components/bloodlink/AppShell";
import { bloodGroups, keralaDistricts } from "@/lib/bloodlink-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/sos")({
  head: () => ({
    meta: [
      { title: "Emergency SOS | BloodLink Kerala" },
      { name: "description", content: "Submit an urgent Kerala blood requirement through BloodLink Kerala." },
    ],
  }),
  component: SosPage,
});

const sosSchema = z.object({
  requester_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(20),
  blood_group: z.enum(bloodGroups),
  district: z.string().min(1),
  hospital: z.string().trim().min(2).max(160),
  urgency: z.enum(["critical", "urgent", "scheduled"]),
  notes: z.string().max(1000).optional(),
});

function SosPage() {
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    const parsed = sosSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      toast.error("Please complete all required fields correctly.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.from("blood_requests").insert([parsed.data]);
    setLoading(false);
    if (error) toast.error("Unable to submit right now. Please try again.");
    else toast.success("SOS request submitted. Coordinators are alerted.");
  }

  return (
    <PageShell>
      <section className="hero-bg px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-card)]">
            <div
              className="grid h-24 w-24 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
              style={{ animation: "pulse-ring 1.8s infinite" }}
            >
              <AlertTriangle className="h-10 w-10" />
            </div>
            <h1 className="mt-7 font-display text-4xl font-black sm:text-5xl">Emergency SOS</h1>
            <p className="mt-3 text-base font-semibold leading-7 text-muted-foreground">
              Submit an urgent blood requirement with hospital and district details for fast donor
              discovery.
            </p>
            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-primary-soft p-4 text-primary">
              <HeartPulse className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-sm font-bold leading-6">
                For critical cases, also contact hospital emergency services immediately.
              </p>
            </div>
          </div>
          <form
            action={submit}
            className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Your name"><input name="requester_name" required className={inputCls} /></Field>
              <Field label="Phone"><input name="phone" required className={inputCls} /></Field>
              <Field label="Blood group needed">
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
              <div className="md:col-span-2">
                <Field label="Hospital"><input name="hospital" required className={inputCls} placeholder="Hospital name & location" /></Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Urgency">
                  <select name="urgency" className={inputCls} defaultValue="urgent">
                    <option value="critical">Critical (within hours)</option>
                    <option value="urgent">Urgent (within a day)</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Additional notes (optional)">
                  <textarea name="notes" rows={4} className={inputCls} placeholder="Any context that helps donors and coordinators." />
                </Field>
              </div>
            </div>
            <button
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-display text-lg font-black text-primary-foreground shadow-[var(--shadow-glow)] transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-5 w-5 animate-spin" />}
              Submit SOS request
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
