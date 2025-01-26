import { Schema } from "yup";
import IncomingForm from "formidable/Formidable";
import { IFormDataFile } from "types/IFormDataFile";
import { StatusCodes as HTTP } from "http-status-codes";
import { IFileService } from "types/services/IFileService";
import type { Request, NextFunction, Response } from "express";
import { IFormidableFormFactory } from "types/factories/IFormidableFormFactory";

import { APP } from "@config";

import { Di } from "@enums/Di";
import { Dependency } from "@enums/Dependency";

import { formatError } from "@helpers/yup/formatError";
import { getInstanceOf } from "@helpers/getInstanceOf";
import { mapFormDataFiles } from "@helpers/mapFormDataFiles";

interface IFormValidators {
  files?: Schema<IFormDataFile[]>;

  fields?: Schema;
}

export const parseUploadFormData = (
  options: {
    basePath: string;
    multiples: boolean;
    fieldsOrder?: string[];
  },
  validators?: IFormValidators
) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const {
      query: { workspaceId },
    } = request;

    if (APP.IS_CLEARING_TEMPORARY_UPLOADS_DIR) {
      return response.status(HTTP.SERVICE_UNAVAILABLE).send();
    }

    if (typeof workspaceId !== "string") {
      return response.status(HTTP.INTERNAL_SERVER_ERROR).send();
    }

    const parsedWorkspaceId = parseInt(workspaceId.toString());

    const formidableFormFactory = getInstanceOf<IFormidableFormFactory>(
      Di.FormidableFormFactory
    );

    const { fieldsOrder, ...formOptions } = options;

    const form = await formidableFormFactory.create({
      ...formOptions,
      destination: `workspace-${parsedWorkspaceId}`,
    });

    if (fieldsOrder?.length) {
      // @NOTE force specific order - before parsing files we can check if required fields are defined
      setFieldsOrderValidation(form, fieldsOrder);
    }

    form.parse(request, async (error, fields, files) => {
      const mappedFiles = files ? mapFormDataFiles(files) : [];

      if (error) {
        log.error({
          error,
          message: `An error occured while parsing file(s) for workspace #${workspaceId}`,
          dependency: Dependency.formidable,
        });

        await onAnyErrorDuringFormParse(parsedWorkspaceId, mappedFiles);

        return response.status(HTTP.BAD_REQUEST).send();
      }

      if (validators) {
        const errors = await handleValidators(
          { fields, files: mappedFiles },
          validators
        );

        if (errors) {
          await onAnyErrorDuringFormParse(parsedWorkspaceId, mappedFiles);

          return response.status(HTTP.BAD_REQUEST).send({ body: errors });
        }
      }

      request.body = fields;

      request.files = mappedFiles;

      next();
    });
  };
};

async function onAnyErrorDuringFormParse(
  workspaceId: number,
  files: IFormDataFile[]
) {
  const fileService = getInstanceOf<IFileService>(Di.FileService);

  await fileService.removeFromTemporaryDir({
    files,
    from: { workspaceId },
  });
}

function setFieldsOrderValidation(form: IncomingForm, fieldsOrder: string[]) {
  let fieldsOrderIndex = 0;

  form.on("field", name => {
    if (name !== fieldsOrder[fieldsOrderIndex]) {
      throw new Error(`Invalid fields order at position ${fieldsOrderIndex} (expected: ${fieldsOrder[fieldsOrderIndex]}, received: ${name})`);
    }

    fieldsOrderIndex++;
  });
}

async function handleValidators<T>(
  data: {
    files: IFormDataFile[];
    fields: T;
  },
  validators?: IFormValidators
) {
  if (!validators) {
    return null;
  }

  const { files, fields } = data;

  try {
    if (validators.fields) {
      await validators.fields.validate(fields, { abortEarly: false });
    }

    if (validators.files) {
      await validators.files.validate(files, { abortEarly: false });
    }
  } catch (error) {
    return formatError(error);
  }

  return null;
}
