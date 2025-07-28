"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";
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
	showProgramDropdown: boolean;
	setShowProgramDropdown: React.Dispatch<React.SetStateAction<boolean>>;
	universityInputRef: RefObject<HTMLInputElement | null>;
	programInputRef: RefObject<HTMLInputElement | null>;
	onUniversityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onProgramChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onUniversitySelect: (suggestion: string) => void;
	onProgramSelect: (suggestion: string) => void;
	onSubmit: () => void;
	onProgramInputFocus: () => void;
	onProgramInputMouseDown?: () => void;
	allProgramNames: string[]; // Add this prop
	programsForSelectedUniversity: string[];
}

export function InputForm({
	universityGuess,
	programGuess,
	universityCorrect,
	programCorrect,
	gameWon,
	filteredUniversitySuggestions,
	filteredProgramSuggestions,
	showProgramDropdown,
	setShowProgramDropdown,
	universityInputRef,
	programInputRef,
	onUniversityChange,
	onProgramChange,
	onUniversitySelect,
	onProgramSelect,
	onSubmit,
	onProgramInputFocus,
	onProgramInputMouseDown,
	allProgramNames = [], // Default to empty array
	programsForSelectedUniversity = [],
}: InputFormProps) {
	const programDropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!showProgramDropdown) return;
		function handleClickOutside(event: MouseEvent) {
			if (programDropdownRef.current && !programDropdownRef.current.contains(event.target as Node)) {
				setShowProgramDropdown(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showProgramDropdown, setShowProgramDropdown]);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg sm:text-xl">Tahmininizi Yapın</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3 sm:space-y-4">
				<div className="relative">
					<label htmlFor="university-guess" className="mb-2 block font-medium text-sm">
						Üniversite Adı
					</label>
					<Input
						id="university-guess"
						ref={universityInputRef}
						value={universityGuess}
						onChange={onUniversityChange}
						placeholder="Örn: BOĞAZİÇİ ÜNİVERSİTESİ"
						className={
							universityCorrect ? "border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-900/20" : ""
						}
						disabled={gameWon}
						autoComplete="off"
					/>
					{filteredUniversitySuggestions.length > 0 && (
						<div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-800">
							{filteredUniversitySuggestions.map((suggestion) => (
								<button
									key={suggestion}
									className="w-full cursor-pointer p-2 text-left text-sm hover:bg-gray-100 sm:text-base dark:text-gray-200 dark:hover:bg-slate-700"
									type="button"
									onClick={() => onUniversitySelect(suggestion)}
								>
									{suggestion}
								</button>
							))}
						</div>
					)}
				</div>

				<div className="relative">
					<label htmlFor="program-guess" className="mb-2 block font-medium text-sm">
						Program Adı
					</label>
					<div className="relative">
						<Input
							id="program-guess"
							ref={programInputRef}
							value={programGuess}
							onChange={onProgramChange}
							onFocus={onProgramInputFocus}
							onMouseDown={onProgramInputMouseDown}
							placeholder="Örn: Bilgisayar Mühendisliği (4 Yıllık)"
							className={
								programCorrect ? "border-green-500 bg-green-50 pr-8 dark:border-green-400 dark:bg-green-900/20" : "pr-8"
							}
							disabled={gameWon}
							onKeyPress={(e) => e.key === "Enter" && onSubmit()}
							autoComplete="off"
						/>
						<button
							type="button"
							aria-label="Açılır menüyü göster"
							className="-translate-y-1/2 absolute top-1/2 right-3 m-0 cursor-pointer border-none bg-transparent p-0 text-gray-400 dark:text-gray-300"
							style={{
								fontWeight: 400,
								fontSize: "1.2rem",
								opacity: 0.7,
								lineHeight: 0,
							}}
							onClick={() => {
								if (programInputRef.current) {
									programInputRef.current.focus();
								}
								if (typeof onProgramInputMouseDown === "function") {
									onProgramInputMouseDown();
								}
								if (typeof onProgramInputFocus === "function") {
									onProgramInputFocus();
								}
							}}
						>
							<svg
								width="18"
								height="18"
								viewBox="0 0 18 18"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								style={{ display: "block" }}
							>
								<title>Açılır menü oku</title>
								<path
									d="M5 7L9 11L13 7"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>
					</div>
					{/* Always show dropdown if there are suggestions and showProgramDropdown is true */}
					{filteredProgramSuggestions.length > 0 && showProgramDropdown && (
						<div
							ref={programDropdownRef}
							className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-800"
						>
							{filteredProgramSuggestions.map((suggestion) => (
								<button
									key={suggestion}
									className="w-full cursor-pointer p-2 text-left text-sm hover:bg-gray-100 sm:text-base dark:text-gray-200 dark:hover:bg-slate-700"
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
					disabled={!universityGuess.trim() || !programGuess.trim() || gameWon}
					className="w-full text-sm sm:text-base"
				>
					Tahmin Et
				</Button>
			</CardContent>
		</Card>
	);
}
