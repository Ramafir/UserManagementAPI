export type ControllerImplementation = {
  version: number;

  details?: {
    url?: string;

    incompatibileWith?: string[];
  };

  handle: (
    request: CustomRequest<any, any, any>,
    response: CustomResponse<any>
  ) => Promise<void | CustomResponse<any>>;
};
