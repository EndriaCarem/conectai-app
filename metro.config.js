const { ServerResponse } = require('http');

const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// expo-sqlite em web precisa de arquivos wasm (docs.expo.dev/versions/v57.0.0/sdk/sqlite).
config.resolver.assetExts.push('wasm');

// COEP/COOP: exige o SharedArrayBuffer usado pelo SQLite WASM no navegador.
// Receita oficial: https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/
config.server.enhanceMiddleware = (middleware) => (req, res, next) => {
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  middleware(req, res, next);
};

// Complemento: o enhanceMiddleware só alcança o middleware do Metro, mas o
// documento HTML raiz é respondido pelo ManifestMiddleware (que entra na frente
// da pilha) — e é nele que o navegador lê COOP/COEP para liberar o
// SharedArrayBuffer. Não há hook oficial para isso, então interceptamos o
// writeHead de todo response gerado por este processo (só o dev server).
// TODO: remover se o Expo passar a aplicar enhanceMiddleware ao documento.
const originalWriteHead = ServerResponse.prototype.writeHead;
ServerResponse.prototype.writeHead = function writeHeadWithIsolationHeaders(...args) {
  const status = typeof args[0] === 'number' ? args[0] : this.statusCode;
  // 1xx/101 (websocket upgrade) não podem receber headers extras.
  if (status >= 200 && !this.headersSent && !this.getHeader('Cross-Origin-Embedder-Policy')) {
    this.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    this.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  }
  return originalWriteHead.apply(this, args);
};

module.exports = config;
