"use client";

import { Button } from "@/components/ui/button";
import { Eye, RefreshCw, ArrowLeft } from "lucide-react";

interface ActionButtonsProps {
	gameWon: boolean;
	onShowAnswer: () => void;
	onResetGame: () => void;
	onNewGameSession?: () => void;
}

export function ActionButtons({
	gameWon,
	onShowAnswer,
	onResetGame,
	onNewGameSession,
}: ActionButtonsProps) {
	return (
		<div className="mb-8 flex justify-center gap-3">
			<Button
				onClick={onShowAnswer}
				className="gap-2 border border-amber-700 bg-amber-600 text-white shadow-md hover:bg-amber-700"
				disabled={gameWon}
			>
				<Eye className="h-4 w-4" />
				Cevabı Gör
			</Button>
			<Button
				onClick={onResetGame}
				className="gap-2 border border-blue-700 bg-blue-600 text-white shadow-md hover:bg-blue-700"
			>
				<RefreshCw className="h-4 w-4" />
				Yeni Oyun
			</Button>
			{onNewGameSession && (
				<Button
					onClick={onNewGameSession}
					variant="outline"
					className="gap-2"
				>
					<ArrowLeft className="h-4 w-4" />
					Yeni Sıralama Türü
				</Button>
			)}
		</div>
	);
}
