import { z } from "zod";
import { schemaIpv4BlacklistData, schemaIpv4Record } from "./schemas";

export type Ipv4Record = z.infer<typeof schemaIpv4Record>;
export type Ipv4BlacklistData = z.infer<typeof schemaIpv4BlacklistData>;
