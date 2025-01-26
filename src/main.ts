import "reflect-metadata";
import lockfile from "proper-lockfile";

import { APP } from "./config";
import { onExit, server } from "./server";

(async function () {
  try {
    if (APP.IS_PRODUCTION) {
      await lockfile.lock(__filename);
    }

    const app = await server();

    const { PORT } = APP;

    app.listen(PORT, () => {
      log.info({
        message: `⚡️ Server is running at http://localhost:${PORT}`,
      });
    });
  } catch (error) {
    console.log(error);

    if (APP.IS_PRODUCTION) {
      await lockfile.unlock(__filename);
    }
  }
})();

process.on("SIGINT", onExit);
process.on("SIGTERM", onExit);
process.on("SIGQUIT", onExit);
