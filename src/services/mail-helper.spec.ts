import MailPayload from '../models/mail-payload';
import Result from '../models/result';
import callProvider from './mail-helper';

import * as sendgrid from '../modules/sendgrid';
jest.mock('../modules/sendgrid');

import * as mailgun from '../modules/mailgun';
import ErrorCode from '../models/error-code';
jest.mock('../modules/mailgun');

describe('mail-helper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('callProvider()', () => {
    describe('sendgrid', () => {
      test('sendgrid SP Module successful', async () => {
        const payload: MailPayload = {
          to: [{ name: 'Recipient', email: 'recipient@gmail.com' }],
          from: { name: 'Admin', email: 'admin@test.com' },
          subject: 'test subject',
          body: 'test body',
        };

        const successfulSPModuleResult: Result<boolean> = new Result();
        successfulSPModuleResult.data = true;
        successfulSPModuleResult.message = 'success';

        (sendgrid.sendmail as jest.Mock).mockReturnValue(successfulSPModuleResult);

        const result = await callProvider('sendgrid', payload);
        expect(sendgrid.sendmail).toBeCalledTimes(1);
        expect(result).toEqual(successfulSPModuleResult);
      });

      test('sendgrid SP Module failed', async () => {
        const payload: MailPayload = {
          to: [{ name: 'Recipient', email: 'recipient@gmail.com' }],
          from: { name: 'Admin', email: 'admin@test.com' },
          subject: 'test subject',
          body: 'test body',
        };

        const failedSPModuleResult: Result<boolean> = new Result();
        failedSPModuleResult.setFailure('Not Authorised', ErrorCode.UnAuthorized);
        (sendgrid.sendmail as jest.Mock).mockReturnValue(failedSPModuleResult);

        const result = await callProvider('sendgrid', payload);
        expect(sendgrid.sendmail).toBeCalledTimes(1);
        expect(result).toEqual(failedSPModuleResult);
      });
    });

    describe('mailgun', () => {
      test('mailgun SP Module is successful', async () => {
        const payload: MailPayload = {
          to: [{ name: 'Recipient', email: 'recipient@gmail.com' }],
          from: { name: 'Admin', email: 'admin@test.com' },
          subject: 'test subject',
          body: 'test body',
        };

        const successfulSPModuleResult: Result<boolean> = new Result();
        successfulSPModuleResult.data = true;
        successfulSPModuleResult.message = 'success';

        (mailgun.sendmail as jest.Mock).mockReturnValue(successfulSPModuleResult);

        const result = await callProvider('mailgun', payload);
        expect(mailgun.sendmail).toBeCalledTimes(1);
        expect(result).toEqual(successfulSPModuleResult);
      });

      test('mailgun SP Module failed', async () => {
        const payload: MailPayload = {
          to: [{ name: 'Recipient', email: 'recipient@gmail.com' }],
          from: { name: 'Admin', email: 'admin@test.com' },
          subject: 'test subject',
          body: 'test body',
        };

        const failedSPModuleResult: Result<boolean> = new Result();
        failedSPModuleResult.setFailure('Not Authorised', ErrorCode.UnAuthorized);
        (mailgun.sendmail as jest.Mock).mockReturnValue(failedSPModuleResult);

        const result = await callProvider('mailgun', payload);
        expect(mailgun.sendmail).toBeCalledTimes(1);
        expect(result).toEqual(failedSPModuleResult);
      });
    });
  });
});
