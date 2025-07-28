"use client";

import { Badge } from "@/components/ui/badge";

interface GameStatsProps {
	attempts: number;
	universityCorrect: boolean;
	programCorrect: boolean;
}

export function GameStats({
	attempts,
	universityCorrect,
	programCorrect,
}: GameStatsProps) {
	return (
		<div className="mb-4 flex flex-wrap justify-center gap-2 sm:mb-6 sm:gap-4">
			<Badge variant="outline" className="text-xs sm:text-sm">
				Deneme: {attempts}
			</Badge>
			<Badge
				variant={universityCorrect ? "default" : "outline"}
				className="text-xs sm:text-sm"
			>
				Üniversite: {universityCorrect ? "✓" : "?"}
			</Badge>
			<Badge
				variant={programCorrect ? "default" : "outline"}
				className="text-xs sm:text-sm"
			>
				Program: {programCorrect ? "✓" : "?"}
			</Badge>
		</div>
	);
}
