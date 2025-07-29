"use client";

import { useEffect, useState } from "react";

// Type for beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[];
	readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
	prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
	const [showInstall, setShowInstall] = useState(false);
	const [isStandalone, setIsStandalone] = useState(false);

	useEffect(() => {
		// Check if already installed (running in standalone mode)
		const checkStandalone = () => {
			setIsStandalone(
				window.matchMedia("(display-mode: standalone)").matches ||
					("standalone" in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true) ||
					document.referrer.includes("android-app://"),
			);
		};

		checkStandalone();

		// Listen for beforeinstallprompt event
		const handler = (e: Event) => {
			console.log("beforeinstallprompt olayı tetiklendi");
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);
			setShowInstall(true);
		};

		window.addEventListener("beforeinstallprompt", handler as EventListener);

		// For debugging - show install button after 2 seconds if in development
		const isDev = process.env.NODE_ENV === "development" || window.location.hostname === "localhost";
		if (isDev && !isStandalone) {
			setTimeout(() => {
				if (!deferredPrompt) {
					console.log("Geliştirme modu: beforeinstallprompt olmadan yükleme düğmesi gösteriliyor");
					console.log("PWA Yükleme kriterleri kontrolü:");
					console.log(
						"- HTTPS veya localhost:",
						window.location.protocol === "https:" || window.location.hostname === "localhost",
					);
					console.log("- Manifest var:", document.querySelector('link[rel="manifest"]') !== null);
					console.log("- Service worker var:", "serviceWorker" in navigator);
					console.log("- Standalone modu:", isStandalone);
					setShowInstall(true);
				}
			}, 2000);
		}

		return () => {
			window.removeEventListener("beforeinstallprompt", handler as EventListener);
		};
	}, [deferredPrompt, isStandalone]);

	const handleInstallClick = async () => {
		if (!deferredPrompt) {
			// Provide helpful instructions based on the browser/platform
			const userAgent = navigator.userAgent;
			let instructions = "";

			if (userAgent.includes("Chrome") || userAgent.includes("Chromium")) {
				instructions =
					"Chrome'da: Üç nokta menüsüne (⋮) tıklayın → 'Atlasguessr'i yükle' veya adres çubuğundaki yükleme simgesini arayın.";
			} else if (userAgent.includes("Safari")) {
				instructions = "Safari'de: Paylaş düğmesine (□↗) dokunun → 'Ana Ekrana Ekle'.";
			} else if (userAgent.includes("Firefox")) {
				instructions = "Firefox'ta: Üç çizgi menüsüne (☰) tıklayın → 'Yükle' veya 'Ana Ekrana Ekle'.";
			} else if (userAgent.includes("Edge")) {
				instructions = "Edge'de: Üç nokta menüsüne (...) tıklayın → 'Uygulamalar' → 'Bu siteyi uygulama olarak yükle'.";
			} else {
				instructions = "Tarayıcınızın menüsünde 'Ana Ekrana Ekle' veya 'Uygulama Yükle' seçeneğini arayın.";
			}

			alert(
				`Bu uygulamayı yüklemek için:\n\n${instructions}\n\nBu, Atlasguessr'i çevrimdışı kullanmanıza ve yerel bir uygulama gibi erişmenize olanak tanır!`,
			);
			return;
		}

		try {
			deferredPrompt.prompt();
			const { outcome } = await deferredPrompt.userChoice;
			console.log("Yükleme istemi sonucu:", outcome);

			if (outcome === "accepted") {
				setShowInstall(false);
				setDeferredPrompt(null);
			}
		} catch (error) {
			console.error("Yükleme istemi sırasında hata:", error);
		}
	};

	// Don't show if already installed
	if (isStandalone || !showInstall) return null;

	return (
		<button
			type="button"
			onClick={handleInstallClick}
			className="fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white shadow-lg hover:bg-blue-700"
			aria-label="Atlasguessr'i uygulama olarak yükle"
		>
			<span className="text-lg">📱</span>
			<span>Uygulamayı Yükle</span>
		</button>
	);
}
