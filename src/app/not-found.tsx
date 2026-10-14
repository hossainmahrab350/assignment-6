import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-6xl font-bold tracking-wide">404</h1>
      <p className="mt-2 text-muted">Page not found.</p>
      <Link href="/" className="mt-6 rounded-full bg-accent px-6 py-3 text-sm font-bold tracking-wide text-black">
        GO HOME
      </Link>
    </div>
  );
}