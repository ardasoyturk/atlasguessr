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
				<div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3">
					<MapPin className="h-4 w-4 text-blue-600" />
					<span className="font-medium">Şehir:</span>
					<span className="text-blue-700">
						{currentProgram.cityName}
					</span>
				</div>

				<div className="flex items-center gap-2 rounded-lg bg-green-50 p-3">
					<University className="h-4 w-4 text-green-600" />
					<span className="font-medium">Üniversite Türü:</span>
					<span className="text-green-700">
						{currentProgram.programType}
					</span>
				</div>

				<div className="flex items-center gap-2 rounded-lg bg-purple-50 p-3">
					<DollarSign className="h-4 w-4 text-purple-600" />
					<span className="font-medium">Ücret Durumu:</span>
					<span className="text-purple-700">
						{currentProgram.scholarshipType}
					</span>
				</div>

				<div className="rounded-lg bg-yellow-50 p-3">
					<div className="mb-2 flex items-center gap-2">
						<Trophy className="h-4 w-4 text-yellow-600" />
						<span className="font-medium">
							Son Yerleşen Sıralamaları (4 Yıl):
						</span>
					</div>
					<ul className="list-inside list-disc text-sm text-yellow-700">
						{currentProgram.rank.map((r: string, i: number) => (
							<li key={r}>
								{2024 - i}: {r}
							</li>
						))}
					</ul>
				</div>

				<div className="flex items-center gap-2 rounded-lg bg-orange-50 p-3">
					<ListOrdered className="h-4 w-4 text-orange-600" />
					<span className="font-medium">Sıralama Türü:</span>
					<span className="text-orange-700">
						{currentProgram.rankingType}
					</span>
				</div>
			</CardContent>
		</Card>
	);
}
