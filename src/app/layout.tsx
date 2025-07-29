import "@/styles/globals.css";

import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import type { Viewport } from "next";
import { Geist } from "next/font/google";

export const viewport: Viewport = {
	themeColor: "#0f172a",
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export const metadata: Metadata = {
	title: "Atlasguessr - Üniversite Program Tahmin Oyunu",
	description: "Türkiye'deki üniversite programlarını tahmin etme oyunu. Offline oynanabilen eğitici tahmin oyunu.",
	keywords: ["üniversite", "program", "tahmin", "oyun", "eğitim", "türkiye"],
	authors: [{ name: "Atlasguessr" }],
	manifest: "/manifest.json",
	icons: [
		{ rel: "icon", url: "/favicon.ico" },
		{ rel: "apple-touch-icon", url: "/apple-touch-icon.png", sizes: "180x180" },
		{ rel: "icon", url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
		{ rel: "icon", url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
		{ rel: "icon", url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
	],

	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: "Atlasguessr",
	},
	openGraph: {
		title: "Atlasguessr",
		description: "Üniversite Program Tahmin Oyunu",
		type: "website",
		locale: "tr_TR",
	},
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="tr" className={`${geist.variable}`}>
			<head>
				<link rel="manifest" href="/manifest.json" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content="Atlasguessr" />
				<meta name="application-name" content="Atlasguessr" />
				<meta name="msapplication-TileColor" content="#0f172a" />
				<meta name="msapplication-config" content="none" />
			</head>
			<GoogleTagManager gtmId="GTM-N6HWL9CP" />
			<body className="min-h-screen bg-background text-foreground antialiased">
				{children}
				<PWAInstallPrompt />
				<ServiceWorkerRegistration />
				<GoogleAnalytics gaId="G-SKL8NEHMCN" />
			</body>
		</html>
	);
}
