import ErrorCode from '../models/error-code';
import MailPayload from '../models/mail-payload';
import Result from '../models/result';
import { sendmail } from './sendgrid';

describe('modules/sendgrid', () => {
  test('sendgrid integration successful', async () => {
    jest.setTimeout(30000);

    const payload: MailPayload = {
      to: [{ name: 'Recipient', email: 'p4ul81@yahoo.com' }],
      from: { name: 'Admin', email: 'admin@jedlie.cf' },
      subject: 'test subject',
      body: 'test body',
    };

    const succcessfulResult: Result<boolean> = new Result();
    succcessfulResult.data = true;
    succcessfulResult.message = 'success';

    const result = await sendmail(payload);
    expect(result).toEqual(succcessfulResult);
  });

  test('sendgrid Authorisation Failure', async () => {
    const payload: MailPayload = {
      to: [{ name: 'Recipient', email: 'p4ul81@yahoo.com' }],
      from: { name: 'Admin', email: 'admin@jedlie.cf' },
      subject: 'test subject',
      body: 'test body',
    };

    const failedResult: Result<boolean> = new Result();
    failedResult.setFailure('Not Authorised', ErrorCode.UnAuthorized);

    const result = await sendmail(payload, 'FAILEDAPIKEY');
    expect(result).toEqual(failedResult);
  });
});
