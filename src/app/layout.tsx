import "@/styles/globals.css";

import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import type { Viewport } from "next";
import { Geist } from "next/font/google";

export const viewport: Viewport = {
	themeColor: "#3b82f6",
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
		{ rel: "apple-touch-icon", url: "/favicon.ico" },
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
