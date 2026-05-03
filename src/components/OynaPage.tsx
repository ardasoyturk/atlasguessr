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
import { useEffect, useRef, useState } from "preact/compat";

const RANKING_TYPES: RankingType[] = ["Sayısal", "Eşit Ağırlık", "Sözel", "Yabancı Dil", "Rastgele"];
const RANKING_TYPE_TONE_CLASSES: Record<RankingType, string> = {
	Sayısal: "border-sky-300/70 bg-sky-500/[0.12] text-sky-900 dark:border-sky-500/30 dark:text-sky-100",
	"Eşit Ağırlık":
		"border-emerald-300/70 bg-emerald-500/[0.12] text-emerald-900 dark:border-emerald-500/30 dark:text-emerald-100",
	Sözel:
		"border-fuchsia-300/70 bg-fuchsia-500/[0.12] text-fuchsia-900 dark:border-fuchsia-500/30 dark:text-fuchsia-100",
	"Yabancı Dil": "border-amber-300/70 bg-amber-500/[0.14] text-amber-900 dark:border-amber-500/30 dark:text-amber-100",
	Rastgele: "border-violet-300/70 bg-violet-500/[0.12] text-violet-900 dark:border-violet-500/30 dark:text-violet-100",
};

const parseRankingType = (rankingType: string | null | undefined): RankingType | null => {
	if (!rankingType) {
		return null;
	}

	if (RANKING_TYPES.includes(rankingType as RankingType)) {
		return rankingType as RankingType;
	}

	return null;
};

interface OynaPageProps {
	initialRankingType?: string | null;
}

export function OynaPage({ initialRankingType = null }: OynaPageProps) {
	const [selectedRankingType, setSelectedRankingType] = useState<RankingType | null>(() =>
		parseRankingType(initialRankingType),
	);

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

	useEffect(() => {
		setSelectedRankingType(parseRankingType(initialRankingType));
	}, [initialRankingType]);

	useEffect(() => {
		if (!selectedRankingType) {
			window.location.href = "/";
			return;
		}

		initializeGame(selectedRankingType);
	}, [selectedRankingType]);

	const initializeGame = async (rankingType: RankingType) => {
		try {
			setIsLoading(true);

			await gameDataService.preloadData();

			const universityNames = await gameDataService.getUniversityNames();
			setAllUniversityNames(universityNames);

			let randomProgram: Program;
			let programNames: string[];

			if (rankingType === "Rastgele") {
				randomProgram = await gameDataService.getRandomProgram();
				programNames = await gameDataService.getProgramNames();
			} else {
				randomProgram = await gameDataService.getRandomProgramByRankingType(rankingType);
				programNames = await gameDataService.getProgramNamesByRankingType(rankingType);
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
		setShowProgramDropdown(true);
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

	const handleProgramInputFocus = () => {
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
		setShowProgramDropdown(false);
		setProgramInputFocusedByUser(false);
		programInputRef.current?.focus();

		if (currentProgram?.rankingType) {
			try {
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
		const programMatch = gameDataService.checkProgramNameMatch(programGuess, currentProgram);

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
		if (!universityMatch) setUniversityGuess("");
		if (!programMatch) setProgramGuess("");
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
		window.location.href = "/";
	};

	if (isLoading) {
		return <LoadingState isLoading={true} currentProgram={undefined} />;
	}

	if (!currentProgram) {
		return (
			<div className="flex min-h-screen items-center justify-center px-4">
				<div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
					<p className="text-muted-foreground">Oyun yüklenemedi.</p>
					<button
						type="button"
						onClick={() => {
							window.location.href = "/";
						}}
						className="mt-4 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground"
					>
						Ana Sayfaya Dön
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="relative min-h-screen px-3 py-4 sm:px-6 sm:py-8">
			<div className="-z-10 absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(14,116,244,0.12),transparent_40%),radial-gradient(circle_at_86%_10%,rgba(245,158,11,0.1),transparent_38%),radial-gradient(circle_at_72%_84%,rgba(16,185,129,0.08),transparent_42%)]" />
			<div className="mx-auto w-full max-w-5xl">
				<div className="mb-7 text-center sm:mb-8">
					<h1 className="text-4xl sm:text-5xl">Atlasguessr</h1>
					<p className="mt-2 text-muted-foreground text-sm sm:text-base">
						Türk üniversitelerindeki lisans programlarını tahmin edin.
					</p>
					<div className="mx-auto mt-4 h-px w-28 bg-[linear-gradient(90deg,transparent,rgba(51,65,85,0.35),transparent)] dark:bg-[linear-gradient(90deg,transparent,rgba(203,213,225,0.35),transparent)]" />
					{selectedRankingType && (
						<div className="mt-4">
							<span
								className={`inline-flex rounded-full border px-3 py-1 font-medium text-xs sm:text-sm ${RANKING_TYPE_TONE_CLASSES[selectedRankingType]}`}
							>
								Sıralama Türü: {selectedRankingType}
							</span>
						</div>
					)}
				</div>

				<GameStats attempts={attempts} universityCorrect={universityCorrect} programCorrect={programCorrect} />

				<div className="mb-6 grid gap-4 lg:grid-cols-2">
					<HintsCard currentProgram={currentProgram} />
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
						answerSubmitted={answerSubmitted}
						rankingType={currentProgram?.rankingType || selectedRankingType}
					/>
				</div>

				<ActionButtons
					gameWon={gameWon}
					onShowAnswer={() => setShowAnswerModal(true)}
					onResetGame={resetGame}
					onNewGameSession={startNewGameSession}
				/>

				<GuessHistory guessHistory={guessHistory} currentProgram={currentProgram} isExactMatch={isExactMatch} />

				<GameInstructions />
				<Footer />
			</div>

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

			{currentProgram && (
				<ShowAnswerModal
					isOpen={showAnswerModal}
					onClose={() => setShowAnswerModal(false)}
					currentProgram={currentProgram}
					attempts={attempts}
					onNewGame={resetGame}
				/>
			)}
		</div>
	);
}
