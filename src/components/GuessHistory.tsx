"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Program } from "@/lib/gameData";

interface GuessHistoryProps {
	guessHistory: Array<{
		university: string;
		program: string;
		universityMatch: boolean;
		programMatch: boolean;
	}>;
	currentProgram: Program;
	isExactMatch: (guess: string, target: string) => boolean;
}

export function GuessHistory({
	guessHistory,
	currentProgram,
	isExactMatch,
}: GuessHistoryProps) {
	if (guessHistory.length === 0) return null;

	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle>Tahmin Geçmişi</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					{guessHistory.map((guess, index) => (
						<div
							key={`${guess.university}-${guess.program}-${index}`}
							className="grid grid-cols-1 gap-2 rounded-lg bg-gray-50 p-3 md:grid-cols-2 dark:bg-slate-700/60"
						>
							<div
								className={`rounded p-2 ${
									guess.universityMatch
										? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200 dark:border dark:border-green-500/30"
										: "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-200 dark:border dark:border-red-500/30"
								}`}
							>
								<span className="font-medium">
									Üniversite:{" "}
								</span>
								{guess.university}
								{guess.universityMatch ? " ✓" : " ✗"}
								{/* Show the actual correct answer if the guess was correct but different */}
								{guess.universityMatch &&
									!isExactMatch(
										guess.university,
										currentProgram.universityName
									) && (
										<div className="mt-1 text-green-600 text-xs dark:text-green-400">
											Doğru cevap:{" "}
											{currentProgram.universityName}
										</div>
									)}
							</div>
							<div
								className={`rounded p-2 ${
									guess.programMatch
										? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200 dark:border dark:border-green-500/30"
										: "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-200 dark:border dark:border-red-500/30"
								}`}
							>
								<span className="font-medium">Program: </span>
								{guess.program}
								{guess.programMatch ? " ✓" : " ✗"}
								{/* Show the actual correct answer if the guess was correct but different */}
								{guess.programMatch &&
									guess.program !==
										currentProgram.programName && (
										<div className="mt-1 text-green-600 text-xs dark:text-green-400">
											Doğru cevap:{" "}
											{currentProgram.programName}
										</div>
									)}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
