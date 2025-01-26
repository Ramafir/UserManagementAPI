import merge from "lodash/merge";
import { SaveOptions } from "typeorm";

export const getOptionsOfTraceRelatedEntity = (
  data: {
    workspaceId: number;
    userId: number;
  },
  options?: SaveOptions
) => {
  return {
    ...options,
    data: options?.data ? merge(data, options.data) : data,
  };
};
