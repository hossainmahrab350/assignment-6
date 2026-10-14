"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { usePlan } from "@/components/PlanProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { counts } = usePlan();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="FitLog logo" width={32} height={32} className="h-8 w-8 object-contain" />
          <span className="font-display text-xl font-bold tracking-wide">FITLOG</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className={`font-display text-sm tracking-widest transition ${isActive("/") ? "text-accent" : "text-muted hover:text-foreground"}`}
          >
            WORKOUT
          </Link>
          <Link
            href="/my-plan"
            className={`font-display text-sm tracking-widest transition ${isActive("/my-plan") ? "text-accent" : "text-muted hover:text-foreground"}`}
          >
            MY PLAN
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/my-plan"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-bold tracking-wide text-black"
          >
            PLAN <span className="rounded-full bg-black/10 px-2">{counts.plan}</span>
          </Link>
          <Link
            href="/my-plan"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-bold tracking-wide text-foreground"
          >
            SAVED <span className="rounded-full bg-white/10 px-2">{counts.saved}</span>
          </Link>
        </div>
      </nav>

      {/* mobile links */}
      <div className="flex justify-center gap-6 border-t border-border py-2 md:hidden">
        <Link href="/" className={`font-display text-xs tracking-widest ${isActive("/") ? "text-accent" : "text-muted"}`}>WORKOUT</Link>
        <Link href="/my-plan" className={`font-display text-xs tracking-widest ${isActive("/my-plan") ? "text-accent" : "text-muted"}`}>MY PLAN</Link>
      </div>
    </header>
  );
}