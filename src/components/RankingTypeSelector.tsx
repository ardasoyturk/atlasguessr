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
			<Card className="w-full max-w-2xl border-white/20 bg-white/90 shadow-2xl backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90">
				<CardHeader className="p-4 text-center sm:p-6">
					<CardTitle className="mb-2 font-bold text-2xl text-gray-800 sm:text-3xl lg:text-4xl dark:text-gray-100">
						<span className="text-blue-600 dark:text-blue-400">🎓 Atlasguessr</span>
					</CardTitle>
					<CardDescription className="text-base text-gray-600 sm:text-lg dark:text-gray-300">
						Sıralama türünü seçin ve maceranız başlasın! ✨
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3 p-4 sm:space-y-4 sm:p-6">
					{rankingTypes.map((rankingTypeInfo, index) => (
						<Button
							key={rankingTypeInfo.type}
							variant="outline"
							className={
								"group relative flex h-auto w-full items-center justify-between border-gray-200 bg-white/50 p-4 text-left sm:p-6 dark:border-slate-600 dark:bg-slate-700/50"
							}
							onClick={() => handleSelection(rankingTypeInfo.type)}
						>
							<div className="relative z-10 flex items-center space-x-3 sm:space-x-4">
								<span className="text-2xl sm:text-3xl">{rankingTypeInfo.emoji}</span>
								<div>
									<div className="font-semibold text-base text-gray-800 sm:text-lg dark:text-gray-100">
										{rankingTypeInfo.type}
									</div>
									<div className="text-gray-500 text-xs sm:text-sm dark:text-gray-300">
										{rankingTypeInfo.description}
									</div>
								</div>
							</div>
							<div className="relative text-gray-400 dark:text-gray-500">→</div>
						</Button>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
