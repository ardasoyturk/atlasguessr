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
		<div className="mb-6 flex justify-center gap-4">
			<Badge variant="outline" className="text-sm">
				Deneme: {attempts}
			</Badge>
			<Badge
				variant={universityCorrect ? "default" : "outline"}
				className="text-sm"
			>
				Üniversite: {universityCorrect ? "✓" : "?"}
			</Badge>
			<Badge
				variant={programCorrect ? "default" : "outline"}
				className="text-sm"
			>
				Program: {programCorrect ? "✓" : "?"}
			</Badge>
		</div>
	);
}
