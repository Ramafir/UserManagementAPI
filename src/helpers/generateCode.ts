import random from "lodash/random";
import shuffle from "lodash/shuffle";
import { IDateService } from "types/services/IDateService";

import { getInstanceOf } from "./getInstanceOf";

import { Di } from "@enums/Di";

export const generateCode = (length = 30) => {
  const dateService = getInstanceOf<IDateService>(Di.DateService);

  const randomAddNumber = random(50000, 9999999999);
  const randomSubtractNumber = random(500, 30000);

  const now = dateService.now();

  const sum = now.unix() - randomSubtractNumber + randomAddNumber;

  const rawCode = sum.toString().padStart(length, "0");

  const codeAsArray = shuffle(rawCode.toString().split(""));

  return codeAsArray.join("");
};
