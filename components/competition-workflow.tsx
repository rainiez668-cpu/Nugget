"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  FileCheck2,
  FileSearch,
  FileText,
  ImageIcon,
  LayoutTemplate,
  Link2,
  LoaderCircle,
  Lock,
  PackageCheck,
  ScanSearch,
  Send,
  Sparkles,
  Upload,
  UserCheck,
  WandSparkles,
} from "lucide-react";
import { getCompetition } from "@/lib/competitions";
import { getRuleSet, inferParticipation } from "@/lib/competition-rules";
import {
  buildBoardLayouts,
  buildAssetPlan,
  buildAssetPrompts,
  buildConcepts,
  effectiveDeliverables,
  packageMarkdown,
} from "@/lib/production";
import { CompetitionBoard } from "@/components/competition-board";
import type { CompetitionListing } from "@/lib/types";

const steps = [
  { id: "documents", label: "导入竞赛文件", icon: FileSearch },
  { id: "eligibility", label: "资格判断", icon: UserCheck },
  { id: "deliverables", label: "提交成果矩阵", icon: FileCheck2 },
  { id: "concept", label: "方案生成", icon: Sparkles },
  { id: "assets", label: "图像生成", icon: ImageIcon },
  { id: "layout", label: "排版与文字", icon: LayoutTemplate },
  { id: "review", label: "审阅与提交", icon: PackageCheck },
];

export function CompetitionWorkflow() {
  const [competition, setCompetition] = useState<CompetitionListing | undefined>(
    getCompetition("real-leather-student-2026"),
  );
  const [active, setActive] = useState("documents");
  const [completed, setCompleted] = useState<string[]>([]);
  const [busy, setBusy] = useState("");
  const [selectedConcept, setSelectedConcept] = useState(0);
  const [selectedLayout, setSelectedLayout] = useState(0);
  const [assetCount, setAssetCount] = useState(3);
  const [assetCountConfirmed, setAssetCountConfirmed] = useState(false);
  const [assets, setAssets] = useState<string[]>([]);
  const [imageProvider, setImageProvider] = useState("");
  const [statement, setStatement] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("competition");
    if (id) setCompetition(getCompetition(id) ?? getCompetition("real-leather-student-2026"));
  }, []);

  const rules = competition ? getRuleSet(competition.id) : undefined;
  const participation = competition
    ? rules?.participation ?? inferParticipation(competition.eligibility)
    : "restricted";
  const eligible = participation === "student" || participation === "open";
  const deliverables = useMemo(
    () => competition ? effectiveDeliverables(competition, rules) : [],
    [competition, rules],
  );
  const assetPlan = useMemo(
    () => competition ? buildAssetPlan(competition, deliverables) : undefined,
    [competition, deliverables],
  );
  const concepts = useMemo(() => competition ? buildConcepts(competition) : [], [competition]);
  const concept = concepts[selectedConcept];
  const layouts = useMemo(
    () => competition ? buildBoardLayouts(competition, selectedConcept) : [],
    [competition, selectedConcept],
  );
  const layout = layouts[selectedLayout] ?? layouts[0];
  const progress = Math.round((completed.length / steps.length) * 100);

  useEffect(() => {
    if (!assetPlan) return;
    setAssetCount(assetPlan.recommended);
    setAssetCountConfirmed(assetPlan.confidence !== "unknown");
    setAssets([]);
  }, [assetPlan]);

  if (!competition || !concept || !layout || !assetPlan) return null;
  const currentCompetition = competition;
  const currentAssetPlan = assetPlan;

  const indexFor = (id: string) => steps.findIndex((step) => step.id === id);
  const canOpen = (id: string) => {
    const index = indexFor(id);
    if (index <= 2) return true;
    return completed.includes(steps[index - 1].id);
  };

  function complete(id: string, next?: string) {
    setCompleted((current) => current.includes(id) ? current : [...current, id]);
    if (next) setActive(next);
  }

  function simulate(id: string, duration: number, callback: () => void) {
    setBusy(id);
    window.setTimeout(() => {
      callback();
      setBusy("");
    }, duration);
  }

  async function generateAssets() {
    setBusy("assets");
    try {
      const response = await fetch("/api/generate-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          competitionTitle: currentCompetition.title,
          conceptTitle: concept.title,
          categories: currentCompetition.categories,
          prompts: buildAssetPrompts(
            currentCompetition,
            concept,
            currentAssetPlan,
            assetCount,
          ),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "生成失败");
      setAssets(data.assets);
      setImageProvider(data.provider);
    } finally {
      setBusy("");
    }
  }

  function downloadPackage() {
    const markdown = packageMarkdown(
      currentCompetition,
      concept,
      deliverables,
      assets.length,
      currentAssetPlan.roles,
    );
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${currentCompetition.id}-submission-package.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[#f3eee3]">
      <header className="border-b border-ink/10 bg-paper px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-[1450px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <a href="/discover" className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-cream hover:bg-gold-soft" aria-label="返回比赛雷达">
              <ArrowLeft className="h-4 w-4" />
            </a>
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-black">COMPETITION WORKFLOW</span>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${eligible ? "bg-[#dce8d2] text-[#405b35]" : "bg-[#f9e0d7] text-[#7d3825]"}`}>
                  {eligible ? "符合当前学生身份" : "资格不匹配"}
                </span>
              </div>
              <h1 className="mt-2 font-black">{competition.translatedTitle}</h1>
            </div>
          </div>
          <div className="min-w-64">
            <div className="flex justify-between text-[10px] font-bold text-ink/45"><span>流程完成度</span><span>{progress}%</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/10"><div className="h-full rounded-full bg-gold transition-all" style={{ width: `${progress}%` }} /></div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1450px] lg:grid-cols-[250px_1fr]">
        <aside className="border-r border-ink/10 bg-paper p-4 lg:min-h-[calc(100vh-85px)]">
          <p className="px-3 py-2 text-[10px] font-black uppercase tracking-[.16em] text-ink/35">End-to-end workflow</p>
          <nav className="space-y-1">
            {steps.map((step, index) => {
              const locked = !canOpen(step.id);
              const done = completed.includes(step.id);
              return (
                <button key={step.id} type="button" disabled={locked} onClick={() => setActive(step.id)} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-30 ${active === step.id ? "bg-ink text-white" : "hover:bg-cream"}`}>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${active === step.id ? "bg-gold text-ink" : "bg-cream"}`}>
                    {locked ? <Lock className="h-3.5 w-3.5" /> : done ? <Check className="h-4 w-4" /> : <step.icon className="h-4 w-4" />}
                  </span>
                  <span><span className="block text-[9px] font-black opacity-35">0{index + 1}</span><span className="text-xs font-black">{step.label}</span></span>
                </button>
              );
            })}
          </nav>
          <div className="mt-6 rounded-2xl border border-ink/10 bg-[#fff4d3] p-4">
            <p className="flex items-center gap-2 text-xs font-black"><Lock className="h-4 w-4" /> 人工审阅保留</p>
            <p className="mt-2 text-[11px] leading-5 text-ink/55">系统可以生成和打包，但真实网站上传前仍要求你确认资格、原创性和最终文件。</p>
          </div>
        </aside>

        <main className="min-w-0 p-4 sm:p-7 lg:p-9">
          {active === "documents" && (
            <Section eyebrow="01 · DOCUMENT INGESTION" title="竞赛文件中心" description="保存官方原文与本地解析依据，再开始生产。">
              <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
                <div className="overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-card">
                  {(rules?.documents ?? competition.sources.map((source) => ({
                    name: source.name, type: "official-page" as const, url: source.url, downloadable: false, checkedAt: competition.lastChecked,
                  }))).map((doc, index) => (
                    <div key={doc.name} className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between ${index ? "border-t border-ink/10" : ""}`}>
                      <div className="flex items-center gap-4"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-soft"><FileText className="h-5 w-5" /></span><div><p className="font-black">{doc.name}</p><p className="mt-1 text-xs text-ink/40">核验 {doc.checkedAt}</p></div></div>
                      <a href={doc.url} target="_blank" rel="noreferrer" download={doc.downloadable || undefined} className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/10 px-4 py-2.5 text-xs font-black hover:bg-gold-soft">{doc.downloadable ? <Download className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}{doc.downloadable ? "下载文件" : "打开原文"}</a>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="rounded-3xl border border-dashed border-ink/20 bg-paper p-5 text-center"><Upload className="mx-auto h-7 w-7 text-ink/35" /><p className="mt-3 text-sm font-black">补充上传细则</p><p className="mt-1 text-xs text-ink/45">PDF、DOCX、图片或网页链接</p></div>
                  <ActionButton busy={busy === "documents"} done={completed.includes("documents")} onClick={() => simulate("documents", 900, () => complete("documents", "eligibility"))} label="读取全部文件并分析" doneLabel="文件已解析" />
                </div>
              </div>
            </Section>
          )}

          {active === "eligibility" && (
            <Section eyebrow="02 · ELIGIBILITY GATE" title="你到底能不能参加？" description="系统引用官方规则给出硬结论。">
              <div className={`rounded-3xl border p-6 shadow-card ${eligible ? "border-[#9bb58d] bg-[#e4ecdc]" : "border-[#d49a7f] bg-[#f9e0d7]"}`}>
                <div className="flex justify-between gap-5"><div><p className="text-xs font-black uppercase tracking-[.15em] opacity-50">Eligibility verdict</p><h3 className="display mt-2 text-4xl font-semibold">{rules?.verdict ?? (eligible ? "当前身份可参加" : "当前身份不符合")}</h3><p className="mt-4 max-w-3xl text-sm leading-7 opacity-75">{rules?.verdictDetail ?? competition.eligibility.join("；")}</p></div>{eligible ? <BadgeCheck className="h-12 w-12 text-[#587247]" /> : <AlertTriangle className="h-12 w-12 text-[#a84f32]" />}</div>
              </div>
              <div className="mt-5 flex justify-end"><button disabled={!eligible} onClick={() => complete("eligibility", "deliverables")} className="rounded-full bg-ink px-6 py-3.5 text-sm font-black text-white disabled:opacity-30">确认资格并继续</button></div>
            </Section>
          )}

          {active === "deliverables" && (
            <Section eyebrow="03 · DELIVERABLE MATRIX" title="必须提交什么？" description="后续生成只围绕已经确认的成果矩阵工作。">
              <div className="overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-card">
                {deliverables.map((item, index) => <div key={item} className={`flex gap-4 p-5 ${index ? "border-t border-ink/10" : ""}`}><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold text-xs font-black">{index + 1}</span><p className="text-sm font-bold leading-6">{item}</p></div>)}
              </div>
              <div className="mt-5 grid gap-4 rounded-3xl border border-ink/10 bg-paper p-5 shadow-card md:grid-cols-[1fr_250px]">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.16em] text-[#9a6900]">Visual asset plan</p>
                  <h3 className="mt-2 text-xl font-black">
                    {assetPlan.confidence === "exact"
                      ? `官方要求 ${assetPlan.min} 张`
                      : assetPlan.confidence === "range"
                        ? `官方允许 ${assetPlan.min}–${assetPlan.max} 张`
                        : "图片数量需要人工确认"}
                  </h3>
                  <p className="mt-3 text-xs leading-6 text-ink/55">解析依据：{assetPlan.evidence}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {assetPlan.roles.slice(0, assetCount).map((role, index) => (
                      <span key={role} className="rounded-full bg-cream px-3 py-1.5 text-[10px] font-black">
                        V0{index + 1} · {role}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl bg-cream p-4">
                  <label className="text-xs font-black" htmlFor="asset-count">计划生成数量</label>
                  <div className="mt-3 flex items-center gap-3">
                    <button type="button" disabled={assetCount <= assetPlan.min} onClick={() => { setAssetCount((value) => value - 1); setAssets([]); }} className="h-10 w-10 rounded-full border border-ink/10 bg-paper font-black disabled:opacity-25">−</button>
                    <input id="asset-count" readOnly value={assetCount} className="h-10 min-w-0 flex-1 rounded-xl border border-ink/10 bg-paper text-center text-lg font-black" />
                    <button type="button" disabled={assetCount >= assetPlan.max} onClick={() => { setAssetCount((value) => value + 1); setAssets([]); }} className="h-10 w-10 rounded-full border border-ink/10 bg-paper font-black disabled:opacity-25">+</button>
                  </div>
                  <p className="mt-2 text-[10px] leading-4 text-ink/45">
                    {assetPlan.confidence === "range" ? "默认采用最低合规数量以控制生成成本。" : "数量来自当前成果矩阵。"}
                  </p>
                  {assetPlan.confidence === "unknown" && (
                    <label className="mt-3 flex gap-2 text-[10px] font-bold leading-4">
                      <input type="checkbox" checked={assetCountConfirmed} onChange={(event) => setAssetCountConfirmed(event.target.checked)} className="accent-[#201d17]" />
                      我已对照官方细则确认这个数量
                    </label>
                  )}
                </div>
              </div>
              <div className="mt-5 rounded-3xl bg-ink p-6 text-white"><p className="text-xs font-black uppercase tracking-[.15em] text-gold">AI与原创规则</p><p className="mt-3 text-sm leading-7 text-white/65">{rules?.aiRule ?? "未提取到明确AI限制；最终提交前必须再次核对官方规则。"}</p></div>
              <div className="mt-5 flex justify-end"><button disabled={!assetCountConfirmed} onClick={() => complete("deliverables", "concept")} className="rounded-full bg-gold px-6 py-3.5 text-sm font-black disabled:opacity-30">确认成果矩阵与数量</button></div>
            </Section>
          )}

          {active === "concept" && (
            <Section eyebrow="04 · CONCEPT GENERATION" title="选择一个方案方向" description="Nugget生成三个可比较方向；你批准后才进入生图。">
              <div className="grid gap-4 lg:grid-cols-3">
                {concepts.map((item, index) => <button key={item.title} onClick={() => { setSelectedConcept(index); setSelectedLayout(0); }} className={`rounded-3xl border p-5 text-left shadow-card transition ${selectedConcept === index ? "border-gold bg-[#fff5d8] ring-2 ring-gold/30" : "border-ink/10 bg-paper hover:-translate-y-1"}`}><p className="text-[10px] font-black text-ink/35">DIRECTION 0{index + 1}</p><h3 className="display mt-3 text-3xl font-semibold">{item.title}</h3><p className="mt-2 text-sm font-bold text-[#8b6208]">{item.tagline}</p><p className="mt-4 text-xs leading-6 text-ink/55">{item.strategy}</p><div className="mt-5 flex flex-wrap gap-1.5">{item.palette.map((color) => <span key={color} className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold">{color}</span>)}</div></button>)}
              </div>
              <div className="mt-5 flex justify-end"><button onClick={() => { setStatement(concept.statement); complete("concept", "assets"); }} className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-black text-white">批准 {concept.title}<ChevronRight className="h-4 w-4" /></button></div>
            </Section>
          )}

          {active === "assets" && (
            <Section eyebrow="05 · IMAGE GENERATION" title="生成竞赛视觉" description="有OpenAI密钥时真实生成；没有密钥时使用内置AI样板完成体验。">
              {assets.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-ink/20 bg-paper p-12 text-center shadow-card"><span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gold-soft"><WandSparkles className="h-7 w-7" /></span><h3 className="display mt-5 text-3xl font-semibold">{assetCount}个成果提示词已经准备好</h3><p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-ink/55">每张图对应一个成果角色，并保持同一方案、材料、比例和视觉语言。</p><div className="mx-auto mt-4 flex max-w-2xl flex-wrap justify-center gap-2">{assetPlan.roles.slice(0, assetCount).map((role, index) => <span key={role} className="rounded-full bg-cream px-3 py-1.5 text-[10px] font-black">V0{index + 1} · {role}</span>)}</div><button onClick={() => void generateAssets()} disabled={busy === "assets"} className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-black text-white">{busy === "assets" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}{busy === "assets" ? `正在生成 ${assetCount} 张...` : `生成 ${assetCount} 张竞赛视觉`}</button></div>
              ) : (
                <><div className="mb-4 flex justify-between"><span className="rounded-full bg-[#dce8d2] px-3 py-1.5 text-xs font-black text-[#405b35]">{imageProvider === "openai" ? "OpenAI真实生成" : "演示AI样板"} · {assets.length}张</span><button onClick={() => setAssets([])} className="text-xs font-black text-[#8b6208]">重新生成</button></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{assets.map((src, index) => <div key={index} className="overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-card"><div className="relative aspect-[4/3]"><Image src={src} alt={`Generated competition visual ${index + 1}`} fill unoptimized={src.startsWith("data:")} className="object-cover" /></div><div className="p-4"><p className="font-black">V{String(index + 1).padStart(2, "0")} · {assetPlan.roles[index] ?? `补充视觉 ${index + 1}`}</p><p className="mt-1 text-xs text-ink/45">对应成果矩阵，可单独重做或替换</p></div></div>)}</div><div className="mt-5 flex justify-end"><button onClick={() => complete("assets", "layout")} className="rounded-full bg-gold px-6 py-3.5 text-sm font-black">批准视觉并排版</button></div></>
              )}
            </Section>
          )}

          {active === "layout" && (
            <Section eyebrow="06 · LAYOUT & COPY" title="选择版式方向" description="系统根据比赛类别、概念驱动和成果结构推荐三个不同构图；你决定最终阅读顺序。">
              <div className="mb-5 grid gap-3 md:grid-cols-3">
                {layouts.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedLayout(index)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      selectedLayout === index
                        ? "border-ink bg-ink text-white shadow-card"
                        : "border-ink/10 bg-paper hover:border-gold"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-black">{item.name}</p>
                      <span className={`rounded-full px-2 py-1 text-[9px] font-black ${selectedLayout === index ? "bg-gold text-ink" : "bg-gold-soft"}`}>
                        方案 0{index + 1}
                      </span>
                    </div>
                    <p className="mt-2 text-[10px] font-black uppercase tracking-[.12em] opacity-45">{item.signature}</p>
                    <p className="mt-3 text-xs leading-5 opacity-65">{item.rationale}</p>
                  </button>
                ))}
              </div>
              <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
                <div className="rounded-3xl bg-[#cec7b9] p-5 shadow-card">
                  <CompetitionBoard
                    assets={assets}
                    competitionTitle={competition.title}
                    concept={concept}
                    deliverables={deliverables}
                    layout={layout}
                  />
                  <div className="mt-3 flex items-center justify-between text-[10px] font-black uppercase tracking-[.12em] text-ink/45">
                    <span>{layout.name}</span>
                    <span>根据 {competition.categories.slice(0, 2).join(" / ")} 推荐</span>
                  </div>
                </div>
                <div className="rounded-3xl border border-ink/10 bg-paper p-5 shadow-card"><label className="text-xs font-black">设计说明</label><textarea value={statement} onChange={(event) => setStatement(event.target.value)} className="mt-3 min-h-64 w-full rounded-2xl border border-ink/10 bg-cream p-4 text-sm leading-7 outline-none focus:border-gold" /><p className="mt-2 text-right text-xs font-bold text-ink/35">{statement.length} 字符</p></div>
              </div>
              <div className="mt-5 flex justify-end"><button onClick={() => complete("layout", "review")} className="rounded-full bg-ink px-6 py-3.5 text-sm font-black text-white">批准排版与文字</button></div>
            </Section>
          )}

          {active === "review" && (
            <Section eyebrow="07 · REVIEW & SUBMISSION" title={submitted ? "模拟提交成功" : "最终审阅与提交"} description="真实网站上传需要账号、验证码和最终签署；这里完整模拟提交并生成可下载的交付包。">
              {!submitted ? (
                <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
                  <div className="overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-card">
                    {["资格符合当前身份", "官方细则已读取并保留来源", "成果矩阵全部覆盖", "方案方向已经人工批准", `${assets.length}张视觉已经生成并批准`, "排版与文字已经审阅", "原创过程与AI使用记录已保留"].map((item) => <label key={item} className="flex items-center gap-3 border-b border-ink/10 p-4 last:border-0"><CheckCircle2 className="h-5 w-5 text-[#628150]" /><span className="text-sm font-bold">{item}</span></label>)}
                  </div>
                  <div className="space-y-4">
                    <button onClick={downloadPackage} className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/10 bg-paper px-5 py-3.5 text-sm font-black"><Download className="h-4 w-4" />下载提交包清单</button>
                    <label className="flex gap-3 rounded-2xl border border-ink/10 bg-paper p-4"><input type="checkbox" checked={reviewed} onChange={(event) => setReviewed(event.target.checked)} className="mt-1 accent-[#201d17]" /><span className="text-xs font-bold leading-5">我已确认资格、版权、技术可行性和最终文件，并授权执行模拟提交。</span></label>
                    <button disabled={!reviewed || busy === "submit"} onClick={() => simulate("submit", 1300, () => { setSubmitted(true); complete("review"); })} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-black text-white disabled:opacity-30">{busy === "submit" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{busy === "submit" ? "正在上传并校验..." : "模拟提交到竞赛网站"}</button>
                  </div>
                </div>
              ) : (
                <div className="rounded-[2rem] border border-[#9bb58d] bg-[#e4ecdc] p-8 text-center shadow-card"><BadgeCheck className="mx-auto h-16 w-16 text-[#587247]" /><p className="mt-5 text-xs font-black uppercase tracking-[.16em] text-[#587247]">Submission receipt</p><h3 className="display mt-2 text-4xl font-semibold">NUG-{new Date().getFullYear()}-{competition.id.slice(0, 6).toUpperCase()}</h3><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#405b35]">模拟上传、文件完整性检查和回执生成已完成。正式版本将在接入目标比赛网站后，于最终确认前显示真实上传字段和回执。</p><a href={competition.sources[0]?.url} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-black text-white">打开官方提交页面<Link2 className="h-4 w-4" /></a></div>
              )}
            </Section>
          )}
        </main>
      </div>
    </div>
  );
}

function Section({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return <section><p className="text-[10px] font-black uppercase tracking-[.18em] text-[#9a6900]">{eyebrow}</p><h2 className="display mt-3 text-4xl font-semibold sm:text-5xl">{title}</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-ink/55">{description}</p><div className="mt-7">{children}</div></section>;
}

function ActionButton({ busy, done, onClick, label, doneLabel }: { busy: boolean; done: boolean; onClick: () => void; label: string; doneLabel: string }) {
  return <button type="button" onClick={onClick} disabled={busy || done} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-black text-white disabled:opacity-50">{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : done ? <CheckCircle2 className="h-4 w-4 text-gold" /> : <ScanSearch className="h-4 w-4" />}{busy ? "正在处理..." : done ? doneLabel : label}</button>;
}
