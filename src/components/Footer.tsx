"use client";

export function Footer() {
	return (
		<footer className="mt-12 border-indigo-200 border-t pt-6">
			<div className="flex items-center justify-between text-sm">
				<p className="text-gray-600">
					Made with ❤️ by{" "}
					<a
						href="https://ardasoyturk.com"
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium text-indigo-700"
					>
						Arda Soyturk
					</a>
				</p>
				<p className="text-gray-500 text-xs">
					Türk üniversitelerini keşfetmenin eğlenceli yolu
				</p>
			</div>
		</footer>
	);
}
