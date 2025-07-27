"use client";

import type React from "react";

import { GameWonModal } from "@/components/GameWonModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { type Program, gameDataService } from "@/lib/gameData";
import {
	DollarSign,
	GraduationCap,
	ListOrdered,
	MapPin,
	RefreshCw,
	Trophy,
	University,
} from "lucide-react";
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
		if (value.length > 1) {
			setFilteredProgramSuggestions(
				allProgramNames.filter((name) =>
					normalizeText(name).includes(normalizeText(value))
				)
			);
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
			currentProgram.programName
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

				{isLoading ? (
					<div className="flex min-h-[50vh] items-center justify-center">
						<Card className="w-full max-w-md">
							<CardContent className="pt-6 text-center">
								<div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
								<p className="text-lg">Veriler yükleniyor...</p>
							</CardContent>
						</Card>
					</div>
				) : !currentProgram ? (
					<div className="flex min-h-[50vh] items-center justify-center">
						<Card className="w-full max-w-md">
							<CardContent className="pt-6 text-center">
								<p className="text-lg text-red-600">
									Veri yüklenirken hata oluştu.
								</p>
								<Button
									onClick={() => window.location.reload()}
									className="mt-4"
								>
									Yeniden Dene
								</Button>
							</CardContent>
						</Card>
					</div>
				) : (
					<>
						{/* Rest of the existing UI stays exactly the same */}

						{/* Game Stats */}
						<div className="mb-6 flex justify-center gap-4">
							<Badge variant="outline" className="text-sm">
								Deneme: {attempts}
							</Badge>
							<Badge
								variant={
									universityCorrect ? "default" : "outline"
								}
								className="text-sm"
							>
								Üniversite: {universityCorrect ? "✓" : "?"}
							</Badge>
							<Badge
								variant={programCorrect ? "default" : "outline"}
								className="text-sm"
							>
								Program: {programCorrect ? "✓" : "?"}
							</Badge>
						</div>

						<div className="mb-6 grid gap-6 md:grid-cols-2">
							{/* Hints Section */}
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
										<span className="font-medium">
											Şehir:
										</span>
										<span className="text-blue-700">
											{currentProgram?.cityName}
										</span>
									</div>

									<div className="flex items-center gap-2 rounded-lg bg-green-50 p-3">
										<University className="h-4 w-4 text-green-600" />
										<span className="font-medium">
											Üniversite Türü:
										</span>
										<span className="text-green-700">
											{currentProgram?.programType}
										</span>
									</div>

									<div className="flex items-center gap-2 rounded-lg bg-purple-50 p-3">
										<DollarSign className="h-4 w-4 text-purple-600" />
										<span className="font-medium">
											Ücret Durumu:
										</span>
										<span className="text-purple-700">
											{currentProgram?.scholarshipType}
										</span>
									</div>

									<div className="rounded-lg bg-yellow-50 p-3">
										<div className="mb-2 flex items-center gap-2">
											<Trophy className="h-4 w-4 text-yellow-600" />
											<span className="font-medium">
												Son Yerleşen Sıralamaları (4
												Yıl):
											</span>
										</div>
										<ul className="list-inside list-disc text-sm text-yellow-700">
											{currentProgram?.rank.map(
												(r: string, i: number) => (
													<li key={r}>
														{2024 - i}: {r}
													</li>
												)
											)}
										</ul>
									</div>

									<div className="flex items-center gap-2 rounded-lg bg-orange-50 p-3">
										<ListOrdered className="h-4 w-4 text-orange-600" />
										<span className="font-medium">
											Sıralama Türü:
										</span>
										<span className="text-orange-700">
											{currentProgram?.rankingType}
										</span>
									</div>
								</CardContent>
							</Card>

							{/* Input Section */}
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
											onChange={
												handleUniversityInputChange
											}
											placeholder="Örn: BOĞAZİÇİ ÜNİVERSİTESİ"
											className={
												universityCorrect
													? "border-green-500 bg-green-50"
													: ""
											}
											disabled={gameWon}
											autoComplete="off"
										/>
										{filteredUniversitySuggestions.length >
											0 && (
											<div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
												{filteredUniversitySuggestions.map(
													(suggestion) => (
														<button
															key={suggestion}
															className="w-full cursor-pointer p-2 text-left hover:bg-gray-100"
															type="button"
															onClick={() =>
																selectUniversitySuggestion(
																	suggestion
																)
															}
														>
															{suggestion}
														</button>
													)
												)}
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
											onChange={handleProgramInputChange}
											placeholder="Örn: Bilgisayar Mühendisliği (4 Yıllık)"
											className={
												programCorrect
													? "border-green-500 bg-green-50"
													: ""
											}
											disabled={gameWon}
											onKeyPress={(e) =>
												e.key === "Enter" &&
												checkGuess()
											}
											autoComplete="off"
										/>
										{filteredProgramSuggestions.length >
											0 && (
											<div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
												{filteredProgramSuggestions.map(
													(suggestion) => (
														<button
															key={suggestion}
															className="w-full cursor-pointer p-2 text-left hover:bg-gray-100"
															type="button"
															onClick={() =>
																selectProgramSuggestion(
																	suggestion
																)
															}
														>
															{suggestion}
														</button>
													)
												)}
											</div>
										)}
									</div>

									<Button
										onClick={checkGuess}
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
						</div>

						{/* Reset Button */}
						<div className="mb-8 text-center">
							<Button
								onClick={resetGame}
								variant="outline"
								className="gap-2 bg-transparent"
							>
								<RefreshCw className="h-4 w-4" />
								Yeni Oyun
							</Button>
						</div>

						{/* Guess History */}
						{guessHistory.length > 0 && (
							<Card className="mb-6">
								<CardHeader>
									<CardTitle>Tahmin Geçmişi</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										{guessHistory.map((guess, index) => (
											<div
												key={
													guess.university +
													guess.program
												}
												className="grid grid-cols-1 gap-2 rounded-lg bg-gray-50 p-3 md:grid-cols-2"
											>
												<div
													className={`rounded p-2 ${
														guess.universityMatch
															? "bg-green-100 text-green-800"
															: "bg-red-100 text-red-800"
													}`}
												>
													<span className="font-medium">
														Üniversite:{" "}
													</span>
													{guess.university}
													{guess.universityMatch
														? " ✓"
														: " ✗"}
													{/* Show the actual correct answer if the guess was correct but different */}
													{guess.universityMatch &&
														!isExactMatch(
															guess.university,
															currentProgram?.universityName ||
																""
														) && (
															<div className="mt-1 text-green-600 text-xs">
																Doğru cevap:{" "}
																{
																	currentProgram?.universityName
																}
															</div>
														)}
												</div>
												<div
													className={`rounded p-2 ${
														guess.programMatch
															? "bg-green-100 text-green-800"
															: "bg-red-100 text-red-800"
													}`}
												>
													<span className="font-medium">
														Program:{" "}
													</span>
													{guess.program}
													{guess.programMatch
														? " ✓"
														: " ✗"}
													{/* Show the actual correct answer if the guess was correct but different */}
													{guess.programMatch &&
														guess.program !==
															currentProgram?.programName && (
															<div className="mt-1 text-green-600 text-xs">
																Doğru cevap:{" "}
																{
																	currentProgram?.programName
																}
															</div>
														)}
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Instructions */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">
									Nasıl Oynanır?
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2 text-gray-600 text-sm">
								<p>
									• Verilen ipuçlarını kullanarak hem
									üniversite hem de program adını tahmin edin
								</p>
								<p>
									• Her tahmin sonrası hangi kısmın doğru
									olduğunu görebilirsiniz
								</p>
								<p>
									• Doğru tahmin ettiğiniz kısımlar yeşil
									renkte görünür
								</p>
								<p>
									• Her iki kısmı da doğru tahmin ettiğinizde
									oyunu kazanırsınız
								</p>
								<p>
									• İpuçları: şehir, üniversite türü, burs
									durumu, son 4 yılın sıralamaları ve bölüm
									türü
								</p>
							</CardContent>
						</Card>
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
			</div>
		</div>
	);
}
