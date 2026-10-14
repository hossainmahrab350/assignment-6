import Link from "next/link";
import Image from "next/image";
import { Clock, Flame, Star } from "lucide-react";

export default function WorkoutCard({ w }: { w: any }) {
  return (
    <Link
      href={`/workout/${w.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:border-accent/60"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        <Image src={w.image} alt={w.name} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition duration-300 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap gap-2">
          {w.muscleGroups.map((g: string) => (
            <span key={g} className="rounded-full border border-border px-2 py-0.5 text-[10px] font-bold tracking-widest text-accent">
              {g.toUpperCase()}
            </span>
          ))}
        </div>
        <h3 className="font-display text-lg font-bold tracking-wide">{w.name.toUpperCase()}</h3>
        <p className="text-xs text-muted">{w.equipment}</p>
        <div className="mt-auto flex items-center gap-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1"><Clock size={14} /> {w.duration} min</span>
          <span className="inline-flex items-center gap-1"><Flame size={14} /> {w.caloriesBurned} kcal</span>
          <span className="inline-flex items-center gap-1"><Star size={14} className="text-accent" /> {w.rating}</span>
        </div>
      </div>
    </Link>
  );
}