"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
	useEffect(() => {
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker
				.register("/sw.js", {
					scope: "/",
				})
				.then((registration) => {
					console.log("SW registered: ", registration);
					console.log("SW scope: ", registration.scope);

					// Preload data when SW is ready
					if (registration.active) {
						registration.active.postMessage({
							type: "PRELOAD_DATA",
						});
					}

					// Handle updates
					registration.addEventListener("updatefound", () => {
						console.log("SW update found");
						const newWorker = registration.installing;
						if (newWorker) {
							newWorker.addEventListener("statechange", () => {
								if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
									console.log("SW updated, reload recommended");
								}
							});
						}
					});
				})
				.catch((registrationError) => {
					console.log("SW registration failed: ", registrationError);
				});

			// Listen for SW messages
			navigator.serviceWorker.addEventListener("message", (event) => {
				if (event.data && event.data.type === "PRELOAD_COMPLETE") {
					console.log("SW: Data preloading complete");
				}
			});
		} else {
			console.log("Service Workers not supported");
		}
	}, []);

	return null;
}
