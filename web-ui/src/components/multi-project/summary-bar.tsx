import { useMemo } from "react";
import { cn } from "@/components/ui/cn";
import type { RuntimeProjectSummary } from "@/runtime/types";

interface StatusPill {
	label: string;
	count: number;
	toneClassName: string;
	attentionThreshold?: boolean;
}

export function SummaryBar({ projects }: { projects: RuntimeProjectSummary[] }): React.ReactElement {
	const totals = useMemo(() => {
		let backlog = 0;
		let inProgress = 0;
		let review = 0;
		let trash = 0;
		for (const project of projects) {
			backlog += project.taskCounts.backlog;
			inProgress += project.taskCounts.in_progress;
			review += project.taskCounts.review;
			trash += project.taskCounts.trash;
		}
		return { backlog, inProgress, review, trash };
	}, [projects]);

	const pills: StatusPill[] = [
		{
			label: "Backlog",
			count: totals.backlog,
			toneClassName: "bg-text-primary/15 text-text-primary",
		},
		{
			label: "In Progress",
			count: totals.inProgress,
			toneClassName: "bg-accent/20 text-accent",
		},
		{
			label: "Review",
			count: totals.review,
			toneClassName: "bg-status-green/20 text-status-green",
			attentionThreshold: totals.review > 0,
		},
		{
			label: "Trash",
			count: totals.trash,
			toneClassName: "bg-status-red/20 text-status-red",
		},
	];

	const totalTasks = totals.backlog + totals.inProgress + totals.review + totals.trash;

	return (
		<div className="flex items-center gap-4 border-b border-border bg-surface-1 px-5 py-3">
			<div className="flex items-center gap-1.5 text-sm text-text-secondary">
				<span className="font-medium text-text-primary">{projects.length}</span>
				<span>projects</span>
				<span className="text-text-tertiary mx-1">·</span>
				<span className="font-medium text-text-primary">{totalTasks}</span>
				<span>tasks</span>
			</div>
			<div className="flex items-center gap-2 ml-auto">
				{pills.map((pill) => (
					<span
						key={pill.label}
						className={cn(
							"inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
							pill.toneClassName,
							pill.attentionThreshold && "ring-1 ring-status-green/40",
						)}
					>
						<span>{pill.label}</span>
						<span className="font-semibold">{pill.count}</span>
					</span>
				))}
			</div>
		</div>
	);
}
