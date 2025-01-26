import cors from "cors";
import path from "path";
import fs from "fs-extra";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { StatusCodes as HTTP } from "http-status-codes";
import express, { Application, Request, Response, Router } from "express";

import { APP } from "@config";

import { Dependency } from "@enums/Dependency";

export const setupExpress = async (app: Application) => {
  app.use(
    cors({
      credentials: false,
      origin: [APP.URL, APP.E2E_TESTS_URL],
    })
  );

  app.use(express.json());

  app.use(helmet());

  app.use(cookieParser());

  app.use(APP.ROUTES_PREFIX, await getRoutes());

  app.use((request: Request, response: Response) => {
    return response
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .send("Oops.. Something broke 😢");
  });
};

async function getRoutes() {
  const routesDir = path.join(APP.BASE_DIR, "routes");

  const versions = fs.readdirSync(routesDir);

  const mainRouter = Router();

  for (const version of versions) {
    const versionRouter = Router();

    const routers = fs.readdirSync(path.join(routesDir, version));

    const registeredRouters: string[] = [];

    for (const router of routers) {
      // @NOTE consider adding dirs skip

      const dependency = await import(
        path.resolve(APP.BASE_DIR, "routes", version, router)
      );

      const [routeName] = router.split(".");

      versionRouter.use(`/${routeName}`, dependency.default);

      registeredRouters.push(routeName);
    }

    log.debug({
      message: `registered ${version} routes: \n${registeredRouters.join(
        "\n"
      )}`,
      dependency: Dependency.Express,
    });

    mainRouter.use(`/${version}`, versionRouter);
  }

  return mainRouter;
}
