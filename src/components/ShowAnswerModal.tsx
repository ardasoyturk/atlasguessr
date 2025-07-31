"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Program } from "@/lib/gameData";
import { Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";

interface ShowAnswerModalProps {
	isOpen: boolean;
	onClose: () => void;
	currentProgram: Program;
	onNewGame: () => void;
	attempts: number;
}

export function ShowAnswerModal({ isOpen, onClose, currentProgram, onNewGame, attempts }: ShowAnswerModalProps) {
	const [showHint, setShowHint] = useState(false);

	const handleNewGame = () => {
		onNewGame();
		onClose();
		setShowHint(false);
	};

	const handleClose = () => {
		// If the answer was shown, automatically start a new game
		if (showHint) {
			onNewGame();
		}
		onClose();
		setShowHint(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="mx-2 w-full max-w-md rounded-xl border-amber-200 bg-amber-50 p-0 shadow-2xl sm:mx-4 dark:border-amber-800 dark:bg-slate-800">
				{/* Warning Header */}
				<div className="rounded-md bg-amber-500 px-4 py-6 text-center text-white sm:px-6 sm:py-8 dark:bg-amber-600">
					<div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm sm:mb-3 sm:h-16 sm:w-16">
						<Eye className="h-6 w-6 sm:h-8 sm:w-8" />
					</div>
					<DialogHeader>
						<DialogTitle className="font-bold text-white text-xl sm:text-2xl">
							🤔Cevabı görmek mi istiyorsun?
						</DialogTitle>
						<DialogDescription className="text-amber-100">
							Görünüşe göre {attempts > 0 ? `${attempts} deneme sonrası` : "hiç denemeden"} cevabı görmek istiyorsun.
						</DialogDescription>
					</DialogHeader>
				</div>

				{/* Content */}
				<div className="space-y-3 p-4 sm:space-y-4 sm:p-6">
					{!showHint ? (
						<>
							{/* Warning Message */}
							{/* Warning Message */}
							<div className="rounded-lg bg-amber-50 p-4 text-center dark:border dark:border-amber-500/30 dark:bg-amber-900/20">
								<p className="mb-2 font-medium text-amber-800 dark:text-amber-200">Emin misin?</p>
								<p className="text-amber-700 text-sm dark:text-amber-300">
									Cevabı gördükten sonra oyun bitecek ve yeni oyuna geçmen gerekecek.
									{attempts === 0 && " Bence hiç denemeden pes etme!"}
								</p>
							</div>
							{/* Encouragement for attempts */}
							{attempts < 3 && (
								<div className="rounded-lg bg-blue-50 p-4 text-center dark:border dark:border-blue-500/30 dark:bg-blue-900/20">
									<p className="mb-2 font-medium text-blue-800 dark:text-blue-200">Bence biraz daha denemelisin.</p>
									<p className="text-blue-700 text-sm dark:text-blue-300">
										İpuçları oldukça detaylı. Belki bir kaç tahmin daha yapabilirsin, şansını denemeye ne dersin?
									</p>
								</div>
							)}{" "}
							{/* Action Buttons */}
							<div className="flex gap-2">
								<Button
									onClick={() => setShowHint(true)}
									className="group flex-1 gap-2 bg-amber-600 text-white transition-all duration-300 hover:scale-105 hover:bg-amber-700 hover:shadow-lg active:scale-95 dark:bg-amber-600 dark:hover:bg-amber-700"
								>
									<Eye className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
									Evet, göster
								</Button>
								<Button
									onClick={handleClose}
									variant="outline"
									className="group flex-1 gap-2 border-green-200 bg-white text-green-700 transition-all duration-300 hover:scale-105 hover:bg-green-50 hover:text-green-800 hover:shadow-lg active:scale-95 dark:border-green-700 dark:bg-slate-800 dark:text-green-400 dark:hover:bg-green-900/20 dark:hover:text-green-300"
								>
									<X className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
									Vazgeç
								</Button>
							</div>
						</>
					) : (
						<>
							{/* Answer Display */}
							<div className="space-y-3">
								<div className="fade-in slide-in-from-left-3 animate-in rounded-lg bg-blue-50 p-4 duration-500 dark:border dark:border-blue-500/30 dark:bg-blue-900/20">
									<div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
										<span className="text-lg">🏛️</span>
										<div>
											<p className="font-medium text-blue-600 text-xs dark:text-blue-400">ÜNİVERSİTE</p>
											<p className="font-semibold leading-tight dark:text-blue-100">{currentProgram.universityName}</p>
										</div>
									</div>
								</div>

								<div className="fade-in slide-in-from-left-3 animate-in rounded-lg bg-purple-50 p-4 delay-150 duration-500 dark:border dark:border-purple-500/30 dark:bg-purple-900/20">
									<div className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
										<span className="text-lg">📚</span>
										<div>
											<p className="font-medium text-purple-600 text-xs dark:text-purple-400">PROGRAM</p>
											<p className="font-semibold leading-tight dark:text-purple-100">{currentProgram.programName}</p>
										</div>
									</div>
								</div>

								<div className="fade-in slide-in-from-left-3 animate-in rounded-lg bg-orange-50 p-4 delay-300 duration-500 dark:border dark:border-orange-500/30 dark:bg-orange-900/20">
									<div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
										<span className="text-lg">📍</span>
										<div>
											<p className="font-medium text-orange-600 text-xs dark:text-orange-400">ŞEHİR</p>
											<p className="font-semibold dark:text-orange-100">{currentProgram.cityName}</p>
										</div>
									</div>
								</div>
							</div>

							{/* Game Over Message */}
							<div className="rounded-lg bg-gray-50 p-4 text-center dark:border dark:border-slate-600 dark:bg-slate-800">
								<p className="mb-2 font-medium text-gray-700 dark:text-gray-200">🎮 Oyun Bitti!</p>
								<p className="text-gray-600 text-sm dark:text-gray-300">
									Cevabı gördün ve oyun bitti. Şimdi yeni bir oyun başlatabilirsin.
								</p>
							</div>

							{/* New Game Button */}
							<Button
								onClick={handleNewGame}
								className="group w-full gap-2 bg-green-600 text-white transition-all duration-300 hover:scale-105 hover:bg-green-700 hover:shadow-lg active:scale-95 dark:bg-green-600 dark:hover:bg-green-700"
							>
								<EyeOff className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
								Yeni Oyun Başlat
							</Button>
						</>
					)}

					{/* Game ID */}
					{currentProgram.id !== undefined && (
						<p className="text-center text-gray-400 text-xs dark:text-gray-500">Oyun #{currentProgram.id}</p>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
