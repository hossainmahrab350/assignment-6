"use client";
import { useEffect, useState } from "react";
import { usePlan } from "@/components/PlanProvider";
import { useToast } from "@/components/ToastProvider";
import WorkoutCard from "@/components/WorkoutCard";
import type { Workout } from "@/lib/types";
import { API_BASE } from "@/lib/types";

export default function HomePage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"Duration" | "Calories" | "Rating">("Duration");
  const { addToPlan, isInPlan, counts } = usePlan();
  const { toast } = useToast();

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(API_BASE)
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        setWorkouts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!alive) return;
        setWorkouts([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const sorted = [...workouts].sort((a, b) => {
    if (sort === "Calories") return b.caloriesBurned - a.caloriesBurned;
    if (sort === "Rating") return b.rating - a.rating;
    return b.duration - a.duration;
  });

  const handleAdd = (id: number, name: string) => {
    if (counts.plan >= 5) {
      toast("Today's plan is full (5 lifts)");
      return;
    }
    addToPlan(id);
    toast(`Added ${name} to today's plan`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="font-display text-sm tracking-[0.3em] text-accent">WORKOUT LIBRARY</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-none tracking-wide sm:text-5xl lg:text-6xl">
              TRAIN WITH INTENT. LOG EVERY SET.
            </h1>
            <p className="mt-5 max-w-xl text-sm text-muted sm:text-base">
              FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today's plan, and watch the week's work add up.
            </p>
            <a
              href="#library"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold tracking-wide text-black transition hover:brightness-110"
            >
              BROWSE WORKOUTS
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-border">
            <img src="/banner.png" alt="FitLog banner" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Library */}
      <section id="library" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-wide">THE LIBRARY</h2>
            <p className="mt-1 text-sm text-muted">Twelve lifts covering every major muscle group.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">Sort By</span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="appearance-none rounded-lg border border-border bg-card px-4 py-2 pr-9 text-xs font-bold tracking-wide text-foreground outline-none"
              >
                <option value="Duration">Duration</option>
                <option value="Calories">Calories</option>
                <option value="Rating">Rating</option>
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
              <p className="text-sm text-muted">Loading workouts…</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((w) => (
              <div key={w.id} className="relative">
                <WorkoutCard w={w} />
                {!isInPlan(w.id) && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAdd(w.id, w.name);
                    }}
                    disabled={counts.plan >= 5}
                    className="absolute bottom-3 right-3 rounded-full bg-accent/90 px-3 py-1 text-[10px] font-bold tracking-wide text-black transition hover:bg-accent disabled:opacity-40"
                  >
                    + ADD
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}