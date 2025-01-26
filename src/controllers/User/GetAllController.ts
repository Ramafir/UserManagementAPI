import { User } from "@db/entities/User";
import { FindOptionsWhere } from "typeorm";
import { inject, injectable } from "tsyringe";
import { UserMapper } from "@mappers/UserMapper";
import { StatusCodes as HTTP } from "http-status-codes";
import { IUserRepository } from "types/repositories/IUserRepository";
import { GetAllControllerTypes } from "types/controllers/User/GetAllController";
import { ControllerImplementation } from "types/controllers/ControllerImplementation";

import { Di } from "@enums/Di";
import { Permission } from "@shared/types/enums/Permission";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

@injectable()
export class GetAllController extends BaseController {
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
    request: GetAllControllerTypes.v1.Request,
    response: GetAllControllerTypes.v1.Response
  ) {
    const {
      query: { skip, take, filters },
    } = request;

    let where: FindOptionsWhere<User>[] = [];

    if (filters.workspaceId) {
      where = [
        {
          userToWorkspace: {
            workspaceId: filters.workspaceId,
          },
        },
        {
          role: {
            permissionToRole: {
              permission: {
                signature: Permission.ViewAllWorkspaces,
              },
              enabled: true,
            },
          },
        },
      ];
    }

    const [result, total] = await this._userRepository.getAllAndCount({
      skip,
      take,
      order: {
        email: "asc",
      },
      relations: {
        role: true,
        createdBy: true,
      },
      where,
      withDeleted: true,
    });

    const mappedResult = this.mapper.map<User>(result).to(UserMapper);

    return this.finalizeRequest(response, HTTP.OK, {
      result: mappedResult,
      total,
    });
  }
}
