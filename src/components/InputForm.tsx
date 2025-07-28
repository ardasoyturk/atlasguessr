"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type React from "react";
import type { RefObject } from "react";

interface InputFormProps {
	universityGuess: string;
	programGuess: string;
	universityCorrect: boolean;
	programCorrect: boolean;
	gameWon: boolean;
	filteredUniversitySuggestions: string[];
	filteredProgramSuggestions: string[];
	universityInputRef: RefObject<HTMLInputElement | null>;
	programInputRef: RefObject<HTMLInputElement | null>;
	onUniversityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onProgramChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onUniversitySelect: (suggestion: string) => void;
	onProgramSelect: (suggestion: string) => void;
	onSubmit: () => void;
}

export function InputForm({
	universityGuess,
	programGuess,
	universityCorrect,
	programCorrect,
	gameWon,
	filteredUniversitySuggestions,
	filteredProgramSuggestions,
	universityInputRef,
	programInputRef,
	onUniversityChange,
	onProgramChange,
	onUniversitySelect,
	onProgramSelect,
	onSubmit,
}: InputFormProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Tahmininizi Yapın</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="relative">
					<label
						htmlFor="university-guess"
						className="mb-2 block font-medium text-sm"
					>
						Üniversite Adı
					</label>
					<Input
						id="university-guess"
						ref={universityInputRef}
						value={universityGuess}
						onChange={onUniversityChange}
						placeholder="Örn: BOĞAZİÇİ ÜNİVERSİTESİ"
						className={
							universityCorrect
								? "border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-900/20"
								: ""
						}
						disabled={gameWon}
						autoComplete="off"
					/>
					{filteredUniversitySuggestions.length > 0 && (
						<div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-800">
							{filteredUniversitySuggestions.map((suggestion) => (
								<button
									key={suggestion}
									className="w-full cursor-pointer p-2 text-left hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-700"
									type="button"
									onClick={() =>
										onUniversitySelect(suggestion)
									}
								>
									{suggestion}
								</button>
							))}
						</div>
					)}
				</div>

				<div className="relative">
					<label
						htmlFor="program-guess"
						className="mb-2 block font-medium text-sm"
					>
						Program Adı
					</label>
					<Input
						id="program-guess"
						ref={programInputRef}
						value={programGuess}
						onChange={onProgramChange}
						placeholder="Örn: Bilgisayar Mühendisliği (4 Yıllık)"
						className={
							programCorrect
								? "border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-900/20"
								: ""
						}
						disabled={gameWon}
						onKeyPress={(e) => e.key === "Enter" && onSubmit()}
						autoComplete="off"
					/>
					{filteredProgramSuggestions.length > 0 && (
						<div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-800">
							{filteredProgramSuggestions.map((suggestion) => (
								<button
									key={suggestion}
									className="w-full cursor-pointer p-2 text-left hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-700"
									type="button"
									onClick={() => onProgramSelect(suggestion)}
								>
									{suggestion}
								</button>
							))}
						</div>
					)}
				</div>

				<Button
					onClick={onSubmit}
					disabled={
						!universityGuess.trim() ||
						!programGuess.trim() ||
						gameWon
					}
					className="w-full"
				>
					Tahmin Et
				</Button>
			</CardContent>
		</Card>
	);
}
