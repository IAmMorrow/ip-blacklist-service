import { z } from "zod";

export const schemaIpv4Record = z.object({
    ipv4: z.string(),
    severity: z.number(),
});

export const schemaIpv4BlacklistData = z.object({
    ipv4Records: z.array(schemaIpv4Record),
    updatedAt: z.number(),
});
