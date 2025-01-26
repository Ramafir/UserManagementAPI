import { IncomingMessage } from "http";

export type IncomingAllowRequestMessage = IncomingMessage & { userId?: number };
