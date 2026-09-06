const CACHE_NAME = 'controle-vendas-v1';
const urlsToCache = [
'index.html',
'1.html',
'2.html',
'3.html',
'4.html',
'5.html',
'6.html',
'7.html',
'logo-192.png',
'logo-512.png'
];

// Instalação do Service Worker e salvamento dos arquivos em cache
self.addEventListener('install', event => {
event.waitUntil(
caches.open(CACHE_NAME)
.then(cache => {
return cache.addAll(urlsToCache);
})
.then(() => self.skipWaiting())
);
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', event => {
event.waitUntil(
caches.keys().then(cacheNames => {
return Promise.all(
cacheNames.map(cacheName => {
if (cacheName !== CACHE_NAME) {
return caches.delete(cacheName);
}
})
);
}).then(() => self.clients.claim())
);
});

// Interceptação de requisições para funcionamento offline (Cache First)
self.addEventListener('fetch', event => {
event.respondWith(
caches.match(event.request)
.then(response => {
// Retorna o arquivo do cache se existir, senão busca na rede
return response || fetch(event.request);
})
.catch(() => {
// Fallback opcional caso queira exibir algo offline para páginas não cacheadas
if (event.request.mode === 'navigate') {
return caches.match('index.html');
}
})
);
});