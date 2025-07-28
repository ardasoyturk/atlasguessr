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
	alternativeNames?: string[]; // Optional array of alternative program names
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
			const types: ProgramType[] = [
				"sayisal",
				"esitagirlik",
				"sozel",
				"dil",
			];

			const allData = await Promise.all(
				types.map(async (type) => {
					const response = await fetch(`/data/${type}.json`);
					if (!response.ok) {
						throw new Error(
							`Failed to fetch ${type}.json: ${response.statusText}`
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
				})
			);

			// Flatten all programs into one array
			this.allPrograms = allData.flat();

			// Extract ALL program names for suggestions (including alternative names)
			const allProgramNamesSet = new Set<string>();

			for (const program of this.allPrograms) {
				// Add main program name
				allProgramNamesSet.add(program.programName);

				// Add alternative names if they exist
				if (program.alternativeNames) {
					for (const altName of program.alternativeNames) {
						allProgramNamesSet.add(altName);
					}
				}
			}

			this.allProgramNames = Array.from(allProgramNamesSet).sort(); // Extract unique university names for suggestions
			const universityNameSet = new Set(
				this.allPrograms.map((p) => p.universityName)
			);
			this.allUniversityNames = Array.from(universityNameSet).sort();

			this.isLoaded = true;
			console.log(`Loaded ${this.allPrograms.length} total programs`);
			console.log(
				`Extracted ${this.allProgramNames.length} unique program names`
			);
			console.log(
				`Extracted ${this.allUniversityNames.length} unique university names`
			);
		} catch (error) {
			console.error("Error loading program data:", error);
			throw new Error(
				"Failed to load program data. Please check your connection."
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

		return program;
	}

	async getProgramNames(): Promise<string[]> {
		await this.loadAllData();
		return this.allProgramNames;
	}

	async getProgramNamesByRankingType(rankingType: string): Promise<string[]> {
		await this.loadAllData();

		// Filter programs by ranking type and get ALL program names (including alternative names)
		const filteredPrograms = this.allPrograms.filter(
			(program) => program.rankingType === rankingType
		);

		// Extract ALL unique program names, including alternative names
		const allProgramNamesSet = new Set<string>();

		for (const program of filteredPrograms) {
			// Add main program name
			allProgramNamesSet.add(program.programName);

			// Add alternative names if they exist
			if (program.alternativeNames) {
				for (const altName of program.alternativeNames) {
					allProgramNamesSet.add(altName);
				}
			}
		}

		return Array.from(allProgramNamesSet).sort();
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

	// Normalize text for Turkish comparison
	private normalizeText(text: string): string {
		return text
			.toLocaleLowerCase("tr-TR")
			.replace(/ğ/g, "g")
			.replace(/ü/g, "u")
			.replace(/ş/g, "s")
			.replace(/ı/g, "i")
			.replace(/ö/g, "o")
			.replace(/ç/g, "c")
			.trim();
	}

	// Check if two program names match, considering both main name and alternative names
	checkProgramNameMatch(guess: string, target: Program): boolean {
		const guessNormalized = this.normalizeText(guess);
		const targetNameNormalized = this.normalizeText(target.programName);

		// Check exact match with main program name
		if (guessNormalized === targetNameNormalized) {
			return true;
		}

		// Check exact match with alternative names
		if (target.alternativeNames) {
			for (const altName of target.alternativeNames) {
				const altNameNormalized = this.normalizeText(altName);
				if (guessNormalized === altNameNormalized) {
					return true;
				}
			}
		}

		return false;
	}
}

// Export a singleton instance
export const gameDataService = new GameDataService();
