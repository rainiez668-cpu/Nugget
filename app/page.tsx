import Link from "next/link";
import {
  ArrowRight,
  Check,
  Globe2,
  ListFilter,
  Search,
  WandSparkles,
  Sparkles,
} from "lucide-react";
import { NuggetVisual } from "@/components/nugget-visual";
import { SectionLabel } from "@/components/section-label";

const workflow = [
  { name: "发现", copy: "发现来自全球的设计竞赛。", icon: Globe2, color: "bg-gold-soft" },
  { name: "判断", copy: "快速了解报名费用、奖项与参赛资格。", icon: ListFilter, color: "bg-[#dce8d2]" },
  { name: "拆解", copy: "拆解竞赛 Brief，提取关键要求。", icon: Search, color: "bg-[#f8d6c9]" },
  { name: "创作", copy: "将竞赛要求转化为可执行的设计方向。", icon: WandSparkles, color: "bg-[#d9d6ef]" },
];

export default function Home() {
  return (
    <>
      <section className="overflow-hidden px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.08fr_.92fr]">
          <div>
            <SectionLabel>面向设计师的全球竞赛雷达</SectionLabel>
            <h1 className="display mt-7 max-w-3xl text-6xl font-semibold leading-[0.96] sm:text-7xl lg:text-[92px]">
              Find the right competition. <span className="relative whitespace-nowrap">
                Then win it.
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 500 22" fill="none" aria-hidden="true">
                  <path d="M5 14C137 2 320 4 495 10" stroke="#F6BD3A" strokeWidth="10" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-[23px] leading-8 text-ink/65 sm:text-[18px]">
              Nugget 搜集全球不同国家、语言与设计领域的公开竞赛，优先筛选免费参赛机会，并将竞赛Brief转化为完整的提案方案包。
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/discover"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 font-bold text-white shadow-[0_8px_0_#d99f1d] transition hover:-translate-y-1"
              >
                发现竞赛
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-paper px-6 py-4 font-bold shadow-sm transition hover:bg-gold-soft"
              >
                <Sparkles className="h-4 w-4" />
                体验 Demo
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-ink/55">
              {["优先推荐免费竞赛", "奖项与参赛资格一目了然", "持续发现全球机会"].map((item) => (
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
              <SectionLabel>从发现到提交</SectionLabel>
              <h2 className="display mt-5 text-4xl font-semibold sm:text-5xl">一个竞赛雷达，覆盖不同设计领域。</h2>
            </div>
            <p className="max-w-md leading-7 text-ink/60">
              覆盖建筑、景观、室内、产品、视觉传达、数字体验、时尚、社会创新，以及不断出现的新兴设计领域。
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
            <SectionLabel>Nugget能帮你得到什么</SectionLabel>
            <h2 className="display mt-5 text-4xl font-semibold sm:text-5xl">不只是对话，而是一套可以继续推进的完整方案。</h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
            <div className="rounded-4xl border border-ink/10 bg-ink p-7 text-white shadow-soft">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider">Brief 洞察</span>
              <h3 className="display mt-8 text-4xl lg:w-[calc(100%+0.75rem)]">别让截止日期决定你的策略。</h3>
              <p className="mt-4 leading-7 text-white/65">
                Nugget不只解读竞赛Brief写了什么，也帮你看清评审真正希望你关注什么。
              </p>
              <div className="mt-8 space-y-3">
                {["潜在机会", "提交风险", "评审关注点"].map((item, index) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl bg-white/10 p-4">
                    <span className="font-semibold">{item}</span>
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-gold text-xs font-black text-ink">{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="paper-grid rounded-4xl border border-ink/10 bg-paper p-7 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-gold-soft px-3 py-1 text-xs font-bold uppercase tracking-wider">概念方案 01</span>
                <span className="text-xs font-bold text-ink/40">THE DAILY FOLD</span>
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_.8fr]">
                <div>
                  <h3 className="display text-[32px] font-semibold">一件家具，三种生活场景。</h3>
                  <p className="mt-4 leading-7 text-ink/60">
                    一款独立式多功能柜体，展开后可作为工作书桌，进一步延展为多人共享桌面，收合后则转变为柔软舒适的休憩坐凳。
                  </p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {["桦木胶合板", "软木", "羊毛", "黄铜"].map((item) => (
                      <span key={item} className="rounded-full border border-ink/10 bg-white px-3 py-2 text-xs font-bold">{item}</span>
                    ))}
                  </div>
                </div>
                <div className="grain min-h-48 rounded-3xl border border-ink/10 bg-gold-soft p-5">
                  <div className="flex h-full flex-col justify-between">
                    <Sparkles className="h-6 w-6" />
                    <p className="display text-2xl font-semibold">已包含：AI 图像生成提示词、设计理念陈述及展板排版方案。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grain mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border-2 border-ink bg-gold p-8 text-center shadow-[8px_8px_0_#201d17] sm:p-14">
          <h2 className="display text-4xl font-semibold sm:text-6xl">适合你的设计命题，可能来自世界任何地方。</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink/70">从真正值得投入的竞赛机会开始，让Nugget帮你一步步完善参赛方案。</p>
          <Link href="/discover" className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 font-bold text-white">
            打开竞赛雷达 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
