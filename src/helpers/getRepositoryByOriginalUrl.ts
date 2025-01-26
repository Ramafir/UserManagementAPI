import { capitalize } from "lodash";
import { container } from "tsyringe";
import { IBaseRepository } from "types/repositories/IBaseRepository";

import { getInstanceOf } from "./getInstanceOf";

export const getRepositoryByOriginalUrl = <T>(
  originalUrl: string,
  resourceNamePosition = 2
) => {
  // @NOTE e.g. (1) /api/v1/notes/1?version=1 (resourceNamePosition = -2)
  // @NOTE e.g. (2) /api/v1/workspaces/1/pin?version=1 (resourceNamePosition = -3)
  const resourceInPlural = originalUrl.split("/").at(-resourceNamePosition);

  if (!resourceInPlural) {
    return null;
  }

  const resource = resourceInPlural.slice(0, -1);

  const dependency = `I${capitalize(resource)}Repository`;

  if (!container.isRegistered(dependency)) {
    return null;
  }

  return getInstanceOf<IBaseRepository<T>>(dependency);
};
