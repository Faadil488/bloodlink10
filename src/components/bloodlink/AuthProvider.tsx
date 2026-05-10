import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type DonorStatus = "available" | "busy" | "emergency";

export type Profile = {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
};

export type DonorRecord = {
  id: string;
  blood_group: string | null;
  district: string | null;
  area: string | null;
  available: boolean;
  verified: boolean;
  status: DonorStatus;
  last_donation: string | null;
};

type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  donor: DonorRecord | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [donor, setDonor] = useState<DonorRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const userRef = useRef<User | null>(null);

  const loadExtras = useCallback(async (uid: string) => {
    const [{ data: p }, { data: d }] = await Promise.all([
      supabase
        .from("profiles")
        .select("full_name,email,phone,avatar_url")
        .eq("user_id", uid)
        .maybeSingle(),
      supabase
        .from("donors")
        .select("id,blood_group,district,area,available,verified,status,last_donation")
        .eq("user_id", uid)
        .maybeSingle(),
    ]);
    setProfile((p as Profile) ?? null);
    setDonor((d as DonorRecord) ?? null);
  }, []);

  const refresh = useCallback(async () => {
    if (userRef.current) await loadExtras(userRef.current.id);
  }, [loadExtras]);

  useEffect(() => {
    let active = true;
    const fallback = window.setTimeout(() => active && setLoading(false), 1800);

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      window.clearTimeout(fallback);
      const u = session?.user ?? null;
      userRef.current = u;
      setUser(u);
      setLoading(false);
      if (u) {
        // defer to avoid deadlock inside callback
        setTimeout(() => loadExtras(u.id), 0);
      } else {
        setProfile(null);
        setDonor(null);
      }
    });

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        const u = data.session?.user ?? null;
        userRef.current = u;
        setUser(u);
        if (u) loadExtras(u.id);
      })
      .finally(() => {
        window.clearTimeout(fallback);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      window.clearTimeout(fallback);
      listener.subscription.unsubscribe();
    };
  }, [loadExtras]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      donor,
      loading,
      refresh,
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [user, profile, donor, loading, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
