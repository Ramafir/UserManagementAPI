import { injectable } from "tsyringe";
import { JobConfig } from "types/jobs/JobConfig";

import { APP } from "@config";

import { BaseJob } from "./BaseJob";

@injectable()
export class DisableFilesUploadJob extends BaseJob {
  jobName = DisableFilesUploadJob.name;

  config: JobConfig = {
    time: "55 23 * * *",
    runners: {
      onTick: this.onTick.bind(this),
    },
    options: {
      runOnInit: false,
    },
  };

  constructor() {
    super();
  }

  async onTick() {
    APP.IS_CLEARING_TEMPORARY_UPLOADS_DIR = true;

    await this.onComplete();
  }
}
