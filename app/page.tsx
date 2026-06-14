import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileText,
  Layers3,
  Lightbulb,
  PackageCheck,
  Sparkles,
} from "lucide-react";
import { NuggetVisual } from "@/components/nugget-visual";
import { SectionLabel } from "@/components/section-label";

const workflow = [
  { name: "Dig", copy: "Paste the messy brief.", icon: FileText, color: "bg-gold-soft" },
  { name: "Hatch", copy: "Reveal three strong directions.", icon: Lightbulb, color: "bg-[#dce8d2]" },
  { name: "Polish", copy: "Build prompts, words, and boards.", icon: Layers3, color: "bg-[#f8d6c9]" },
  { name: "Pack", copy: "Export a submission-ready plan.", icon: PackageCheck, color: "bg-[#d9d6ef]" },
];

export default function Home() {
  return (
    <>
      <section className="overflow-hidden px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.08fr_.92fr]">
          <div>
            <SectionLabel>AI competition studio for designers</SectionLabel>
            <h1 className="display mt-7 max-w-3xl text-6xl font-semibold leading-[0.96] sm:text-7xl lg:text-[92px]">
              Find golden ideas inside <span className="relative whitespace-nowrap">
                messy briefs.
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 500 22" fill="none" aria-hidden="true">
                  <path d="M5 14C137 2 320 4 495 10" stroke="#F6BD3A" strokeWidth="10" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-ink/65 sm:text-xl">
              Nugget turns dense design competition briefs into clear requirements, concept directions,
              visual prompts, board plans, and a submission checklist.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/studio"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 font-bold text-white shadow-[0_8px_0_#d99f1d] transition hover:-translate-y-1"
              >
                Start with a brief
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-paper px-6 py-4 font-bold shadow-sm transition hover:bg-gold-soft"
              >
                <Sparkles className="h-4 w-4" />
                See the instant demo
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-ink/55">
              {["No account", "Local-first", "Beautiful mock AI"].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#798c68]" /> {item}
                </span>
              ))}
            </div>
          </div>
          <NuggetVisual />
        </div>
      </section>

      <section className="border-y border-ink/10 bg-paper/70 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionLabel>From brief to board</SectionLabel>
              <h2 className="display mt-5 text-4xl font-semibold sm:text-5xl">A tiny studio with a clear rhythm.</h2>
            </div>
            <p className="max-w-md leading-7 text-ink/60">
              Keep the spark. Lose the spreadsheet panic. Nugget turns ambiguity into a sequence you can design through.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {workflow.map((step, index) => (
              <div key={step.name} className="group rounded-4xl border border-ink/10 bg-cream p-5 shadow-card transition hover:-translate-y-1">
                <div className={`grid h-14 w-14 place-items-center rounded-2xl border border-ink/10 ${step.color}`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-ink/40">0{index + 1}</p>
                <h3 className="display mt-1 text-3xl font-semibold">{step.name}</h3>
                <p className="mt-2 leading-6 text-ink/60">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>What comes out</SectionLabel>
            <h2 className="display mt-5 text-4xl font-semibold sm:text-5xl">Not a chat. A working proposal kit.</h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
            <div className="rounded-4xl border border-ink/10 bg-ink p-7 text-white shadow-soft">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider">Brief intelligence</span>
              <h3 className="display mt-8 text-4xl">The deadline is not the strategy.</h3>
              <p className="mt-4 leading-7 text-white/65">
                Nugget separates what the brief says from what the jury is really inviting you to notice.
              </p>
              <div className="mt-8 space-y-3">
                {["Hidden opportunity", "Submission risk", "Jury signal"].map((item, index) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl bg-white/10 p-4">
                    <span className="font-semibold">{item}</span>
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-gold text-xs font-black text-ink">{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="paper-grid rounded-4xl border border-ink/10 bg-paper p-7 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-gold-soft px-3 py-1 text-xs font-bold uppercase tracking-wider">Concept 01</span>
                <span className="text-xs font-bold text-ink/40">THE DAILY FOLD</span>
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_.8fr]">
                <div>
                  <h3 className="display text-4xl font-semibold">One object. Three moments.</h3>
                  <p className="mt-4 leading-7 text-ink/60">
                    A freestanding cabinet opens into a desk, extends into a shared table, and closes into a soft perch.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {["Birch ply", "Cork", "Wool", "Brass"].map((item) => (
                      <span key={item} className="rounded-full border border-ink/10 bg-white px-3 py-2 text-xs font-bold">{item}</span>
                    ))}
                  </div>
                </div>
                <div className="grain min-h-48 rounded-3xl border border-ink/10 bg-gold-soft p-5">
                  <div className="flex h-full flex-col justify-between">
                    <Sparkles className="h-6 w-6" />
                    <p className="display text-2xl font-semibold">Image prompts, statement, and board layout included.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grain mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border-2 border-ink bg-gold p-8 text-center shadow-[8px_8px_0_#201d17] sm:p-14">
          <h2 className="display text-4xl font-semibold sm:text-6xl">Your next idea is already in the brief.</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink/70">Let’s dig it out, give it shape, and get it onto the board.</p>
          <Link href="/studio" className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 font-bold text-white">
            Open the studio <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
