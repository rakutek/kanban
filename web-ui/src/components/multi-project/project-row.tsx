import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "@/components/ui/cn";
import type { RuntimeProjectSummary } from "@/runtime/types";
import { formatPathForDisplay } from "@/utils/path-display";

const PROJECT_ACCENT_COLORS = [
	"bg-status-blue",
	"bg-status-green",
	"bg-status-orange",
	"bg-status-purple",
	"bg-accent",
	"bg-status-red",
	"bg-status-gold",
] as const;

interface TaskCountBadge {
	id: string;
	label: string;
	shortLabel: string;
	toneClassName: string;
	count: number;
}

function getAccentColorClass(index: number): (typeof PROJECT_ACCENT_COLORS)[number] {
	return PROJECT_ACCENT_COLORS[index % PROJECT_ACCENT_COLORS.length]!;
}

export function OverviewProjectRow({
	project,
	index,
	isExpanded,
	onToggleExpand,
	onSelectProject,
}: {
	project: RuntimeProjectSummary;
	index: number;
	isExpanded: boolean;
	onToggleExpand: () => void;
	onSelectProject: (projectId: string) => void;
}): React.ReactElement {
	const displayPath = formatPathForDisplay(project.path);
	const accentColor = getAccentColorClass(index);

	const badges: TaskCountBadge[] = [
		{
			id: "backlog",
			label: "Backlog",
			shortLabel: "B",
			toneClassName: "bg-text-primary/15 text-text-primary",
			count: project.taskCounts.backlog,
		},
		{
			id: "in_progress",
			label: "In Progress",
			shortLabel: "IP",
			toneClassName: "bg-accent/20 text-accent",
			count: project.taskCounts.in_progress,
		},
		{
			id: "review",
			label: "Review",
			shortLabel: "R",
			toneClassName: "bg-status-green/20 text-status-green",
			count: project.taskCounts.review,
		},
		{
			id: "trash",
			label: "Trash",
			shortLabel: "T",
			toneClassName: "bg-status-red/20 text-status-red",
			count: project.taskCounts.trash,
		},
	].filter((badge) => badge.count > 0);

	const totalTasks =
		project.taskCounts.backlog +
		project.taskCounts.in_progress +
		project.taskCounts.review +
		project.taskCounts.trash;

	return (
		<Collapsible.Root open={isExpanded} onOpenChange={onToggleExpand}>
			<div className="rounded-lg border border-border bg-surface-1 overflow-hidden">
				<div className="flex items-center">
					{/* Accent color bar */}
					<div className={cn("w-1 self-stretch shrink-0 rounded-l-lg", accentColor)} />

					{/* Main row content */}
					<div className="flex flex-1 items-center gap-3 px-3 py-2.5 min-w-0">
						{/* Expand/collapse trigger */}
						<Collapsible.Trigger asChild>
							<button
								type="button"
								className={cn(
									"flex items-center justify-center w-5 h-5 rounded-sm shrink-0",
									"text-text-tertiary hover:text-text-secondary hover:bg-surface-3 cursor-pointer",
									"transition-transform duration-150",
									isExpanded && "rotate-90",
								)}
								disabled={totalTasks === 0}
							>
								<ChevronRight size={14} />
							</button>
						</Collapsible.Trigger>

						{/* Project info */}
						<div className="flex-1 min-w-0">
							<div className="flex items-baseline gap-2">
								<button
									type="button"
									onClick={() => onSelectProject(project.id)}
									className="font-medium text-sm text-text-primary hover:text-accent cursor-pointer bg-transparent border-none p-0 truncate"
									title={`Open ${project.name} kanban board`}
								>
									{project.name}
								</button>
								<span className="text-[10px] font-mono text-text-tertiary truncate hidden sm:inline">
									{displayPath}
								</span>
							</div>
						</div>

						{/* Task count badges */}
						<div className="flex items-center gap-1.5 shrink-0">
							{badges.map((badge) => (
								<span
									key={badge.id}
									className={cn(
										"inline-flex items-center gap-1 rounded-full text-[10px] px-1.5 py-px font-medium",
										badge.toneClassName,
									)}
									title={badge.label}
								>
									<span>{badge.shortLabel}</span>
									<span style={{ opacity: 0.4 }}>|</span>
									<span>{badge.count}</span>
								</span>
							))}
							{totalTasks === 0 ? <span className="text-[10px] text-text-tertiary">No tasks</span> : null}
						</div>

						{/* Open project button */}
						<button
							type="button"
							onClick={() => onSelectProject(project.id)}
							className="flex items-center justify-center w-6 h-6 rounded-sm shrink-0 text-text-tertiary hover:text-text-secondary hover:bg-surface-3 cursor-pointer bg-transparent border-none"
							title="Open project board"
						>
							<ExternalLink size={13} />
						</button>
					</div>
				</div>

				{/* Expanded content (Phase 2: individual task cards) */}
				<Collapsible.Content>
					<div className="border-t border-border px-4 py-3 bg-surface-0">
						<p className="text-xs text-text-tertiary italic">
							{totalTasks} task{totalTasks !== 1 ? "s" : ""} — click project name to view board
						</p>
					</div>
				</Collapsible.Content>
			</div>
		</Collapsible.Root>
	);
}
