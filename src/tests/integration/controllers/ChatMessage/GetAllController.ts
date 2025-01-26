import { expect, should } from "chai";
import { StatusCodes as HTTP } from "http-status-codes";
import { SUPER_USER_EMAIL } from "@integration-tests/config";
import { Method, defineTests } from "@integration-tests/probata";
import { addChatMessages } from "@integration-tests/helpers/db/addChatMessages";
import { includeGeneralTests } from "@integration-tests/helpers/includeGeneralTests";
import { includePaginationTests } from "@integration-tests/helpers/includePaginationTests";

import { IChatMessageDTO } from "@shared/types/DTOs/ChatMessage";
import { PaginatedResponse } from "@shared/types/PaginatedResponse";

import { BaseController } from "@controllers/BaseController";

const { v1 } = BaseController.ALL_VERSION_DEFINITIONS;

const baseQuery = { version: v1 };

const CHAT_MESSAGE_1 = {
  id: 1,
};

const CHAT_MESSAGE_2 = {
  id: 2,
  replyToId: 1,
};

export const GET_ALL_CONTROLLER_V1_BEFORE_HOOK = async () => {
  return addChatMessages([CHAT_MESSAGE_1, CHAT_MESSAGE_2]);
};

export const GET_ALL_CONTROLLER_V1_TESTS = defineTests(
  {
    method: Method.GET,
    baseQuery,
  },

  ({ addTest }) => {
    includeGeneralTests({
      addTest,
      baseQuery,
    });

    includePaginationTests({
      addTest,
      baseQuery,
    });

    addTest({
      description: `returns ${HTTP.OK} with at least 1 item for depth '1' message(s)`,
      query: {
        ...baseQuery,
        page: 1,
        perPage: 10,
      },
      session: { user: { email: SUPER_USER_EMAIL } },
      expect: {
        statusCode: HTTP.OK,
        callback: response => {
          const { total, result } = <PaginatedResponse<IChatMessageDTO>>(
            response.body
          );
          const message = result.find(item => item.id === CHAT_MESSAGE_1.id);

          expect(total).to.be.greaterThan(0);
          should().exist(message);
        },
      },
    });

    addTest({
      description: `returns ${HTTP.OK} with at least 1 item for depth '2' message(s)`,
      query: {
        ...baseQuery,
        page: 1,
        perPage: 10,
        messageId: CHAT_MESSAGE_1.id,
      },
      session: { user: { email: SUPER_USER_EMAIL } },
      expect: {
        statusCode: HTTP.OK,
        callback: response => {
          const { total, result } = <PaginatedResponse<IChatMessageDTO>>(
            response.body
          );
          const message = result.find(item => item.id === CHAT_MESSAGE_2.id);

          expect(total).to.be.greaterThan(0);
          should().exist(message);
        },
      },
    });
  }
);
