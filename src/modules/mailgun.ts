// Reference: https://documentation.mailgun.com/en/latest/api-sending.html#examples
import axios from 'axios';
import ErrorCode from '../models/error-code';
import MailPayload from '../models/mail-payload';
import Result from '../models/result';
import qs from 'qs';
import 'dotenv/config';

const sendmail = async (
  payload: MailPayload,
  apikey = process.env.MAILGUN_API_KEY,
  url = process.env.MAILGUN_SEND_URL,
) => {
  const result: Result<boolean> = new Result();

  if (!url || !apikey) {
    if (!url) console.error(`API URL is not defined`);
    if (!apikey) console.error(`API URL is not defined`);
    result.setFailure('Server Config Error', ErrorCode.GenericError);
    return result;
  }

  const toStringArray = payload.to.map((recipient) => {
    return recipient.name ? `${recipient.name} <${recipient.email}>` : recipient.email;
  });
  let ccStringArray: string[] = [];
  if (payload.cc) {
    ccStringArray = payload.cc.map((recipient) => {
      return recipient.name ? `${recipient.name} <${recipient.email}>` : recipient.email;
    });
  }
  let bccStringArray: string[] = [];
  if (payload.bcc) {
    bccStringArray = payload.bcc.map((recipient) => {
      return recipient.name ? `${recipient.name} <${recipient.email}>` : recipient.email;
    });
  }

  const data = qs.stringify({
    from: payload.from.name ? `${payload.from.name} <${payload.from.email}>` : payload.from.email,
    subject: payload.subject,
    text: payload.body,
    to: toStringArray.join(),
    cc: ccStringArray && ccStringArray.length > 0 ? ccStringArray.join() : undefined,
    bcc: bccStringArray && bccStringArray.length > 0 ? bccStringArray.join() : undefined,
  });

  console.debug(`mailgun request: `, data);

  try {
    const response = await axios.post(url, data, {
      auth: {
        username: 'api',
        password: apikey,
      },
    });
    if (response.status === 202 || response.status === 200) {
      result.data = true;
      result.message = 'success';
      console.log(response);
      console.debug(`mailgun: Mail Sent!`);
    }
  } catch (error) {
    if (error.response) {
      // The request was made
      // the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`[mailgun.sendmail] (${error.response.status}) `, error.response.data);

      if (error.response.status === 401) result.setFailure('Not Authorised', ErrorCode.UnAuthorized);
      else if (error.response.status >= 500)
        result.setFailure(`Service Provider Error ${error.response.status}`, ErrorCode.ServiceProviderFault);
      else if (error.response.status >= 400)
        result.setFailure(`Request Error ${error.response.status}`, ErrorCode.RequestError);
      else {
        console.error(`[mailgun.sendmail] ` + error);
        result.setFailure('Failed when calling Service Provider', ErrorCode.Exception);
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest
      // is an instance of http.ClientRequest in node.js
      console.error(`[mailgun.sendmail] Rquest: `, error.request);
      result.setFailure('No Response from Service Provider', ErrorCode.RequestError);
    } else {
      // Something happened in setting up the request
      // that triggered an Error
      console.error(`[mailgun.sendmail] Msg: `, error.message);
      result.setFailure('Failed when calling Service Provider', ErrorCode.Exception);
    }
  }

  return result;
};

export { sendmail };
