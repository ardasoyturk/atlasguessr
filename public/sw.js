// @ts-nocheck
// Service Worker for offline caching
const CACHE_NAME = "atlas-guessr-v1";
const DATA_CACHE_NAME = "atlas-guessr-data-v1";

// Files to cache for offline functionality
const urlsToCache = [
	"/",
	"/data/sayisal.json",
	"/data/esitagirlik.json",
	"/data/sozel.json",
	"/data/dil.json",
	"/_next/static/css/",
	"/_next/static/js/",
];

// Install event - cache essential files
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => {
				console.log("Service Worker: Caching essential files");
				return cache.addAll(["/"]); // Cache main page first
			})
			.then(() => {
				console.log("Service Worker: Essential files cached");
				return self.skipWaiting();
			}),
	);
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cacheName) => {
						if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
							console.log("Service Worker: Deleting old cache", cacheName);
							return caches.delete(cacheName);
						}
					}),
				);
			})
			.then(() => {
				console.log("Service Worker: Activated");
				return self.clients.claim();
			}),
	);
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Handle data files with cache-first strategy
	if (url.pathname.startsWith("/data/")) {
		event.respondWith(
			caches.open(DATA_CACHE_NAME).then((cache) => {
				return cache.match(request).then((response) => {
					if (response) {
						console.log(
							"Service Worker: Serving data from cache",
							url.pathname,
						);
						return response;
					}

					// If not in cache, fetch from network and cache it
					return fetch(request)
						.then((fetchResponse) => {
							// Check if we received a valid response
							if (
								!fetchResponse ||
								fetchResponse.status !== 200 ||
								fetchResponse.type !== "basic"
							) {
								return fetchResponse;
							}

							// Clone the response
							const responseToCache = fetchResponse.clone();
							cache.put(request, responseToCache);
							console.log("Service Worker: Cached data file", url.pathname);

							return fetchResponse;
						})
						.catch(() => {
							console.log(
								"Service Worker: Network failed for data file",
								url.pathname,
							);
							// Return empty array as fallback for data files
							return new Response("[]", {
								status: 200,
								statusText: "OK",
								headers: { "Content-Type": "application/json" },
							});
						});
				});
			}),
		);
		return;
	}

	// Handle app files with network-first strategy
	if (url.origin === location.origin) {
		event.respondWith(
			fetch(request)
				.then((response) => {
					// If successful, cache the response
					if (response.status === 200) {
						const responseClone = response.clone();
						caches.open(CACHE_NAME).then((cache) => {
							cache.put(request, responseClone);
						});
					}
					return response;
				})
				.catch(() => {
					// If network fails, try cache
					return caches.match(request).then((response) => {
						if (response) {
							console.log(
								"Service Worker: Serving from cache (offline)",
								url.pathname,
							);
							return response;
						}

						// If requesting the main page and not cached, return offline page
						if (request.mode === "navigate") {
							return caches.match("/");
						}

						throw new Error("No cache entry for " + request.url);
					});
				}),
		);
	}
});

// Background sync for preloading data
self.addEventListener("message", (event) => {
	if (event.data && event.data.type === "PRELOAD_DATA") {
		console.log("Service Worker: Preloading data files");

		const dataUrls = [
			"/data/sayisal.json",
			"/data/esitagirlik.json",
			"/data/sozel.json",
			"/data/dil.json",
		];

		caches
			.open(DATA_CACHE_NAME)
			.then((cache) => {
				return Promise.all(
					dataUrls.map((url) => {
						return fetch(url)
							.then((response) => {
								if (response.status === 200) {
									cache.put(url, response.clone());
									console.log("Service Worker: Preloaded", url);
								}
								return response;
							})
							.catch((error) => {
								console.warn("Service Worker: Failed to preload", url, error);
							});
					}),
				);
			})
			.then(() => {
				// Notify the client that preloading is complete
				if (event.source && typeof event.source.postMessage === "function") {
					event.source.postMessage({ type: "PRELOAD_COMPLETE" });
				}
			});
	}
});

console.log("Service Worker: Loaded");
