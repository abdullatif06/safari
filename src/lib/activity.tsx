"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/useUser";

/**
 * Tracks the current user's saves and RSVPs across the page so cards and the
 * detail view share one source of truth. All writes go straight to Supabase
 * (RLS limits them to the user's own rows) with optimistic UI updates.
 */
interface ActivityValue {
  ready: boolean;
  isLoggedIn: boolean;
  savedIds: Set<string>;
  goingIds: Set<string>;
  toggleSave: (eventId: string) => Promise<void>;
  toggleRsvp: (eventId: string, meta?: { title?: string; date?: string }) => Promise<void>;
}

const ActivityContext = createContext<ActivityValue | null>(null);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const user = useUser();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [goingIds, setGoingIds] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (user === undefined) return; // still loading auth
    if (user === null) {
      setSavedIds(new Set());
      setGoingIds(new Set());
      setReady(true);
      return;
    }
    let cancelled = false;
    const supabase = createClient();
    (async () => {
      const [{ data: saves }, { data: rsvps }] = await Promise.all([
        supabase.from("saves").select("event_id").eq("user_id", user.id),
        supabase.from("rsvps").select("event_id").eq("user_id", user.id),
      ]);
      if (cancelled) return;
      setSavedIds(new Set((saves ?? []).map((r: { event_id: string }) => r.event_id)));
      setGoingIds(new Set((rsvps ?? []).map((r: { event_id: string }) => r.event_id)));
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const toggleSave = useCallback(
    async (eventId: string) => {
      if (!user) return;
      const supabase = createClient();
      const wasSaved = savedIds.has(eventId);
      // Optimistic update
      setSavedIds((prev) => {
        const next = new Set(prev);
        wasSaved ? next.delete(eventId) : next.add(eventId);
        return next;
      });
      const { error } = wasSaved
        ? await supabase
            .from("saves")
            .delete()
            .eq("user_id", user.id)
            .eq("event_id", eventId)
        : await supabase
            .from("saves")
            .insert({ user_id: user.id, event_id: eventId });
      if (error) {
        // Revert on failure
        setSavedIds((prev) => {
          const next = new Set(prev);
          wasSaved ? next.add(eventId) : next.delete(eventId);
          return next;
        });
      }
    },
    [user, savedIds],
  );

  const toggleRsvp = useCallback(
    async (eventId: string, meta?: { title?: string; date?: string }) => {
      if (!user) return;
      const supabase = createClient();
      const wasGoing = goingIds.has(eventId);
      setGoingIds((prev) => {
        const next = new Set(prev);
        wasGoing ? next.delete(eventId) : next.add(eventId);
        return next;
      });
      const { error } = wasGoing
        ? await supabase
            .from("rsvps")
            .delete()
            .eq("user_id", user.id)
            .eq("event_id", eventId)
        : await supabase
            .from("rsvps")
            .insert({ user_id: user.id, event_id: eventId, status: "going" });
      if (error) {
        setGoingIds((prev) => {
          const next = new Set(prev);
          wasGoing ? next.add(eventId) : next.delete(eventId);
          return next;
        });
      } else if (!wasGoing && meta?.title) {
        // Fire-and-forget RSVP confirmation email
        fetch("/api/rsvp-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId, eventTitle: meta.title, eventDate: meta.date ?? "" }),
        }).catch(() => {});
      }
    },
    [user, goingIds],
  );

  return (
    <ActivityContext.Provider
      value={{
        ready,
        isLoggedIn: !!user,
        savedIds,
        goingIds,
        toggleSave,
        toggleRsvp,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const ctx = useContext(ActivityContext);
  if (!ctx)
    throw new Error("useActivity must be used within an ActivityProvider");
  return ctx;
}
