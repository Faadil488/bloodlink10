import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Activity,
  CalendarDays,
  HeartPulse,
  Loader2,
  ShieldCheck,
  ToggleRight,
  UserCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/bloodlink/AppShell";
import { useAuth, type DonorStatus } from "@/components/bloodlink/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Donor Dashboard | BloodLink Kerala" },
      { name: "description", content: "Manage donor availability, requests, and donation history." },
    ],
  }),
  component: DashboardPage,
});

type RequestRow = {
  id: string;
  blood_group: string;
  hospital: string;
  district: string;
  urgency: string;
  status: string;
  created_at: string;
};
type DonationRow = { id: string; donation_date: string; location: string; notes: string | null };

const statusOptions: { value: DonorStatus; label: string; dot: string }[] = [
  { value: "available", label: "Available", dot: "bg-success" },
  { value: "busy", label: "Busy", dot: "bg-warning" },
  { value: "emergency", label: "Emergency", dot: "bg-primary" },
];

function DashboardPage() {
  const { user, profile, donor, loading, refresh } = useAuth();
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [history, setHistory] = useState<DonationRow[]>([]);
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    if (!user || !donor) return;

    supabase
      .from("blood_requests")
      .select("id,blood_group,hospital,district,urgency,status,created_at")
      .eq("district", donor.district ?? "")
      .eq("blood_group", (donor.blood_group ?? "") as never)
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => setRequests((data as RequestRow[]) ?? []));

    supabase
      .from("donation_history")
      .select("id,donation_date,location,notes")
      .eq("donor_id", donor.id)
      .order("donation_date", { ascending: false })
      .limit(10)
      .then(({ data }) => setHistory((data as DonationRow[]) ?? []));
  }, [user, donor]);

  if (loading) {
    return (
      <PageShell>
        <section className="px-4 py-16">
          <div className="mx-auto flex max-w-7xl items-center gap-3 rounded-3xl bg-secondary p-10 font-black">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading dashboard…
          </div>
        </section>
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell>
        <section className="hero-bg px-4 py-20">
          <div className="mx-auto max-w-md rounded-3xl bg-card p-8 text-center shadow-[var(--shadow-card)]">
            <h1 className="font-display text-3xl font-black">Login required</h1>
            <p className="mt-3 font-semibold text-muted-foreground">
              Please login to access your donor dashboard.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-black text-primary-foreground shadow-[var(--shadow-glow)]"
            >
              Login
            </Link>
          </div>
        </section>
      </PageShell>
    );
  }

  const name = profile?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "Donor";

  async function setStatus(s: DonorStatus) {
    if (!user) return;
    setSavingStatus(true);
    const { error } = await supabase
      .from("donors")
      .update({ status: s, available: s !== "busy" })
      .eq("user_id", user.id);
    setSavingStatus(false);
    if (error) toast.error(error.message);
    else {
      toast.success(`Status set to ${s}`);
      await refresh();
    }
  }

  const profileFields = [
    Boolean(profile?.full_name),
    Boolean(profile?.phone),
    Boolean(profile?.avatar_url),
    Boolean(donor?.blood_group),
    Boolean(donor?.district),
    Boolean(donor?.area),
    Boolean(donor?.last_donation),
    Boolean(donor?.verified),
  ];
  const completion = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);

  return (
    <PageShell>
      <section className="hero-bg px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-wide text-primary">Donor dashboard</p>
          <h1 className="mt-1 font-display text-4xl font-black sm:text-5xl">
            Welcome back, {name} 👋
          </h1>
          <p className="mt-3 max-w-2xl text-base font-semibold text-muted-foreground">
            Update your status, watch incoming requests in your district, and track your donation
            history — all in one place.
          </p>
          {!donor && (
            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-primary/30 bg-primary-soft px-5 py-4">
              <UserCircle2 className="h-5 w-5 text-primary" />
              <p className="text-sm font-bold text-primary">
                Finish your donor profile so we can match you with people who need your blood group.
              </p>
              <Link
                to="/profile"
                className="ml-auto rounded-full bg-primary px-4 py-2 text-xs font-black text-primary-foreground"
              >
                Complete profile
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={ToggleRight} label="Availability" value={donor?.available ? "On" : "Off"} />
          <Stat icon={HeartPulse} label="Profile strength" value={`${completion}%`} />
          <Stat icon={Activity} label="Open requests" value={String(requests.length)} />
          <Stat icon={CalendarDays} label="Donations" value={String(history.length)} />
        </div>

        {donor && (
          <div className="mx-auto mt-6 max-w-7xl rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">
                  Donor status
                </p>
                <p className="font-display text-lg font-black">How available are you right now?</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((opt) => {
                  const active = donor.status === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setStatus(opt.value)}
                      disabled={savingStatus}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${
                        active
                          ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                          : "border-border bg-card text-foreground hover:bg-secondary"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${opt.dot}`} /> {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div id="requests" className="mx-auto mt-6 grid max-w-7xl gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card title="Matching requests in your district">
            {requests.length === 0 ? (
              <Empty
                title="No matching requests"
                copy="When someone in your district requests your blood group, it will show up here."
              />
            ) : (
              <ul className="space-y-3">
                {requests.map((r) => (
                  <li
                    key={r.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-secondary/60 p-4"
                  >
                    <div>
                      <p className="font-display text-base font-black">{r.hospital}</p>
                      <p className="text-xs font-semibold text-muted-foreground">
                        {r.district} · {new Date(r.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-foreground">
                        {r.blood_group}
                      </span>
                      <span className="rounded-full bg-card px-3 py-1 text-xs font-bold capitalize">
                        {r.urgency}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Donation history">
            {history.length === 0 ? (
              <Empty title="No donations logged" copy="Your past donations will appear here once recorded." />
            ) : (
              <ul className="space-y-3">
                {history.map((h) => (
                  <li key={h.id} className="rounded-2xl bg-secondary/60 p-4">
                    <p className="font-display text-base font-black">{h.location}</p>
                    <p className="text-xs font-semibold text-muted-foreground">
                      {new Date(h.donation_date).toLocaleDateString()}
                    </p>
                    {h.notes && <p className="mt-1 text-sm font-semibold">{h.notes}</p>}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="mx-auto mt-6 max-w-7xl rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl font-black">Profile completion</h2>
            <span className="text-sm font-black text-primary">{completion}%</span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="mt-3 flex items-center gap-2 text-sm font-bold text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Add an avatar, last donation date, and location for the best matching.
          </p>
        </div>
      </section>
    </PageShell>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5">
      <Icon className="h-6 w-6 text-primary" />
      <p className="mt-4 text-xs font-black uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-display text-2xl font-black">{value}</p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <h2 className="mb-4 font-display text-xl font-black">{title}</h2>
      {children}
    </div>
  );
}

function Empty({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-8 text-center">
      <p className="font-display text-base font-black">{title}</p>
      <p className="mt-1 text-sm font-semibold text-muted-foreground">{copy}</p>
    </div>
  );
}
