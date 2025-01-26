import { IPermissionDefinition } from "./IPermissionDefinition";

export interface IRoleDefinition {
  name: string;

  description: string;

  permissions: IPermissionDefinition[];
}
