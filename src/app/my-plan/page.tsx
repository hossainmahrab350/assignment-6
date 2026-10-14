"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Flame, Star, Check, X, ArrowRight } from "lucide-react";
import type { Workout } from "@/lib/types";
import { API_BASE } from "@/lib/types";
import { usePlan } from "@/components/PlanProvider";
import { useToast } from "@/components/ToastProvider";

type Tab = "plan" | "saved";

export default function MyPlanPage() {
  const { plan, saved, done, removeFromPlan, toggleDone, removeFromSaved, isInPlan, counts } = usePlan();
  const { toast } = useToast();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("plan");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(API_BASE)
      .then((r) => r.json())
      .then((data) => {
        if (alive) setWorkouts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (alive) setWorkouts([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const byId = (ids: number[]) =>
    ids.map((id) => workouts.find((w) => w.id === id)).filter(Boolean) as Workout[];

  const planItems = byId(plan);
  const savedItems = byId(saved);

  const totalMinutes = planItems.reduce((a, w) => a + w.duration, 0);
  const totalCalories = planItems.reduce((a, w) => a + w.caloriesBurned, 0);

  const items = tab === "plan" ? planItems : savedItems;

  const markDone = (id: number, name: string) => {
    toggleDone(id);
    const nowDone = !done.includes(id);
    toast(nowDone ? `${name} marked done` : `${name} unmarked`);
  };

  const removePlan = (id: number, name: string) => {
    removeFromPlan(id);
    toast(`Removed ${name} from plan`);
  };

  const removeSaved = (id: number, name: string) => {
    removeFromSaved(id);
    toast(`Removed ${name} from saved`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-bold tracking-wide">MY PLAN</h1>
      <p className="mt-1 text-sm text-muted">Cap of five lifts for today. Finish them, then load more.</p>

      {/* Metrics */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { label: "EXERCISES", value: planItems.length },
          { label: "MINUTES", value: totalMinutes },
          { label: "CALORIES", value: totalCalories },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <p className="text-xs font-bold tracking-widest text-muted">{m.label}</p>
            <p className="mt-2 font-display text-3xl font-bold sm:text-4xl">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2">
        {(["plan", "saved"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2 text-xs font-bold tracking-wide transition ${
              tab === t ? "bg-accent text-black" : "border border-border text-muted hover:text-foreground"
            }`}
          >
            {t === "plan" ? "TODAY'S PLAN" : "SAVED"}
            <span className="ml-2 opacity-70">{t === "plan" ? planItems.length : savedItems.length}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-10 flex min-h-[200px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
            <p className="text-sm text-muted">Loading workouts…</p>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <h2 className="font-display text-3xl font-bold tracking-wide">NOTHING HERE YET</h2>
          <p className="mt-2 text-sm text-muted">Browse the library and add a lift to get today moving.</p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold tracking-wide text-black"
          >
            GO TO WORKOUTS <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((w) => {
            const isDone = done.includes(w.id);
            return (
              <div
                key={w.id}
                className={`flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center ${isDone ? "opacity-60" : ""}`}
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                  <Image src={w.image} alt={w.name} fill className="object-cover" sizes="80px" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className={`font-display text-lg font-bold tracking-wide ${isDone ? "line-through" : ""}`}>
                    {w.name.toUpperCase()}
                  </h3>
                  <p className="text-xs text-muted">{w.equipment}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
                    <span className="inline-flex items-center gap-1"><Clock size={13} /> {w.duration} min</span>
                    <span className="inline-flex items-center gap-1"><Flame size={13} /> {w.caloriesBurned} kcal</span>
                    <span className="inline-flex items-center gap-1"><Star size={13} className="text-accent" /> {w.rating}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <Link
                    href={`/workout/${w.id}`}
                    className="rounded-full border border-border px-4 py-2 text-xs font-bold tracking-wide text-foreground transition hover:border-accent"
                  >
                    VIEW DETAILS
                  </Link>
                  {tab === "plan" && (
                    <button
                      onClick={() => markDone(w.id, w.name)}
                      className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-bold tracking-wide transition ${
                        isDone ? "bg-accent text-black" : "border border-border text-foreground hover:border-accent"
                      }`}
                    >
                      <Check size={14} /> {isDone ? "DONE" : "MARK AS DONE"}
                    </button>
                  )}
                  <button
                    onClick={() => (tab === "plan" ? removePlan(w.id, w.name) : removeSaved(w.id, w.name))}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition hover:border-red-500 hover:text-red-400"
                    aria-label="Remove"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}