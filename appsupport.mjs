import { close as CloseSequlzConn } from "./models/sequlz.mjs";
import { server } from "./app.mjs";
import { default as DBG } from "debug";
const debug = DBG("app:debug");
const debugError = DBG("app:error");

async function catchProcessDeath() {  
  await CloseSequlzConn();
  await server.close();
  process.exit(0);
}

process.on("SIGTERM", catchProcessDeath);
process.on("SIGINT", catchProcessDeath);
process.on("SIGHUP", catchProcessDeath);

process.on("exit", () => {
  debug("exiting...");
});

/**
 * Event listener for HTTP server "error" event.
 */
 export function onError(error) {
  if (error.syscall !== "listen") {
    debugError(error);
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
 export function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

/**
 * Normalize a port into a number, string, or false.
 */
 export function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

process.on("uncaughtException", function (err) {
  console.error(`I've crashed!!! - ${err.stack || err}`);
});

process.on("unhandledRejection", (reason, p) => {
  console.error(`Unhandled Rejection at: ${util.inspect(p)} reason: ${reason}`);
});