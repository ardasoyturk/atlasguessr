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
			<DialogContent className="mx-2 w-full max-w-md rounded-xl border-amber-200 bg-gradient-to-b from-amber-50 to-white p-0 shadow-2xl sm:mx-4">
				{/* Warning Header */}
				<div className="rounded-md bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-6 text-center text-white sm:px-6 sm:py-8">
					<div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm sm:mb-3 sm:h-16 sm:w-16">
						<Eye className="h-6 w-6 sm:h-8 sm:w-8" />
					</div>
					<DialogHeader>
						<DialogTitle className="font-bold text-white text-xl sm:text-2xl">🤔 Cevabı Görmek İstiyorsun?</DialogTitle>
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
							<div className="rounded-lg bg-amber-50 p-4 text-center">
								<p className="mb-2 font-medium text-amber-800">Emin misin? 🤯</p>
								<p className="text-amber-700 text-sm">
									Cevabı gördükten sonra oyun bitecek ve yeni oyuna geçmen gerekecek.
									{attempts === 0 && " Bence hiç denemeden pes etme!"}
								</p>
							</div>

							{/* Encouragement for attempts */}
							{attempts < 3 && (
								<div className="rounded-lg bg-blue-50 p-4 text-center">
									<p className="mb-2 font-medium text-blue-800">💪 Biraz daha dene!</p>
									<p className="text-blue-700 text-sm">
										İpuçları oldukça detaylı. Belki bir kaç tahmin daha yapabilirsin?
									</p>
								</div>
							)}

							{/* Action Buttons */}
							<div className="flex gap-2">
								<Button onClick={() => setShowHint(true)} className="flex-1 gap-2 bg-amber-600 hover:bg-amber-700">
									<Eye className="h-4 w-4" />
									Evet, Göster
								</Button>
								<Button
									onClick={handleClose}
									variant="outline"
									className="flex-1 gap-2 border-green-200 hover:bg-green-50"
								>
									<X className="h-4 w-4" />
									Vazgeç
								</Button>
							</div>
						</>
					) : (
						<>
							{/* Answer Display */}
							<div className="space-y-3">
								<div className="rounded-lg bg-blue-50 p-4">
									<div className="flex items-center gap-2 text-blue-800">
										<span className="text-lg">🏛️</span>
										<div>
											<p className="font-medium text-blue-600 text-xs">ÜNİVERSİTE</p>
											<p className="font-semibold leading-tight">{currentProgram.universityName}</p>
										</div>
									</div>
								</div>

								<div className="rounded-lg bg-purple-50 p-4">
									<div className="flex items-center gap-2 text-purple-800">
										<span className="text-lg">📚</span>
										<div>
											<p className="font-medium text-purple-600 text-xs">PROGRAM</p>
											<p className="font-semibold leading-tight">{currentProgram.programName}</p>
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

							{/* Game Over Message */}
							<div className="rounded-lg bg-gray-50 p-4 text-center">
								<p className="mb-2 font-medium text-gray-700">🎮 Oyun Bitti!</p>
								<p className="text-gray-600 text-sm">
									Cevabı gördün ve oyun bitti. Şimdi yeni bir oyun başlatabilirsin.
								</p>
							</div>

							{/* New Game Button */}
							<Button onClick={handleNewGame} className="w-full gap-2 bg-green-600 hover:bg-green-700">
								<EyeOff className="h-4 w-4" />
								Yeni Oyun Başlat
							</Button>
						</>
					)}

					{/* Game ID */}
					{currentProgram.id !== undefined && (
						<p className="text-center text-gray-400 text-xs">Oyun #{currentProgram.id}</p>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
