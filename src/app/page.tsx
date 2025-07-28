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
import { ShowAnswerModal } from "@/components/ShowAnswerModal";
import { type Program, gameDataService } from "@/lib/gameData";
import { useEffect, useRef, useState } from "react";

export default function AtlasguessrGame() {
	const [programs, setPrograms] = useState<Program[]>([]);
	const [allUniversityNames, setAllUniversityNames] = useState<string[]>([]);
	const [allProgramNames, setAllProgramNames] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);
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

	useEffect(() => {
		// Load real data on component mount
		const loadData = async () => {
			try {
				setIsLoading(true);
				const programNames = await gameDataService.getProgramNames();
				const universityNames =
					await gameDataService.getUniversityNames();
				// Get all programs by loading a random one and accessing the service's data
				await gameDataService.preloadData();
				const loadStatus = gameDataService.getLoadStatus();

				if (loadStatus.loaded && loadStatus.count > 0) {
					// Get program names for suggestions
					setAllProgramNames(programNames);
					setAllUniversityNames(universityNames);

					// Extract university names from loaded data
					const randomProgram =
						await gameDataService.getRandomProgram();
					setCurrentProgram(randomProgram);

					// Set a flag that data is loaded (we'll use the service directly)
					setPrograms([randomProgram]); // Just to indicate data is loaded
				}
				setIsLoading(false);
			} catch (error) {
				console.error("Failed to load data:", error);
				setIsLoading(false);
			}
		};

		loadData();
	}, []);

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
		try {
			const randomProgram = await gameDataService.getRandomProgram();
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

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<div className="mx-auto max-w-4xl">
				<div className="mb-8 text-center">
					<h1 className="mb-2 font-bold text-4xl text-indigo-900">
						🎓 Atlasguessr
					</h1>
					<p className="text-gray-600">
						Türk üniversitelerindeki lisans programlarını tahmin
						edin!
					</p>
				</div>

				<LoadingState
					isLoading={isLoading}
					currentProgram={currentProgram}
				/>

				{!isLoading && currentProgram && (
					<>
						<GameStats
							attempts={attempts}
							universityCorrect={universityCorrect}
							programCorrect={programCorrect}
						/>

						<div className="mb-6 grid gap-6 md:grid-cols-2">
							<HintsCard currentProgram={currentProgram} />

							<InputForm
								universityGuess={universityGuess}
								programGuess={programGuess}
								universityCorrect={universityCorrect}
								programCorrect={programCorrect}
								gameWon={gameWon}
								filteredUniversitySuggestions={
									filteredUniversitySuggestions
								}
								filteredProgramSuggestions={
									filteredProgramSuggestions
								}
								onUniversityChange={handleUniversityInputChange}
								onProgramChange={handleProgramInputChange}
								onUniversitySelect={selectUniversitySuggestion}
								onProgramSelect={selectProgramSuggestion}
								onSubmit={checkGuess}
								universityInputRef={universityInputRef}
								programInputRef={programInputRef}
							/>
						</div>

						<ActionButtons
							gameWon={gameWon}
							onShowAnswer={() => setShowAnswerModal(true)}
							onResetGame={resetGame}
						/>

						<GuessHistory
							guessHistory={guessHistory}
							currentProgram={currentProgram}
							isExactMatch={isExactMatch}
						/>

						<GameInstructions />
					</>
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
		</div>
	);
}
