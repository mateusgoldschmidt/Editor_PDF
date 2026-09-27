const CACHE_NAME = 'pdf-workspace-v1';
const ASSETS = [
  './index.html',
  './manifest.json'
];

// Instalação: Guarda os arquivos básicos no cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Intercepta as requisições
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Retorna do cache se encontrar, senão vai para a rede
      return response || fetch(e.request);
    })
  );
});

// Atualiza o cache se a versão mudar
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});
