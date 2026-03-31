import { LayoutGrid } from "lucide-react";
import { useCallback, useState } from "react";
import type { RuntimeProjectSummary } from "@/runtime/types";
import { LocalStorageKey, readLocalStorageItem, writeLocalStorageItem } from "@/storage/local-storage-store";
import { OverviewProjectRow } from "./project-row";
import { SummaryBar } from "./summary-bar";

function loadExpandedProjectIds(): Set<string> {
	const stored = readLocalStorageItem(LocalStorageKey.OverviewExpandedProjects);
	if (!stored) {
		return new Set();
	}
	try {
		const parsed: unknown = JSON.parse(stored);
		if (Array.isArray(parsed)) {
			return new Set(parsed.filter((id): id is string => typeof id === "string"));
		}
	} catch {
		// Ignore parse failures.
	}
	return new Set();
}

function saveExpandedProjectIds(ids: Set<string>): void {
	writeLocalStorageItem(LocalStorageKey.OverviewExpandedProjects, JSON.stringify([...ids]));
}

export function MultiProjectOverview({
	projects,
	onSelectProject,
}: {
	projects: RuntimeProjectSummary[];
	onSelectProject: (projectId: string) => void;
}): React.ReactElement {
	const sortedProjects = [...projects].sort((a, b) => a.path.localeCompare(b.path));
	const [expandedIds, setExpandedIds] = useState<Set<string>>(loadExpandedProjectIds);

	const toggleExpand = useCallback((projectId: string) => {
		setExpandedIds((prev) => {
			const next = new Set(prev);
			if (next.has(projectId)) {
				next.delete(projectId);
			} else {
				next.add(projectId);
			}
			saveExpandedProjectIds(next);
			return next;
		});
	}, []);

	if (projects.length === 0) {
		return (
			<div className="flex flex-1 min-h-0 items-center justify-center bg-surface-0 p-6">
				<div className="flex flex-col items-center justify-center gap-3 text-text-tertiary">
					<LayoutGrid size={48} strokeWidth={1} />
					<h3 className="text-sm font-semibold text-text-primary">No projects</h3>
					<p className="text-[13px] text-text-secondary">Add projects to see the overview.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col min-h-0 min-w-0 bg-surface-0">
			<SummaryBar projects={projects} />
			<div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
				<div className="flex flex-col gap-2 p-4">
					{sortedProjects.map((project, index) => (
						<OverviewProjectRow
							key={project.id}
							project={project}
							index={index}
							isExpanded={expandedIds.has(project.id)}
							onToggleExpand={() => toggleExpand(project.id)}
							onSelectProject={onSelectProject}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
