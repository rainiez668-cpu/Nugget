"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Download,
  FileJson,
  FolderOpen,
  HardDrive,
  Lightbulb,
  Trash2,
} from "lucide-react";
import { deleteProject, getProjects, setActiveProject } from "@/lib/storage";
import { exportJson, exportMarkdown } from "@/lib/export";
import type { SavedProject } from "@/lib/types";

export default function LibraryPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProjects(getProjects());
    setReady(true);
  }, []);

  function reopen(project: SavedProject) {
    setActiveProject(project);
    router.push("/studio");
  }

  function remove(id: string) {
    deleteProject(id);
    setProjects((current) => current.filter((project) => project.id !== id));
  }

  return (
    <div className="min-h-[75vh] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] shadow-sm">
              <FolderOpen className="h-3.5 w-3.5" /> 项目库
            </span>
            <h1 className="display mt-5 text-5xl font-semibold sm:text-6xl">你的灵感架</h1>
            <p className="mt-3 max-w-2xl text-lg leading-7 text-ink/60">
              保存的提案仅保留在当前浏览器中。<br />你可以随时重新打开、继续完善，或导出到其他地方。
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-2xl border border-ink/10 bg-[#e4ecdc] px-4 py-3 text-sm font-semibold text-[#4d6541]">
            <HardDrive className="h-5 w-5" />
            已保存在本地设备
          </div>
        </div>

        {ready && projects.length === 0 ? (
          <section className="paper-grid mt-10 rounded-[2.5rem] border border-dashed border-ink/20 bg-paper p-8 text-center shadow-card sm:p-16">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-[28px] border-2 border-ink bg-gold shadow-[5px_5px_0_#201d17]">
              <Lightbulb className="h-8 w-8" />
            </span>
            <h2 className="display mt-7 text-4xl font-semibold">灵感架还是空的。</h2>
            <p className="mx-auto mt-3 max-w-md leading-7 text-ink/55">
              分析一份竞赛 Brief 并保存结果，你的第一个项目就会出现在这里，随时可以重新打开。
            </p>
            <button type="button" onClick={() => router.push("/studio")} className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-bold text-white shadow-[0_5px_0_#d99f1d]">
              开始一个项目 <ArrowRight className="h-4 w-4" />
            </button>
          </section>
        ) : (
          <div data-testid="project-grid" className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => (
              <article key={project.id} className="group overflow-hidden rounded-4xl border border-ink/10 bg-paper shadow-card transition hover:-translate-y-1 hover:shadow-soft">
                <div className={`h-2 ${index % 3 === 0 ? "bg-gold" : index % 3 === 1 ? "bg-sage" : "bg-coral"}`} />
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-gold-soft px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]">
                      {project.analysis.concepts.length} 个概念方案
                    </span>
                    <button
                      type="button"
                      aria-label={`删除 ${project.title}`}
                      onClick={() => remove(project.id)}
                      className="grid h-9 w-9 place-items-center rounded-full text-ink/35 transition hover:bg-[#f9e0d7] hover:text-[#9f4226]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <h2 className="display mt-5 line-clamp-2 text-3xl font-semibold leading-tight">{project.title}</h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink/55">{project.analysis.summary}</p>
                  <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-ink/40">
                    <CalendarDays className="h-4 w-4" />
                    更新于 {new Date(project.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                  <button
                    data-testid="reopen-project"
                    type="button"
                    onClick={() => reopen(project)}
                    className="mt-6 flex w-full items-center justify-between rounded-2xl bg-ink px-4 py-3.5 text-sm font-bold text-white transition group-hover:bg-[#332f27]"
                  >
                    在设计工作室中重新打开 <ArrowRight className="h-4 w-4" />
                  </button>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => exportMarkdown(project)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink/10 px-3 py-2.5 text-xs font-bold hover:bg-cream">
                      <Download className="h-3.5 w-3.5" /> Markdown
                    </button>
                    <button type="button" onClick={() => exportJson(project)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink/10 px-3 py-2.5 text-xs font-bold hover:bg-cream">
                      <FileJson className="h-3.5 w-3.5" /> JSON
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
