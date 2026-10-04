"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Check,
  ClipboardCheck,
  Eye,
  FileCheck2,
  Lightbulb,
  Sparkles,
  Target,
  Users,
  Wallet,
} from "lucide-react";
import type { CompetitionAnalysis } from "@/lib/types";

function ListCard({
  title,
  items,
  icon: Icon,
  tone = "cream",
}: {
  title: string;
  items: string[];
  icon: typeof Check;
  tone?: "cream" | "gold" | "sage" | "coral";
}) {
  const colors = {
    cream: "bg-paper",
    gold: "bg-gold-soft/60",
    sage: "bg-[#e4ecdc]",
    coral: "bg-[#f9e0d7]",
  };
  return (
    <section className={`rounded-4xl border border-ink/10 p-6 shadow-card ${colors[tone]}`}>
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/70">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="display text-2xl font-semibold">{title}</h3>
      </div>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-ink/70">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-ink/55" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function AnalysisDashboard({ analysis }: { analysis: CompetitionAnalysis }) {
  const [activeConcept, setActiveConcept] = useState(0);
  const concept = analysis.concepts[activeConcept];

  return (
    <div data-testid="analysis-results" className="space-y-6">
      <section className="overflow-hidden rounded-4xl border border-ink/10 bg-paper shadow-soft">
        <div className="grid lg:grid-cols-[1.2fr_.8fr]">
          <div className="p-7 sm:p-9">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-soft px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em]">
              <Sparkles className="h-3.5 w-3.5" /> 竞赛 Brief 已解析
            </span>
            <h2 className="display mt-5 text-4xl font-semibold leading-tight sm:text-5xl">{analysis.competitionTitle}</h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-ink/65">{analysis.summary}</p>
          </div>
          <div className="grid grid-cols-2 border-t border-ink/10 bg-ink p-4 text-white lg:border-l lg:border-t-0">
            {[
              { label: "截止日期", value: analysis.deadline, icon: CalendarDays },
              { label: "参赛资格", value: analysis.eligibility, icon: Users },
              { label: "报名费", value: analysis.entryFee, icon: Wallet },
              { label: "概念方案", value: "3 directions ready", icon: Lightbulb },
            ].map((fact) => (
              <div key={fact.label} className="border border-white/10 p-4">
                <fact.icon className="h-4 w-4 text-gold" />
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">{fact.label}</p>
                <p className="mt-1 text-sm font-semibold leading-5">{fact.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <ListCard title="提交成果" items={analysis.deliverables} icon={FileCheck2} />
        <ListCard title="格式要求" items={analysis.formatRequirements} icon={ClipboardCheck} />
        <ListCard title="评审关注重点" items={analysis.judgingCriteria} icon={Target} tone="sage" />
        <ListCard title="潜在设计机会" items={analysis.hiddenOpportunities} icon={Eye} tone="gold" />
      </div>

      <ListCard title="开始设计前需要注意" items={analysis.risks} icon={AlertTriangle} tone="coral" />

      <section id="concepts" data-testid="concept-directions" className="rounded-[2.25rem] border border-ink/10 bg-ink p-4 text-white shadow-soft sm:p-7">
        <div className="flex flex-col gap-5 px-2 py-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold">三种切入方式</span>
            <h2 className="display mt-2 text-4xl font-semibold">概念方向</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.concepts.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setActiveConcept(index)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  index === activeConcept ? "bg-gold text-ink" : "bg-white/10 text-white/60 hover:bg-white/20"
                }`}
              >
                0{index + 1} {item.title}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-4xl bg-cream text-ink">
          <div className="grid lg:grid-cols-[1.1fr_.9fr]">
            <div className="p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/40">设计方向 {activeConcept + 1}</p>
              <h3 className="display mt-3 text-5xl font-semibold">{concept.title}</h3>
              <p className="display mt-3 text-2xl leading-8 text-ink/60">{concept.tagline}</p>
              <div className="mt-7 border-l-4 border-gold pl-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink/40">空间 / 产品策略</p>
                <p className="mt-2 leading-7 text-ink/70">{concept.strategy}</p>
              </div>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-ink/10 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/40">视觉氛围</p>
                  <p className="mt-2 text-sm leading-6">{concept.visualMood}</p>
                </div>
                <div className="rounded-2xl border border-ink/10 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/40">评审契合点</p>
                  <p className="mt-2 text-sm leading-6">{concept.juryAppeal}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {concept.materialPalette.map((material) => (
                  <span key={material} className="rounded-full bg-gold-soft px-3 py-2 text-xs font-bold">{material}</span>
                ))}
              </div>
            </div>
            <div className="paper-grid border-t border-ink/10 bg-gold-soft/40 p-7 lg:border-l lg:border-t-0">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink/40">图像生成提示词包</p>
              <div className="mt-4 space-y-3">
                {concept.prompts.map((prompt, index) => (
                  <div key={prompt} className="rounded-2xl border border-ink/10 bg-white/80 p-4">
                    <div className="flex gap-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-xs font-black text-white">{index + 1}</span>
                      <p className="text-sm leading-6 text-ink/65">{prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid border-t border-ink/10 lg:grid-cols-2">
            <div className="p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink/40">150 字概念说明</p>
              <p className="mt-4 leading-7 text-ink/70">{concept.statement}</p>
            </div>
            <div className="border-t border-ink/10 p-7 sm:p-9 lg:border-l lg:border-t-0">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink/40">展板排版方案</p>
              <div className="mt-4 space-y-3">
                {concept.boardLayout.map((item, index) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-ink/20 text-xs font-bold">{index + 1}</span>
                    <p className="text-sm leading-6 text-ink/70">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-ink/10 bg-white p-7 sm:p-9">
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5" />
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink/40">此方向的提交清单</p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {concept.checklist.map((item) => (
                <div key={item.label} className="flex gap-3 rounded-2xl border border-ink/10 bg-cream p-4">
                  <span className="mt-0.5 h-5 w-5 shrink-0 rounded-md border-2 border-ink/25" />
                  <div>
                    <p className="font-bold">{item.label}</p>
                    <p className="mt-1 text-sm leading-5 text-ink/55">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center py-5">
          <button type="button" onClick={() => setActiveConcept((activeConcept + 1) % 3)} className="flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white">
            探索下一个方向 <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
