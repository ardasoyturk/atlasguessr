"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Program } from "@/lib/gameData";
import { CheckCircle, Copy, RefreshCw, Share2 } from "lucide-react";
import { useState } from "react";

interface GameWonModalProps {
	isOpen: boolean;
	onClose: () => void;
	currentProgram: Program;
	attempts: number;
	onNewGame: () => void;
	guessHistory: Array<{
		university: string;
		program: string;
		universityMatch: boolean;
		programMatch: boolean;
	}>;
}

export function GameWonModal({
	isOpen,
	onClose,
	currentProgram,
	attempts,
	onNewGame,
	guessHistory,
}: GameWonModalProps) {
	const [copied, setCopied] = useState(false);

	const generateShareText = () => {
		const gameId = currentProgram.id || 0;
		const universityEmoji = "🏛️";
		const programEmoji = "📚";

		// Generate attempt summary with emojis
		const attemptSummary = guessHistory
			.map((guess) => {
				const universityStatus = guess.universityMatch ? "🟢" : "🔴";
				const programStatus = guess.programMatch ? "🟢" : "🔴";
				return `${universityStatus}${programStatus}`;
			})
			.join(" ");

		return `🎓 Atlasguessr #${gameId}

${universityEmoji} ${currentProgram.universityName}
${programEmoji} ${currentProgram.programName}

📍 ${currentProgram.cityName}
🎯 ${attempts} denemede tamamlandı!

${attemptSummary}

🔗 atlasguessr.xyz`;
	};

	const shareResult = async () => {
		const shareText = generateShareText();

		// Check if we're on mobile (touch device) and if native sharing is available
		const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;

		if (isMobile && navigator.share) {
			// Use native sharing only on mobile devices
			try {
				await navigator.share({
					title: "Atlasguessr",
					text: shareText,
				});
			} catch (error) {
				// Fallback to clipboard if sharing fails
				copyToClipboard(shareText);
			}
		} else {
			// Always use clipboard on desktop
			copyToClipboard(shareText);
		}
	};

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy to clipboard:", error);
		}
	};

	const handleNewGame = () => {
		onNewGame();
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="mx-2 w-full max-w-md rounded-xl border-green-200 bg-gradient-to-b from-green-50 to-white p-0 shadow-2xl sm:mx-4 dark:border-green-800 dark:from-slate-800 dark:to-slate-900">
				{/* Celebration Header */}
				<div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-6 text-center text-white sm:px-6 sm:py-8">
					<div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm sm:mb-3 sm:h-16 sm:w-16">
						<CheckCircle className="h-6 w-6 sm:h-8 sm:w-8" />
					</div>
					<DialogHeader>
						<DialogTitle className="font-bold text-white text-xl sm:text-2xl">🎉 Tebrikler!</DialogTitle>
						<DialogDescription className="text-green-100">{attempts} denemede başardınız!</DialogDescription>
					</DialogHeader>
				</div>

				{/* Game Result Details */}
				<div className="space-y-3 p-4 sm:space-y-4 sm:p-6">
					{/* University and Program */}
					<div className="space-y-2 sm:space-y-3">
						<div className="rounded-lg bg-blue-50 p-3 sm:p-4">
							<div className="flex items-center gap-2 text-blue-800">
								<span className="text-base sm:text-lg">🏛️</span>
								<div>
									<p className="font-medium text-blue-600 text-xs">ÜNİVERSİTE</p>
									<p className="font-semibold text-sm leading-tight sm:text-base">{currentProgram.universityName}</p>
								</div>
							</div>
						</div>

						<div className="rounded-lg bg-purple-50 p-3 sm:p-4">
							<div className="flex items-center gap-2 text-purple-800">
								<span className="text-base sm:text-lg">📚</span>
								<div>
									<p className="font-medium text-purple-600 text-xs">PROGRAM</p>
									<p className="font-semibold text-sm leading-tight sm:text-base">{currentProgram.programName}</p>
								</div>
							</div>
						</div>

						<div className="rounded-lg bg-orange-50 p-3 sm:p-4">
							<div className="flex items-center gap-2 text-orange-800">
								<span className="text-base sm:text-lg">📍</span>
								<div>
									<p className="font-medium text-orange-600 text-xs">ŞEHİR</p>
									<p className="font-semibold text-sm sm:text-base">{currentProgram.cityName}</p>
								</div>
							</div>
						</div>
					</div>

					{/* Attempt History Visualization */}
					<div className="rounded-lg bg-gray-50 p-4 dark:bg-slate-800 dark:border dark:border-slate-600">
						<p className="mb-3 text-center font-medium text-gray-600 text-sm dark:text-gray-300">Tahmin Geçmişi</p>
						<div className="flex flex-wrap justify-center gap-3">
							{guessHistory.map((guess, index) => (
								<div
									key={`${guess.university}-${guess.program}-${index}`}
									className="flex gap-0.5"
									title={`${index + 1}. Tahmin`}
								>
									<div className={`h-6 w-6 rounded-sm ${guess.universityMatch ? "bg-green-500" : "bg-red-500"}`} />
									<div className={`h-6 w-6 rounded-sm ${guess.programMatch ? "bg-green-500" : "bg-red-500"}`} />
								</div>
							))}
						</div>
						<p className="mt-2 text-center text-gray-500 text-xs dark:text-gray-400">🟢 Doğru • 🔴 Yanlış</p>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-2">
						<Button 
							onClick={shareResult} 
							className="flex-1 gap-2 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
						>
							{copied ? (
								<>
									<Copy className="h-4 w-4" />
									Kopyalandı!
								</>
							) : (
								<>
									<Share2 className="h-4 w-4" />
									Paylaş
								</>
							)}
						</Button>
						<Button
							onClick={handleNewGame}
							variant="outline"
							className="flex-1 gap-2 border-green-200 bg-white text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-700 dark:bg-slate-800 dark:text-green-400 dark:hover:bg-green-900/20 dark:hover:text-green-300"
						>
							<RefreshCw className="h-4 w-4" />
							Yeni Oyun
						</Button>
					</div>

					{/* Game ID for sharing */}
					{currentProgram.id !== undefined && (
						<p className="text-center text-gray-400 text-xs dark:text-gray-500">Oyun #{currentProgram.id}</p>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
