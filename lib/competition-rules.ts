export type RuleDocument = {
  name: string;
  type: "official-page" | "pdf" | "extracted";
  url: string;
  downloadable: boolean;
  checkedAt: string;
};

export type CompetitionRuleSet = {
  participation: "student" | "open" | "professional" | "restricted";
  verdict: string;
  verdictDetail: string;
  deliverables: string[];
  aiRule: string;
  documents: RuleDocument[];
};

export const competitionRules: Record<string, CompetitionRuleSet> = {
  "pohang-museum-2026": {
    participation: "professional",
    verdict: "学生不可独立参加",
    verdictDetail:
      "参赛者必须在本国合法注册为建筑师。外国获胜者还必须与韩国注册建筑师组成联合体，才能签订后续设计合同。",
    deliverables: [
      "按官方模板完成参赛申请与专业资格证明",
      "项目设计说明与建筑方案图纸",
      "匿名评审材料",
      "获胜后提交联合体及韩国执业合作证明",
    ],
    aiRule: "官方公开页面未提供明确AI条款，必须在提交前向主办方书面确认。",
    documents: [
      {
        name: "浦项博物馆竞赛官方页面",
        type: "official-page",
        url: "http://www.pohang-muse.kr",
        downloadable: false,
        checkedAt: "2026-06-15",
      },
      {
        name: "Nugget提取规则摘要.md",
        type: "extracted",
        url: "/competition-files/pohang-museum-rules-extracted.md",
        downloadable: true,
        checkedAt: "2026-06-15",
      },
    ],
  },
  "real-leather-student-2026": {
    participation: "student",
    verdict: "符合学生优先条件",
    verdictDetail:
      "全球在校学生或毕业不超过一年、且尚未在创意行业全职就业者可参加；须年满18岁。免费报名。",
    deliverables: [
      "至少3张、最多5张不同角度的设计图或效果图",
      "其中一张必须展示完整正面视图",
      "每张图片必须为JPG、横版、300dpi、文件不超过5MB",
      "设计说明最多600字",
      "设计必须至少使用50%牛皮革，并可在约6个月内制作成实体原型",
      "不能使用毛皮、异国皮、黏合皮或合成仿皮作为主要材料",
    ],
    aiRule:
      "允许在设计过程中使用AI工具，但作品必须原创、可实际制作，并符合材料与原型要求。参赛者应保留创作过程并按规则披露。",
    documents: [
      {
        name: "官方报名与完整规则页面",
        type: "official-page",
        url: "https://rlsd.internationaldesigncomp.com/",
        downloadable: false,
        checkedAt: "2026-06-15",
      },
      {
        name: "Nugget提取规则摘要.md",
        type: "extracted",
        url: "/competition-files/real-leather-2026-rules-extracted.md",
        downloadable: true,
        checkedAt: "2026-06-15",
      },
    ],
  },
};

export function inferParticipation(eligibility: string[]): CompetitionRuleSet["participation"] {
  const value = eligibility.join(" ");
  if (/学生|在校|毕业/.test(value)) return "student";
  if (/注册|执业|专业人士|专业设计师/.test(value)) return "professional";
  if (/全球开放|全球设计师|国际开放/.test(value)) return "open";
  return "restricted";
}

export function getRuleSet(id: string) {
  return competitionRules[id];
}
