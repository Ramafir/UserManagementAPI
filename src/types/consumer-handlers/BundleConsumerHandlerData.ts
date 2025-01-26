import { Bundle } from "@db/entities/Bundle";

export type BundleConsumerHandlerData = {
  bundle: Bundle;

  workspaceId: number;
};
