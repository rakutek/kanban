const MAX_DIFF_CHARS = 50_000;

interface BuildAgentReviewPromptInput {
	originalTaskPrompt: string;
	diff: string;
	diffSummary: string;
}

export function buildAgentReviewPrompt(input: BuildAgentReviewPromptInput): string {
	const truncatedDiff =
		input.diff.length > MAX_DIFF_CHARS
			? `${input.diff.slice(0, MAX_DIFF_CHARS)}\n\n... (diff truncated)`
			: input.diff;

	return [
		"You are reviewing code changes made by another agent for the following task:",
		"",
		`> ${input.originalTaskPrompt}`,
		"",
		"## Diff summary",
		"```",
		input.diffSummary || "(no changes)",
		"```",
		"",
		"## Full diff",
		"```diff",
		truncatedDiff || "(no changes)",
		"```",
		"",
		"## Instructions",
		"Review these changes for critical issues only:",
		"- Bugs or broken logic",
		"- Security vulnerabilities",
		"- Missing error handling that would cause crashes",
		"- Incorrect API usage",
		"",
		"Do NOT flag style issues, naming preferences, or minor improvements.",
		"",
		"Provide a concise summary of your findings. If there are critical issues, describe each one clearly.",
	].join("\n");
}

interface ReviewFeedback {
	taskId: string;
	finalMessage: string;
}

export function buildAgentReviewFeedbackPrompt(input: {
	originalTaskPrompt: string;
	feedbacks: ReviewFeedback[];
}): string {
	const feedbackSections = input.feedbacks.map((fb, i) => {
		return [`### Reviewer ${i + 1}`, "", fb.finalMessage].join("\n");
	});

	return [
		"Multiple automated code reviewers have reviewed your changes for the following task:",
		"",
		`> ${input.originalTaskPrompt}`,
		"",
		"## Review feedback",
		"",
		...feedbackSections,
		"",
		"## Instructions",
		"Triage the feedback above. For each finding:",
		"1. Decide if it is a genuine issue that needs fixing",
		"2. If so, plan the fix",
		"3. If not, explain why it can be dismissed",
		"",
		"Then implement any necessary fixes.",
	].join("\n");
}
