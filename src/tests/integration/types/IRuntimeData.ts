import { Server } from "http";
import TestAgent from "supertest/lib/agent";

export interface IRuntimeData {
  getData(): {
    app: Server;
    supertest: TestAgent;
    globalCookie: Record<string, string>;
  };

  addGlobalCookie(arg: { email: string; cookie: string }): void;
}
