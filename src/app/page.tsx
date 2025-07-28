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
import {
	RankingTypeSelector,
	type RankingType,
} from "@/components/RankingTypeSelector";
import { ShowAnswerModal } from "@/components/ShowAnswerModal";
import { type Program, gameDataService } from "@/lib/gameData";
import { useEffect, useRef, useState } from "react";

export default function AtlasguessrGame() {
	const [gamePhase, setGamePhase] = useState<"selection" | "playing">(
		"selection"
	);
	const [selectedRankingType, setSelectedRankingType] =
		useState<RankingType | null>(null);
	const [programs, setPrograms] = useState<Program[]>([]);
	const [allUniversityNames, setAllUniversityNames] = useState<string[]>([]);
	const [allProgramNames, setAllProgramNames] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentProgram, setCurrentProgram] = useState<Program | undefined>(
		undefined
	);
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

	const [filteredUniversitySuggestions, setFilteredUniversitySuggestions] =
		useState<string[]>([]);
	const [filteredProgramSuggestions, setFilteredProgramSuggestions] =
		useState<string[]>([]);

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
				randomProgram =
					await gameDataService.getRandomProgramByRankingType(
						rankingType
					);
				programNames =
					await gameDataService.getProgramNamesByRankingType(
						rankingType
					);
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
	const handleUniversityInputChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value;
		setUniversityGuess(value);
		if (value.length > 1) {
			setFilteredUniversitySuggestions(
				allUniversityNames.filter((name) =>
					normalizeText(name).includes(normalizeText(value))
				)
			);
		} else {
			setFilteredUniversitySuggestions([]);
		}
	};

	const handleProgramInputChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value;
		setProgramGuess(value);
		if (value.length > 1 && currentProgram?.rankingType) {
			// Get program names filtered by the current program's ranking type
			gameDataService
				.getProgramNamesByRankingType(currentProgram.rankingType)
				.then((filteredProgramNames) => {
					const suggestions = filteredProgramNames.filter((name) =>
						normalizeText(name).includes(normalizeText(value))
					);
					setFilteredProgramSuggestions(suggestions);
				})
				.catch((error) => {
					console.error(
						"Error filtering program suggestions:",
						error
					);
					// Fallback to all programs if filtering fails
					setFilteredProgramSuggestions(
						allProgramNames.filter((name) =>
							normalizeText(name).includes(normalizeText(value))
						)
					);
				});
		} else {
			setFilteredProgramSuggestions([]);
		}
	};

	const selectUniversitySuggestion = (suggestion: string) => {
		setUniversityGuess(suggestion);
		setFilteredUniversitySuggestions([]);
		programInputRef.current?.focus(); // Move focus to program input
	};

	const selectProgramSuggestion = (suggestion: string) => {
		setProgramGuess(suggestion);
		setFilteredProgramSuggestions([]);
	};

	const checkGuess = () => {
		if (!universityGuess.trim() || !programGuess.trim() || !currentProgram)
			return;

		const normalizedUniversityGuess = normalizeText(universityGuess);
		const normalizedUniversityTarget = normalizeText(
			currentProgram.universityName
		);

		const universityMatch =
			normalizedUniversityGuess === normalizedUniversityTarget;

		// Use flexible program matching that ignores language variants
		const programMatch = gameDataService.checkProgramNameMatch(
			programGuess,
			currentProgram
		);

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
				randomProgram =
					await gameDataService.getRandomProgramByRankingType(
						selectedRankingType
					);
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
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			{gamePhase === "selection" && (
				<div className="animate-fade-in-up">
					<RankingTypeSelector
						onSelectRankingType={handleRankingTypeSelect}
					/>
				</div>
			)}

			{gamePhase === "playing" && (
				<div className="mx-auto max-w-4xl animate-slide-in-from-right">
					<div className="mb-8 text-center">
						<h1 className="mb-2 animate-bounce-in font-bold text-4xl text-indigo-900">
							🎓 Atlasguessr
						</h1>
						<p className="animate-fade-in-delay text-gray-600">
							Türk üniversitelerindeki lisans programlarını tahmin
							edin!
						</p>
						{selectedRankingType && (
							<div className="mt-4 animate-scale-in">
								<span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800 shadow-sm ring-1 ring-indigo-600/20">
									<span className="mr-2">🎯</span>
									Sıralama Türü: {selectedRankingType}
								</span>
							</div>
						)}
					</div>

					<LoadingState
						isLoading={isLoading}
						currentProgram={currentProgram}
					/>

					{!isLoading && currentProgram && (
						<div className="animate-fade-in-stagger space-y-6">
							<div className="animate-slide-in-left">
								<GameStats
									attempts={attempts}
									universityCorrect={universityCorrect}
									programCorrect={programCorrect}
								/>
							</div>

							<div className="animate-slide-in-right">
								<div className="mb-6 grid gap-6 md:grid-cols-2">
									<div className="animate-scale-in">
										<HintsCard
											currentProgram={currentProgram}
										/>
									</div>

									<div className="animate-scale-in-delay">
										<InputForm
											universityGuess={universityGuess}
											programGuess={programGuess}
											universityCorrect={
												universityCorrect
											}
											programCorrect={programCorrect}
											gameWon={gameWon}
											filteredUniversitySuggestions={
												filteredUniversitySuggestions
											}
											filteredProgramSuggestions={
												filteredProgramSuggestions
											}
											onUniversityChange={
												handleUniversityInputChange
											}
											onProgramChange={
												handleProgramInputChange
											}
											onUniversitySelect={
												selectUniversitySuggestion
											}
											onProgramSelect={
												selectProgramSuggestion
											}
											onSubmit={checkGuess}
											universityInputRef={
												universityInputRef
											}
											programInputRef={programInputRef}
										/>
									</div>
								</div>
							</div>

							<div className="animate-slide-in-up">
								<ActionButtons
									gameWon={gameWon}
									onShowAnswer={() =>
										setShowAnswerModal(true)
									}
									onResetGame={resetGame}
									onNewGameSession={startNewGameSession}
								/>
							</div>

							<div className="animate-fade-in-delay-2">
								<GuessHistory
									guessHistory={guessHistory}
									currentProgram={currentProgram}
									isExactMatch={isExactMatch}
								/>
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
