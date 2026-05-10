import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Clock,
  HeartPulse,
  MapPin,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/bloodlink/AppShell";
import { useAuth } from "@/components/bloodlink/AuthProvider";
import { bloodGroups, keralaDistricts } from "@/lib/bloodlink-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BloodLink Kerala | Emergency Blood Donor Discovery" },
      {
        name: "description",
        content:
          "Discover nearby blood donors, hospitals, and blood banks across Kerala in seconds with BloodLink Kerala.",
      },
      { property: "og:title", content: "BloodLink Kerala" },
      {
        property: "og:description",
        content: "Emergency Blood Donor Discovery Platform for Kerala.",
      },
    ],
  }),
  component: Index,
});

const stats = [
  { label: "Kerala districts", value: "14", icon: MapPin },
  { label: "Search target", value: "<30s", icon: Clock },
  { label: "Blood groups", value: "8", icon: HeartPulse },
  { label: "Care network", value: "24/7", icon: Activity },
];

function Index() {
  const { user, profile } = useAuth();
  const firstName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0];

  return (
    <PageShell>
      <section className="hero-bg relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-black text-primary shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              {firstName ? `Welcome back, ${firstName}` : "Kerala emergency network"}
            </div>
            <h1 className="font-display text-5xl font-black leading-[1.02] text-foreground sm:text-6xl lg:text-7xl">
              BloodLink Kerala
            </h1>
            <p className="mt-6 max-w-2xl text-xl font-semibold leading-8 text-muted-foreground">
              Emergency Blood Donor Discovery Platform for Kerala. Locate available donors,
              hospitals, and blood banks through a fast map-driven experience.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/search"
                className="hover-lift inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-black text-primary-foreground shadow-[var(--shadow-glow)]"
              >
                Find Donors Near Me <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-base font-black text-foreground transition hover:-translate-y-0.5 hover:bg-secondary"
              >
                Become a Donor
              </Link>
            </div>

            <form
              className="glass-panel mt-10 grid gap-3 rounded-[2rem] p-4 md:grid-cols-[1fr_1fr_auto] -translate-x-3"
              action="/search"
            >
              <select
                name="blood"
                className="rounded-2xl border border-input bg-background px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Blood group</option>
                {bloodGroups.map((group) => (
                  <option key={group}>{group}</option>
                ))}
              </select>
              <select
                name="district"
                className="rounded-2xl border border-input bg-background px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">District</option>
                {keralaDistricts.map((district) => (
                  <option key={district.name}>{district.name}</option>
                ))}
              </select>
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-foreground px-5 py-3 font-black text-background">
                <Search className="h-4 w-4" /> Search
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-6 py-8 lg:pl-12">
            <div className="glass-panel float-card w-72 rounded-[2rem] p-5">
              <p className="text-sm font-black text-muted-foreground">Critical request</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-display text-4xl font-black text-primary">O-</span>
                <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-black text-primary">
                  Matched
                </span>
              </div>
              <p className="mt-4 text-sm font-semibold text-muted-foreground">
                Kottayam Medical College · 13.1 km
              </p>
            </div>
            <div className="glass-panel float-card w-80 rounded-[2rem] p-5 translate-x-8">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-success text-primary-foreground">
                  <Users className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-black">5 donors nearby</p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    Verified and available now
                  </p>
                </div>
              </div>
            </div>
            <div className="glass-panel float-card w-80 rounded-[2rem] p-5 translate-x-4">
              <div className="mb-4 flex items-center gap-2 text-sm font-black text-primary">
                <HeartPulse className="h-5 w-5" /> Kerala live coverage
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-black text-muted-foreground">
                {bloodGroups.slice(0, 6).map((group) => (
                  <span key={group} className="rounded-full bg-secondary px-3 py-2">
                    {group}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass-panel rounded-[2rem] p-6 transition hover:-translate-y-1"
              >
                <stat.icon className="h-6 w-6 text-primary" />
                <p className="mt-5 font-display text-4xl font-black text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm font-bold text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-4xl font-black text-foreground">Why BloodLink works</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              [
                Search,
                "Smart donor discovery",
                "Filter by blood group, district, radius, availability, and verification.",
              ],
              [
                MapPin,
                "Real map visibility",
                "See donors, hospitals, and blood banks in a Kerala-centered interactive map.",
              ],
              [
                ShieldCheck,
                "Verification-first records",
                "Admin workflows keep donor and institution data cleaner over time.",
              ],
            ].map(([Icon, title, copy]) => (
              <article
                key={title as string}
                className="rounded-[2rem] bg-card p-7 shadow-[var(--shadow-card)] transition hover:-translate-y-1"
              >
                <Icon className="h-8 w-8 text-primary" />
                <h3 className="mt-6 font-display text-2xl font-black text-foreground">
                  {title as string}
                </h3>
                <p className="mt-3 text-base font-semibold leading-7 text-muted-foreground">
                  {copy as string}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="font-display text-4xl font-black text-foreground">
                Kerala live coverage
              </h2>
              <p className="mt-3 max-w-2xl text-lg font-semibold text-muted-foreground">
                District-focused search designed for Kerala’s emergency response patterns.
              </p>
            </div>
            <Link to="/search" className="inline-flex items-center gap-2 font-black text-primary">
              Open search <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {keralaDistricts.map((district) => (
              <div
                key={district.name}
                className="rounded-2xl border border-border bg-card px-4 py-3 font-black text-foreground shadow-sm"
              >
                {district.name}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
