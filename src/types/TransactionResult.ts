export class TransactionResult<T> {
  isSuccess: boolean;

  value?: T;

  error?: string;

  private constructor(isSuccess: boolean, value?: T, error?: string) {
    this.isSuccess = isSuccess;

    this.value = value;

    this.error = error;
  }

  static success<T>(value?: T): TransactionResult<T> {
    return new TransactionResult<T>(true, value);
  }

  static failure<T>(error?: string): TransactionResult<T> {
    return new TransactionResult<T>(false, undefined, error);
  }
}
