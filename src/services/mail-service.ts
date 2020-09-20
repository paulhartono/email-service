import MailPayload from '../models/mail-payload';
import Provider from '../models/provider';
import Result from '../models/result';
import Status from '../models/status';
import callProvider from './mail-helper';

export type SendEmailRequest = {
  payload: MailPayload;
};

export default class MailService {
  private db: Provider[];

  constructor(db: Provider[]) {
    this.db = db;
  }

  public async sendEmail(request: SendEmailRequest) {
    const payload = request.payload;
    // console.debug(`payload: `, payload);

    // In Production: This should be a Query to DB
    // Query should be similar to ORDER BY priority ASC, id DESC
    const providers: Provider[] = this.db
      .filter((provider) => provider.status === Status.Enabled)
      .sort((a: Provider, b: Provider) => a.priority - b.priority);

    let result: Result<boolean> = new Result();
    let module = '';
    for (let i = 0; i < providers.length; i++) {
      module = providers[i].module;

      result = await callProvider(module, payload);
      if (result.isSuccessful()) {
        break;
      }
    }

    return result;
  }
}
