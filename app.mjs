import { default as createError } from "http-errors";
import { default as express } from "express";
import * as path from "path";
import { default as cookieParser } from "cookie-parser";
import { default as logger } from "morgan";
import { default as bodyParser } from "body-parser";
import * as http from "http";
import { router as indexRouter } from "./routes/index.mjs";
import { default as DBG } from "debug";
import { approotdir } from "./approotdir.mjs";
import { onError, onListening, normalizePort } from "./appsupport.mjs";


const __dirname = approotdir;
export const app = express();
const debug = DBG("app:debug");
const debugError = DBG("app:error");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  debugError(err);
  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */
export const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
