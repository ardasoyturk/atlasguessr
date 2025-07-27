"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
	useEffect(() => {
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker
				.register("/sw.js")
				.then((registration) => {
					console.log("SW registered: ", registration);
					// Preload data when SW is ready
					if (registration.active) {
						registration.active.postMessage({
							type: "PRELOAD_DATA",
						});
					}
				})
				.catch((registrationError) => {
					console.log("SW registration failed: ", registrationError);
				});
		}
	}, []);

	return null;
}
