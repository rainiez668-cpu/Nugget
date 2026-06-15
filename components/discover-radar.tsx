"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  CalendarClock,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Filter,
  Globe2,
  GraduationCap,
  Languages,
  Radio,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import {
  COMPETITION_TYPES,
  DESIGN_CATEGORIES,
  competitionScore,
  competitions,
} from "@/lib/competitions";
import { setImportedBrief } from "@/lib/storage";
import type { CompetitionListing } from "@/lib/types";

type FeeFilter = "all" | "free" | "paid";
type SortMode = "recommended" | "deadline" | "prize";

function SourceBadge({ grade }: { grade: CompetitionListing["sourceGrade"] }) {
  const styles = {
    A: "bg-[#dce8d2] text-[#405b35]",
    B: "bg-gold-soft text-[#795609]",
    C: "bg-[#eee9df] text-ink/55",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black ${styles[grade]}`}>
      <ShieldCheck className="h-3 w-3" /> {grade}级来源
    </span>
  );
}

function DetailPanel({
  item,
  onClose,
  onAnalyze,
}: {
  item: CompetitionListing;
  onClose: () => void;
  onAnalyze: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-ink/35 backdrop-blur-sm" role="dialog" aria-modal="true">
      <button type="button" aria-label="关闭详情" onClick={onClose} className="absolute inset-0 cursor-default" />
      <aside className="relative h-full w-full max-w-2xl overflow-y-auto bg-cream shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/10 bg-cream/90 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <SourceBadge grade={item.sourceGrade} />
            <span className="text-xs font-bold text-ink/40">核验于 {item.lastChecked}</span>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-white hover:bg-gold-soft">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-ink px-3 py-1.5 text-xs font-bold text-white">{item.country}</span>
            <span className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-bold">{item.competitionType}</span>
            {item.entryFee === 0 && <span className="rounded-full bg-gold px-3 py-1.5 text-xs font-black">免报名费</span>}
          </div>
          <p className="mt-7 text-sm font-bold text-ink/40">{item.title}</p>
          <h2 className="display mt-2 text-4xl font-semibold leading-tight sm:text-5xl">{item.translatedTitle}</h2>
          <p className="mt-5 text-lg leading-8 text-ink/65">{item.summary}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              { icon: CalendarClock, label: "投稿截止", value: `${item.deadline} · 剩余 ${item.daysLeft} 天` },
              { icon: CircleDollarSign, label: "报名费用", value: item.entryFee === 0 ? "免费" : `${item.feeCurrency} ${item.entryFee}` },
              { icon: Banknote, label: "奖金与机会", value: item.prize },
              { icon: Languages, label: "发布语言", value: item.language },
            ].map((fact) => (
              <div key={fact.label} className="rounded-2xl border border-ink/10 bg-paper p-4">
                <fact.icon className="h-5 w-5 text-[#a87300]" />
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.15em] text-ink/40">{fact.label}</p>
                <p className="mt-1 text-sm font-bold leading-6">{fact.value}</p>
              </div>
            ))}
          </div>

          <section className="mt-8 rounded-3xl border border-ink/10 bg-white p-5">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <h3 className="font-black">参加资格</h3>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.eligibility.map((entry) => (
                <span key={entry} className="inline-flex items-center gap-1.5 rounded-full bg-[#e4ecdc] px-3 py-2 text-xs font-bold text-[#405b35]">
                  <Check className="h-3.5 w-3.5" /> {entry}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-ink/10 bg-paper p-5">
            <h3 className="font-black">设计类别</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.categories.map((category) => (
                <span key={category} className="rounded-full border border-ink/10 bg-cream px-3 py-2 text-xs font-bold">{category}</span>
              ))}
            </div>
          </section>

          <section className="mt-5">
            <div className="flex items-center justify-between">
              <h3 className="font-black">信息来源</h3>
              <span className="text-xs font-semibold text-ink/40">点击前建议再次核对官方页面</span>
            </div>
            <div className="mt-3 space-y-2">
              {item.sources.map((source) => (
                <div key={source.name} className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <span className={`grid h-9 w-9 place-items-center rounded-xl ${source.type === "wechat" ? "bg-[#dce8d2]" : "bg-gold-soft"}`}>
                      {source.type === "wechat" ? <Radio className="h-4 w-4" /> : <Globe2 className="h-4 w-4" />}
                    </span>
                    <div>
                      <p className="text-sm font-bold">{source.name}</p>
                      <p className="text-xs text-ink/40">{source.type === "wechat" ? "微信公众号来源" : "公开网页来源"}</p>
                    </div>
                  </div>
                  {source.verified && <BadgeCheck className="h-5 w-5 text-[#648053]" />}
                </div>
              ))}
            </div>
          </section>

          <div className="mt-8 rounded-3xl bg-ink p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">下一步</p>
            <h3 className="display mt-2 text-3xl font-semibold">把比赛带进 Nugget Studio</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">自动填入 Brief，继续拆解规则、机会、风险和三个概念方向。</p>
            <button type="button" onClick={onAnalyze} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3.5 text-sm font-black text-ink">
              用 Nugget 分析这场比赛 <Sparkles className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

export function DiscoverRadar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部类别");
  const [type, setType] = useState("全部类型");
  const [fee, setFee] = useState<FeeFilter>("all");
  const [eligibility, setEligibility] = useState("全部资格");
  const [sort, setSort] = useState<SortMode>("recommended");
  const [selected, setSelected] = useState<CompetitionListing | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return competitions
      .filter((item) => {
        const searchable = [
          item.title,
          item.translatedTitle,
          item.organizer,
          item.country,
          item.summary,
          ...item.categories,
        ].join(" ").toLowerCase();
        if (normalized && !searchable.includes(normalized)) return false;
        if (category !== "全部类别" && !item.categories.includes(category)) return false;
        if (type !== "全部类型" && item.competitionType !== type) return false;
        if (fee === "free" && item.entryFee !== 0) return false;
        if (fee === "paid" && item.entryFee === 0) return false;
        if (eligibility === "学生可参加" && !item.eligibility.some((value) => /学生|在校|毕业/.test(value))) return false;
        if (eligibility === "全球开放" && !item.eligibility.some((value) => /全球/.test(value))) return false;
        if (eligibility === "专业资格" && !item.eligibility.some((value) => /注册|专业|执业/.test(value))) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === "deadline") return a.daysLeft - b.daysLeft;
        if (sort === "prize") return b.prizeValueUsd - a.prizeValueUsd;
        return competitionScore(b) - competitionScore(a);
      });
  }, [category, eligibility, fee, query, sort, type]);

  function analyze(item: CompetitionListing) {
    setImportedBrief(item.brief);
    router.push("/studio");
  }

  const visibleCategories = showAllCategories ? DESIGN_CATEGORIES : DESIGN_CATEGORIES.slice(0, 9);

  return (
    <div>
      <section className="border-b border-ink/10 px-4 pb-11 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_.65fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] shadow-sm">
                  <Radio className="h-3.5 w-3.5 text-[#a87300]" /> Global design radar
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#dce8d2] px-3 py-1.5 text-xs font-bold text-[#405b35]">
                  <span className="h-2 w-2 rounded-full bg-[#6c8e59]" /> 每日更新演示
                </span>
              </div>
              <h1 className="display mt-6 max-w-4xl text-5xl font-semibold leading-[.98] sm:text-7xl">
                全球设计比赛，<br /><span className="text-[#a87300]">先看值不值得参加。</span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/60">
                跨国家、跨语言、跨设计类别持续发现仍可投稿的比赛。免费优先，奖金、资格和截止日期一眼看清。
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "22+", label: "设计类别" },
                { value: "12", label: "国家与地区" },
                { value: "4", label: "来源类型" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-ink/10 bg-paper p-4 text-center shadow-card">
                  <p className="display text-3xl font-semibold">{stat.value}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ink/40">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-9 flex flex-col gap-3 rounded-[2rem] border border-ink/10 bg-paper p-3 shadow-soft sm:flex-row">
            <label className="flex min-h-14 flex-1 items-center gap-3 rounded-2xl bg-cream px-4">
              <Search className="h-5 w-5 text-ink/35" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索比赛、国家、主办方或设计类别..."
                className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-ink/30"
              />
            </label>
            <button type="button" onClick={() => setFee("free")} className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition ${fee === "free" ? "bg-gold text-ink" : "bg-ink text-white"}`}>
              <CircleDollarSign className="h-4 w-4" /> 只看免费比赛
            </button>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-ink/10 bg-paper p-4 shadow-card">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-ink/45">
              <Filter className="h-4 w-4" /> 按设计类别筛选
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {visibleCategories.map((item) => (
                <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full px-3.5 py-2 text-xs font-bold transition ${category === item ? "bg-ink text-white" : "border border-ink/10 bg-cream hover:bg-gold-soft"}`}>
                  {item}
                </button>
              ))}
              <button type="button" onClick={() => setShowAllCategories((value) => !value)} className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-xs font-bold text-[#8b6208]">
                {showAllCategories ? "收起" : `查看全部 ${DESIGN_CATEGORIES.length - 1} 类`} <ChevronDown className={`h-3.5 w-3.5 transition ${showAllCategories ? "rotate-180" : ""}`} />
              </button>
            </div>
            <div className="mt-4 grid gap-2 border-t border-ink/10 pt-4 sm:grid-cols-4">
              <select value={type} onChange={(event) => setType(event.target.value)} className="rounded-xl border border-ink/10 bg-cream px-3 py-2.5 text-xs font-bold outline-none">
                {COMPETITION_TYPES.map((item) => <option key={item}>{item}</option>)}
              </select>
              <select value={fee} onChange={(event) => setFee(event.target.value as FeeFilter)} className="rounded-xl border border-ink/10 bg-cream px-3 py-2.5 text-xs font-bold outline-none">
                <option value="all">全部报名费用</option>
                <option value="free">免费报名</option>
                <option value="paid">付费报名</option>
              </select>
              <select value={eligibility} onChange={(event) => setEligibility(event.target.value)} className="rounded-xl border border-ink/10 bg-cream px-3 py-2.5 text-xs font-bold outline-none">
                <option>全部资格</option>
                <option>学生可参加</option>
                <option>全球开放</option>
                <option>专业资格</option>
              </select>
              <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)} className="rounded-xl border border-ink/10 bg-cream px-3 py-2.5 text-xs font-bold outline-none">
                <option value="recommended">推荐排序：免费优先</option>
                <option value="deadline">截止日期最近</option>
                <option value="prize">奖金金额最高</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black">找到 {results.length} 场仍可投稿的比赛</p>
              <p className="mt-1 text-xs text-ink/45">演示数据集 · 生产版本将接入每日抓取与重新核验</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-ink/45">
              <SlidersHorizontal className="h-4 w-4" /> 默认综合免费、奖金、可信度和准备时间
            </div>
          </div>

          <div data-testid="competition-grid" className="mt-5 grid gap-4 lg:grid-cols-2">
            {results.map((item, index) => (
              <article key={item.id} className={`group overflow-hidden rounded-[2rem] border bg-paper shadow-card transition hover:-translate-y-1 hover:shadow-soft ${item.featured && index === 0 ? "border-gold" : "border-ink/10"}`}>
                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {item.entryFee === 0 ? (
                        <span className="rounded-full bg-gold px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em]">免费报名</span>
                      ) : (
                        <span className="rounded-full bg-[#eee9df] px-3 py-1.5 text-[10px] font-black">{item.feeCurrency} {item.entryFee}</span>
                      )}
                      <SourceBadge grade={item.sourceGrade} />
                    </div>
                    <span className="text-xs font-black text-[#9a5f28]">剩余 {item.daysLeft} 天</span>
                  </div>

                  <div className="mt-5 flex items-start gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-ink/10 bg-cream text-xs font-black">{item.countryCode}</span>
                    <div>
                      <p className="text-xs font-bold text-ink/40">{item.title}</p>
                      <h2 className="display mt-1 text-2xl font-semibold leading-tight sm:text-3xl">{item.translatedTitle}</h2>
                      <p className="mt-2 text-xs font-semibold text-ink/45">{item.organizer} · {item.country} · {item.language}</p>
                    </div>
                  </div>

                  <p className="mt-5 line-clamp-2 text-sm leading-6 text-ink/60">{item.summary}</p>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <div className="rounded-2xl bg-[#fff1c7] p-3">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-ink/40"><Banknote className="h-3.5 w-3.5" /> 奖金与机会</div>
                      <p className="mt-2 text-sm font-black leading-5">{item.prize}</p>
                    </div>
                    <div className="rounded-2xl bg-[#e4ecdc] p-3">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-ink/40"><GraduationCap className="h-3.5 w-3.5" /> 参加资格</div>
                      <p className="mt-2 line-clamp-2 text-sm font-black leading-5">{item.eligibility.join(" · ")}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.categories.slice(0, 3).map((entry) => (
                      <span key={entry} className="rounded-full border border-ink/10 px-2.5 py-1 text-[10px] font-bold text-ink/55">{entry}</span>
                    ))}
                    <span className="rounded-full border border-ink/10 px-2.5 py-1 text-[10px] font-bold text-ink/55">{item.competitionType}</span>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4">
                    <span className="inline-flex items-center gap-2 text-xs font-bold text-ink/50"><Clock3 className="h-4 w-4" /> 截止 {item.deadline}</span>
                    <button data-testid={`view-${item.id}`} type="button" onClick={() => setSelected(item)} className="inline-flex items-center gap-1.5 text-xs font-black transition group-hover:text-[#9a6900]">
                      查看完整信息 <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {results.length === 0 && (
            <div className="mt-6 rounded-[2rem] border border-dashed border-ink/20 bg-paper p-12 text-center">
              <Search className="mx-auto h-8 w-8 text-ink/30" />
              <h3 className="display mt-4 text-3xl font-semibold">没有找到符合条件的比赛</h3>
              <button type="button" onClick={() => { setQuery(""); setCategory("全部类别"); setType("全部类型"); setFee("all"); setEligibility("全部资格"); }} className="mt-4 text-sm font-black text-[#8b6208]">
                清除全部筛选
              </button>
            </div>
          )}
        </div>
      </section>

      {selected && <DetailPanel item={selected} onClose={() => setSelected(null)} onAnalyze={() => analyze(selected)} />}
    </div>
  );
}
