"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Download,
  FileJson,
  Gem,
  RotateCcw,
  Save,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { AnalysisDashboard } from "@/components/analysis-dashboard";
import { LoadingStudio } from "@/components/loading-studio";
import { SAMPLE_BRIEF } from "@/lib/sample";
import { exportJson, exportMarkdown } from "@/lib/export";
import { saveProject, takeActiveProject, takeImportedBrief } from "@/lib/storage";
import type { CompetitionAnalysis, SavedProject } from "@/lib/types";

type StudioProps = {
  demo?: boolean;
};

export function Studio({ demo = false }: StudioProps) {
  const router = useRouter();
  const initialized = useRef(false);
  const [brief, setBrief] = useState(demo ? SAMPLE_BRIEF : "");
  const [analysis, setAnalysis] = useState<CompetitionAnalysis | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [provider, setProvider] = useState("mock");

  const analyze = useCallback(async (text = brief) => {
    setLoading(true);
    setError("");
    setSaved(false);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief: text }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Analysis failed.");
      setAnalysis(data.analysis);
      setProvider(data.provider);
      window.setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [brief]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const active = takeActiveProject();
    if (active) {
      setBrief(active.originalBrief);
      setAnalysis(active.analysis);
      setProjectId(active.id);
      setCreatedAt(active.createdAt);
    } else {
      const importedBrief = takeImportedBrief();
      if (importedBrief) {
        setBrief(importedBrief);
        void analyze(importedBrief);
      } else if (demo) {
        void analyze(SAMPLE_BRIEF);
      }
    }
  }, [analyze, demo]);

  const currentProject = useMemo<SavedProject | null>(() => {
    if (!analysis) return null;
    const now = new Date().toISOString();
    return {
      id: projectId ?? crypto.randomUUID(),
      title: analysis.competitionTitle,
      originalBrief: brief,
      analysis,
      createdAt: createdAt ?? now,
      updatedAt: now,
    };
  }, [analysis, brief, createdAt, projectId]);

  function handleSave() {
    if (!currentProject) return;
    saveProject(currentProject);
    setProjectId(currentProject.id);
    setCreatedAt(currentProject.createdAt);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] shadow-sm">
                <Gem className="h-3.5 w-3.5 text-[#b77c00]" /> The studio
              </span>
              <span className="rounded-full bg-[#e4ecdc] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#4d6541]">
                Demo mode · {provider} AI
              </span>
            </div>
            <h1 className="display mt-5 text-5xl font-semibold sm:text-6xl">What are we digging into?</h1>
            <p className="mt-3 max-w-2xl text-lg leading-7 text-ink/60">
              Drop in the competition brief. Nugget will separate the rules from the openings and hatch three directions worth exploring.
            </p>
          </div>
          {analysis && (
            <button
              type="button"
              onClick={() => {
                setAnalysis(null);
                setBrief("");
                setProjectId(null);
              }}
              className="inline-flex items-center gap-2 text-sm font-bold text-ink/55 hover:text-ink"
            >
              <RotateCcw className="h-4 w-4" /> Start fresh
            </button>
          )}
        </div>

        <section className="mt-9 rounded-[2.25rem] border border-ink/10 bg-paper p-3 shadow-soft sm:p-5">
          <div className="rounded-3xl border border-ink/10 bg-cream p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="brief" className="text-sm font-bold">Competition brief</label>
              <span className="text-xs font-semibold text-ink/35">{brief.length.toLocaleString()} characters</span>
            </div>
            <textarea
              id="brief"
              data-testid="brief-input"
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
              placeholder="Paste the full competition brief here — deadlines, deliverables, judging criteria, all of it..."
              className="scrollbar-thin mt-3 min-h-[260px] w-full resize-y rounded-2xl border border-ink/10 bg-white p-5 text-[15px] leading-7 outline-none transition placeholder:text-ink/30 focus:border-gold focus:ring-4 focus:ring-gold/15"
            />
            {error && <p role="alert" className="mt-3 rounded-xl bg-[#f9e0d7] px-4 py-3 text-sm font-semibold text-[#8a3f29]">{error}</p>}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                data-testid="sample-brief"
                type="button"
                onClick={() => {
                  setBrief(SAMPLE_BRIEF);
                  setError("");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-bold transition hover:bg-gold-soft"
              >
                <Sparkles className="h-4 w-4" /> Try sample brief
              </button>
              <button
                data-testid="analyze-button"
                type="button"
                disabled={loading || brief.trim().length < 80}
                onClick={() => void analyze()}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-bold text-white shadow-[0_5px_0_#d99f1d] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none"
              >
                <WandSparkles className="h-4 w-4" /> Analyze the brief
              </button>
            </div>
          </div>
        </section>

        {loading && <div className="mt-6"><LoadingStudio /></div>}

        {analysis && !loading && (
          <div id="results" className="scroll-mt-24 pt-10">
            <div className="sticky top-[82px] z-40 mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-paper/90 p-3 shadow-card backdrop-blur-xl">
              <p className="hidden pl-2 text-sm font-semibold text-ink/55 sm:block">Your proposal kit is ready.</p>
              <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                <button
                  data-testid="save-project"
                  type="button"
                  onClick={handleSave}
                  className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition sm:flex-none ${
                    saved ? "bg-[#dce8d2] text-[#42593a]" : "bg-gold text-ink hover:bg-[#eeb12b]"
                  }`}
                >
                  {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                  {saved ? "Saved locally" : "Save project"}
                </button>
                <button type="button" onClick={() => currentProject && exportMarkdown(currentProject)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2.5 text-xs font-bold hover:bg-cream sm:flex-none">
                  <Download className="h-4 w-4" /> Markdown
                </button>
                <button type="button" onClick={() => currentProject && exportJson(currentProject)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2.5 text-xs font-bold hover:bg-cream sm:flex-none">
                  <FileJson className="h-4 w-4" /> JSON
                </button>
              </div>
            </div>
            <AnalysisDashboard analysis={analysis} />
            <div className="mt-8 flex justify-center">
              <button type="button" onClick={() => router.push("/library")} className="rounded-full border border-ink/15 bg-paper px-6 py-3 text-sm font-bold shadow-sm hover:bg-gold-soft">
                Visit your project library
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
