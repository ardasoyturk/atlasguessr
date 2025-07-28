"use client";

export function Footer() {
	return (
		<footer className="mt-8 border-indigo-200 border-t pt-4 sm:mt-12 sm:pt-6 dark:border-gray-700">
			<div className="flex flex-col items-center gap-2 text-center text-sm sm:flex-row sm:justify-between sm:text-left">
				<p className="text-gray-600 dark:text-gray-300">
					Made with ❤️ by{" "}
					<a
						href="https://ardasoyturk.com"
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium text-indigo-700 dark:text-indigo-400"
					>
						Arda Soyturk
					</a>
				</p>
				<p className="text-gray-500 text-xs dark:text-gray-400">
					Türk üniversitelerini keşfetmenin eğlenceli yolu
				</p>
			</div>
		</footer>
	);
}
