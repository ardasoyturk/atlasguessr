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
import { type RankingType, RankingTypeSelector } from "@/components/RankingTypeSelector";
import { ShowAnswerModal } from "@/components/ShowAnswerModal";
import { type Program, gameDataService } from "@/lib/gameData";
import { useEffect, useRef, useState } from "react";

export default function AtlasguessrGame() {
	const [gamePhase, setGamePhase] = useState<"selection" | "playing">("selection");
	const [selectedRankingType, setSelectedRankingType] = useState<RankingType | null>(null);
	const [programs, setPrograms] = useState<Program[]>([]);
	const [allUniversityNames, setAllUniversityNames] = useState<string[]>([]);
	const [allProgramNames, setAllProgramNames] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
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

	const universityInputRef = useRef<HTMLInputElement>(null);
	const programInputRef = useRef<HTMLInputElement>(null);

	const handleRankingTypeSelect = async (rankingType: RankingType) => {
		try {
			setIsLoading(true);
			setSelectedRankingType(rankingType);

			// Preload all data first
			await gameDataService.preloadData();

			// Get program names and university names
			const universityNames = await gameDataService.getUniversityNames();
			setAllUniversityNames(universityNames);

			// Get a random program based on the selected ranking type
			let randomProgram: Program;
			let programNames: string[];

			if (rankingType === "Rastgele") {
				// Get random program from all types
				randomProgram = await gameDataService.getRandomProgram();
				programNames = await gameDataService.getProgramNames();
			} else {
				// Get random program from specific ranking type
				randomProgram = await gameDataService.getRandomProgramByRankingType(rankingType);
				programNames = await gameDataService.getProgramNamesByRankingType(rankingType);
			}

			setCurrentProgram(randomProgram);
			setAllProgramNames(programNames);
			setPrograms([randomProgram]); // Just to indicate data is loaded

			// Switch to game phase
			setGamePhase("playing");
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
		if (!universityGuess.trim() || !programGuess.trim() || !currentProgram) return;

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
	};

	const startNewGameSession = () => {
		setGamePhase("selection");
		setSelectedRankingType(null);
		setCurrentProgram(undefined);
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
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4 dark:from-slate-900 dark:to-indigo-900">
			{gamePhase === "selection" && (
				<div className="animate-fade-in-up">
					<RankingTypeSelector onSelectRankingType={handleRankingTypeSelect} />
				</div>
			)}

			{gamePhase === "playing" && (
				<div className="mx-auto max-w-4xl animate-slide-in-from-right px-2 sm:px-4">
					<div className="mb-6 text-center sm:mb-8">
						<h1 className="mb-2 animate-bounce-in font-bold text-2xl text-indigo-900 sm:text-3xl lg:text-4xl dark:text-indigo-200">
							🎓 Atlasguessr
						</h1>
						<p className="animate-fade-in-delay px-2 text-gray-600 text-sm sm:text-base dark:text-gray-300">
							Türk üniversitelerindeki lisans programlarını tahmin edin!
						</p>
						{selectedRankingType && (
							<div className="mt-3 animate-scale-in sm:mt-4">
								<span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 font-medium text-indigo-800 text-xs shadow-sm ring-1 ring-indigo-600/20 sm:px-3 sm:text-sm dark:bg-indigo-900/50 dark:text-indigo-200 dark:ring-indigo-400/30">
									<span className="mr-1 sm:mr-2">🎯</span>
									Sıralama Türü: {selectedRankingType}
								</span>
							</div>
						)}
					</div>

					<LoadingState isLoading={isLoading} currentProgram={currentProgram} />

					{!isLoading && currentProgram && (
						<div className="animate-fade-in-stagger space-y-4 sm:space-y-6">
							<div className="animate-slide-in-left">
								<GameStats attempts={attempts} universityCorrect={universityCorrect} programCorrect={programCorrect} />
							</div>

							<div className="animate-slide-in-right">
								<div className="mb-4 grid gap-4 sm:mb-6 sm:gap-6 lg:grid-cols-2">
									<div className="animate-scale-in">
										<HintsCard currentProgram={currentProgram} />
									</div>

									<div className="animate-scale-in-delay">
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
										/>
									</div>
								</div>
							</div>

							<div className="animate-slide-in-up">
								<ActionButtons
									gameWon={gameWon}
									onShowAnswer={() => setShowAnswerModal(true)}
									onResetGame={resetGame}
									onNewGameSession={startNewGameSession}
								/>
							</div>

							<div className="animate-fade-in-delay-2">
								<GuessHistory guessHistory={guessHistory} currentProgram={currentProgram} isExactMatch={isExactMatch} />
							</div>

							<div className="animate-fade-in-delay-3">
								<GameInstructions />
							</div>
						</div>
					)}

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
			)}

			{/* Custom CSS animations */}
			<style jsx>{`
				@keyframes fade-in-up {
					from {
						opacity: 0;
						transform: translateY(30px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				@keyframes slide-in-from-right {
					from {
						opacity: 0;
						transform: translateX(100px);
					}
					to {
						opacity: 1;
						transform: translateX(0);
					}
				}
				@keyframes slide-in-left {
					from {
						opacity: 0;
						transform: translateX(-50px);
					}
					to {
						opacity: 1;
						transform: translateX(0);
					}
				}
				@keyframes slide-in-right {
					from {
						opacity: 0;
						transform: translateX(50px);
					}
					to {
						opacity: 1;
						transform: translateX(0);
					}
				}
				@keyframes slide-in-up {
					from {
						opacity: 0;
						transform: translateY(30px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				@keyframes scale-in {
					from {
						opacity: 0;
						transform: scale(0.9);
					}
					to {
						opacity: 1;
						transform: scale(1);
					}
				}
				@keyframes bounce-in {
					0% {
						opacity: 0;
						transform: scale(0.3);
					}
					50% {
						opacity: 1;
						transform: scale(1.05);
					}
					70% {
						transform: scale(0.9);
					}
					100% {
						opacity: 1;
						transform: scale(1);
					}
				}

				.animate-fade-in-up {
					animation: fade-in-up 0.8s ease-out;
				}
				.animate-slide-in-from-right {
					animation: slide-in-from-right 0.8s ease-out;
				}
				.animate-slide-in-left {
					animation: slide-in-left 0.6s ease-out;
				}
				.animate-slide-in-right {
					animation: slide-in-right 0.6s ease-out 0.2s both;
				}
				.animate-slide-in-up {
					animation: slide-in-up 0.6s ease-out 0.4s both;
				}
				.animate-scale-in {
					animation: scale-in 0.5s ease-out;
				}
				.animate-scale-in-delay {
					animation: scale-in 0.5s ease-out 0.2s both;
				}
				.animate-bounce-in {
					animation: bounce-in 1s ease-out;
				}
				.animate-fade-in-delay {
					animation: fade-in-up 0.6s ease-out 0.3s both;
				}
				.animate-fade-in-delay-2 {
					animation: fade-in-up 0.6s ease-out 0.6s both;
				}
				.animate-fade-in-delay-3 {
					animation: fade-in-up 0.6s ease-out 0.9s both;
				}
				.animate-fade-in-stagger {
					animation: fade-in-up 0.8s ease-out 0.2s both;
				}
			`}</style>
		</div>
	);
}
