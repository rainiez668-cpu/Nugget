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
  Circle,
  Download,
  Eye,
  FileArchive,
  FileCheck2,
  FileText,
  ImageIcon,
  LayoutTemplate,
  Lock,
  MessageSquareText,
  PackageCheck,
  PanelTop,
  Pencil,
  ScanSearch,
  Sparkles,
} from "lucide-react";
import { getCompetition } from "@/lib/competitions";
import type { CompetitionListing } from "@/lib/types";

const steps = [
  { id: "requirements", label: "要求矩阵", icon: ScanSearch },
  { id: "concept", label: "方案方向", icon: Sparkles },
  { id: "visuals", label: "图纸与视觉", icon: ImageIcon },
  { id: "board", label: "展板排版", icon: LayoutTemplate },
  { id: "review", label: "合规审阅", icon: FileCheck2 },
  { id: "package", label: "提交包", icon: PackageCheck },
];

const requirements = [
  { item: "竞赛资格", rule: "国际团队；按官网完成专业资格注册", status: "确认后通过", owner: "参赛者" },
  { item: "匿名要求", rule: "所有评审材料不得出现姓名、机构或品牌标识", status: "已满足", owner: "Nugget" },
  { item: "场地回应", rule: "回应浦项城市历史、海岸环境与公共文化功能", status: "已满足", owner: "方案" },
  { item: "提交图纸", rule: "总平面、平面、剖面、立面、轴测及核心效果图", status: "已规划", owner: "Nugget" },
  { item: "截止时间", rule: "2026-09-07；建议提前72小时完成最终上传", status: "85天", owner: "时间" },
  { item: "AI使用规则", rule: "提交前必须复核官方规则；如要求披露则如实说明", status: "待核验", owner: "参赛者" },
];

const drawings = [
  { code: "D01", name: "总平面与滨海联系", scale: "1:1000", status: "视觉草图已生成" },
  { code: "D02", name: "首层公共层平面", scale: "1:400", status: "构图已规划" },
  { code: "D03", name: "档案大厅纵剖面", scale: "1:250", status: "构图已规划" },
  { code: "D04", name: "体量与时间地层轴测", scale: "NTS", status: "视觉草图已生成" },
  { code: "V01", name: "主入口与城市客厅", scale: "Hero", status: "已生成" },
  { code: "V02", name: "中央档案大厅", scale: "Interior", status: "已生成" },
];

const reviewItems = [
  { label: "文件数量与页面尺寸", detail: "A1横版两张，300dpi输出配置", passed: true },
  { label: "匿名与隐私", detail: "展板未出现作者姓名或学校信息", passed: true },
  { label: "概念一致性", detail: "文字、总图、空间和效果图均使用“Tidal Archive”逻辑", passed: true },
  { label: "图像一致性", detail: "三张视觉保持石材、深色金属、木材与滨海光线语言", passed: true },
  { label: "专业资格证明", detail: "需要你上传官方要求的注册或团队证明", passed: false },
  { label: "AI披露与版权", detail: "需要你确认比赛规则并决定披露方式", passed: false },
  { label: "技术可行性复核", detail: "需由参赛团队确认结构、消防、无障碍和面积数据", passed: false },
];

export function ProductionWorkspace() {
  const [competition, setCompetition] = useState<CompetitionListing | undefined>(
    getCompetition("pohang-museum-2026"),
  );
  const [activeStep, setActiveStep] = useState("concept");
  const [approved, setApproved] = useState<string[]>(["requirements"]);
  const [packageBuilt, setPackageBuilt] = useState(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("competition");
    if (id) setCompetition(getCompetition(id) ?? getCompetition("pohang-museum-2026"));
  }, []);

  const progress = useMemo(() => Math.round(((approved.length + (packageBuilt ? 1 : 0)) / 6) * 100), [approved, packageBuilt]);

  if (!competition) return null;

  function approve(step: string) {
    setApproved((current) => current.includes(step) ? current : [...current, step]);
  }

  return (
    <div className="min-h-screen bg-[#f3eee3]">
      <div className="border-b border-ink/10 bg-paper px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <a href="/discover" className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-cream hover:bg-gold-soft" aria-label="返回比赛雷达">
              <ArrowLeft className="h-4 w-4" />
            </a>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-black">PRODUCTION STUDIO</span>
                <span className="rounded-full bg-[#dce8d2] px-2.5 py-1 text-[10px] font-bold text-[#405b35]">自动保存</span>
              </div>
              <h1 className="mt-2 font-black">{competition.translatedTitle}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden min-w-48 sm:block">
              <div className="flex justify-between text-[10px] font-bold text-ink/45"><span>提交包完成度</span><span>{progress}%</span></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/10"><div className="h-full rounded-full bg-gold transition-all" style={{ width: `${progress}%` }} /></div>
            </div>
            <button type="button" onClick={() => setActiveStep("review")} className="rounded-full border border-ink/10 bg-white px-4 py-2.5 text-xs font-black hover:bg-cream">
              预览审阅
            </button>
            <button type="button" onClick={() => { setPackageBuilt(true); setActiveStep("package"); }} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-black text-white shadow-[0_4px_0_#d99f1d]">
              <FileArchive className="h-4 w-4" /> 生成提交包
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1500px] xl:grid-cols-[235px_1fr]">
        <aside className="border-r border-ink/10 bg-paper p-4 xl:min-h-[calc(100vh-86px)]">
          <p className="px-3 pt-2 text-[10px] font-black uppercase tracking-[0.16em] text-ink/35">Competition workflow</p>
          <nav className="mt-4 grid gap-1 sm:grid-cols-3 xl:grid-cols-1">
            {steps.map((step, index) => {
              const done = approved.includes(step.id) || (step.id === "package" && packageBuilt);
              return (
                <button key={step.id} type="button" onClick={() => setActiveStep(step.id)} className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${activeStep === step.id ? "bg-ink text-white" : "hover:bg-cream"}`}>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${activeStep === step.id ? "bg-gold text-ink" : "bg-cream"}`}>
                    {done ? <Check className="h-4 w-4" /> : <step.icon className="h-4 w-4" />}
                  </span>
                  <span>
                    <span className={`block text-[9px] font-black uppercase tracking-[0.14em] ${activeStep === step.id ? "text-white/35" : "text-ink/30"}`}>0{index + 1}</span>
                    <span className="text-xs font-black">{step.label}</span>
                  </span>
                </button>
              );
            })}
          </nav>
          <div className="mt-6 rounded-2xl border border-ink/10 bg-[#fff4d3] p-4">
            <div className="flex items-center gap-2 text-xs font-black"><Lock className="h-4 w-4" /> 你是最终设计负责人</div>
            <p className="mt-2 text-[11px] leading-5 text-ink/55">Nugget生成草案与检查报告。资格、真实性、技术可行性和最终提交必须由你批准。</p>
          </div>
        </aside>

        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          {activeStep === "requirements" && (
            <WorkspaceSection eyebrow="01 · BRIEF INTELLIGENCE" title="竞赛要求矩阵" description="把长篇竞赛文件转换成逐条可追踪的约束。每一项都必须有证据或负责人。">
              <div className="overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-card">
                {requirements.map((requirement, index) => (
                  <div key={requirement.item} className={`grid gap-3 p-5 md:grid-cols-[150px_1fr_110px_90px] md:items-center ${index ? "border-t border-ink/10" : ""}`}>
                    <p className="font-black">{requirement.item}</p>
                    <p className="text-sm leading-6 text-ink/60">{requirement.rule}</p>
                    <span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-black ${requirement.status === "待核验" ? "bg-[#f9e0d7] text-[#8a3f29]" : "bg-[#dce8d2] text-[#405b35]"}`}>{requirement.status}</span>
                    <p className="text-xs font-bold text-ink/40">{requirement.owner}</p>
                  </div>
                ))}
              </div>
              <ApprovalBar approved={approved.includes("requirements")} onApprove={() => approve("requirements")} label="确认要求矩阵" />
            </WorkspaceSection>
          )}

          {activeStep === "concept" && (
            <WorkspaceSection eyebrow="02 · CONCEPT DIRECTION" title="Tidal Archive · 潮汐档案" description="把城市记忆理解为不断沉积、暴露和重写的地层，而不是被封存在展柜里的静态历史。">
              <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
                <div className="overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-card">
                  <div className="relative aspect-[16/9]">
                    <Image src="/competition-demo/tidal-archive-hero.png" alt="Tidal Archive museum entrance concept" fill priority className="object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-6 pt-20 text-white">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-gold">Hero view · V01</p>
                      <p className="display mt-1 text-3xl font-semibold">A civic archive shaped by coast, industry, and everyday memory.</p>
                    </div>
                  </div>
                  <div className="grid gap-4 p-6 sm:grid-cols-3">
                    {[
                      ["Public ground", "首层作为穿越式城市客厅，让博物馆在闭馆后仍保持公共性。"],
                      ["Memory strata", "三个错动体量对应海洋、工业与日常生活三组城市档案。"],
                      ["Coastal roof", "连续屋顶步道连接城市与海岸，成为新的公共观察平台。"],
                    ].map(([title, copy]) => (
                      <div key={title}>
                        <p className="text-xs font-black uppercase tracking-[0.12em]">{title}</p>
                        <p className="mt-2 text-xs leading-5 text-ink/55">{copy}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-3xl bg-ink p-6 text-white shadow-card">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-gold">Jury strategy</p>
                    <h3 className="display mt-3 text-3xl font-semibold">清晰、在地、可建造。</h3>
                    <p className="mt-4 text-sm leading-7 text-white/60">方案不依赖夸张造型，而用公共路径、档案序列和材料地层建立辨识度。评委能在十秒内理解核心概念，也能继续看到空间和运营逻辑。</p>
                  </div>
                  <div className="rounded-3xl border border-ink/10 bg-paper p-5 shadow-card">
                    <p className="text-xs font-black">材料语言</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["本地浅灰石材", "深色耐候金属", "温暖木饰面", "半透明展陈织物", "滨海草本"].map((item) => <span key={item} className="rounded-full bg-gold-soft px-3 py-2 text-[10px] font-bold">{item}</span>)}
                    </div>
                  </div>
                  <button type="button" className="flex w-full items-center justify-between rounded-2xl border border-ink/10 bg-paper p-4 text-left shadow-card hover:bg-gold-soft/30">
                    <span className="flex items-center gap-3"><MessageSquareText className="h-5 w-5" /><span><b className="block text-sm">留下设计批注</b><span className="text-xs text-ink/45">例如：入口需要更克制</span></span></span>
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <ApprovalBar approved={approved.includes("concept")} onApprove={() => approve("concept")} label="批准当前方案方向" />
            </WorkspaceSection>
          )}

          {activeStep === "visuals" && (
            <WorkspaceSection eyebrow="03 · VISUAL PRODUCTION" title="图纸与竞赛视觉" description="视觉先建立统一方案语言，再进入人工筛选与针对性重绘。生成图不是技术图纸，尺寸和结构仍需参赛团队复核。">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["/competition-demo/tidal-archive-aerial.png", "V03 · 场地鸟瞰", "公共屋顶、雨水花园与滨海联系"],
                  ["/competition-demo/tidal-archive-interior.png", "V02 · 档案大厅", "展览序列、自然光与城市记忆装置"],
                ].map(([src, title, caption]) => (
                  <div key={src} className="overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-card">
                    <div className="relative aspect-[16/10]"><Image src={src} alt={title} fill className="object-cover" /></div>
                    <div className="flex items-center justify-between p-4">
                      <div><p className="text-sm font-black">{title}</p><p className="mt-1 text-xs text-ink/45">{caption}</p></div>
                      <span className="rounded-full bg-[#dce8d2] px-2.5 py-1 text-[10px] font-black text-[#405b35]">已生成</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-card">
                <div className="grid grid-cols-[70px_1fr_80px_130px] gap-3 border-b border-ink/10 bg-cream p-4 text-[10px] font-black uppercase tracking-[0.12em] text-ink/40">
                  <span>编号</span><span>图纸</span><span>比例</span><span>状态</span>
                </div>
                {drawings.map((drawing) => (
                  <div key={drawing.code} className="grid grid-cols-[70px_1fr_80px_130px] gap-3 border-b border-ink/10 p-4 text-xs last:border-0">
                    <b>{drawing.code}</b><span>{drawing.name}</span><span className="text-ink/45">{drawing.scale}</span><span className="font-bold text-[#587247]">{drawing.status}</span>
                  </div>
                ))}
              </div>
              <ApprovalBar approved={approved.includes("visuals")} onApprove={() => approve("visuals")} label="批准视觉方向与图纸清单" />
            </WorkspaceSection>
          )}

          {activeStep === "board" && (
            <WorkspaceSection eyebrow="04 · BOARD COMPOSER" title="A1竞赛展板预览" description="自动使用统一网格、阅读顺序和文字层级。你可以在最终导出前替换任何图片、标题或图纸。">
              <div className="rounded-3xl border border-ink/10 bg-[#d7d0c3] p-4 shadow-card sm:p-8">
                <div className="mx-auto aspect-[1.414/1] max-w-6xl overflow-hidden bg-[#f7f2e8] shadow-2xl">
                  <div className="grid h-full grid-cols-12 grid-rows-8 gap-[3px] bg-[#d4cdbf] p-[3px]">
                    <div className="relative col-span-8 row-span-5 overflow-hidden bg-black"><Image src="/competition-demo/tidal-archive-hero.png" alt="Board hero" fill className="object-cover" /></div>
                    <div className="col-span-4 row-span-3 bg-[#1d1b17] p-[5%] text-white">
                      <p className="text-[5px] font-black uppercase tracking-[.18em] text-gold sm:text-[8px]">Pohang Museum · 2026</p>
                      <h3 className="display mt-[7%] text-[18px] font-semibold leading-none sm:text-[34px]">Tidal<br />Archive</h3>
                      <p className="mt-[7%] text-[5px] leading-relaxed text-white/55 sm:text-[8px]">A civic archive shaped by coast, industry, and everyday memory.</p>
                    </div>
                    <div className="col-span-4 row-span-2 bg-[#f3be3b] p-[5%]">
                      <p className="text-[5px] font-black uppercase tracking-[.16em] sm:text-[8px]">Concept</p>
                      <p className="mt-[5%] text-[5px] leading-relaxed sm:text-[8px]">Memory is not stored as a single chronology. It gathers like coastal strata: deposited, exposed, and rewritten by each generation.</p>
                    </div>
                    <div className="relative col-span-5 row-span-3 overflow-hidden"><Image src="/competition-demo/tidal-archive-aerial.png" alt="Board aerial" fill className="object-cover" /></div>
                    <div className="relative col-span-4 row-span-3 overflow-hidden"><Image src="/competition-demo/tidal-archive-interior.png" alt="Board interior" fill className="object-cover" /></div>
                    <div className="col-span-3 row-span-3 bg-[#faf7ef] p-[6%]">
                      <p className="text-[5px] font-black uppercase tracking-[.16em] sm:text-[8px]">Spatial sequence</p>
                      <div className="mt-[7%] space-y-[5%]">
                        {["City room", "Archive hall", "Coastal roof", "Memory garden"].map((item, index) => <p key={item} className="border-b border-black/15 pb-[4%] text-[5px] font-bold sm:text-[8px]">0{index + 1} · {item}</p>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["12栏网格", "A1横版", "匿名版", "图片300dpi目标", "标题中英双语", "PDF压缩预设"].map((item) => <span key={item} className="rounded-full border border-ink/10 bg-paper px-3 py-2 text-xs font-bold">{item}</span>)}
              </div>
              <ApprovalBar approved={approved.includes("board")} onApprove={() => approve("board")} label="批准展板版式" />
            </WorkspaceSection>
          )}

          {activeStep === "review" && (
            <WorkspaceSection eyebrow="05 · HUMAN REVIEW GATE" title="最终合规与设计审阅" description="Nugget会找问题，但不会假装替你承担专业责任。所有红色项目解决后才允许标记为可提交。">
              <div className="grid gap-4 lg:grid-cols-[1fr_330px]">
                <div className="overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-card">
                  {reviewItems.map((item, index) => (
                    <div key={item.label} className={`flex gap-4 p-5 ${index ? "border-t border-ink/10" : ""}`}>
                      {item.passed ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#628150]" /> : <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#bd663f]" />}
                      <div><p className="font-black">{item.label}</p><p className="mt-1 text-sm leading-6 text-ink/55">{item.detail}</p></div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="rounded-3xl bg-ink p-6 text-white shadow-card">
                    <p className="text-[10px] font-black uppercase tracking-[.16em] text-gold">Review score</p>
                    <p className="display mt-3 text-6xl font-semibold">74<span className="text-2xl text-white/30">/100</span></p>
                    <p className="mt-3 text-sm leading-6 text-white/55">视觉与叙事已达到审阅状态。资格、AI规则和技术可行性仍需你或专业团队确认。</p>
                  </div>
                  <div className="rounded-3xl border border-[#d49a7f] bg-[#f9e0d7] p-5">
                    <p className="flex items-center gap-2 font-black text-[#7d3825]"><AlertTriangle className="h-4 w-4" /> 当前不可自动提交</p>
                    <p className="mt-2 text-xs leading-5 text-[#7d3825]/75">还有3项人工确认未完成。系统不会绕过竞赛规则或代替你的最终签署。</p>
                  </div>
                </div>
              </div>
              <ApprovalBar approved={approved.includes("review")} onApprove={() => approve("review")} label="我已审阅并确认未决事项" />
            </WorkspaceSection>
          )}

          {activeStep === "package" && (
            <WorkspaceSection eyebrow="06 · DELIVERY" title="提交包" description="把已批准内容整理成清晰的文件结构。当前为演示包，正式提交前仍需替换和核验技术文件。">
              <div className="grid gap-4 lg:grid-cols-3">
                {[
                  { icon: PanelTop, name: "01_Tidal_Archive_Boards.pdf", detail: "2 × A1 landscape · 38.4 MB", ready: packageBuilt },
                  { icon: ImageIcon, name: "02_Render_Set.zip", detail: "6 JPG · 300 dpi target", ready: packageBuilt },
                  { icon: FileText, name: "03_Concept_Statement.txt", detail: "English · 286 words", ready: packageBuilt },
                ].map((file) => (
                  <div key={file.name} className="rounded-3xl border border-ink/10 bg-paper p-5 shadow-card">
                    <div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-soft"><file.icon className="h-5 w-5" /></span>{file.ready ? <BadgeCheck className="h-5 w-5 text-[#628150]" /> : <Circle className="h-5 w-5 text-ink/20" />}</div>
                    <p className="mt-5 break-all text-sm font-black">{file.name}</p>
                    <p className="mt-2 text-xs text-ink/45">{file.detail}</p>
                    <button type="button" disabled={!file.ready} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/10 px-4 py-2.5 text-xs font-black disabled:opacity-30"><Download className="h-4 w-4" /> 下载预览</button>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-3xl border border-ink/10 bg-paper p-6 shadow-card">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[.15em] text-ink/35">Submission status</p>
                    <h3 className="display mt-2 text-3xl font-semibold">{packageBuilt ? "预览包已生成，等待你的最终批准。" : "还没有生成提交包。"}</h3>
                    <p className="mt-2 text-sm text-ink/55">正式上传按钮只会在全部人工确认完成，并且目标网站允许辅助提交时启用。</p>
                  </div>
                  <button type="button" disabled className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-black text-white opacity-35"><Lock className="h-4 w-4" /> 提交到竞赛网站</button>
                </div>
              </div>
            </WorkspaceSection>
          )}
        </main>
      </div>
    </div>
  );
}

function WorkspaceSection({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#9a6900]">{eyebrow}</p>
      <h2 className="display mt-3 text-4xl font-semibold sm:text-5xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-ink/55">{description}</p>
      <div className="mt-7">{children}</div>
    </section>
  );
}

function ApprovalBar({ approved, onApprove, label }: { approved: boolean; onApprove: () => void; label: string }) {
  return (
    <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-ink/10 bg-paper p-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="px-2 text-xs font-bold text-ink/45">{approved ? "这一阶段已经由你批准，可继续下一步。" : "请先审阅内容；批准后仍可回来修改。"}</p>
      <button type="button" onClick={onApprove} className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-black ${approved ? "bg-[#dce8d2] text-[#405b35]" : "bg-gold text-ink"}`}>
        {approved ? <Check className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {approved ? "已批准" : label} <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
