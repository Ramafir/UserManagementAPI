import { object, string } from "yup";
import { SuperSchema } from "types/SuperSchema";
import { IUserRepository } from "types/repositories/IUserRepository";
import { AddControllerTypes } from "types/controllers/User/AddController";

import { firstNameSchema, lastNameSchema } from "./nameSchemas";

import { Di } from "@enums/Di";
import { ACCOUNT_RULES } from "@shared/constants/rules";
import { HEAD_ADMIN_ROLE } from "@shared/constants/config";

import { setYupError } from "@helpers/yup/setError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { CUSTOM_MESSAGES } from "@helpers/yup/custom-messages";

import { useIdNumberSchema } from "@schemas/common/useIdNumberSchema";
import { defineSuperSchemaRunner } from "@schemas/common/defineSuperSchemaRunner";

const { EMAIL } = ACCOUNT_RULES;

const bodySchema: SuperSchema.Fragment<AddControllerTypes.v1.Body> = object({
  email: string()
    .email()
    .max(EMAIL.MAX_LENGTH)
    .required()
    .transform(value => value.toLowerCase())
    .test(async (value, ctx) => {
      const userRepository = getInstanceOf<IUserRepository>(Di.UserRepository);

      const user = await userRepository.getOne({
        where: {
          email: value,
        },
        withDeleted: true,
      });

      if (user) {
        return ctx.createError({
          message: setYupError(CUSTOM_MESSAGES.GENERAL.NOT_AVAILABLE, "email"),
        });
      }

      return true;
    }),

  firstName: firstNameSchema,

  lastName: lastNameSchema,

  roleId: useIdNumberSchema(Di.RoleRepository).test((value, ctx) => {
    if (value === HEAD_ADMIN_ROLE.id) {
      return ctx.createError({
        message: setYupError(CUSTOM_MESSAGES.GENERAL.NOT_AVAILABLE, "role"),
      });
    }

    return true;
  }),
});

export const useAddSuperSchema: SuperSchema.Runner<
  void,
  AddControllerTypes.v1.Body,
  void
> = defineSuperSchemaRunner(() => {
  return {
    body: bodySchema,
  };
});
