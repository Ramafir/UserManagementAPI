export interface IBaseConsumerHandler<T> {
  handle(data: T): Promise<boolean>;

  onFailure(data: T): Promise<void>;
}
