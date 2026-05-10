import { createFileRoute, Link } from "@tanstack/react-router";
import { Banknote, Building2, ShieldCheck, Siren, Trash2, Users } from "lucide-react";
import { PageShell } from "@/components/bloodlink/AppShell";
import { useAuth } from "@/components/bloodlink/AuthProvider";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | BloodLink Kerala" },
      {
        name: "description",
        content: "Admin workspace for donor verification, institutions, and SOS requests.",
      },
      { property: "og:title", content: "Admin Dashboard | BloodLink Kerala" },
      {
        property: "og:description",
        content: "Admin workspace for donor verification, institutions, and SOS requests.",
      },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <PageShell>
        <section className="px-4 py-16">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-secondary p-10 font-black">
            Loading admin…
          </div>
        </section>
      </PageShell>
    );
  if (!user)
    return (
      <PageShell>
        <section className="hero-bg px-4 py-16">
          <div className="mx-auto max-w-lg rounded-[2rem] bg-card p-8 text-center shadow-[var(--shadow-card)]">
            <h1 className="font-display text-4xl font-black">Admin login required</h1>
            <Link
              to="/login"
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-black text-primary-foreground"
            >
              Login
            </Link>
          </div>
        </section>
      </PageShell>
    );
  const cards = [
    [Users, "Manage users", "1,240 records"],
    [ShieldCheck, "Verify donors", "38 pending"],
    [Building2, "Hospitals", "84 listings"],
    [Banknote, "Blood banks", "42 listings"],
    [Siren, "SOS requests", "12 open"],
    [Trash2, "Fake accounts", "7 flagged"],
  ];
  return (
    <PageShell>
      <section className="hero-bg px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-display text-5xl font-black">Admin dashboard</h1>
          <p className="mt-3 font-semibold text-muted-foreground">
            Moderation and data-quality command center.
          </p>
        </div>
      </section>
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {cards.map(([Icon, title, value]) => (
            <article
              key={title as string}
              className="rounded-[2rem] border border-border bg-card p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-1"
            >
              <Icon className="h-8 w-8 text-primary" />
              <h2 className="mt-6 font-display text-2xl font-black">{title as string}</h2>
              <p className="mt-2 font-bold text-muted-foreground">{value as string}</p>
              <button className="mt-5 rounded-full bg-secondary px-4 py-2 font-black text-foreground">
                Review
              </button>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
