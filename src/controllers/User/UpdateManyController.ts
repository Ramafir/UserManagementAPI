import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IUserService } from "types/services/IUserService";
import { IDataStoreService } from "types/services/IDataStoreService";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { UpdateManyControllerTypes } from "types/controllers/User/UpdateManyController";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class UpdateManyController extends BaseController {
  constructor(
    @inject(Di.UserService)
    private _userService: IUserService,
    @inject(Di.DataStoreService)
    private _dataStoreService: IDataStoreService
  ) {
    super();
  }

  implementations: ControllerImplementation[] = [
    {
      version: v1,
      handle: this.v1.bind(this),
    },
  ];

  static readonly ALL_VERSIONS = [v1];

  async v1(
    request: UpdateManyControllerTypes.v1.Request,
    response: UpdateManyControllerTypes.v1.Response
  ) {
    const {
      body: { values },
    } = request;

    const result = await this._userService.updateMany(values);

    if (!result.isSuccess) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send(result.error);
    }

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
