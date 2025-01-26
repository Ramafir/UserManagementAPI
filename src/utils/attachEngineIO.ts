import http from "http";
import { Express } from "express";
import { Server } from "engine.io";
import { IAuthService } from "types/services/IAuthService";
import { IncomingAllowRequestMessage } from "types/IncomingAllowRequestMessage";

import { APP } from "@config";

import { Di } from "@enums/Di";
import { Dependency } from "@enums/Dependency";

import { getInstanceOf } from "@helpers/getInstanceOf";
import { getTokenCookieValue } from "@helpers/getTokenCookieValue";

export const attachEngineIO = (app: Express) => {
  const serverInstance = http.createServer(app);

  log.debug({
    dependency: Dependency.EngineIO,
    message: `Initializing server..`,
  });

  const engineIO = new Server({
    cors: {
      origin: [APP.URL, APP.E2E_TESTS_URL],
      credentials: true,
    },

    // @NOTE handshake (only) on valid token
    allowRequest: async (request: IncomingAllowRequestMessage, callback) => {
      const cookie = request.headers.cookie;

      if (!cookie) {
        return callback("Missing credentials!", false);
      }

      const token = getTokenCookieValue(cookie);

      if (!token) {
        return callback(null, false);
      }

      const authService = getInstanceOf<IAuthService>(Di.AuthService);

      const result = authService.verifyToken(token);

      if (result.error) {
        return callback(null, false);
      }

      const userId = result.payload.id;

      request.userId = userId;

      return callback(null, true);
    },
  });

  engineIO.attach(serverInstance);

  return {
    engineIO,
    serverInstance,
  };
};
