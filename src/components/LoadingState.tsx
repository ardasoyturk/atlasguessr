"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Program } from "@/lib/gameData";

interface LoadingStateProps {
	isLoading: boolean;
	currentProgram: Program | undefined;
}

export function LoadingState({ isLoading, currentProgram }: LoadingStateProps) {
	if (isLoading) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<Card className="w-full max-w-md">
					<CardContent className="pt-6 text-center">
						<div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
						<p className="text-lg">Veriler yükleniyor...</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!currentProgram) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<Card className="w-full max-w-md">
					<CardContent className="pt-6 text-center">
						<p className="text-lg text-red-600">Veri yüklenirken hata oluştu.</p>
						<Button onClick={() => window.location.reload()} className="mt-4">
							Yeniden Dene
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return null;
}
