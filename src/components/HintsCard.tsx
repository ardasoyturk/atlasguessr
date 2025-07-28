"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Program } from "@/lib/gameData";
import {
	DollarSign,
	GraduationCap,
	ListOrdered,
	MapPin,
	Trophy,
	University,
} from "lucide-react";

interface HintsCardProps {
	currentProgram: Program;
}

export function HintsCard({ currentProgram }: HintsCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<GraduationCap className="h-5 w-5" />
					İpuçları
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 dark:bg-slate-700/50 dark:border dark:border-blue-500/20">
					<MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
					<span className="font-medium text-gray-900 dark:text-gray-100">
						Şehir:
					</span>
					<span className="text-blue-700 dark:text-blue-300">
						{currentProgram.cityName}
					</span>
				</div>

				<div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 dark:bg-slate-700/50 dark:border dark:border-green-500/20">
					<University className="h-4 w-4 text-green-600 dark:text-green-400" />
					<span className="font-medium text-gray-900 dark:text-gray-100">
						Üniversite Türü:
					</span>
					<span className="text-green-700 dark:text-green-300">
						{currentProgram.programType}
					</span>
				</div>

				<div className="flex items-center gap-2 rounded-lg bg-purple-50 p-3 dark:bg-slate-700/50 dark:border dark:border-purple-500/20">
					<DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
					<span className="font-medium text-gray-900 dark:text-gray-100">
						Ücret Durumu:
					</span>
					<span className="text-purple-700 dark:text-purple-300">
						{currentProgram.scholarshipType}
					</span>
				</div>

				<div className="rounded-lg bg-yellow-50 p-3 dark:bg-slate-700/50 dark:border dark:border-yellow-500/20">
					<div className="mb-2 flex items-center gap-2">
						<Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
						<span className="font-medium text-gray-900 dark:text-gray-100">
							Son Yerleşen Sıralamaları (4 Yıl):
						</span>
					</div>
					<ul className="list-inside list-disc text-sm text-yellow-700 dark:text-yellow-300">
						{currentProgram.rank.map((r: string, i: number) => (
							<li key={r}>
								{2024 - i}: {r}
							</li>
						))}
					</ul>
				</div>

				<div className="flex items-center gap-2 rounded-lg bg-orange-50 p-3 dark:bg-slate-700/50 dark:border dark:border-orange-500/20">
					<ListOrdered className="h-4 w-4 text-orange-600 dark:text-orange-400" />
					<span className="font-medium text-gray-900 dark:text-gray-100">
						Sıralama Türü:
					</span>
					<span className="text-orange-700 dark:text-orange-300">
						{currentProgram.rankingType}
					</span>
				</div>
			</CardContent>
		</Card>
	);
}
