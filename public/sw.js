const CACHE_NAME = "shonan-juku-v1";

// キャッシュするリソース（インストール時）
const PRECACHE_URLS = [
  "/",
  "/dashboard",
  "/manifest.json",
];

// インストール：事前キャッシュ
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// アクティベート：古いキャッシュを削除
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// フェッチ：Network First（オンライン優先、失敗時にキャッシュ）
self.addEventListener("fetch", (event) => {
  // Chrome拡張やAPIリクエストはスキップ
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 成功したらキャッシュを更新
        if (response && response.status === 200 && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // オフライン時：キャッシュから返す
        return caches.match(event.request).then((cached) => cached || caches.match("/dashboard"));
      })
  );
});
