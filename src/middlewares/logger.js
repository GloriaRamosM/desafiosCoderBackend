import winston from "winston";

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
  transports: [
    new winston.transports.Console({ level: "debug" }),
    new winston.transports.Console({ level: "http" }),
    new winston.transports.Console({ level: "info" }),
    new winston.transports.Console({ level: "warn" }),
    new winston.transports.Console({ level: "error" }),
    new winston.transports.Console({ level: "fatal" }),
  ],
});

const prodLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: "info" }),
    new winston.transports.File({
      filename: "./errors-env.log",
      level: "warn",
    }),
  ],
});

export const addLogger = (req, res, next) => {
  req.logger = devLogger;
  req.logger.http(
    `${req.method} en ${req.url} - ${new Date().toLocaleString()}`
  );
  next();
};
