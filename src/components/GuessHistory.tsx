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
							className="grid grid-cols-1 gap-2 rounded-lg bg-gray-50 p-3 md:grid-cols-2"
						>
							<div
								className={`rounded p-2 ${
									guess.universityMatch
										? "bg-green-100 text-green-800"
										: "bg-red-100 text-red-800"
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
										<div className="mt-1 text-green-600 text-xs">
											Doğru cevap:{" "}
											{currentProgram.universityName}
										</div>
									)}
							</div>
							<div
								className={`rounded p-2 ${
									guess.programMatch
										? "bg-green-100 text-green-800"
										: "bg-red-100 text-red-800"
								}`}
							>
								<span className="font-medium">Program: </span>
								{guess.program}
								{guess.programMatch ? " ✓" : " ✗"}
								{/* Show the actual correct answer if the guess was correct but different */}
								{guess.programMatch &&
									guess.program !==
										currentProgram.programName && (
										<div className="mt-1 text-green-600 text-xs">
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
