import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Filter, MapPin, PhoneCall, SearchIcon, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { KeralaMap } from "@/components/bloodlink/KeralaMap";
import { PageShell } from "@/components/bloodlink/AppShell";
import { bloodGroups, keralaDistricts, sampleDonors } from "@/lib/bloodlink-data";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Find Blood Donors | BloodLink Kerala" },
      { name: "description", content: "Search available Kerala blood donors with district filters and a live map." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [query, setQuery] = useState("");
  const [blood, setBlood] = useState("");
  const [district, setDistrict] = useState("");
  const [availableOnly, setAvailableOnly] = useState(true);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [view, setView] = useState<"list" | "map">("list");

  const donors = useMemo(
    () =>
      sampleDonors.filter((donor) => {
        const q = query.trim().toLowerCase();
        const matchesQuery =
          !q ||
          donor.name.toLowerCase().includes(q) ||
          donor.area.toLowerCase().includes(q) ||
          donor.district.toLowerCase().includes(q);
        return (
          matchesQuery &&
          (!blood || donor.bloodGroup === blood) &&
          (!district || donor.district === district) &&
          (!availableOnly || donor.available) &&
          (!verifiedOnly || donor.verified)
        );
      }),
    [query, blood, district, availableOnly, verifiedOnly],
  );

  const activeFilters = [blood, district, availableOnly && "Available", verifiedOnly && "Verified"].filter(Boolean);

  function clearAll() {
    setQuery("");
    setBlood("");
    setDistrict("");
    setAvailableOnly(true);
    setVerifiedOnly(false);
  }

  return (
    <PageShell>
      <section className="hero-bg px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-display text-4xl font-black sm:text-5xl">Find nearby donors</h1>
          <p className="mt-3 max-w-2xl text-base font-semibold text-muted-foreground">
            Filter verified Kerala donors and scan the live map for hospitals and blood banks.
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
            <div className="relative mb-3">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, area, or district…"
                className="w-full rounded-2xl border border-input bg-background py-3 pl-11 pr-10 text-sm font-semibold outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-secondary"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto_auto]">
              <select value={blood} onChange={(e) => setBlood(e.target.value)} className={inputCls}>
                <option value="">All blood groups</option>
                {bloodGroups.map((g) => <option key={g}>{g}</option>)}
              </select>
              <select value={district} onChange={(e) => setDistrict(e.target.value)} className={inputCls}>
                <option value="">All districts</option>
                {keralaDistricts.map((d) => <option key={d.name}>{d.name}</option>)}
              </select>
              <select className={inputCls} defaultValue="25">
                <option value="25">25 km radius</option>
                <option value="50">50 km radius</option>
                <option value="100">100 km radius</option>
              </select>
              <Toggle checked={availableOnly} onChange={setAvailableOnly} label="Available" />
              <Toggle checked={verifiedOnly} onChange={setVerifiedOnly} label="Verified" />
            </div>
            {activeFilters.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-muted-foreground">Active:</span>
                {activeFilters.map((f, i) => (
                  <span key={i} className="rounded-full bg-secondary px-2.5 py-1 font-bold text-foreground">
                    {f as string}
                  </span>
                ))}
                <button onClick={clearAll} className="ml-auto font-bold text-primary hover:underline">
                  Clear all
                </button>
              </div>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 rounded-full bg-secondary p-1 md:hidden">
            <button
              onClick={() => setView("list")}
              className={`rounded-full py-2 text-sm font-black transition ${view === "list" ? "bg-card shadow-sm" : "text-muted-foreground"}`}
            >
              List
            </button>
            <button
              onClick={() => setView("map")}
              className={`rounded-full py-2 text-sm font-black transition ${view === "map" ? "bg-card shadow-sm" : "text-muted-foreground"}`}
            >
              Map
            </button>
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-[440px_1fr]">
            <div className={`${view === "map" ? "hidden md:block" : "block"} space-y-4`}>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-black">
                  {donors.length} {donors.length === 1 ? "match" : "matches"}
                </h2>
                <span className="flex items-center gap-1.5 text-xs font-black text-muted-foreground">
                  <Filter className="h-3.5 w-3.5" /> Live filters
                </span>
              </div>
              {donors.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
                  <SearchIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-3 font-display text-lg font-black">No donors match</p>
                  <p className="mt-1 text-sm font-semibold text-muted-foreground">
                    Try widening district, radius, or removing filters.
                  </p>
                  <button
                    onClick={clearAll}
                    className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-black text-primary-foreground hover:-translate-y-0.5 transition"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                donors.map((donor) => (
                  <article
                    key={donor.id}
                    className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-lg font-black text-foreground">{donor.name}</h3>
                        <p className="mt-1 flex items-center gap-1 text-sm font-bold text-muted-foreground">
                          <MapPin className="h-4 w-4" /> {donor.area}, {donor.district}
                        </p>
                      </div>
                      <span className="rounded-2xl bg-primary px-3.5 py-2 font-display text-lg font-black text-primary-foreground">
                        {donor.bloodGroup}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${donor.available ? "bg-success/15 text-success" : "bg-primary-soft text-primary"}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${donor.available ? "bg-success" : "bg-primary"}`} />
                        {donor.available ? "Available now" : "Unavailable"}
                      </span>
                      {donor.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-black text-foreground">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </span>
                      )}
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-black text-muted-foreground">
                        {donor.distance} km
                      </span>
                    </div>
                    <button 
                      onClick={() => toast.success(`Contact request sent to ${donor.name}`)}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-black text-background transition hover:-translate-y-0.5"
                    >
                      <PhoneCall className="h-4 w-4" /> Request contact
                    </button>
                  </article>
                ))
              )}
            </div>
            <div className={`${view === "list" ? "hidden md:block" : "block"}`}>
              <KeralaMap donors={donors} district={district} />
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

const inputCls =
  "w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm font-semibold outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30";

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label
      className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition cursor-pointer ${
        checked
          ? "border-primary bg-primary-soft text-primary"
          : "border-border bg-secondary/40 text-foreground hover:bg-secondary"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-primary"
      />
      {label}
    </label>
  );
}
