"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type PlanState = {
  plan: number[]; // workout ids
  saved: number[];
  done: number[];
  counts: { plan: number; saved: number };
  addToPlan: (id: number) => void;
  removeFromPlan: (id: number) => void;
  toggleDone: (id: number) => void;
  saveForLater: (id: number) => void;
  removeFromSaved: (id: number) => void;
  isInPlan: (id: number) => boolean;
  isSaved: (id: number) => boolean;
};

const PlanContext = createContext<PlanState | null>(null);

const PLAN_KEY = "fitlog.plan";
const SAVED_KEY = "fitlog.saved";
const DONE_KEY = "fitlog.done";

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<number[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [done, setDone] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem(PLAN_KEY) || "[]");
      const s = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
      const d = JSON.parse(localStorage.getItem(DONE_KEY) || "[]");
      setPlan(Array.isArray(p) ? p : []);
      setSaved(Array.isArray(s) ? s : []);
      setDone(Array.isArray(d) ? d : []);
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
      localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
      localStorage.setItem(DONE_KEY, JSON.stringify(done));
    } catch {}
  }, [plan, saved, done, hydrated]);

  const addToPlan = useCallback((id: number) => {
    setPlan((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);
  const removeFromPlan = useCallback((id: number) => {
    setPlan((prev) => prev.filter((x) => x !== id));
    setDone((prev) => prev.filter((x) => x !== id));
  }, []);
  const toggleDone = useCallback((id: number) => {
    setDone((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);
  const saveForLater = useCallback((id: number) => {
    setSaved((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);
  const removeFromSaved = useCallback((id: number) => {
    setSaved((prev) => prev.filter((x) => x !== id));
  }, []);

  const value: PlanState = {
    plan,
    saved,
    done,
    counts: { plan: plan.length, saved: saved.length },
    addToPlan,
    removeFromPlan,
    toggleDone,
    saveForLater,
    removeFromSaved,
    isInPlan: (id) => plan.includes(id),
    isSaved: (id) => saved.includes(id),
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export default PlanProvider;

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used within PlanProvider");
  return ctx;
}