export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-ink/65 shadow-sm">
      <span className="h-2 w-2 rounded-full bg-gold" />
      {children}
    </span>
  );
}
