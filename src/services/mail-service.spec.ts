import MailPayload from '../models/mail-payload';
import db from '../db.json';
import MailService, { SendEmailRequest } from '../services/mail-service';
import Result from '../models/result';

import callProvider from './mail-helper';
import ErrorCode from '../models/error-code';
jest.mock('../services/mail-helper');

describe('MailService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendEmail()', () => {
    test('First SP returns success', async () => {
      const payload: MailPayload = {
        to: [{ name: 'Recipient', email: 'recipient@gmail.com' }],
        from: { name: 'Admin', email: 'admin@test.com' },
        subject: 'test subject',
        body: 'test body',
      };

      const successfulCallProviderResult: Result<boolean> = new Result();
      successfulCallProviderResult.data = true;
      successfulCallProviderResult.message = 'success';

      // (callProvider as jest.Mock).mockImplementationOnce(
      //   async (): Promise<Result<boolean>> => successfulCallProviderResult,
      // );
      (callProvider as jest.Mock).mockReturnValue(successfulCallProviderResult);

      const result: Result<boolean> = await new MailService(db).sendEmail({ payload } as SendEmailRequest);
      expect(result).toEqual(successfulCallProviderResult);
    });

    test('Failover Scenario: First SP failed, 2nd SP returns success', async () => {
      const payload: MailPayload = {
        to: [{ name: 'Recipient', email: 'recipient@gmail.com' }],
        from: { name: 'Admin', email: 'admin@test.com' },
        subject: 'test subject',
        body: 'test body',
      };

      const successfulCallProviderResult: Result<boolean> = new Result();
      successfulCallProviderResult.data = true;
      successfulCallProviderResult.message = 'success';
      const failureCallProviderResult: Result<boolean> = new Result();
      failureCallProviderResult.setFailure('First SP has failed', ErrorCode.GenericError);

      (callProvider as jest.Mock).mockReturnValueOnce(failureCallProviderResult);
      (callProvider as jest.Mock).mockReturnValueOnce(successfulCallProviderResult);
      const result: Result<boolean> = await new MailService(db).sendEmail({ payload } as SendEmailRequest);

      expect(callProvider).toBeCalledTimes(2);
      expect(result).toEqual(successfulCallProviderResult);
    });
  });
});
