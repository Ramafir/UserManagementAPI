import { expect } from "chai";
import { StatusCodes as HTTP } from "http-status-codes";
import { Method, defineTests } from "@integration-tests/probata";
import { includeTextTests } from "@integration-tests/helpers/includeTextTests";
import { addChatMessages } from "@integration-tests/helpers/db/addChatMessages";
import { IChatMessageRepository } from "types/repositories/IChatMessageRepository";
import { includeGeneralTests } from "@integration-tests/helpers/includeGeneralTests";
import {
  SUPER_USER_EMAIL,
  UNEXISTING_ITEM_ID,
} from "@integration-tests/config";

import { Di } from "@enums/Di";
import { CHAT_MESSAGE_RULES } from "@shared/constants/rules";

import { getInstanceOf } from "@helpers/getInstanceOf";

import { BaseController } from "@controllers/BaseController";

const {
  VALUE: { MIN_LENGTH, MAX_LENGTH },
} = CHAT_MESSAGE_RULES;
const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const baseQuery = { version: v1 };

const CHAT_MESSAGE_TO_UPDATE = {
  id: 7,
};

const getActionAppendValue = (id?: number) =>
  `${id || CHAT_MESSAGE_TO_UPDATE.id}/value`;

const UPDATED_TEXT_OF_CHAT_MESSAGE = "updated text of comment";

export const PATCH_VALUE_CONTROLLER_V1_BEFORE_HOOK = async () => {
  return addChatMessages([CHAT_MESSAGE_TO_UPDATE]);
};

export const PATCH_VALUE_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.PATCH,
    baseQuery,
  },

  ({ addTest }) => {
    includeGeneralTests({
      addTest,
      baseQuery,
      appendToAction: getActionAppendValue(),
    });

    includeTextTests({
      field: "text",
      addTest,
      baseQuery,
      minLength: MIN_LENGTH,
      maxLength: MAX_LENGTH,
      appendToAction: getActionAppendValue(),
    });

    addTest({
      description: `returns ${HTTP.NOT_FOUND} when trying to update unexisting message`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction: getActionAppendValue(UNEXISTING_ITEM_ID),
      body: {
        text: UPDATED_TEXT_OF_CHAT_MESSAGE,
      },
      expect: {
        statusCode: HTTP.NOT_FOUND,
      },
    });

    addTest({
      description: `returns ${HTTP.NO_CONTENT} on message update`,
      session: { user: { email: SUPER_USER_EMAIL } },
      appendToAction: getActionAppendValue(),
      body: {
        text: UPDATED_TEXT_OF_CHAT_MESSAGE,
      },
      expect: {
        statusCode: HTTP.NO_CONTENT,
        callback: async () => {
          const chatMessageRepository = getInstanceOf<IChatMessageRepository>(
            Di.ChatMessageRepository
          );

          const message = await chatMessageRepository.getOne({
            where: {
              id: CHAT_MESSAGE_TO_UPDATE.id,
            },
          });

          expect(message?.value).to.equal(UPDATED_TEXT_OF_CHAT_MESSAGE);
        },
      },
    });
  }
);
