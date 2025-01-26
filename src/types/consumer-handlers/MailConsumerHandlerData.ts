export type MailConsumerHandlerData<T> = {
  sendTo: string;

  subject: string;

  viewBuilderName: string;
} & T;
