import { BlackListService } from "../BlackListService";
import axios from "axios";
import { readFile, writeFile } from "fs/promises";
import { remoteData } from "./fixtures";
import { Ipv4BlacklistData } from "../types";
import logger from "../logger";

jest.mock("axios");
jest.mock("fs/promises");

describe("BlackListService", () => {
    beforeEach(() => {
        logger.silent = true;
        // Reset all mocks before each test
        jest.resetAllMocks();

        // mock axios to return fixtures
        (axios.get as jest.Mock).mockImplementation(() =>
            Promise.resolve({ data: remoteData })
        );
    });

    test("init correctly starts the service", async () => {
        const service = new BlackListService({
            pollFrequencyMs: 30 * 60 * 1000,
            dataStorePath: "./data.json",
        });
        const loadStateFromDiskSpy = jest.spyOn(service, "_loadStateFromDisk");
        const pollSpy = jest.spyOn(service, "_poll");

        await service.init();

        expect(loadStateFromDiskSpy).toHaveBeenCalledTimes(1);
        expect(pollSpy).toHaveBeenCalledTimes(1);
        expect(service._intervalHandle).not.toBeNull();
        service.stop();
    });

    test("_poll correctly updates state", async () => {
        const service = new BlackListService({
            pollFrequencyMs: 30 * 60 * 1000,
            dataStorePath: "./data.json",
        });

        await service._poll();

        expect(service._ipv4RecordsMap.size).toBeGreaterThan(0);
        expect(service._lastUpdatedAt).not.toBeNull();
    });

    test("_saveStateToDisk and _loadStateFromDisk work correctly", async () => {
        const service = new BlackListService({
            pollFrequencyMs: 30 * 60 * 1000,
            dataStorePath: "./data.json",
        });
        const mockData: Ipv4BlacklistData = {
            updatedAt: Date.now(),
            ipv4Records: [{ ipv4: "1.1.1.1", severity: 1 }],
        };
        (writeFile as jest.Mock).mockResolvedValue(undefined);
        (readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

        await service._loadStateFromDisk();
        expect(readFile).toHaveBeenCalledWith("./data.json", "utf-8");
        expect(service._ipv4RecordsMap.get("1.1.1.1")).toEqual({
            ipv4: "1.1.1.1",
            severity: 1,
        });

        await service._saveStateToDisk(mockData.ipv4Records, mockData.updatedAt);
        expect(writeFile).toHaveBeenCalledWith(
            "./data.json",
            JSON.stringify(mockData, null, 2)
        );
    });

    test("isIpv4Blacklisted correctly checks if an IP is blacklisted", () => {
        const service = new BlackListService({
            pollFrequencyMs: 30 * 60 * 1000,
            dataStorePath: "./data.json",
        });
        service._ipv4RecordsMap = new Map([
            ["1.1.1.1", { ipv4: "1.1.1.1", severity: 1 }],
        ]);

        expect(service.isIpv4Blacklisted("1.1.1.1")).toBe(true);
        expect(service.isIpv4Blacklisted("2.2.2.2")).toBe(false);
    });
});
