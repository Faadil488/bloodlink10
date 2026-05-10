import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/bloodlink/AppShell";
import { useAuth, type DonorStatus } from "@/components/bloodlink/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { bloodGroups, keralaDistricts } from "@/lib/bloodlink-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile | BloodLink Kerala" },
      { name: "description", content: "Edit your donor profile, avatar, and availability." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, donor, loading, refresh } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [area, setArea] = useState("");
  const [status, setStatus] = useState<DonorStatus>("available");
  const [available, setAvailable] = useState(true);
  const [lastDonation, setLastDonation] = useState("");

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setPhone(profile.phone ?? "");
    }
  }, [profile]);
  useEffect(() => {
    if (donor) {
      setBloodGroup(donor.blood_group ?? "");
      setDistrict(donor.district ?? "");
      setArea(donor.area ?? "");
      setStatus(donor.status ?? "available");
      setAvailable(donor.available);
      setLastDonation(donor.last_donation ?? "");
    }
  }, [donor]);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (!user) return null;

  const name = fullName || user.email?.split("@")[0] || "Donor";
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  async function uploadAvatar(file: File) {
    if (!user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const { data: existingProfile } = await supabase.from("profiles").select("id").eq("user_id", user.id).maybeSingle();
      if (existingProfile) {
        await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("user_id", user.id);
      } else {
        await supabase.from("profiles").insert({ user_id: user.id, email: user.email || "", full_name: fullName || "Donor", avatar_url: data.publicUrl });
      }
      await refresh();
      toast.success("Avatar updated");
    } catch (e) {
      toast.error((e as Error).message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!user) return;
    setSaving(true);
    try {
      const { data: existingProfile } = await supabase.from("profiles").select("id").eq("user_id", user.id).maybeSingle();
      let pErr;
      if (existingProfile) {
        const res = await supabase.from("profiles").update({ full_name: fullName, phone }).eq("user_id", user.id);
        pErr = res.error;
      } else {
        const res = await supabase.from("profiles").insert({ user_id: user.id, email: user.email || "", full_name: fullName, phone });
        pErr = res.error;
      }
      if (pErr) throw pErr;

      if (donor) {
        const { error: dErr } = await supabase
          .from("donors")
          .update({
            blood_group: bloodGroup as never,
            district,
            area,
            status,
            available,
            last_donation: lastDonation || null,
          })
          .eq("user_id", user.id);
        if (dErr) throw dErr;
      } else if (bloodGroup && district && area) {
        const { error: dErr } = await supabase.from("donors").insert({
          user_id: user.id,
          blood_group: bloodGroup as never,
          district,
          area,
          status,
          available,
          last_donation: lastDonation || null,
        });
        if (dErr) throw dErr;
      }
      await refresh();
      toast.success("Profile saved");
    } catch (e) {
      toast.error((e as Error).message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell>
      <section className="hero-bg px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-display text-4xl font-black sm:text-5xl">Your profile</h1>
          <p className="mt-2 max-w-xl text-base font-semibold text-muted-foreground">
            Keep your donor details accurate so coordinators can reach you fast.
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[280px_1fr]">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <Avatar className="h-28 w-28">
                  <AvatarImage src={profile?.avatar_url ?? undefined} alt={name} />
                  <AvatarFallback className="bg-primary text-2xl font-black text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)] transition hover:-translate-y-0.5"
                  aria-label="Change avatar"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])}
                />
              </div>
              <p className="mt-4 font-display text-lg font-black">{name}</p>
              <p className="text-xs font-semibold text-muted-foreground">{user.email}</p>
              {donor?.blood_group && (
                <span className="mt-3 rounded-full bg-primary px-3 py-1 text-sm font-black text-primary-foreground">
                  {donor.blood_group}
                </span>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full name">
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Phone">
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Blood group">
                <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className={inputCls}>
                  <option value="">Select</option>
                  {bloodGroups.map((g) => <option key={g}>{g}</option>)}
                </select>
              </Field>
              <Field label="District">
                <select value={district} onChange={(e) => setDistrict(e.target.value)} className={inputCls}>
                  <option value="">Select</option>
                  {keralaDistricts.map((d) => <option key={d.name}>{d.name}</option>)}
                </select>
              </Field>
              <Field label="Area">
                <input value={area} onChange={(e) => setArea(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Last donation">
                <input type="date" value={lastDonation} onChange={(e) => setLastDonation(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Donor status">
                <select value={status} onChange={(e) => setStatus(e.target.value as DonorStatus)} className={inputCls}>
                  <option value="available">Available to donate</option>
                  <option value="busy">Busy</option>
                  <option value="emergency">Emergency available</option>
                </select>
              </Field>
              <label className="flex items-center gap-3 self-end rounded-2xl border border-border bg-secondary/50 px-4 py-3 font-bold">
                <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
                Show me as available
              </label>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-black text-primary-foreground shadow-[var(--shadow-glow)] transition hover:-translate-y-0.5 disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save changes
              </button>
              <Link
                to="/dashboard"
                className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 font-bold text-foreground transition hover:-translate-y-0.5 hover:bg-secondary"
              >
                Back to dashboard
              </Link>
            </div>
          </div>
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
