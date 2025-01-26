import { CronJob } from "cron";
import { IJob } from "types/jobs/IJob";
import { JobConfig } from "types/jobs/JobConfig";

import { Dependency } from "@enums/Dependency";

export abstract class BaseJob implements IJob {
  instance: CronJob | null = null;

  abstract jobName: string;

  abstract config: JobConfig;

  run(): void {
    if (!this.instance) {
      log.warning({
        message: `Something wrong with ${this.jobName} job!! (can't run)`,
        dependency: Dependency.cron,
      });

      return;
    }

    this.instance.start();

    log.debug({
      message: `${this.jobName} is running`,
      dependency: Dependency.cron,
    });
  }

  stop(): void {
    if (!this.instance) {
      log.warning({
        message: `Job ${this.jobName} is already stopped!!`,
        dependency: Dependency.cron,
      });

      return;
    }

    this.instance.stop();

    this.instance = null;

    log.debug({
      message: `Stopped ${this.jobName} job.`,
      dependency: Dependency.cron,
    });
  }

  abstract onTick(): Promise<void> | void;

  async onComplete(arg?: { callback: () => void | Promise<void> }) {
    if (arg) {
      await arg.callback();
    }

    log.debug({
      message: `${this.jobName} completed.`,
      dependency: Dependency.cron,
    });
  }
}
