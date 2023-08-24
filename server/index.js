// Importa las librerías y módulos necesarios
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const microCors = require("micro-cors");
const config = require("./config");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Inicia la aplicación Next.js
app.prepare().then(() => {
  // Crea y configura el servidor Node.js
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    // Maneja las solicitudes utilizando el handler de Next.js
    handle(req, res, parsedUrl);
  });

  // Crea un middleware CORS
  const cors = microCors();

  // Aplica el middleware CORS a tu servidor Next.js
  const corsServer = cors(server);

  // Inicia el servidor
  server.listen(config.port, (err) => {
    if (err) throw err;
    console.log(`Servidor iniciado http://localhost:${config.port}`);
  });
});
