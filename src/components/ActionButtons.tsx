"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, RefreshCw } from "lucide-react";

interface ActionButtonsProps {
	gameWon: boolean;
	onShowAnswer: () => void;
	onResetGame: () => void;
	onNewGameSession?: () => void;
}

export function ActionButtons({ gameWon, onShowAnswer, onResetGame, onNewGameSession }: ActionButtonsProps) {
	return (
		<div className="mb-6 flex flex-col justify-center gap-2 sm:mb-8 sm:flex-row sm:gap-3">
			<Button
				onClick={onShowAnswer}
				className="group gap-2 border border-amber-700 bg-amber-600 text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-amber-700 hover:shadow-lg active:scale-95 disabled:hover:scale-100 dark:border-amber-600 dark:bg-amber-700 dark:hover:bg-amber-800"
				disabled={gameWon}
			>
				<Eye className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
				<span className="text-sm transition-all duration-300 sm:text-base">Cevabı Gör</span>
			</Button>
			<Button
				onClick={onResetGame}
				className="group gap-2 border border-blue-700 bg-blue-600 text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-lg active:scale-95 dark:border-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
			>
				<RefreshCw className="h-4 w-4 transition-all duration-300 group-hover:rotate-180 group-hover:scale-110" />
				<span className="text-sm transition-all duration-300 sm:text-base">Yeni Oyun</span>
			</Button>
			{onNewGameSession && (
				<Button
					onClick={onNewGameSession}
					variant="outline"
					className="group gap-2 border-gray-300 bg-yellow-500 text-white transition-all duration-300 hover:scale-105 hover:bg-yellow-600 hover:shadow-lg active:scale-95 dark:border-gray-600 dark:bg-yellow-600 dark:text-gray-100 dark:hover:bg-yellow-700"
				>
					<ArrowLeft className="h-4 w-4" />
					<span className="text-sm sm:text-base">Yeni Sıralama Türü</span>
				</Button>
			)}
		</div>
	);
}
