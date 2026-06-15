"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";

const links = [
  { href: "/discover", label: "Discover" },
  { href: "/studio", label: "Studio" },
  { href: "/library", label: "Library" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="flex items-center gap-0.5 rounded-full border border-ink/10 bg-white/70 p-1 shadow-sm sm:gap-1">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-2 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                  active ? "bg-ink text-white" : "text-ink/65 hover:bg-gold-soft hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
