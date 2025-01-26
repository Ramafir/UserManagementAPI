import { Response } from "express";
import { InjectionToken } from "tsyringe";
import { IBaseController } from "types/controllers/IBaseController";

import { getInstanceOf } from "./getInstanceOf";

export const processRequestWith =
  <T, P, B, Q>(Controller: InjectionToken<T>) =>
  (...args: [CustomRequest<P, B, Q>, Response]) => {
    const controller = <IBaseController>getInstanceOf(Controller);

    const [request, response] = args;

    controller.invoke(request, response);
  };
