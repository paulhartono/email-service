import MailAddress from './mail-address';

type MailPayload = {
  to: MailAddress[];
  cc?: MailAddress[];
  bcc?: MailAddress[];
  subject?: string;
  body: string;
  from: MailAddress;
};

export default MailPayload;
