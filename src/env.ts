const SERVER_PORT = process.env.SERVER_PORT || "4444";
const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const BLACKLIST_FILE_PATH = process.env.BLACKLIST_FILE_PATH || "./ipv4Blacklist.json";
const POLL_FREQUENCY_MS = process.env.POLL_FREQUENCY_MS || 30 * 60 * 1000; // 30 minutes;

export {
    SERVER_PORT,
    LOG_LEVEL,
    BLACKLIST_FILE_PATH,
    POLL_FREQUENCY_MS,
};