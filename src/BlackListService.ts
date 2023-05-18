import axios from "axios";
import { readFile, writeFile } from "fs/promises";
import { Ipv4BlacklistData, Ipv4Record } from "./types";
import { schemaIpv4BlacklistData } from "./schemas";
import logger from "./logger";
import { getIpv4RecordsFromData, ipv4RecordsListToMap } from "./helpers";

const blacklistedIpEndpoint =
  "https://raw.githubusercontent.com/stamparm/ipsum/master/ipsum.txt";

type BlackListServiceParams = {
  pollFrequencyMs: number;
  dataStorePath: string;
};

export class BlackListService {
    _params: BlackListServiceParams;
    _intervalHandle: NodeJS.Timer | null = null;
    _ipv4RecordsMap: Map<string, Ipv4Record> = new Map();
    _lastUpdatedAt: number | null = null;

    constructor(params: BlackListServiceParams) {
        this._params = params;
    }

    async init() {
        if (this._intervalHandle !== null) {
            logger.error("BlackListService already started");
            throw new Error("BlackListService already started");
        }

        // optimistically loading existing data on disk
        await this._loadStateFromDisk();

        // starting an update loop
        this._intervalHandle = setInterval(
            this._poll.bind(this),
            this._params.pollFrequencyMs
        );

        // doing an initial poll
        const pollPromise = this._poll();

        if (
            this._lastUpdatedAt &&
      Date.now() - this._lastUpdatedAt > this._params.pollFrequencyMs
        ) {
            logger.info("Local data is too old, cold starting ...");
            await pollPromise;
        }
    }

    stop() {
        if (this._intervalHandle === null) {
            logger.error("BlackListService is not started");
            throw new Error("BlackListService is not started");
        }
        clearInterval(this._intervalHandle);
        this._intervalHandle = null;
    }

    async _saveStateToDisk(ipv4Records: Ipv4Record[], updatedAt: number) {

        const data: Ipv4BlacklistData = {
            updatedAt,
            ipv4Records,
        };

        await writeFile(this._params.dataStorePath, JSON.stringify(data, null, 2));
    }

    async _loadStateFromDisk() {
        try {
            const rawData = await readFile(this._params.dataStorePath, "utf-8");

            // safely parsing and ensuring conformity
            const { updatedAt, ipv4Records } = schemaIpv4BlacklistData.parse(
                JSON.parse(rawData)
            );

            // restoring loaded data in the state
            this._ipv4RecordsMap = ipv4RecordsListToMap(ipv4Records);
            this._lastUpdatedAt = updatedAt;
            logger.info("Loaded records from local data");
        } catch (error) {
            logger.info("Couln't load existing records");
        }
    }

    getIpv4Record(ipv4: string) {
        return this._ipv4RecordsMap.get(ipv4);
    }

    isIpv4Blacklisted(ipv4: string): boolean {
        return this._ipv4RecordsMap.has(ipv4);
    }

    async _poll() {
        const { data } = await axios.get(blacklistedIpEndpoint);

        // if the response data is not a string, something went wrong with github
        if (typeof data !== "string") {
            throw new Error("Bad return type");
        }

        const ipv4Records = getIpv4RecordsFromData(data);
        this._ipv4RecordsMap = ipv4RecordsListToMap(ipv4Records);

        // updating lastUpdatedAt to now
        this._lastUpdatedAt = Date.now();

        // saving new data to disk
        await this._saveStateToDisk(ipv4Records, this._lastUpdatedAt);
    }
}
