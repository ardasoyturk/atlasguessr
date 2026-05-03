"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, type RefObject } from "preact/compat";

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
	onUniversityInputFocus: () => void;
	onProgramChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onUniversitySelect: (suggestion: string) => void;
	onProgramSelect: (suggestion: string) => void;
	onSubmit: () => void;
	onProgramInputFocus: () => void;
	onProgramInputMouseDown?: () => void;
	answerSubmitted?: boolean;
	rankingType?: string | null;
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
	onUniversityInputFocus,
	onProgramChange,
	onUniversitySelect,
	onProgramSelect,
	onSubmit,
	onProgramInputFocus,
	onProgramInputMouseDown,
	answerSubmitted = false,
	rankingType = null,
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
		<Card className="border-border/80 bg-card/96 shadow-sm">
			<CardHeader className="border-border/70 border-b pb-4">
				<CardTitle className="text-xl">Tahmin</CardTitle>
			</CardHeader>
			<CardContent className="space-y-5">
				<div>
					<label
						htmlFor="university-guess"
						className="mb-2 flex items-center gap-2 font-medium text-muted-foreground text-sm"
					>
						<span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-500" />
						Üniversite
					</label>
					<Input
						id="university-guess"
						ref={universityInputRef}
						value={universityGuess}
						onChange={onUniversityChange}
						onFocus={onUniversityInputFocus}
						placeholder="Örn: BOĞAZİÇİ ÜNİVERSİTESİ"
						className={
							universityCorrect
								? "border-emerald-300/70 bg-emerald-500/[0.08] dark:border-emerald-500/30"
								: "border-sky-200/70 bg-sky-500/[0.05] focus-visible:border-sky-400 dark:border-sky-500/25"
						}
						disabled={gameWon || answerSubmitted}
						autoComplete="off"
					/>
					{filteredUniversitySuggestions.length > 0 && (
						<div className="mt-2 max-h-52 w-full overflow-y-auto rounded-lg border border-sky-200/70 bg-sky-500/[0.05] dark:border-sky-500/25">
							{filteredUniversitySuggestions.map((suggestion) => (
								<button
									key={suggestion}
									className="w-full border-sky-200/70 border-b p-2.5 text-left text-sm last:border-b-0 hover:bg-sky-500/[0.12] dark:border-sky-500/25"
									type="button"
									onClick={() => onUniversitySelect(suggestion)}
								>
									{suggestion}
								</button>
							))}
						</div>
					)}
				</div>

				<div>
					<label
						htmlFor="program-guess"
						className="mb-2 flex items-center gap-2 font-medium text-muted-foreground text-sm"
					>
						<span className="inline-block h-1.5 w-1.5 rounded-full bg-violet-500" />
						Program
					</label>
					<div className="relative">
						<Input
							id="program-guess"
							ref={programInputRef}
							value={programGuess}
							onChange={onProgramChange}
							onFocus={onProgramInputFocus}
							onMouseDown={onProgramInputMouseDown}
							placeholder={
								rankingType === "Sözel"
									? "Örn: Türk Dili ve Edebiyatı"
									: rankingType === "Eşit Ağırlık"
										? "Örn: Hukuk"
										: rankingType === "Yabancı Dil"
											? "Örn: İngiliz Dili ve Edebiyatı"
											: "Örn: Bilgisayar Mühendisliği"
							}
							className={
								programCorrect
									? "border-emerald-300/70 bg-emerald-500/[0.08] pr-9 dark:border-emerald-500/30"
									: "border-violet-200/70 bg-violet-500/[0.05] pr-9 focus-visible:border-violet-400 dark:border-violet-500/25"
							}
							disabled={gameWon || answerSubmitted}
							onKeyDown={(e) => e.key === "Enter" && onSubmit()}
							autoComplete="off"
						/>
						<button
							type="button"
							aria-label="Program listesi"
							className="-translate-y-1/2 absolute top-1/2 right-2 rounded-md p-1 text-muted-foreground hover:bg-secondary"
							onClick={() => {
								if (programInputRef.current) {
									programInputRef.current.focus();
								}
								onProgramInputMouseDown?.();
								onProgramInputFocus();
							}}
						>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
								<title>Açılır menü oku</title>
								<path
									d="M4.5 6.5L8 10L11.5 6.5"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>
					</div>
					{filteredProgramSuggestions.length > 0 && showProgramDropdown && (
						<div
							ref={programDropdownRef}
							className="mt-2 max-h-52 w-full overflow-y-auto rounded-lg border border-violet-200/70 bg-violet-500/[0.05] dark:border-violet-500/25"
						>
							{filteredProgramSuggestions.map((suggestion) => (
								<button
									key={suggestion}
									className="w-full border-violet-200/70 border-b p-2.5 text-left text-sm last:border-b-0 hover:bg-violet-500/[0.12] dark:border-violet-500/25"
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
					disabled={!universityGuess.trim() || !programGuess.trim() || gameWon || answerSubmitted}
					className="w-full bg-[linear-gradient(135deg,oklch(0.53_0.14_255),oklch(0.47_0.12_285))] text-white hover:opacity-95"
				>
					Tahmini Kontrol Et
				</Button>
			</CardContent>
		</Card>
	);
}
