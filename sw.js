const CACHE_NAME = 'pdf-workspace-v3'; // Aumentamos a versão aqui
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png'
];

// Instalação: Guarda os arquivos no cache e FORÇA a atualização
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Obriga o app a não esperar para atualizar
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Intercepta as requisições (Offline mode)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

// Ativação: Limpa o cache velho e assume o controle imediatamente
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    }).then(() => self.clients.claim()) // Assume o controle da página na hora
  );
});
