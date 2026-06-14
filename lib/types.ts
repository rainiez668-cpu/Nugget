export type ChecklistItem = {
  label: string;
  detail: string;
};

export type ConceptDirection = {
  title: string;
  tagline: string;
  strategy: string;
  visualMood: string;
  materialPalette: string[];
  juryAppeal: string;
  prompts: string[];
  statement: string;
  boardLayout: string[];
  checklist: ChecklistItem[];
};

export type CompetitionAnalysis = {
  competitionTitle: string;
  summary: string;
  deadline: string;
  eligibility: string;
  entryFee: string;
  deliverables: string[];
  formatRequirements: string[];
  judgingCriteria: string[];
  hiddenOpportunities: string[];
  risks: string[];
  concepts: ConceptDirection[];
  generatedAt: string;
};

export type SavedProject = {
  id: string;
  title: string;
  originalBrief: string;
  analysis: CompetitionAnalysis;
  createdAt: string;
  updatedAt: string;
};
