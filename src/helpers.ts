import { Ipv4Record } from "./types";

const IPV4_REGEX =
  /(?<ipv4>[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)\s+(?<severity>[0-9]+)/;

/*
 * Parse the blacklist .txt data and extract a list of
 * ipv4 addresses and their associated severity
 */
export function getIpv4RecordsFromData(data: string): Ipv4Record[] {
    // splitting the file in lines for easier parsing
    const dataLines = data.split("\n");

    // extracting any ipv4 address and severity from the lines
    return dataLines.reduce((acc: Ipv4Record[], dataLine) => {
        const lineMatch = dataLine.match(IPV4_REGEX);

        // checking if an IP was found on this line
        if (
            lineMatch &&
      lineMatch.groups &&
      "ipv4" in lineMatch.groups &&
      "severity" in lineMatch.groups
        ) {
            acc.push({
                ipv4: lineMatch.groups.ipv4,
                severity: Number(lineMatch.groups.severity),
            });
        }
        return acc;
    }, []);
}

/*
 * Turns Ipv4Record list to a map
 */
export function ipv4RecordsListToMap(
    records: Ipv4Record[]
): Map<string, Ipv4Record> {
    const map = new Map<string, Ipv4Record>();

    for (let i = 0; i < records.length; i++) {
        const record = records[i];
        map.set(record.ipv4, record);
    }

    return map;
}
