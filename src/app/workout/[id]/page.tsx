"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Clock, Flame, Star, Check, Bookmark, ArrowLeft } from "lucide-react";
import type { Workout } from "@/lib/types";
import { API_BASE } from "@/lib/types";
import { usePlan } from "@/components/PlanProvider";
import { useToast } from "@/components/ToastProvider";

export default function WorkoutDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToPlan, saveForLater, isInPlan, isSaved, counts } = usePlan();
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    let alive = true;
    setLoading(true);
    fetch(`${API_BASE}/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (alive) setWorkout(data);
      })
      .catch(() => {
        if (alive) setWorkout(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-bold">NOT FOUND</h1>
        <button onClick={() => router.push("/")} className="mt-6 rounded-full bg-accent px-6 py-3 text-sm font-bold text-black">
          GO HOME
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <button onClick={() => router.back()} className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
          <div className="relative aspect-[4/5] w-full">
            <Image src={workout.image} alt={workout.name} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" priority />
          </div>
        </div>

        <div>
          <h1 className="font-display text-4xl font-bold tracking-wide sm:text-5xl">{workout.name.toUpperCase()}</h1>
          <p className="mt-3 text-muted">{workout.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {workout.muscleGroups.map((g) => (
              <span key={g} className="rounded-full border border-border px-3 py-1 text-xs font-bold tracking-widest text-accent">
                {g}
              </span>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-border bg-card">
            {[
              ["EQUIPMENT", workout.equipment],
              ["DIFFICULTY", workout.difficulty],
              ["SETS", String(workout.sets)],
              ["REPS", workout.reps],
              ["DURATION", `${workout.duration} min`],
              ["CALORIES", `${workout.caloriesBurned} kcal`],
              ["RATING", String(workout.rating)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between border-b border-border px-5 py-3 last:border-b-0">
                <span className="text-xs font-bold tracking-widest text-muted">{label}</span>
                <span className="text-sm font-semibold">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h2 className="font-display text-xl font-bold tracking-wide">INSTRUCTIONS</h2>
            <ol className="mt-3 space-y-3">
              {workout.instructions.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-black">
                    {i + 1}
                  </span>
                  <span className="text-zinc-300">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => {
                if (counts.plan >= 5 && !isInPlan(workout.id)) {
                  toast("Today's plan is full (5 lifts)");
                  return;
                }
                addToPlan(workout.id);
                toast("Added to today's plan");
              }}
              disabled={isInPlan(workout.id)}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold tracking-wide text-black transition hover:brightness-110 disabled:opacity-50"
            >
              <Check size={16} /> ADD TO TODAY'S PLAN
            </button>
            <button
              onClick={() => {
                saveForLater(workout.id);
                toast("Saved for later");
              }}
              disabled={isSaved(workout.id)}
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-bold tracking-wide text-foreground transition hover:border-accent disabled:opacity-50"
            >
              <Bookmark size={16} /> SAVE FOR LATER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}