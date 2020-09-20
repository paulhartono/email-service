import ErrorCode from './error-code';

export default class Result<T> {
  public code: ErrorCode;
  public error: boolean;
  public message: string;
  public data?: T;

  constructor(data: T = {} as T) {
    this.code = ErrorCode.NoError;
    this.error = false;
    this.message = '';
    this.data = data;
  }

  isSuccessful(): boolean {
    return this.error === false;
  }

  setSuccess(message: string, code: ErrorCode = ErrorCode.NoError): void {
    this.error = false;
    this.message = message;
    if (code == undefined) {
      code = ErrorCode.NoError;
    }
    this.code = code;
  }

  setFailure(message: string, code: ErrorCode = ErrorCode.GenericError): void {
    this.error = true;
    this.message = message;
    if (code == undefined) {
      code = ErrorCode.GenericError;
    }
    this.code = code;
  }

  setResult(result: Result<T>): void {
    this.error = result.error;
    this.code = result.code;
    this.data = result.data;
    this.message = result.message;
  }
}
