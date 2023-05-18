import winston from "winston";
import { LOG_LEVEL } from "./env";

const transports: winston.transport[] = [];

transports.push(
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" })
);

if (process.env.NODE_ENV !== "production") {
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({
                    format: "HH:mm:ss",
                }),
                winston.format.printf(({ level, message, timestamp }) => {
                    return `[${timestamp}] ${level}: ${message}`;
                })
            ),
        })
    );
}

const logger = winston.createLogger({
    level: LOG_LEVEL,
    format: winston.format.json(),
    defaultMeta: { service: "ip-blacklist-server" },
    transports,
});

export default logger;
