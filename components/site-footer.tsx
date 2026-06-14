import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-paper/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <Logo />
        <p className="text-sm text-ink/55">From brief to board, one nugget at a time.</p>
      </div>
    </footer>
  );
}
