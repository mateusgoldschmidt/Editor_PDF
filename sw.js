const CACHE_NAME = 'pdf-workspace-dynamic-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png'
];

// Instalação: Guarda os arquivos básicos no cache e assume o controle na hora
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Ativação: Limpa caches velhos antigos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    }).then(() => self.clients.claim())
  );
});

// Interceptação com estratégia NETWORK FIRST (Rede Primeiro, Cache como Plano B)
self.addEventListener('fetch', (e) => {
  // Ignora requisições de outras origens (como as bibliotecas externas do CDN)
  if (!e.request.url.startsWith(self.location.origin)) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        // Se a internet funcionou e baixou a versão mais recente do GitHub,
        // ele clona essa resposta e atualiza o cache silenciosamente.
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseClone);
        });
        
        // Retorna a versão novinha em folha para a tela
        return networkResponse;
      })
      .catch(() => {
        // Se falhou (celular offline ou sem sinal), ele busca a última versão que guardou no cache
        return caches.match(e.request);
      })
  );
});
