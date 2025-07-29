"use client";

import { useEffect, useState } from "react";

interface ManifestIcon {
	src: string;
	sizes?: string;
	type?: string;
	purpose?: string;
}

interface ManifestData {
	name?: string;
	short_name?: string;
	start_url?: string;
	display?: string;
	icons?: ManifestIcon[];
	theme_color?: string;
	background_color?: string;
}

interface PWAStatus {
	hasManifest: boolean;
	hasServiceWorker: boolean;
	isHttps: boolean;
	isStandalone: boolean;
	hasValidIcons: boolean;
	manifestData?: ManifestData;
	errors: string[];
}

export function PWADebug() {
	const [status, setStatus] = useState<PWAStatus>({
		hasManifest: false,
		hasServiceWorker: false,
		isHttps: false,
		isStandalone: false,
		hasValidIcons: false,
		errors: [],
	});
	const [showDebug, setShowDebug] = useState(false);

	useEffect(() => {
		const checkPWAStatus = async () => {
			const errors: string[] = [];
			let manifestData: ManifestData | null = null;

			// Check HTTPS
			const isHttps = window.location.protocol === "https:" || window.location.hostname === "localhost";
			if (!isHttps) {
				errors.push("Not served over HTTPS (required for PWA)");
			}

			// Check manifest
			const manifestLink = document.querySelector('link[rel="manifest"]');
			const hasManifest = !!manifestLink;
			if (!hasManifest) {
				errors.push("No manifest link found");
			} else {
				try {
					const manifestUrl = manifestLink.getAttribute("href");
					if (manifestUrl) {
						const response = await fetch(manifestUrl);
						manifestData = (await response.json()) as ManifestData;

						// Validate manifest requirements
						if (!manifestData.name && !manifestData.short_name) {
							errors.push("Manifest missing name/short_name");
						}
						if (!manifestData.start_url) {
							errors.push("Manifest missing start_url");
						}
						if (!manifestData.display) {
							errors.push("Manifest missing display mode");
						}
						if (!manifestData.icons || manifestData.icons.length === 0) {
							errors.push("Manifest missing icons");
						} else {
							const hasLargeIcon = manifestData.icons.some((icon: ManifestIcon) => {
								const sizes = icon.sizes?.split("x");
								return sizes?.[0] ? Number.parseInt(sizes[0], 10) >= 192 : false;
							});
							if (!hasLargeIcon) {
								errors.push("No icon >= 192x192 found");
							}
						}
					}
				} catch (e) {
					errors.push("Failed to fetch/parse manifest");
				}
			}

			// Check Service Worker
			const hasServiceWorker = "serviceWorker" in navigator;
			if (!hasServiceWorker) {
				errors.push("Service Worker not supported");
			} else {
				try {
					const registration = await navigator.serviceWorker.getRegistration();
					if (!registration) {
						errors.push("No Service Worker registered");
					}
				} catch (e) {
					errors.push("Service Worker registration failed");
				}
			}

			// Check standalone mode
			const isStandalone =
				window.matchMedia("(display-mode: standalone)").matches ||
				("standalone" in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true) ||
				document.referrer.includes("android-app://");

			setStatus({
				hasManifest,
				hasServiceWorker,
				isHttps,
				isStandalone,
				hasValidIcons: manifestData?.icons?.length ? manifestData.icons.length > 0 : false,
				manifestData: manifestData || undefined,
				errors,
			});
		};

		checkPWAStatus();

		// Show debug in development
		if (process.env.NODE_ENV === "development") {
			setShowDebug(true);
		}
	}, []);

	if (!showDebug && process.env.NODE_ENV !== "development") return null;

	const allGood = status.errors.length === 0 && status.hasManifest && status.hasServiceWorker && status.isHttps;

	return (
		<div className="fixed top-4 left-4 z-50 max-w-md rounded-lg bg-gray-900 p-4 text-white shadow-lg">
			<div className="mb-2 flex items-center justify-between">
				<h3 className="font-bold">PWA Status</h3>
				<button type="button" onClick={() => setShowDebug(!showDebug)} className="text-gray-400 hover:text-white">
					{showDebug ? "Hide" : "Show"}
				</button>
			</div>

			{showDebug && (
				<div className="space-y-2 text-sm">
					<div className={`flex items-center gap-2 ${allGood ? "text-green-400" : "text-red-400"}`}>
						<span>{allGood ? "✅" : "❌"}</span>
						<span>PWA Ready: {allGood ? "Yes" : "No"}</span>
					</div>

					<div className="space-y-1">
						<div className={`flex items-center gap-2 ${status.isHttps ? "text-green-400" : "text-red-400"}`}>
							<span>{status.isHttps ? "✅" : "❌"}</span>
							<span>HTTPS: {status.isHttps ? "Yes" : "No"}</span>
						</div>

						<div className={`flex items-center gap-2 ${status.hasManifest ? "text-green-400" : "text-red-400"}`}>
							<span>{status.hasManifest ? "✅" : "❌"}</span>
							<span>Manifest: {status.hasManifest ? "Yes" : "No"}</span>
						</div>

						<div className={`flex items-center gap-2 ${status.hasServiceWorker ? "text-green-400" : "text-red-400"}`}>
							<span>{status.hasServiceWorker ? "✅" : "❌"}</span>
							<span>Service Worker: {status.hasServiceWorker ? "Yes" : "No"}</span>
						</div>

						<div className={`flex items-center gap-2 ${status.hasValidIcons ? "text-green-400" : "text-red-400"}`}>
							<span>{status.hasValidIcons ? "✅" : "❌"}</span>
							<span>Icons: {status.hasValidIcons ? "Yes" : "No"}</span>
						</div>

						<div className={`flex items-center gap-2 ${status.isStandalone ? "text-green-400" : "text-gray-400"}`}>
							<span>{status.isStandalone ? "✅" : "ℹ️"}</span>
							<span>Standalone: {status.isStandalone ? "Yes" : "No"}</span>
						</div>
					</div>

					{status.errors.length > 0 && (
						<div className="mt-3 rounded bg-red-900/50 p-2">
							<div className="font-medium text-red-300">Issues:</div>
							<ul className="mt-1 list-inside list-disc text-red-200 text-xs">
								{status.errors.map((error) => (
									<li key={error}>{error}</li>
								))}
							</ul>
						</div>
					)}

					{status.manifestData && (
						<details className="mt-3">
							<summary className="cursor-pointer text-blue-300">Manifest Data</summary>
							<pre className="mt-1 max-h-32 overflow-auto text-gray-300 text-xs">
								{JSON.stringify(status.manifestData, null, 2)}
							</pre>
						</details>
					)}
				</div>
			)}
		</div>
	);
}
