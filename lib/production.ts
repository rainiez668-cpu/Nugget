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
  const text = `${competition.title} ${competition.translatedTitle} ${competition.brief} ${competition.categories.join(" ")}`.toLowerCase();
  const primary = (competition.categories[0] ?? "").toLowerCase();
  const domain = competition.categories[0] ?? "设计";
  const profiles = /平面|品牌|包装|摄影|影像/.test(primary) || /poster|graphic|illustration|海报|插画|dignity/.test(text)
    ? [
        ["Human Measure", "用一个可被立即理解的人类尺度符号回应比赛主题。", "将抽象议题压缩为单一主视觉、清晰对比和可跨语言传播的视觉动作。", ["Signal red", "Warm white", "Charcoal", "Cobalt"]],
        ["Shared Ground", "让不同身份在同一视觉结构中获得平等位置。", "通过重复、差异与留白建立包容性叙事，避免口号式表达。", ["Ultramarine", "Clay", "Paper", "Black"]],
        ["Quiet Evidence", "用克制的事实感代替煽情，让主题自己产生重量。", "采用档案、标记与缺席空间构成视觉证据链。", ["Graphite", "Fog", "Safety orange", "White"]],
      ]
    : /建筑|景观|城市|室内|展陈|遗产/.test(primary) || /microhome|pavilion|museum|architecture|遗址/.test(text)
      ? [
          ["Living Threshold", "把边界变成可使用的空间，而不是一条分隔线。", "以场地、气候和人的移动生成清晰空间序列，并让平面与剖面共享同一组织逻辑。", ["Limestone", "Earth", "Shadow", "Oxide"]],
          ["Climate Spine", "用一条环境基础设施组织采光、通风、结构和公共生活。", "以主脊串联功能和流线，通过可验证的被动策略塑造建筑形态。", ["Sand", "Patina green", "Sky", "Charcoal"]],
          ["Open Ruin", "让新介入保持可逆，使既有场所继续讲述自己的时间。", "采用轻触地面的构造、可拆模块与连续公共路径回应场地记忆。", ["Stone", "Bronze", "Dust", "Deep blue"]],
        ]
      : /产品|工业|家具|时尚|纺织|珠宝|交通|照明/.test(primary) || /product|furniture|fashion|leather/.test(text)
        ? [
            ["Adaptive Object", "一个对象通过清晰连接适应多种使用状态。", "以可替换部件、真实材料和可制造连接实现变化，而不是依赖概念造型。", ["Oxblood", "Natural tan", "Canvas", "Brass"]],
            ["Material Loop", "让材料寿命、维修和再使用成为产品体验的一部分。", "从材料属性和加工工艺出发，减少永久粘合并展示装配逻辑。", ["Chestnut", "Bone", "Graphite", "Steel"]],
            ["Essential Gesture", "集中设计资源解决一个最关键的人机动作。", "用克制形态、人体尺度和精确细节建立识别度与可行性。", ["Deep green", "Cream", "Black", "Bronze"]],
          ]
        : [
            ["Visible Change", "把复杂议题转化为可看见、可参与的改变。", "以明确的前后关系和用户路径组织跨媒体体验。", ["Cobalt", "Amber", "White", "Charcoal"]],
            ["Common Protocol", "建立一个允许不同人参与和扩展的开放规则。", "通过模块、界面和反馈机制形成可持续运行的系统。", ["Teal", "Sand", "Ink", "Coral"]],
            ["Local Signal", "从具体场景提取一个可以全球理解的信号。", "用真实人物、环境证据和克制叙事避免空泛概念。", ["Forest", "Sky", "Clay", "Paper"]],
          ];

  return profiles.map(([title, tagline, strategy, palette]) => ({
    title: title as string,
    tagline: `${tagline} 本方向针对“${competition.translatedTitle}”。`,
    strategy: `${strategy} 核心类别为${competition.categories.slice(0, 3).join("、")}。`,
    palette: palette as string[],
    statement: `${title} 从“${competition.translatedTitle}”的公开简报出发，围绕${competition.categories.slice(0, 3).join("、")}建立一套可被评委快速理解的方案。设计不把主题停留在口号，而是将其转译为具体对象、空间、视觉或使用过程。方案以${strategy}为主要方法，同时对照报名资格、成果格式和截止时间组织生产。所有生成内容都必须在最终提交前由参赛者核对官方细则、技术可行性、原创性与AI披露要求。`,
    prompts: [
      `Primary competition visual for "${competition.title}". Direction: ${title}. Brief: ${competition.brief}. Discipline: ${domain}. Show the complete proposal clearly, specific to the stated subject, credible and competition-ready.`,
      `Second required evidence image for the exact same proposal for "${competition.title}", direction ${title}. Show use, context, transformation or spatial sequence appropriate to ${competition.categories.join(", ")}. Maintain identical design identity.`,
      `Third required evidence image for the exact same proposal for "${competition.title}", direction ${title}. Show construction, material, system, typography or implementation detail appropriate to the brief. Maintain identical proportions and identity.`,
    ],
  }));
}

export function extractStatementLimit(deliverables: string[]) {
  const evidence = deliverables.find((item) => /字|词|word|character/i.test(item));
  const match = evidence?.match(/(?:最多|不超过|maximum|max\.?)\s*(\d+)/i);
  return {
    limit: match ? Number(match[1]) : undefined,
    unit: /word|词/i.test(evidence ?? "") ? "words" : "characters",
    evidence,
  };
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
