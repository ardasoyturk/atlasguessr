// Client-side data service with caching for offline-first gameplay

export type ProgramType = "sayisal" | "esitagirlik" | "sozel" | "dil";

export interface Program {
	id: string;
	universityName: string;
	facultyName: string;
	programName: string;
	cityName: string;
	programType: string;
	scholarshipType: string;
	quota: string[];
	rank: string[];
	points: string[];
	rankingType: string;
	gameId?: number; // Optional for sharing purposes
}

class GameDataService {
	private allPrograms: Program[] = [];
	private allProgramNames: string[] = [];
	private allUniversityNames: string[] = [];
	private isLoaded = false;

	private async loadAllData(): Promise<void> {
		if (this.isLoaded) {
			return;
		}

		try {
			console.log("Loading all program data...");
			const types: ProgramType[] = ["sayisal", "esitagirlik", "sozel", "dil"];

			const allData = await Promise.all(
				types.map(async (type) => {
					const response = await fetch(`/data/${type}.json`);
					if (!response.ok) {
						throw new Error(
							`Failed to fetch ${type}.json: ${response.statusText}`,
						);
					}
					const programs = (await response.json()) as Program[];

					// Add the correct rankingType based on the file source
					const rankingTypeMap: Record<ProgramType, string> = {
						sayisal: "Sayısal",
						esitagirlik: "Eşit Ağırlık",
						sozel: "Sözel",
						dil: "Yabancı Dil",
					};

					// Set the rankingType for each program based on its source file
					return programs.map((program) => ({
						...program,
						rankingType: rankingTypeMap[type],
					}));
				}),
			);

			// Flatten all programs into one array
			this.allPrograms = allData.flat();

			// Extract unique program names for suggestions
			const programNameSet = new Set(
				this.allPrograms.map((p) => p.programName),
			);
			this.allProgramNames = Array.from(programNameSet).sort();

			// Extract unique university names for suggestions
			const universityNameSet = new Set(
				this.allPrograms.map((p) => p.universityName),
			);
			this.allUniversityNames = Array.from(universityNameSet).sort();

			this.isLoaded = true;
			console.log(`Loaded ${this.allPrograms.length} total programs`);
			console.log(
				`Extracted ${this.allProgramNames.length} unique program names`,
			);
			console.log(
				`Extracted ${this.allUniversityNames.length} unique university names`,
			);
		} catch (error) {
			console.error("Error loading program data:", error);
			throw new Error(
				"Failed to load program data. Please check your connection.",
			);
		}
	}

	async getRandomProgram(): Promise<Program> {
		await this.loadAllData();

		if (this.allPrograms.length === 0) {
			throw new Error("No programs available");
		}

		const randomIndex = Math.floor(Math.random() * this.allPrograms.length);
		const program = this.allPrograms[randomIndex];

		if (!program) {
			throw new Error("Failed to get random program");
		}

		// Add a unique identifier based on the index for sharing purposes
		return { ...program, gameId: randomIndex };
	}

	async getProgramById(gameId: number): Promise<Program | null> {
		await this.loadAllData();

		if (gameId < 0 || gameId >= this.allPrograms.length) {
			return null;
		}

		const program = this.allPrograms[gameId];
		return program ? { ...program, gameId } : null;
	}

	async getProgramNames(): Promise<string[]> {
		await this.loadAllData();
		return this.allProgramNames;
	}

	async getProgramNamesByRankingType(rankingType: string): Promise<string[]> {
		await this.loadAllData();
		
		// Filter programs by ranking type and get unique program names
		const filteredPrograms = this.allPrograms.filter(
			program => program.rankingType === rankingType
		);
		
		const programNameSet = new Set(
			filteredPrograms.map(p => p.programName)
		);
		
		return Array.from(programNameSet).sort();
	}

	async getUniversityNames(): Promise<string[]> {
		await this.loadAllData();
		return this.allUniversityNames;
	}

	async getTotalCount(): Promise<number> {
		await this.loadAllData();
		return this.allPrograms.length;
	}

	async preloadData(): Promise<void> {
		await this.loadAllData();
	}

	clearCache(): void {
		this.allPrograms = [];
		this.allProgramNames = [];
		this.allUniversityNames = [];
		this.isLoaded = false;
		console.log("Data cache cleared");
	}

	getLoadStatus(): { loaded: boolean; count: number } {
		return {
			loaded: this.isLoaded,
			count: this.allPrograms.length,
		};
	}

	// Normalize program name by removing language information and other variations
	private normalizeProgramName(programName: string): string {
		return (
			programName
				.toLowerCase()
				.trim()
				// Remove language specifications
				.replace(/\s*\(i̇ngilizce\)\s*/gi, "")
				.replace(/\s*\(ingilizce\)\s*/gi, "")
				.replace(/\s*\(almanca\)\s*/gi, "")
				.replace(/\s*\(fransızca\)\s*/gi, "")
				.replace(/\s*\(rusça\)\s*/gi, "")
				.replace(/\s*\(arapça\)\s*/gi, "")
				.replace(/\s*\(çince\)\s*/gi, "")
				.replace(/\s*\(japonca\)\s*/gi, "")
				.replace(/\s*\(korece\)\s*/gi, "")
				.replace(/\s*\(i̇spanyolca\)\s*/gi, "")
				.replace(/\s*\(ispanyolca\)\s*/gi, "")
				.replace(/\s*\(i̇talyanca\)\s*/gi, "")
				.replace(/\s*\(italyanca\)\s*/gi, "")
				// Remove Turkish diacritics for better matching
				.replace(/ğ/g, "g")
				.replace(/ü/g, "u")
				.replace(/ş/g, "s")
				.replace(/ı/g, "i")
				.replace(/ö/g, "o")
				.replace(/ç/g, "c")
				// Normalize spaces
				.replace(/\s+/g, " ")
				.trim()
		);
	}

	// Check if two program names match, ignoring language variants
	checkProgramNameMatch(guess: string, target: string): boolean {
		const normalizedGuess = this.normalizeProgramName(guess);
		const normalizedTarget = this.normalizeProgramName(target);
		return normalizedGuess === normalizedTarget;
	}
}

// Export a singleton instance
export const gameDataService = new GameDataService();
