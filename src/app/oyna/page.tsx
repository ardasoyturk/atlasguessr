"use client";

import type React from "react";

import { ActionButtons } from "@/components/ActionButtons";
import { Footer } from "@/components/Footer";
import { GameInstructions } from "@/components/GameInstructions";
import { GameStats } from "@/components/GameStats";
import { GameWonModal } from "@/components/GameWonModal";
import { GuessHistory } from "@/components/GuessHistory";
import { HintsCard } from "@/components/HintsCard";
import { InputForm } from "@/components/InputForm";
import { LoadingState } from "@/components/LoadingState";
import type { RankingType } from "@/components/RankingTypeSelector";
import { ShowAnswerModal } from "@/components/ShowAnswerModal";
import { type Program, gameDataService } from "@/lib/gameData";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

function OynaPageContent() {
	const router = useRouter();
	const searchParams = useSearchParams();

	// Get ranking type from URL params
	const rankingTypeParam = searchParams.get("siralama");
	const selectedRankingType = rankingTypeParam as RankingType | null;

	const [allUniversityNames, setAllUniversityNames] = useState<string[]>([]);
	const [allProgramNames, setAllProgramNames] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentProgram, setCurrentProgram] = useState<Program | undefined>(undefined);
	const [universityGuess, setUniversityGuess] = useState("");
	const [programGuess, setProgramGuess] = useState("");
	const [attempts, setAttempts] = useState(0);
	const [universityCorrect, setUniversityCorrect] = useState(false);
	const [programCorrect, setProgramCorrect] = useState(false);
	const [gameWon, setGameWon] = useState(false);
	const [showAnswerModal, setShowAnswerModal] = useState(false);
	const [guessHistory, setGuessHistory] = useState<
		Array<{
			university: string;
			program: string;
			universityMatch: boolean;
			programMatch: boolean;
		}>
	>([]);

	const [filteredUniversitySuggestions, setFilteredUniversitySuggestions] = useState<string[]>([]);
	const [filteredProgramSuggestions, setFilteredProgramSuggestions] = useState<string[]>([]);
	const [programsForSelectedUniversity, setProgramsForSelectedUniversity] = useState<string[]>([]);
	const [showProgramDropdown, setShowProgramDropdown] = useState(true);
	const [programInputFocusedByUser, setProgramInputFocusedByUser] = useState(false);
	const [answerSubmitted, setAnswerSubmitted] = useState(false);

	const universityInputRef = useRef<HTMLInputElement>(null);
	const programInputRef = useRef<HTMLInputElement>(null);

	// Initialize game when component mounts or ranking type changes
	useEffect(() => {
		if (!selectedRankingType) {
			// Redirect to home if no ranking type is specified
			router.push("/");
			return;
		}

		initializeGame();
	}, [selectedRankingType, router]);

	const initializeGame = async () => {
		if (!selectedRankingType) return;

		try {
			setIsLoading(true);

			// Preload all data first
			await gameDataService.preloadData();

			// Get program names and university names
			const universityNames = await gameDataService.getUniversityNames();
			setAllUniversityNames(universityNames);

			// Get a random program based on the selected ranking type
			let randomProgram: Program;
			let programNames: string[];

			if (selectedRankingType === "Rastgele") {
				// Get random program from all types
				randomProgram = await gameDataService.getRandomProgram();
				programNames = await gameDataService.getProgramNames();
			} else {
				// Get random program from specific ranking type
				randomProgram = await gameDataService.getRandomProgramByRankingType(selectedRankingType);
				programNames = await gameDataService.getProgramNamesByRankingType(selectedRankingType);
			}

			setCurrentProgram(randomProgram);
			setAllProgramNames(programNames);

			setIsLoading(false);
		} catch (error) {
			console.error("Failed to load data:", error);
			setIsLoading(false);
		}
	};

	const normalizeText = (text: string) => {
		// Proper Turkish case conversion
		return text
			.toLocaleLowerCase("tr-TR")
			.replace(/ğ/g, "g")
			.replace(/ü/g, "u")
			.replace(/ş/g, "s")
			.replace(/ı/g, "i")
			.replace(/ö/g, "o")
			.replace(/ç/g, "c")
			.trim();
	};

	// Check if user's guess is exactly the same as the correct answer (for display purposes)
	const isExactMatch = (guess: string, target: string) => {
		return guess.trim() === target.trim();
	};

	const handleUniversityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setUniversityGuess(value);
		setProgramsForSelectedUniversity([]);

		if (currentProgram) {
			gameDataService
				.getUniversityNamesByTypeAndCity(currentProgram.programType, currentProgram.cityName)
				.then((filteredUniversities) => {
					let searchResults = filteredUniversities;
					if (value.length > 0) {
						searchResults = filteredUniversities.filter((name) => normalizeText(name).includes(normalizeText(value)));
					}
					setFilteredUniversitySuggestions(searchResults);
				})
				.catch((error) => {
					console.error("Error filtering universities:", error);
					let fallback = allUniversityNames;
					if (value.length > 0) {
						fallback = allUniversityNames.filter((name) => normalizeText(name).includes(normalizeText(value)));
					}
					setFilteredUniversitySuggestions(fallback);
				});
		} else {
			setFilteredUniversitySuggestions([]);
			setFilteredProgramSuggestions(allProgramNames);
			setShowProgramDropdown(false);
			setProgramInputFocusedByUser(false);
		}
	};

	// Show dropdown with all city universities on focus if input is empty
	const handleUniversityInputFocus = () => {
		if (currentProgram) {
			gameDataService
				.getUniversityNamesByTypeAndCity(currentProgram.programType, currentProgram.cityName)
				.then((filteredUniversities) => {
					setFilteredUniversitySuggestions(filteredUniversities);
				})
				.catch(() => setFilteredUniversitySuggestions([]));
		}
	};

	const handleProgramInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setProgramGuess(value);
		setShowProgramDropdown(true); // Show dropdown on input change
		let sourcePrograms: string[] = [];
		if (programsForSelectedUniversity.length > 0) {
			sourcePrograms = programsForSelectedUniversity;
		} else if (currentProgram?.rankingType) {
			sourcePrograms = allProgramNames;
		}
		if (sourcePrograms.length > 0) {
			if (value.length > 0) {
				const filtered = sourcePrograms.filter((name) => normalizeText(name).includes(normalizeText(value)));
				setFilteredProgramSuggestions(filtered);
			} else {
				setFilteredProgramSuggestions(sourcePrograms);
			}
		} else {
			setFilteredProgramSuggestions([]);
		}
	};

	const handleProgramInputFocus = (e?: React.FocusEvent<HTMLInputElement>) => {
		// Only open dropdown if focus was by user (not programmatic)
		if (programInputFocusedByUser) {
			setShowProgramDropdown(true);
			let sourcePrograms: string[] = [];
			if (programsForSelectedUniversity.length > 0) {
				sourcePrograms = programsForSelectedUniversity;
			} else if (currentProgram?.rankingType) {
				sourcePrograms = allProgramNames;
			}
			setFilteredProgramSuggestions(sourcePrograms);
		}
	};

	const selectUniversitySuggestion = async (suggestion: string) => {
		setUniversityGuess(suggestion);
		setFilteredUniversitySuggestions([]);
		setShowProgramDropdown(false); // Hide dropdown after picking university
		setProgramInputFocusedByUser(false); // Mark that next focus is programmatic
		programInputRef.current?.focus(); // Move focus to program input

		// Fetch programs for selected university
		if (currentProgram?.rankingType) {
			try {
				// Use the current program's actual ranking type, not the selected one (which might be "Rastgele")
				const actualRankingType = currentProgram.rankingType;
				const programNames = await gameDataService.getProgramNamesByUniversity(suggestion, actualRankingType);
				setProgramsForSelectedUniversity(programNames);
			} catch (error) {
				console.error("Error fetching programs for university:", error);
				setProgramsForSelectedUniversity([]);
			}
		}
	};

	const selectProgramSuggestion = (suggestion: string) => {
		setProgramGuess(suggestion);
		setFilteredProgramSuggestions([]);
	};

	const checkGuess = () => {
		if (!universityGuess.trim() || !programGuess.trim() || !currentProgram || answerSubmitted) return;

		const normalizedUniversityGuess = normalizeText(universityGuess);
		const normalizedUniversityTarget = normalizeText(currentProgram.universityName);

		const universityMatch = normalizedUniversityGuess === normalizedUniversityTarget;

		// Use flexible program matching that ignores language variants
		const programMatch = gameDataService.checkProgramNameMatch(programGuess, currentProgram);

		// Add to guess history
		const newGuess = {
			university: universityGuess,
			program: programGuess,
			universityMatch,
			programMatch,
		};
		setGuessHistory([...guessHistory, newGuess]);

		if (universityMatch) {
			setUniversityCorrect(true);
		}

		if (programMatch) {
			setProgramCorrect(true);
		}

		if (universityMatch && programMatch) {
			setGameWon(true);
			setAnswerSubmitted(true);
		}

		setAttempts(attempts + 1);
		if (!universityMatch) setUniversityGuess(""); // Clear only if incorrect
		if (!programMatch) setProgramGuess(""); // Clear only if incorrect
		setFilteredUniversitySuggestions([]);
		setFilteredProgramSuggestions([]);
	};

	const resetGame = async () => {
		if (!selectedRankingType) return;

		try {
			let randomProgram: Program;

			if (selectedRankingType === "Rastgele") {
				randomProgram = await gameDataService.getRandomProgram();
			} else {
				randomProgram = await gameDataService.getRandomProgramByRankingType(selectedRankingType);
			}

			setCurrentProgram(randomProgram);
			console.log("Seçilen program: ", randomProgram);
		} catch (error) {
			console.error("Failed to get random program:", error);
		}

		setUniversityGuess("");
		setProgramGuess("");
		setAttempts(0);
		setUniversityCorrect(false);
		setProgramCorrect(false);
		setGameWon(false);
		setShowAnswerModal(false);
		setGuessHistory([]);
		setFilteredUniversitySuggestions([]);
		setFilteredProgramSuggestions([]);
		setAnswerSubmitted(false);
	};

	const startNewGameSession = () => {
		// Navigate back to home to select a new ranking type
		router.push("/");
	};

	if (isLoading) {
		return <LoadingState isLoading={true} currentProgram={undefined} />;
	}

	if (!currentProgram) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<p className="text-gray-600 dark:text-gray-300">Oyun yüklenemedi</p>
					<button
						type="button"
						onClick={() => router.push("/")}
						className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
					>
						Ana Sayfaya Dön
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 p-2 sm:p-4 dark:bg-slate-900">
			<div className="mx-auto max-w-4xl px-2 sm:px-4">
				<div className="mb-6 text-center sm:mb-8">
					<h1 className="mb-2 font-bold text-2xl text-indigo-900 sm:text-3xl lg:text-4xl dark:text-indigo-200">
						🎓 Atlasguessr
					</h1>
					<p className="px-2 text-gray-600 text-sm sm:text-base dark:text-gray-300">
						Türk üniversitelerindeki lisans programlarını tahmin edin!
					</p>
					{selectedRankingType && (
						<div className="mt-3 sm:mt-4">
							<span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 font-medium text-indigo-800 text-xs shadow-sm ring-1 ring-indigo-600/20 sm:px-3 sm:text-sm dark:bg-indigo-900/50 dark:text-indigo-200 dark:ring-indigo-400/30">
								Sıralama Türü: {selectedRankingType}
							</span>
						</div>
					)}
				</div>

				<div className="space-y-4 sm:space-y-6">
					<div>
						<GameStats attempts={attempts} universityCorrect={universityCorrect} programCorrect={programCorrect} />
					</div>

					<div>
						<div className="mb-4 grid gap-4 sm:mb-6 sm:gap-6 lg:grid-cols-2">
							<div>
								<HintsCard currentProgram={currentProgram} />
							</div>

							<div>
								<InputForm
									universityGuess={universityGuess}
									programGuess={programGuess}
									universityCorrect={universityCorrect}
									programCorrect={programCorrect}
									gameWon={gameWon}
									filteredUniversitySuggestions={filteredUniversitySuggestions}
									filteredProgramSuggestions={filteredProgramSuggestions}
									showProgramDropdown={showProgramDropdown}
									setShowProgramDropdown={setShowProgramDropdown}
									onUniversityChange={handleUniversityInputChange}
									onUniversityInputFocus={handleUniversityInputFocus}
									onProgramChange={handleProgramInputChange}
									onProgramInputFocus={handleProgramInputFocus}
									onUniversitySelect={selectUniversitySuggestion}
									onProgramSelect={selectProgramSuggestion}
									onSubmit={checkGuess}
									universityInputRef={universityInputRef}
									programInputRef={programInputRef}
									onProgramInputMouseDown={() => setProgramInputFocusedByUser(true)}
									allProgramNames={allProgramNames}
									programsForSelectedUniversity={programsForSelectedUniversity}
									answerSubmitted={answerSubmitted}
								/>
							</div>
						</div>
					</div>

					<div>
						<ActionButtons
							gameWon={gameWon}
							onShowAnswer={() => setShowAnswerModal(true)}
							onResetGame={resetGame}
							onNewGameSession={startNewGameSession}
						/>
					</div>

					<div>
						<GuessHistory guessHistory={guessHistory} currentProgram={currentProgram} isExactMatch={isExactMatch} />
					</div>

					<div>
						<GameInstructions />
					</div>
				</div>

				{/* Game Won Modal */}
				{currentProgram && (
					<GameWonModal
						isOpen={gameWon}
						onClose={() => setGameWon(false)}
						currentProgram={currentProgram}
						attempts={attempts}
						onNewGame={resetGame}
						guessHistory={guessHistory}
					/>
				)}

				{/* Show Answer Modal */}
				{currentProgram && (
					<ShowAnswerModal
						isOpen={showAnswerModal}
						onClose={() => setShowAnswerModal(false)}
						currentProgram={currentProgram}
						attempts={attempts}
						onNewGame={resetGame}
					/>
				)}

				<Footer />
			</div>

			{/* All custom animations and related CSS have been removed for a snappy, animation-free experience. */}
		</div>
	);
}

export default function OynaPage() {
	return (
		<Suspense fallback={<LoadingState isLoading={true} currentProgram={undefined} />}>
			<OynaPageContent />
		</Suspense>
	);
}
