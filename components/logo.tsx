import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Nugget home">
      <span className="relative grid h-10 w-10 place-items-center rounded-[16px] border-2 border-ink bg-gold shadow-[3px_3px_0_#201d17] transition-transform group-hover:-rotate-6">
        <svg viewBox="0 0 40 40" className="h-7 w-7" aria-hidden="true">
          <path d="M10 25c-1-8 3-15 10-16 7-1 12 5 11 12-1 7-5 11-12 10-5 0-8-2-9-6Z" fill="#FFF5CF" stroke="#201D17" strokeWidth="2" />
          <path d="M15 22c2 2 8 2 10-1" fill="none" stroke="#201D17" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="17" r="1.5" fill="#201D17" />
          <circle cx="25" cy="16" r="1.5" fill="#201D17" />
        </svg>
      </span>
      {!compact && <span className="display text-2xl font-bold">Nugget</span>}
    </Link>
  );
}
