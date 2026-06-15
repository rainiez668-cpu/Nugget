"use client";

import type { SavedProject } from "@/lib/types";

const STORAGE_KEY = "nugget-projects-v1";
const ACTIVE_KEY = "nugget-active-project";
const IMPORTED_BRIEF_KEY = "nugget-imported-brief";

export function getProjects(): SavedProject[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as SavedProject[];
  } catch {
    return [];
  }
}

export function saveProject(project: SavedProject): void {
  const projects = getProjects();
  const existing = projects.findIndex((item) => item.id === project.id);
  if (existing >= 0) projects[existing] = project;
  else projects.unshift(project);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function deleteProject(id: string): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(getProjects().filter((project) => project.id !== id)),
  );
}

export function setActiveProject(project: SavedProject): void {
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(project));
}

export function takeActiveProject(): SavedProject | null {
  const raw = localStorage.getItem(ACTIVE_KEY);
  if (!raw) return null;
  localStorage.removeItem(ACTIVE_KEY);
  try {
    return JSON.parse(raw) as SavedProject;
  } catch {
    return null;
  }
}

export function setImportedBrief(brief: string): void {
  localStorage.setItem(IMPORTED_BRIEF_KEY, brief);
}

export function takeImportedBrief(): string | null {
  const brief = localStorage.getItem(IMPORTED_BRIEF_KEY);
  if (brief) localStorage.removeItem(IMPORTED_BRIEF_KEY);
  return brief;
}
