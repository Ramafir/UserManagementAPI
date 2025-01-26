import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { StatusCodes as HTTP } from "http-status-codes";
import { IUserRepository } from "types/repositories/IUserRepository";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { UpdateProfileControllerTypes } from "types/controllers/User/UpdateProfileController";

import { Di } from "@enums/Di";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class UpdateProfileController extends BaseController {
  constructor(
    @inject(Di.UserRepository)
    private _userRepository: IUserRepository
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
    request: UpdateProfileControllerTypes.v1.Request,
    response: Response
  ) {
    const { userId, body } = request;

    const user = await this._userRepository.getOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    await this._userRepository.primitiveSave({
      ...user,
      ...body,
    });

    return this.finalizeRequest(response, HTTP.NO_CONTENT);
  }
}
