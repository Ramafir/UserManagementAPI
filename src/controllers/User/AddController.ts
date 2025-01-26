import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { UserMapper } from "@mappers/UserMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { IUserRepository } from "types/repositories/IUserRepository";
import { AddControllerTypes } from "types/controllers/User/AddController";
import { SignUpMailViewBuilder as VB } from "types/mail/SignUpMailViewBuilder";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";
import { MailConsumerHandlerData } from "types/consumer-handlers/MailConsumerHandlerData";

import { Di } from "@enums/Di";
import { Queue } from "@enums/Queue";

import { sendToQueue } from "@helpers/sendToQueue";
import { generateCode } from "@helpers/generateCode";
import { SignUpMailViewBuilder } from "@services/MailService/view-builders/SignUpMailViewBuilder";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class AddController extends BaseController {
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

  async v1(request: AddControllerTypes.v1.Request, response: Response) {
    const {
      userId,
      body: { email, firstName, lastName, roleId },
    } = request;

    const user = await this._userRepository.primitiveSave({
      email,
      firstName,
      lastName,
      role: {
        id: roleId,
      },
      createdBy: {
        id: userId,
      },
      signUpCode: generateCode(),
    });

    if (!user) {
      return response.status(HTTP.UNPROCESSABLE_ENTITY).send();
    }

    sendToQueue<MailConsumerHandlerData<VB.Input>>(Queue.SendMail, {
      user,
      sendTo: user.email,
      subject: `itvault - you were invitied to application!`,
      viewBuilderName: SignUpMailViewBuilder.name,
    });

    const mappedResult = this.mapper.map(user).to(UserMapper);

    return this.finalizeRequest(response, HTTP.CREATED, mappedResult);
  }
}
