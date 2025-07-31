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
	// No animation or preloader state

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

	const handleSelection = (rankingType: RankingType) => {
		onSelectRankingType(rankingType);
	};

	return (
		<div className="flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 p-2 sm:p-4 dark:bg-slate-900">
			<Card className="fade-in slide-in-from-bottom-4 w-full max-w-2xl animate-in border-white/20 bg-white/90 shadow-2xl backdrop-blur-sm duration-700 dark:border-slate-700/50 dark:bg-slate-800/90">
				<CardHeader className="p-4 text-center sm:p-6">
					<CardTitle className="fade-in slide-in-from-top-2 mb-2 animate-in font-bold text-2xl text-gray-800 duration-500 sm:text-3xl lg:text-4xl dark:text-gray-100">
						<span className="text-blue-600 dark:text-blue-400">🎓 Atlasguessr</span>
					</CardTitle>
					<CardDescription className="fade-in slide-in-from-top-2 animate-in text-base text-gray-600 delay-150 duration-500 sm:text-lg dark:text-gray-300">
						Sıralama türünü seçin ve maceranız başlasın! ✨
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3 p-4 sm:space-y-4 sm:p-6">
					{rankingTypes.map((rankingTypeInfo, index) => (
						<Button
							key={rankingTypeInfo.type}
							variant="outline"
							className={
								"group fade-in slide-in-from-left-3 relative flex h-auto w-full animate-in cursor-pointer items-center justify-between border-gray-200 bg-white/50 p-4 text-left transition-all duration-300 ease-out hover:scale-[1.02] hover:border-gray-300 hover:bg-white/80 hover:shadow-lg active:scale-[0.98] sm:p-6 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:border-slate-500 dark:hover:bg-slate-600/60 dark:hover:shadow-xl"
							}
							style={{
								animationDelay: `${index * 100 + 300}ms`,
								animationDuration: "600ms",
							}}
							onClick={() => handleSelection(rankingTypeInfo.type)}
						>
							{/* Gradient background that appears on hover */}
							<div
								className={`absolute inset-0 rounded-md bg-gradient-to-r ${rankingTypeInfo.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
							/>

							<div className="relative z-10 flex items-center space-x-3 sm:space-x-4">
								<span className="text-2xl transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 sm:text-3xl">
									{rankingTypeInfo.emoji}
								</span>
								<div>
									<div className="font-semibold text-base text-gray-800 transition-colors duration-300 group-hover:text-gray-900 sm:text-lg dark:text-gray-100 dark:group-hover:text-white">
										{rankingTypeInfo.type}
									</div>
									<div className="text-gray-500 text-xs transition-colors duration-300 group-hover:text-gray-600 sm:text-sm dark:text-gray-300 dark:group-hover:text-gray-200">
										{rankingTypeInfo.description}
									</div>
								</div>
							</div>
							<div className="relative text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300">
								→
							</div>
						</Button>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
