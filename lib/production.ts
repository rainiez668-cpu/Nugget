import type { CompetitionListing } from "@/lib/types";
import type { CompetitionRuleSet } from "@/lib/competition-rules";

export type ProductionConcept = {
  title: string;
  tagline: string;
  strategy: string;
  palette: string[];
  statement: string;
  prompts: string[];
};

export type BoardLayoutId =
  | "spatial-atlas"
  | "object-system"
  | "editorial-impact"
  | "narrative-strip";

export type BoardLayout = {
  id: BoardLayoutId;
  name: string;
  rationale: string;
  signature: string;
};

export type AssetPlan = {
  min: number;
  max: number;
  recommended: number;
  confidence: "exact" | "range" | "unknown";
  evidence: string;
  roles: string[];
};

function visualRoles(categories: string[]) {
  const value = categories.join(" ");
  if (/建筑|景观|城市|室内|展陈|遗产/.test(value)) {
    return ["总体主视图", "场地与环境", "平面与流线", "剖面与空间", "构造与材料", "使用场景", "可持续策略", "补充图纸"];
  }
  if (/产品|工业|家具|珠宝|交通|照明/.test(value)) {
    return ["完整对象主视图", "使用场景", "形态变化", "爆炸与装配", "材料与构造", "人体尺度", "制造过程", "补充细节"];
  }
  if (/平面|品牌|包装|时尚|纺织/.test(value)) {
    return ["核心主视觉", "系列变化", "应用场景", "版式系统", "材料与工艺", "细节特写", "传播触点", "补充视觉"];
  }
  return ["核心主视觉", "问题场景", "方案过程", "使用体验", "关键细节", "结果验证", "系统说明", "补充视觉"];
}

export function buildAssetPlan(
  competition: CompetitionListing,
  deliverables: string[],
): AssetPlan {
  const evidence =
    deliverables.find((item) => /张|幅|页|板|image|visual|render/i.test(item)) ?? "";
  const range = evidence.match(/(?:至少|最少)\s*(\d+)\s*张.*?(?:最多|不超过)\s*(\d+)\s*张/);
  const exact = evidence.match(/(?:提交|需要|共|须有|包含)?\s*(\d+)\s*张/);
  let min = 1;
  let max = 8;
  let recommended = 3;
  let confidence: AssetPlan["confidence"] = "unknown";

  if (range) {
    min = Number(range[1]);
    max = Number(range[2]);
    recommended = min;
    confidence = "range";
  } else if (exact) {
    min = Number(exact[1]);
    max = min;
    recommended = min;
    confidence = "exact";
  }

  const safeMin = Math.max(1, Math.min(min, 8));
  const safeMax = Math.max(safeMin, Math.min(max, 8));
  const roles = visualRoles(competition.categories).slice(0, safeMax);

  return {
    min: safeMin,
    max: safeMax,
    recommended: Math.max(safeMin, Math.min(recommended, safeMax)),
    confidence,
    evidence: evidence || "官方成果描述未提供可可靠解析的图片数量。",
    roles,
  };
}

export function buildAssetPrompts(
  competition: CompetitionListing,
  concept: ProductionConcept,
  plan: AssetPlan,
  count: number,
) {
  return Array.from({ length: count }, (_, index) => {
    const role = plan.roles[index] ?? `补充视觉 ${index + 1}`;
    const base = concept.prompts[index % concept.prompts.length];
    return `${base}\nRequired deliverable role: ${role}. Image ${index + 1} of ${count} for ${competition.title}. Keep the same proposal, materials, proportions, and visual identity across the complete set.`;
  });
}

const boardLayouts: Record<BoardLayoutId, BoardLayout> = {
  "spatial-atlas": {
    id: "spatial-atlas",
    name: "空间图集",
    rationale: "用一张主场景建立空间判断，再以图纸式横带和索引组织证据。",
    signature: "主图 + 图集索引",
  },
  "object-system": {
    id: "object-system",
    name: "对象系统",
    rationale: "把完整对象置于视觉中心，两侧拆分变化、材料和构造逻辑。",
    signature: "中心对象 + 构造证据",
  },
  "editorial-impact": {
    id: "editorial-impact",
    name: "编辑冲击",
    rationale: "让主视觉和标题形成一次强烈识别，辅助图像作为节奏切片。",
    signature: "满版视觉 + 巨型标题",
  },
  "narrative-strip": {
    id: "narrative-strip",
    name: "叙事序列",
    rationale: "用连续三幕解释问题、转变与结果，适合过程和体验型提案。",
    signature: "三幕序列 + 时间轴",
  },
};

export function buildBoardLayouts(
  competition: CompetitionListing,
  conceptIndex: number,
): BoardLayout[] {
  const categories = competition.categories.join(" ");
  let preferred: BoardLayoutId[];

  if (/建筑|景观|城市|室内|展陈|遗产/.test(categories)) {
    preferred = ["spatial-atlas", "narrative-strip", "editorial-impact"];
  } else if (/产品|工业|家具|珠宝|交通|照明/.test(categories)) {
    preferred = ["object-system", "editorial-impact", "narrative-strip"];
  } else if (/平面|品牌|包装|时尚|纺织/.test(categories)) {
    preferred = ["editorial-impact", "object-system", "narrative-strip"];
  } else {
    preferred = ["narrative-strip", "editorial-impact", "spatial-atlas"];
  }

  const rotation = conceptIndex % preferred.length;
  return [...preferred.slice(rotation), ...preferred.slice(0, rotation)].map(
    (id) => boardLayouts[id],
  );
}

export function buildConcepts(competition: CompetitionListing): ProductionConcept[] {
  const domain = competition.categories[0] ?? "设计";
  return [
    {
      title: "Second Life",
      tagline: `把${domain}从一次性成果变成可持续演化的系统。`,
      strategy: `以“拆解、重组、延长寿命”为核心，将竞赛要求转译为清晰的使用场景和可验证的材料策略。`,
      palette: ["深酒红", "自然棕", "亚麻白", "哑光黄铜"],
      statement: `Second Life 不把可持续性当作附加说明，而是让它成为设计的使用方式。方案通过可拆卸部件、清晰连接和可维修构造，使作品能够适应不同场景并延长生命周期。视觉语言保持克制，让材料、结构与人的动作成为表达主体。每一项变化都对应竞赛成果矩阵中的可制造性、原创性和清晰沟通要求，避免只停留在概念图层面。`,
      prompts: [
        `Competition hero visualization for ${competition.title}, concept Second Life, premium editorial presentation, complete proposal clearly visible, refined material detail, plausible construction`,
        `Transformation sequence for ${competition.title}, three configurations shown consistently, clear assembly logic, competition portfolio quality`,
        `Macro construction detail for ${competition.title}, repairable joint, material palette and craftsmanship, photoreal editorial lighting`,
      ],
    },
    {
      title: "Open Framework",
      tagline: "用最少的固定形式，容纳最多的使用变化。",
      strategy: "建立一个稳定的基础框架，通过轻量模块回应不同用户、环境和时间条件。",
      palette: ["炭黑", "沙岩灰", "雾蓝", "暖木色"],
      statement: "Open Framework 将设计理解为一个允许参与者持续调整的基础设施。它不追求单一姿态，而通过明确的主结构和可替换模块，平衡识别度、适应性与实施难度。",
      prompts: [
        `Hero visualization for ${competition.title}, concept Open Framework, adaptable modular system, calm contemporary design, competition quality`,
        `Exploded configuration study for ${competition.title}, modular components and user scenarios, realistic materials`,
        `Context visualization for ${competition.title}, human use and environmental response, coherent design language`,
      ],
    },
    {
      title: "Quiet Signal",
      tagline: "不依赖夸张造型，用精准细节建立记忆点。",
      strategy: "以一个可辨识的连接、界面或空间动作作为核心，其余部分保持安静和高完成度。",
      palette: ["墨绿", "骨白", "石墨", "低饱和金色"],
      statement: "Quiet Signal 把设计资源集中在一个最关键的动作上。通过统一比例、克制色彩和细节精度，让评委先看到清晰主张，再发现完整逻辑。",
      prompts: [
        `Competition hero for ${competition.title}, concept Quiet Signal, restrained iconic gesture, sophisticated editorial visualization`,
        `Detail study for ${competition.title}, precision craftsmanship and coherent material junction`,
        `Full presentation context for ${competition.title}, elegant human-scale use, believable implementation`,
      ],
    },
  ];
}

export function effectiveDeliverables(
  competition: CompetitionListing,
  rules?: CompetitionRuleSet,
) {
  if (rules?.deliverables.length) return rules.deliverables;
  return [
    "3–5张核心视觉或图纸，覆盖整体、使用场景和关键细节",
    "至少一张完整正面或总体视图",
    "一份符合官方字数限制的设计说明",
    "按官方格式导出JPG或PDF并控制文件大小",
    "保留原创过程、参考来源和AI使用记录",
  ];
}

export function packageMarkdown(
  competition: CompetitionListing,
  concept: ProductionConcept,
  deliverables: string[],
  assetCount?: number,
  assetRoles: string[] = [],
) {
  return `# ${competition.translatedTitle}

## Selected concept
${concept.title} — ${concept.tagline}

## Strategy
${concept.strategy}

## Concept statement
${concept.statement}

## Required deliverables
${deliverables.map((item) => `- [x] ${item}`).join("\n")}

## Generated visual assets
${assetCount ? assetRoles.slice(0, assetCount).map((role, index) => `- [x] V${String(index + 1).padStart(2, "0")} — ${role}`).join("\n") : "- Confirm visual quantity against the official rules"}

## Submission details
- Deadline: ${competition.deadline}
- Entry fee: ${competition.entryFee === 0 ? "Free" : "See official rules"}
- Eligibility: ${competition.eligibility.join("; ")}
- Official source: ${competition.sources[0]?.url ?? "Not available"}

Generated by Nugget. Final authorship, eligibility, technical accuracy, and rule compliance must be confirmed by the entrant.
`;
}
