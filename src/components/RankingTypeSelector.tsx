"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type React from "react";
import { useState } from "react";

export type RankingType = "Sayısal" | "Eşit Ağırlık" | "Sözel" | "Yabancı Dil" | "Rastgele";

interface RankingTypeSelectorProps {
	onSelectRankingType: (rankingType: RankingType) => void;
}

export function RankingTypeSelector({ onSelectRankingType }: RankingTypeSelectorProps) {
	const [selectedType, setSelectedType] = useState<RankingType | null>(null);
	const [isAnimating, setIsAnimating] = useState(false);

	const rankingTypes: {
		type: RankingType;
		description: string;
		emoji: string;
		gradient: string;
	}[] = [
		{
			type: "Sayısal",
			description: "Mühendislik, Tıp, Fen Bilimleri vb.",
			emoji: "🔢",
			gradient: "from-blue-500 to-indigo-600",
		},
		{
			type: "Eşit Ağırlık",
			description: "İktisat, İşletme, Hukuk vb.",
			emoji: "⚖️",
			gradient: "from-green-500 to-emerald-600",
		},
		{
			type: "Sözel",
			description: "Edebiyat, Tarih, Sosyoloji vb.",
			emoji: "📚",
			gradient: "from-purple-500 to-violet-600",
		},
		{
			type: "Yabancı Dil",
			description: "İngilizce, Almanca, Fransızca vb.",
			emoji: "🌍",
			gradient: "from-orange-500 to-red-600",
		},
		{
			type: "Rastgele",
			description: "Tüm sıralama türlerinden, her bölüm",
			emoji: "🎲",
			gradient: "from-pink-500 to-rose-600",
		},
	];

	const handleSelection = async (rankingType: RankingType) => {
		if (isAnimating) return;

		setSelectedType(rankingType);
		setIsAnimating(true);

		// Wait for selection animation to complete
		await new Promise((resolve) => setTimeout(resolve, 150));

		// Trigger the actual selection
		onSelectRankingType(rankingType);
	};

	return (
		<div className="flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-2 sm:p-4 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
			{/* Animated background elements */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="-left-4 -top-4 absolute h-72 w-72 animate-pulse rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 mix-blend-multiply blur-xl filter dark:from-blue-400/10 dark:to-purple-400/10 dark:mix-blend-screen" />
				<div
					className="-bottom-8 -right-4 absolute h-72 w-72 animate-pulse rounded-full bg-gradient-to-r from-pink-400/20 to-orange-400/20 mix-blend-multiply blur-xl filter dark:from-pink-400/10 dark:to-orange-400/10 dark:mix-blend-screen"
					style={{ animationDelay: "1s" }}
				/>
				<div
					className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-96 w-96 transform animate-pulse rounded-full bg-gradient-to-r from-indigo-400/10 to-cyan-400/10 mix-blend-multiply blur-xl filter dark:from-indigo-400/5 dark:to-cyan-400/5 dark:mix-blend-screen"
					style={{ animationDelay: "2s" }}
				/>
			</div>

			<Card
				className={`w-full max-w-2xl border-white/20 bg-white/90 shadow-2xl backdrop-blur-sm transition-all duration-150 ease-out dark:border-slate-700/50 dark:bg-slate-800/90 ${
					isAnimating ? "scale-95 opacity-80 blur-sm" : "scale-100 opacity-100 blur-0"
				} ${selectedType ? "animate-pulse" : ""}`}
			>
				<CardHeader className="p-4 text-center sm:p-6">
					<CardTitle className="mb-2 animate-fade-in font-bold text-2xl text-gray-800 sm:text-3xl lg:text-4xl dark:text-gray-100">
						<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
							🎓 Atlasguessr
						</span>
					</CardTitle>
					<CardDescription className="animate-fade-in-delay text-base text-gray-600 sm:text-lg dark:text-gray-300">
						Sıralama türünü seçin ve maceranız başlasın! ✨
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3 p-4 sm:space-y-4 sm:p-6">
					{rankingTypes.map((rankingTypeInfo, index) => (
						<Button
							key={rankingTypeInfo.type}
							variant="outline"
							disabled={isAnimating}
							className={`group relative flex h-auto w-full animate-slide-in items-center justify-between p-4 text-left transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] sm:p-6 ${
								selectedType === rankingTypeInfo.type
									? `border-transparent bg-gradient-to-r ${rankingTypeInfo.gradient} scale-105 text-white shadow-2xl`
									: "border-gray-200 bg-white/50 hover:border-gray-300 hover:bg-white/80 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:border-slate-500 dark:hover:bg-slate-700/80"
							}`}
							style={{ animationDelay: `${index * 75}ms` }}
							onClick={() => handleSelection(rankingTypeInfo.type)}
						>
							{/* Animated background gradient */}
							<div
								className={`absolute inset-0 rounded-lg bg-gradient-to-r ${rankingTypeInfo.gradient} opacity-0 transition-opacity duration-150 group-hover:opacity-10 dark:group-hover:opacity-20`}
							/>

							{/* Shimmer effect */}
							<div className="-skew-x-12 absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:animate-shimmer group-hover:opacity-100 dark:via-slate-100/20" />

							<div className="relative z-10 flex items-center space-x-3 sm:space-x-4">
								<span
									className={`text-2xl transition-all duration-150 group-hover:scale-110 sm:text-3xl ${
										selectedType === rankingTypeInfo.type ? "animate-bounce" : "group-hover:animate-pulse"
									}`}
								>
									{rankingTypeInfo.emoji}
								</span>
								<div>
									<div
										className={`font-semibold text-base transition-colors duration-150 sm:text-lg ${
											selectedType === rankingTypeInfo.type
												? "text-white"
												: "text-gray-800 group-hover:text-gray-900 dark:text-gray-100 dark:group-hover:text-white"
										}`}
									>
										{rankingTypeInfo.type}
									</div>
									<div
										className={`text-xs transition-colors duration-150 sm:text-sm ${
											selectedType === rankingTypeInfo.type
												? "text-white/90"
												: "text-gray-500 group-hover:text-gray-600 dark:text-gray-300 dark:group-hover:text-gray-200"
										}`}
									>
										{rankingTypeInfo.description}
									</div>
								</div>
							</div>
							<div
								className={`relative transition-all duration-150 group-hover:translate-x-1 ${
									selectedType === rankingTypeInfo.type
										? "animate-pulse text-white"
										: "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
								}`}
							>
								→
							</div>

							{/* Selection checkmark */}
							{selectedType === rankingTypeInfo.type && (
								<div className="absolute top-2 right-2 animate-bounce text-white">✓</div>
							)}
						</Button>
					))}

					{/* Loading indicator */}
					{selectedType && (
						<div className="flex animate-fade-in items-center justify-center space-x-2 py-3 sm:py-4">
							<div className="h-2 w-2 animate-ping rounded-full bg-blue-500" />
							<div className="h-2 w-2 animate-ping rounded-full bg-purple-500" style={{ animationDelay: "0.2s" }} />
							<div className="h-2 w-2 animate-ping rounded-full bg-pink-500" style={{ animationDelay: "0.4s" }} />
							<span className="ml-2 font-medium text-gray-600 text-sm sm:text-base dark:text-gray-300">
								Oyun yükleniyor...
							</span>
						</div>
					)}
				</CardContent>
			</Card>

			<style jsx>{`
				@keyframes fade-in {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				@keyframes fade-in-delay {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				@keyframes slide-in {
					from {
						opacity: 0;
						transform: translateX(-30px);
					}
					to {
						opacity: 1;
						transform: translateX(0);
					}
				}
				@keyframes shimmer {
					0% {
						transform: translateX(-100%);
					}
					100% {
						transform: translateX(100%);
					}
				}
				.animate-fade-in {
					animation: fade-in 0.6s ease-out;
				}
				.animate-fade-in-delay {
					animation: fade-in-delay 0.8s ease-out 0.2s both;
				}
				.animate-slide-in {
					animation: slide-in 0.6s ease-out;
				}
				.animate-shimmer {
					animation: shimmer 1.5s ease-in-out;
				}
			`}</style>
		</div>
	);
}
