import { getIpv4RecordsFromData } from "../helpers";
import { Ipv4Record } from "../types";
import { remoteData } from "./fixtures";

describe("getIpv4RecordsFromData", () => {
    it("should properly parse remote data", () => {
        const expected: Ipv4Record[] = [
            {
                ipv4: "5.10.250.122",
                severity: 12,
            },
            {
                ipv4: "141.98.10.172",
                severity: 11,
            },
            {
                ipv4: "202.90.198.2",
                severity: 10,
            },
        ];

        const result = getIpv4RecordsFromData(remoteData);

        expect(result).toStrictEqual(expected);
    });
});
