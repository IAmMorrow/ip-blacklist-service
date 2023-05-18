import Koa from "koa";
import Router from "koa-router";
import dotenv from "dotenv";
import logger from "./logger";

import { BlackListService } from "./BlackListService";
import { SERVER_PORT, BLACKLIST_FILE_PATH, POLL_FREQUENCY_MS } from "./env";

dotenv.config();

const blackListService = new BlackListService({
    pollFrequencyMs: Number(POLL_FREQUENCY_MS),
    dataStorePath: BLACKLIST_FILE_PATH,
});

const app = new Koa();
const router = new Router();

router.get("/ips/:ipv4", async (ctx, next) => {
    ctx.body = blackListService.isIpv4Blacklisted(ctx.params.ipv4);
    ctx.status = 200;
    await next();
});

app.use(router.routes());
app.use(router.allowedMethods());

async function main() {
    logger.info("ip-blacklist-server started");
    try {
        await blackListService.init();
        app.listen(Number(SERVER_PORT));
        logger.info(`Server is listening on port ${SERVER_PORT}`);
    } catch (error) {
        logger.error(`Failed to start the server: ${error}`);
    }
}

main();
