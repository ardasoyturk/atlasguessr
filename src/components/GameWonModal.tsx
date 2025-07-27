"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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

🔗 atlasguessr.com`;
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
			<DialogContent className="mx-4 w-full max-w-md rounded-xl border-green-200 bg-gradient-to-b from-green-50 to-white p-0 shadow-2xl">
				{/* Celebration Header */}
				<div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-8 text-center text-white">
					<div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
						<CheckCircle className="h-8 w-8" />
					</div>
					<DialogHeader>
						<DialogTitle className="font-bold text-2xl text-white">
							🎉 Tebrikler!
						</DialogTitle>
						<DialogDescription className="text-green-100">
							{attempts} denemede başardınız!
						</DialogDescription>
					</DialogHeader>
				</div>

				{/* Game Result Details */}
				<div className="space-y-4 p-6">
					{/* University and Program */}
					<div className="space-y-3">
						<div className="rounded-lg bg-blue-50 p-4">
							<div className="flex items-center gap-2 text-blue-800">
								<span className="text-lg">🏛️</span>
								<div>
									<p className="font-medium text-blue-600 text-xs">
										ÜNİVERSİTE
									</p>
									<p className="font-semibold leading-tight">
										{currentProgram.universityName}
									</p>
								</div>
							</div>
						</div>

						<div className="rounded-lg bg-purple-50 p-4">
							<div className="flex items-center gap-2 text-purple-800">
								<span className="text-lg">📚</span>
								<div>
									<p className="font-medium text-purple-600 text-xs">PROGRAM</p>
									<p className="font-semibold leading-tight">
										{currentProgram.programName}
									</p>
								</div>
							</div>
						</div>

						<div className="rounded-lg bg-orange-50 p-4">
							<div className="flex items-center gap-2 text-orange-800">
								<span className="text-lg">📍</span>
								<div>
									<p className="font-medium text-orange-600 text-xs">ŞEHİR</p>
									<p className="font-semibold">{currentProgram.cityName}</p>
								</div>
							</div>
						</div>
					</div>

					{/* Attempt History Visualization */}
					<div className="rounded-lg bg-gray-50 p-4">
						<p className="mb-3 text-center font-medium text-gray-600 text-sm">
							Tahmin Geçmişi
						</p>
						<div className="flex flex-wrap justify-center gap-3">
							{guessHistory.map((guess, index) => (
								<div
									key={`${guess.university}-${guess.program}-${index}`}
									className="flex gap-0.5"
									title={`${index + 1}. Tahmin`}
								>
									<div
										className={`h-6 w-6 rounded-sm ${
											guess.universityMatch ? "bg-green-500" : "bg-red-500"
										}`}
									/>
									<div
										className={`h-6 w-6 rounded-sm ${
											guess.programMatch ? "bg-green-500" : "bg-red-500"
										}`}
									/>
								</div>
							))}
						</div>
						<p className="mt-2 text-center text-gray-500 text-xs">
							🟢 Doğru • 🔴 Yanlış
						</p>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-2">
						<Button
							onClick={shareResult}
							className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
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
							className="flex-1 gap-2 border-green-200 hover:bg-green-50"
						>
							<RefreshCw className="h-4 w-4" />
							Yeni Oyun
						</Button>
					</div>

					{/* Game ID for sharing */}
					{currentProgram.gameId !== undefined && (
						<p className="text-center text-gray-400 text-xs">
							Oyun #{currentProgram.gameId}
						</p>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
