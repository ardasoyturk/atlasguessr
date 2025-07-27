"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

// Mock database based on the provided JSON structure
const programs = [
	{
		id: "102270026",
		universityName: "BOĞAZİÇİ ÜNİVERSİTESİ",
		facultyName: "Fen-Edebiyat Fakültesi",
		programName: "Dilbilimi (İngilizce) (4 Yıllık)",
		cityName: "İSTANBUL",
		programType: "Devlet",
		scholarshipType: "Ücretsiz",
		quota: ["55+2+0+0+0", "50+2+0+2+0", "55+2", "55+2"],
		rank: ["2.617", "3.112", "2.513", "2.745"],
		points: ["490,75839", "495,28200", "497,93825", "463,24681"],
		rankingType: "Dil",
	},
	{
		id: "102270027",
		universityName: "İSTANBUL TEKNİK ÜNİVERSİTESİ",
		facultyName: "Bilgisayar ve Bilişim Fakültesi",
		programName: "Bilgisayar Mühendisliği (4 Yıllık)",
		cityName: "İSTANBUL",
		programType: "Devlet",
		scholarshipType: "Ücretsiz",
		quota: ["120+5+0+0+0", "115+5+0+5+0", "120+5", "120+5"],
		rank: ["1.250", "1.180", "1.320", "1.290"],
		points: ["520,45123", "525,12456", "518,78945", "522,36789"],
		rankingType: "Sayısal",
	},
	{
		id: "102270028",
		universityName: "KOÇ ÜNİVERSİTESİ",
		facultyName: "Tıp Fakültesi",
		programName: "Tıp (6 Yıllık)",
		cityName: "İSTANBUL",
		programType: "Vakıf",
		scholarshipType: "Burslu",
		quota: ["45+2+0+0+0", "40+2+0+2+0", "45+2", "45+2"],
		rank: ["450", "380", "420", "395"],
		points: ["580,12345", "585,67890", "578,45612", "582,78945"],
		rankingType: "Sayısal",
	},
	{
		id: "102270029",
		universityName: "ORTA DOĞU TEKNİK ÜNİVERSİTESİ",
		facultyName: "Mühendislik Fakültesi",
		programName: "Endüstri Mühendisliği (4 Yıllık)",
		cityName: "ANKARA",
		programType: "Devlet",
		scholarshipType: "Ücretsiz",
		quota: ["3.200", "3.450", "3.100", "3.250"],
		rank: ["3.200", "3.450", "3.100", "3.250"],
		points: ["465,78912", "460,23456", "468,56789", "463,91234"],
		rankingType: "Sayısal",
	},
	{
		id: "102270030",
		universityName: "SABANCI ÜNİVERSİTESİ",
		facultyName: "Sanat ve Sosyal Bilimler Fakültesi",
		programName: "Psikoloji (4 Yıllık)",
		cityName: "İSTANBUL",
		programType: "Vakıf",
		scholarshipType: "Ücretli",
		quota: ["35+1+0+0+0", "30+1+0+1+0", "35+1", "35+1"],
		rank: ["1.800", "1.950", "1.750", "1.825"],
		points: ["510,45678", "508,12345", "512,78901", "509,56789"],
		rankingType: "Eşit Ağırlık",
	},
	{
		id: "102270031",
		universityName: "HACETTEPE ÜNİVERSİTESİ",
		facultyName: "Edebiyat Fakültesi",
		programName: "İngiliz Dili ve Edebiyatı (İngilizce) (4 Yıllık)",
		cityName: "ANKARA",
		programType: "Devlet",
		scholarshipType: "Ücretsiz",
		quota: ["60+2+0+0+0", "55+2+0+2+0", "60+2", "60+2"],
		rank: ["15.000", "16.500", "14.800", "15.200"],
		points: ["420,12345", "418,98765", "422,34567", "419,87654"],
		rankingType: "Dil",
	},
	{
		id: "102270032",
		universityName: "ANKARA ÜNİVERSİTESİ",
		facultyName: "Hukuk Fakültesi",
		programName: "Hukuk (4 Yıllık)",
		cityName: "ANKARA",
		programType: "Devlet",
		scholarshipType: "Ücretsiz",
		quota: ["200+5+0+0+0", "190+5+0+5+0", "200+5", "200+5"],
		rank: ["2.100", "2.300", "2.050", "2.150"],
		points: ["480,12345", "478,98765", "482,34567", "479,87654"],
		rankingType: "Eşit Ağırlık",
	},
	{
		id: "102270033",
		universityName: "GAZİ ÜNİVERSİTESİ",
		facultyName: "Eğitim Fakültesi",
		programName: "Okul Öncesi Öğretmenliği (4 Yıllık)",
		cityName: "ANKARA",
		programType: "Devlet",
		scholarshipType: "Ücretsiz",
		quota: ["80+2+0+0+0", "75+2+0+2+0", "80+2", "80+2"],
		rank: ["25.000", "26.500", "24.800", "25.200"],
		points: ["390,12345", "388,98765", "392,34567", "389,87654"],
		rankingType: "Sözel",
	},
];

// Extract unique university and program names for auto-suggestion
const allUniversityNames = Array.from(
	new Set(programs.map((p) => p.universityName)),
);
const allProgramNames = Array.from(new Set(programs.map((p) => p.programName)));

export default function AtlasguessrGame() {
	const [currentProgram, setCurrentProgram] = useState<
		(typeof programs)[0] | undefined
	>(programs[0]);
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
	const [filteredProgramSuggestions, setFilteredProgramSuggestions] = useState<
		string[]
	>([]);

	const universityInputRef = useRef<HTMLInputElement>(null);
	const programInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		// Select random program on component mount
		const randomProgram = programs[Math.floor(Math.random() * programs.length)];
		setCurrentProgram(randomProgram);
		console.log("Seçilen program: ", randomProgram);
	}, []);

	const normalizeText = (text: string) => {
		return text.toUpperCase().trim();
	};

	const handleUniversityInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const value = e.target.value;
		setUniversityGuess(value);
		if (value.length > 1) {
			setFilteredUniversitySuggestions(
				allUniversityNames.filter((name) =>
					normalizeText(name).includes(normalizeText(value)),
				),
			);
		} else {
			setFilteredUniversitySuggestions([]);
		}
	};

	const handleProgramInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setProgramGuess(value);
		if (value.length > 1) {
			setFilteredProgramSuggestions(
				allProgramNames.filter((name) =>
					normalizeText(name).includes(normalizeText(value)),
				),
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
		if (!universityGuess.trim() || !programGuess.trim()) return;

		const normalizedUniversityGuess = normalizeText(universityGuess);
		const normalizedProgramGuess = normalizeText(programGuess);
		const normalizedUniversityTarget = normalizeText(
			currentProgram.universityName,
		);
		const normalizedProgramTarget = normalizeText(currentProgram.programName);

		const universityMatch =
			normalizedUniversityGuess === normalizedUniversityTarget;
		const programMatch = normalizedProgramGuess === normalizedProgramTarget;

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

	const resetGame = () => {
		const randomProgram = programs[Math.floor(Math.random() * programs.length)];
		setCurrentProgram(randomProgram);
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
						Türk üniversitelerindeki lisans programlarını tahmin edin!
					</p>
				</div>

				{/* Game Stats */}
				<div className="mb-6 flex justify-center gap-4">
					<Badge variant="outline" className="text-sm">
						Deneme: {attempts}
					</Badge>
					<Badge
						variant={universityCorrect ? "default" : "outline"}
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
								<span className="font-medium">Şehir:</span>
								<span className="text-blue-700">
									{currentProgram?.cityName}
								</span>
							</div>

							<div className="flex items-center gap-2 rounded-lg bg-green-50 p-3">
								<University className="h-4 w-4 text-green-600" />
								<span className="font-medium">Üniversite Türü:</span>
								<span className="text-green-700">
									{currentProgram?.programType}
								</span>
							</div>

							<div className="flex items-center gap-2 rounded-lg bg-purple-50 p-3">
								<DollarSign className="h-4 w-4 text-purple-600" />
								<span className="font-medium">Ücret Durumu:</span>
								<span className="text-purple-700">
									{currentProgram?.scholarshipType}
								</span>
							</div>

							<div className="rounded-lg bg-yellow-50 p-3">
								<div className="mb-2 flex items-center gap-2">
									<Trophy className="h-4 w-4 text-yellow-600" />
									<span className="font-medium">
										Son Yerleşen Sıralamaları (4 Yıl):
									</span>
								</div>
								<ul className="list-inside list-disc text-sm text-yellow-700">
									{currentProgram?.rank.map((r, i) => (
										<li key={r}>
											Yıl {i + 1}: {r}
										</li>
									))}
								</ul>
							</div>

							<div className="flex items-center gap-2 rounded-lg bg-orange-50 p-3">
								<ListOrdered className="h-4 w-4 text-orange-600" />
								<span className="font-medium">Sıralama Türü:</span>
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
									onChange={handleUniversityInputChange}
									placeholder="Örn: BOĞAZİÇİ ÜNİVERSİTESİ"
									className={
										universityCorrect ? "border-green-500 bg-green-50" : ""
									}
									disabled={gameWon}
									autoComplete="off"
								/>
								{filteredUniversitySuggestions.length > 0 && (
									<div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
										{filteredUniversitySuggestions.map((suggestion) => (
											<button
												key={suggestion}
												className="w-full cursor-pointer p-2 text-left hover:bg-gray-100"
												type="button"
												onClick={() => selectUniversitySuggestion(suggestion)}
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
									onChange={handleProgramInputChange}
									placeholder="Örn: Bilgisayar Mühendisliği (4 Yıllık)"
									className={
										programCorrect ? "border-green-500 bg-green-50" : ""
									}
									disabled={gameWon}
									onKeyPress={(e) => e.key === "Enter" && checkGuess()}
									autoComplete="off"
								/>
								{filteredProgramSuggestions.length > 0 && (
									<div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
										{filteredProgramSuggestions.map((suggestion) => (
											<button
												key={suggestion}
												className="w-full cursor-pointer p-2 text-left hover:bg-gray-100"
												type="button"
												onClick={() => selectProgramSuggestion(suggestion)}
											>
												{suggestion}
											</button>
										))}
									</div>
								)}
							</div>

							<Button
								onClick={checkGuess}
								disabled={
									!universityGuess.trim() || !programGuess.trim() || gameWon
								}
								className="w-full"
							>
								Tahmin Et
							</Button>
						</CardContent>
					</Card>
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
										key={guess.university + guess.program}
										className="grid grid-cols-1 gap-2 rounded-lg bg-gray-50 p-3 md:grid-cols-2"
									>
										<div
											className={`rounded p-2 ${
												guess.universityMatch
													? "bg-green-100 text-green-800"
													: "bg-red-100 text-red-800"
											}`}
										>
											<span className="font-medium">Üniversite: </span>
											{guess.university}
											{guess.universityMatch ? " ✓" : " ✗"}
										</div>
										<div
											className={`rounded p-2 ${
												guess.programMatch
													? "bg-green-100 text-green-800"
													: "bg-red-100 text-red-800"
											}`}
										>
											<span className="font-medium">Program: </span>
											{guess.program}
											{guess.programMatch ? " ✓" : " ✗"}
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Game Won Message */}
				{gameWon && (
					<Card className="mb-6 border-green-500">
						<CardContent className="pt-6 text-center">
							<h2 className="mb-2 font-bold text-2xl text-green-600">
								🎉 Tebrikler!
							</h2>
							<p className="mb-2 text-gray-600">
								<span className="font-bold">
									{currentProgram?.universityName}
								</span>
							</p>
							<p className="mb-4 text-gray-600">
								<span className="font-bold">{currentProgram?.programName}</span>
							</p>
							<p className="text-gray-500 text-sm">
								{attempts} denemede başardınız!
							</p>
						</CardContent>
					</Card>
				)}

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

				{/* Instructions */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Nasıl Oynanır?</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2 text-gray-600 text-sm">
						<p>
							• Verilen ipuçlarını kullanarak hem üniversite hem de program
							adını tahmin edin
						</p>
						<p>
							• Her tahmin sonrası hangi kısmın doğru olduğunu görebilirsiniz
						</p>
						<p>• Doğru tahmin ettiğiniz kısımlar yeşil renkte görünür</p>
						<p>
							• Her iki kısmı da doğru tahmin ettiğinizde oyunu kazanırsınız
						</p>
						<p>
							• İpuçları: şehir, üniversite türü, ücret durumu, son 4 yılın
							sıralamaları ve sıralama türü
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
