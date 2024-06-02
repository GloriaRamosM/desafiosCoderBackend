import winston from "winston";
import config from "../config.js";

const levels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  http: 4,
  debug: 5,
};

const devLogger = winston.createLogger({
  levels: levels,
  transports: [new winston.transports.Console({ level: "debug" })],
});

const prodLogger = winston.createLogger({
  levels,
  transports: [
    new winston.transports.Console({ level: "info" }),

    new winston.transports.File({
      filename: "./errors.log",
      level: "error",
    }),
  ],
});

export const addLogger = (req, res, next) => {
  req.logger = config.NODE_ENV === "PRODUCTION" ? prodLogger : devLogger;
  req.logger.http(
    `${req.method} en ${req.url} - ${new Date().toLocaleString()}`
  );
  next();
};
export const Logger = config.NODE_ENV === "PRODUCTION" ? prodLogger : devLogger;
