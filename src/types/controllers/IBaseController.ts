import { Response } from "express";

export interface IBaseController {
  invoke<P, B, Q>(
    request: CustomRequest<P, B, Q>,
    response: Response
  ): Promise<void | CustomResponse<any>>;
}
