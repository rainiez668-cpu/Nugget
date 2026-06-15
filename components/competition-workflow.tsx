"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  FileArchive,
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
  Sparkles,
  Upload,
  UserCheck,
} from "lucide-react";
import { getCompetition } from "@/lib/competitions";
import { getRuleSet, inferParticipation } from "@/lib/competition-rules";
import type { CompetitionListing } from "@/lib/types";

const workflowSteps = [
  { id: "documents", label: "导入竞赛文件", icon: FileSearch },
  { id: "eligibility", label: "资格判断", icon: UserCheck },
  { id: "deliverables", label: "提交成果矩阵", icon: FileCheck2 },
  { id: "concept", label: "方案生成", icon: Sparkles },
  { id: "assets", label: "图像与图纸", icon: ImageIcon },
  { id: "layout", label: "排版与文字", icon: LayoutTemplate },
  { id: "review", label: "审阅与提交包", icon: PackageCheck },
];

export function CompetitionWorkflow() {
  const [competition, setCompetition] = useState<CompetitionListing | undefined>(
    getCompetition("real-leather-student-2026"),
  );
  const [active, setActive] = useState("documents");
  const [parsed, setParsed] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [eligibilityConfirmed, setEligibilityConfirmed] = useState(false);
  const [deliverablesConfirmed, setDeliverablesConfirmed] = useState(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("competition");
    if (id) setCompetition(getCompetition(id) ?? getCompetition("real-leather-student-2026"));
  }, []);

  const rules = competition ? getRuleSet(competition.id) : undefined;
  const participation = competition ? rules?.participation ?? inferParticipation(competition.eligibility) : "restricted";
  const eligible = participation === "student" || participation === "open";
  const unlocked = eligibilityConfirmed && deliverablesConfirmed;
  const progress = useMemo(() => {
    let count = parsed ? 1 : 0;
    if (eligibilityConfirmed) count += 1;
    if (deliverablesConfirmed) count += 1;
    return Math.round((count / 7) * 100);
  }, [deliverablesConfirmed, eligibilityConfirmed, parsed]);

  if (!competition) return null;

  function parseDocuments() {
    setParsing(true);
    window.setTimeout(() => {
      setParsing(false);
      setParsed(true);
      setActive("eligibility");
    }, 900);
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
          <p className="px-3 py-2 text-[10px] font-black uppercase tracking-[.16em] text-ink/35">Gated workflow</p>
          <nav className="space-y-1">
            {workflowSteps.map((step, index) => {
              const locked = index >= 3 && !unlocked;
              const done = step.id === "documents" ? parsed : step.id === "eligibility" ? eligibilityConfirmed : step.id === "deliverables" ? deliverablesConfirmed : false;
              return (
                <button
                  key={step.id}
                  type="button"
                  disabled={locked}
                  onClick={() => setActive(step.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-35 ${active === step.id ? "bg-ink text-white" : "hover:bg-cream"}`}
                >
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${active === step.id ? "bg-gold text-ink" : "bg-cream"}`}>
                    {locked ? <Lock className="h-3.5 w-3.5" /> : done ? <Check className="h-4 w-4" /> : <step.icon className="h-4 w-4" />}
                  </span>
                  <span><span className="block text-[9px] font-black opacity-35">0{index + 1}</span><span className="text-xs font-black">{step.label}</span></span>
                </button>
              );
            })}
          </nav>
          <div className="mt-6 rounded-2xl border border-ink/10 bg-[#fff4d3] p-4">
            <p className="flex items-center gap-2 text-xs font-black"><Lock className="h-4 w-4" /> 规则优先</p>
            <p className="mt-2 text-[11px] leading-5 text-ink/55">资格和提交成果未确认前，不启动方案、生图或排版，避免在不能参加的比赛上浪费时间。</p>
          </div>
        </aside>

        <main className="min-w-0 p-4 sm:p-7 lg:p-9">
          {active === "documents" && (
            <WorkflowSection eyebrow="01 · DOCUMENT INGESTION" title="竞赛文件中心" description="先保存原始依据，再进行AI提取。官方网页、PDF、附件和本地解析摘要都在这里可追溯。">
              <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
                <div className="overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-card">
                  {(rules?.documents ?? competition.sources.map((source) => ({
                    name: source.name, type: "official-page" as const, url: source.url, downloadable: false, checkedAt: competition.lastChecked,
                  }))).map((doc, index) => (
                    <div key={doc.name} className={`flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between ${index ? "border-t border-ink/10" : ""}`}>
                      <div className="flex items-center gap-4">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold-soft"><FileText className="h-5 w-5" /></span>
                        <div>
                          <p className="font-black">{doc.name}</p>
                          <p className="mt-1 text-xs text-ink/40">{doc.type === "official-page" ? "官方原文页面" : doc.type === "pdf" ? "官方PDF附件" : "Nugget解析摘要"} · 核验 {doc.checkedAt}</p>
                        </div>
                      </div>
                      <a href={doc.url} target="_blank" rel="noreferrer" download={doc.downloadable || undefined} className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/10 px-4 py-2.5 text-xs font-black hover:bg-gold-soft">
                        {doc.downloadable ? <Download className="h-4 w-4" /> : <Link2 className="h-4 w-4" />} {doc.downloadable ? "下载文件" : "打开原文"}
                      </a>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="rounded-3xl border border-dashed border-ink/20 bg-paper p-5 text-center">
                    <Upload className="mx-auto h-7 w-7 text-ink/35" />
                    <p className="mt-3 text-sm font-black">补充上传细则</p>
                    <p className="mt-1 text-xs leading-5 text-ink/45">支持PDF、DOCX、图片和网页链接。当前演示保留入口，后端上传稍后接入。</p>
                    <button type="button" disabled className="mt-4 rounded-full border border-ink/10 px-4 py-2 text-xs font-black opacity-40">选择文件</button>
                  </div>
                  <button type="button" onClick={parseDocuments} disabled={parsing || parsed} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-black text-white disabled:opacity-50">
                    {parsing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : parsed ? <CheckCircle2 className="h-4 w-4 text-gold" /> : <ScanSearch className="h-4 w-4" />}
                    {parsing ? "正在读取并交叉核对..." : parsed ? "文件已解析" : "读取全部文件并分析"}
                  </button>
                </div>
              </div>
            </WorkflowSection>
          )}

          {active === "eligibility" && (
            <WorkflowSection eyebrow="02 · ELIGIBILITY GATE" title="你到底能不能参加？" description="这是硬门槛。系统必须引用官方规则给出结论，而不是根据比赛标题猜测。">
              {!parsed ? (
                <LockedMessage text="请先在文件中心读取竞赛细则。" onClick={() => setActive("documents")} />
              ) : (
                <>
                  <div className={`rounded-3xl border p-6 shadow-card ${eligible ? "border-[#9bb58d] bg-[#e4ecdc]" : "border-[#d49a7f] bg-[#f9e0d7]"}`}>
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[.15em] opacity-50">Eligibility verdict</p>
                        <h3 className="display mt-2 text-4xl font-semibold">{rules?.verdict ?? (eligible ? "当前身份可参加" : "当前身份可能不符合")}</h3>
                        <p className="mt-4 max-w-3xl text-sm leading-7 opacity-75">{rules?.verdictDetail ?? competition.eligibility.join("；")}</p>
                      </div>
                      {eligible ? <BadgeCheck className="h-12 w-12 shrink-0 text-[#587247]" /> : <AlertTriangle className="h-12 w-12 shrink-0 text-[#a84f32]" />}
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {competition.eligibility.map((item) => <div key={item} className="flex gap-3 rounded-2xl border border-ink/10 bg-paper p-4"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#628150]" /><span className="text-sm font-bold">{item}</span></div>)}
                  </div>
                  <div className="mt-5 flex justify-end">
                    <button type="button" disabled={!eligible} onClick={() => { setEligibilityConfirmed(true); setActive("deliverables"); }} className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-30">
                      确认资格并继续 <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </WorkflowSection>
          )}

          {active === "deliverables" && (
            <WorkflowSection eyebrow="03 · DELIVERABLE MATRIX" title="必须提交什么？" description="将所有成果、格式、材料和限制转成可勾选矩阵。后续生成步骤只能围绕这张矩阵工作。">
              {!eligibilityConfirmed ? (
                <LockedMessage text="资格尚未确认，提交成果矩阵暂时锁定。" onClick={() => setActive("eligibility")} />
              ) : (
                <>
                  <div className="overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-card">
                    {(rules?.deliverables ?? competition.eligibility).map((item, index) => (
                      <div key={item} className={`flex items-start gap-4 p-5 ${index ? "border-t border-ink/10" : ""}`}>
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold text-xs font-black">{index + 1}</span>
                        <p className="text-sm font-bold leading-6">{item}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-3xl border border-ink/10 bg-ink p-6 text-white">
                    <p className="text-xs font-black uppercase tracking-[.15em] text-gold">AI 与原创规则</p>
                    <p className="mt-3 text-sm leading-7 text-white/65">{rules?.aiRule ?? "未从当前公开信息中提取到明确AI规则。进入生成前必须继续向主办方核验。"}</p>
                  </div>
                  <div className="mt-5 flex justify-end">
                    <button type="button" onClick={() => { setDeliverablesConfirmed(true); setActive("concept"); }} className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-black text-ink">
                      我已审阅提交成果 <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </WorkflowSection>
          )}

          {active === "concept" && <FutureStage title="方案生成" description="资格与成果要求已锁定。下一步将在此生成多个可比较的方案方向、评审策略和风险说明。当前先跑通流程，不生成具体参赛方案。" icon={Sparkles} />}
          {active === "assets" && <FutureStage title="图像与图纸" description="后续接入生图、参考图、草图迭代和资产一致性管理。所有视觉必须对应已批准的方案与成果矩阵。" icon={ImageIcon} />}
          {active === "layout" && <FutureStage title="排版与文字" description="后续根据官方尺寸、页数、字数和匿名要求自动编排展板与说明文字。" icon={LayoutTemplate} />}
          {active === "review" && <FutureStage title="审阅与提交包" description="后续执行逐条合规检查、人工批准、文件命名和最终压缩包生成；不会绕过你的签署自动上传。" icon={FileArchive} />}
        </main>
      </div>
    </div>
  );
}

function WorkflowSection({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return <section><p className="text-[10px] font-black uppercase tracking-[.18em] text-[#9a6900]">{eyebrow}</p><h2 className="display mt-3 text-4xl font-semibold sm:text-5xl">{title}</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-ink/55">{description}</p><div className="mt-7">{children}</div></section>;
}

function LockedMessage({ text, onClick }: { text: string; onClick: () => void }) {
  return <div className="rounded-3xl border border-dashed border-ink/20 bg-paper p-10 text-center"><Lock className="mx-auto h-8 w-8 text-ink/25" /><p className="mt-4 font-black">{text}</p><button type="button" onClick={onClick} className="mt-4 text-sm font-black text-[#8b6208]">返回上一步</button></div>;
}

function FutureStage({ title, description, icon: Icon }: { title: string; description: string; icon: typeof Sparkles }) {
  return <WorkflowSection eyebrow="NEXT · READY TO CONNECT" title={title} description={description}><div className="rounded-3xl border border-dashed border-ink/20 bg-paper p-12 text-center shadow-card"><span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gold-soft"><Icon className="h-7 w-7" /></span><h3 className="display mt-5 text-3xl font-semibold">流程节点已解锁</h3><p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-ink/55">现在系统已经知道你有资格参加，也知道必须交什么。具体生成能力会在这个稳定入口上逐步接入。</p></div></WorkflowSection>;
}
