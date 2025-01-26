import { injectable } from "tsyringe";
import { JobConfig } from "types/jobs/JobConfig";
import { IFileService } from "types/services/IFileService";

import { APP } from "@config/index";

import { BaseJob } from "./BaseJob";

import { Di } from "@enums/Di";

import { getInstanceOf } from "@helpers/getInstanceOf";

@injectable()
export class ClearTemporaryUploadsDirectoryJob extends BaseJob {
  jobName = ClearTemporaryUploadsDirectoryJob.name;

  config: JobConfig = {
    time: "59 23 * * *",
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
    const fileService = getInstanceOf<IFileService>(Di.FileService);

    await fileService.removeAllFromTemporaryDir();

    await this.onComplete({
      callback: () => {
        APP.IS_CLEARING_TEMPORARY_UPLOADS_DIR = false;
      },
    });
  }
}
