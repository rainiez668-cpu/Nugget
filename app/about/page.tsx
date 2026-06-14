import {
  Bot,
  Check,
  CloudOff,
  Code2,
  HardDrive,
  KeyRound,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import { SectionLabel } from "@/components/section-label";

const facts = [
  {
    icon: HardDrive,
    title: "Local-first by design",
    copy: "Briefs and saved projects stay in your browser’s localStorage. Nothing is sent to a Nugget account because there is no account.",
  },
  {
    icon: Bot,
    title: "A complete mock brain",
    copy: "The public demo works without setup and produces a rich, realistic proposal kit from the sample brief.",
  },
  {
    icon: KeyRound,
    title: "Bring a provider later",
    copy: "Self-hosted copies can switch to OpenAI or Anthropic through server-side environment variables.",
  },
  {
    icon: CloudOff,
    title: "No cloud sync yet",
    copy: "Projects do not follow you between browsers or devices. Export Markdown or JSON to take the work with you.",
  },
];

export default function AboutPage() {
  return (
    <div className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>Settings & about</SectionLabel>
          <h1 className="display mt-6 text-5xl font-semibold sm:text-7xl">Small, honest, and yours.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-ink/60">
            Nugget v0 is a local-first product demo: enough intelligence to show the whole experience, without accounts, billing, or hidden infrastructure.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {facts.map((fact, index) => (
            <section key={fact.title} className={`rounded-4xl border border-ink/10 p-7 shadow-card ${
              index === 0 ? "bg-gold-soft/60" : index === 1 ? "bg-[#e4ecdc]" : "bg-paper"
            }`}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-ink/10 bg-white/70">
                <fact.icon className="h-5 w-5" />
              </span>
              <h2 className="display mt-6 text-3xl font-semibold">{fact.title}</h2>
              <p className="mt-3 leading-7 text-ink/60">{fact.copy}</p>
            </section>
          ))}
        </div>

        <section className="mt-6 overflow-hidden rounded-[2.25rem] border border-ink/10 bg-ink text-white shadow-soft">
          <div className="grid lg:grid-cols-[.85fr_1.15fr]">
            <div className="p-8 sm:p-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-gold">
                <Code2 className="h-3.5 w-3.5" /> Provider setup
              </span>
              <h2 className="display mt-6 text-4xl font-semibold">Choose how Nugget thinks.</h2>
              <p className="mt-4 leading-7 text-white/60">
                Mock mode is the default and needs no key. For a private local install, add one provider key to <code className="text-gold">.env.local</code> and restart the app.
              </p>
              <div className="mt-7 space-y-3">
                {["Keys stay server-side", "Mock fallback stays available", "No secrets committed"].map((item) => (
                  <p key={item} className="flex items-center gap-3 text-sm font-semibold text-white/70">
                    <Check className="h-4 w-4 text-gold" /> {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="border-t border-white/10 bg-[#171510] p-5 lg:border-l lg:border-t-0">
              <div className="flex items-center gap-2 border-b border-white/10 px-3 pb-4">
                <span className="h-3 w-3 rounded-full bg-coral" />
                <span className="h-3 w-3 rounded-full bg-gold" />
                <span className="h-3 w-3 rounded-full bg-sage" />
                <span className="ml-3 text-xs font-bold text-white/35">.env.local</span>
              </div>
              <pre className="overflow-x-auto p-4 text-sm leading-7 text-white/75">
                <code>{`# Works immediately
AI_PROVIDER=mock

# Or use OpenAI
AI_PROVIDER=openai
OPENAI_API_KEY=your_key_here

# Or use Anthropic
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_key_here`}</code>
              </pre>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            { icon: LockKeyhole, label: "Authentication", value: "Not included yet" },
            { icon: Sparkles, label: "Billing", value: "Not included yet" },
            { icon: CloudOff, label: "Cloud sync", value: "Not included yet" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4 rounded-3xl border border-ink/10 bg-paper p-5 shadow-card">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cream"><item.icon className="h-5 w-5" /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/35">{item.label}</p>
                <p className="mt-1 font-bold">{item.value}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
