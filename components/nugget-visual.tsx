export function NuggetVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[470px]">
      <div className="absolute inset-[8%] rounded-full border border-ink/10 bg-gold-soft/40" />
      <div className="absolute inset-[18%] rounded-full border border-dashed border-ink/20" />
      <span className="absolute left-[8%] top-[24%] rotate-[-9deg] rounded-full border border-ink/15 bg-paper px-3 py-1 text-xs font-bold shadow-card">
        messy brief
      </span>
      <span className="absolute right-[4%] top-[17%] rotate-[7deg] rounded-full border border-ink/15 bg-paper px-3 py-1 text-xs font-bold shadow-card">
        golden idea
      </span>
      <span className="absolute bottom-[16%] left-[4%] rotate-[5deg] rounded-full border border-ink/15 bg-paper px-3 py-1 text-xs font-bold shadow-card">
        ready to hatch
      </span>
      <svg viewBox="0 0 500 500" className="relative z-10 h-full w-full animate-bob" aria-hidden="true">
        <path d="M122 306c-20-87 21-177 110-194 88-17 158 40 158 133 0 89-49 153-140 151-67-1-113-32-128-90Z" fill="#F6BD3A" stroke="#201D17" strokeWidth="8" />
        <path d="M149 285c25 4 42-11 59-30 18 23 45 31 76 15 17 18 42 26 74 15" fill="none" stroke="#201D17" strokeWidth="8" strokeLinecap="round" />
        <circle cx="201" cy="217" r="9" fill="#201D17" />
        <circle cx="299" cy="215" r="9" fill="#201D17" />
        <path d="M221 237c17 15 43 15 59-2" fill="none" stroke="#201D17" strokeWidth="8" strokeLinecap="round" />
        <path d="m103 157 28 20M101 194l35 7M390 139l-25 24M410 181l-36 8" stroke="#201D17" strokeWidth="7" strokeLinecap="round" />
        <path d="m187 111 12-37 21 30 29-28 12 35" fill="#FFE7A3" stroke="#201D17" strokeWidth="7" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
