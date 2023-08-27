// Importa las librerías y módulos necesarios
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
console.log('dev', dev)
const app = next({ dev });
const handle = app.getRequestHandler();

// Inicia la aplicación Next.js
app.prepare().then(() => {
  // Crea y configura el servidor Node.js
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    
    // Maneja las solicitudes utilizando el handler de Next.js
    handle(req, res, parsedUrl);
  });

  // Inicia el servidor
  server.listen(process.env.PORT, (err) => {
    if (err) throw err;
    console.log(`Servidor iniciado http://localhost:${process.env.PORT}`);
  });
});
