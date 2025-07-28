"use client";

import type React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type RankingType = "Sayısal" | "Eşit Ağırlık" | "Sözel" | "Yabancı Dil" | "Rastgele";

interface RankingTypeSelectorProps {
	onSelectRankingType: (rankingType: RankingType) => void;
}

export function RankingTypeSelector({ onSelectRankingType }: RankingTypeSelectorProps) {
	const rankingTypes: { type: RankingType; description: string; emoji: string }[] = [
		{
			type: "Sayısal",
			description: "Mühendislik, Tıp, Fen Bilimleri",
			emoji: "🔢",
		},
		{
			type: "Eşit Ağırlık",
			description: "İktisat, İşletme, Hukuk",
			emoji: "⚖️",
		},
		{
			type: "Sözel",
			description: "Edebiyat, Tarih, Sosyoloji",
			emoji: "📚",
		},
		{
			type: "Yabancı Dil",
			description: "İngilizce, Almanca, Fransızca",
			emoji: "🌍",
		},
		{
			type: "Rastgele",
			description: "Tüm sıralama türlerinden",
			emoji: "🎲",
		},
	];

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<Card className="w-full max-w-2xl">
				<CardHeader className="text-center">
					<CardTitle className="text-3xl font-bold text-gray-800">
						AtlasGuessr
					</CardTitle>
					<CardDescription className="text-lg text-gray-600">
						Sıralama türünü seçin
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{rankingTypes.map((rankingTypeInfo) => (
						<Button
							key={rankingTypeInfo.type}
							variant="outline"
							className="flex h-auto w-full items-center justify-between p-6 text-left transition-all duration-200 hover:border-blue-300 hover:bg-blue-50"
							onClick={() => onSelectRankingType(rankingTypeInfo.type)}
						>
							<div className="flex items-center space-x-4">
								<span className="text-2xl">{rankingTypeInfo.emoji}</span>
								<div>
									<div className="text-lg font-semibold text-gray-800">
										{rankingTypeInfo.type}
									</div>
									<div className="text-sm text-gray-500">
										{rankingTypeInfo.description}
									</div>
								</div>
							</div>
							<div className="text-gray-400">→</div>
						</Button>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
