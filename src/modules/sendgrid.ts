// Reference: https://sendgrid.com/docs/API_Reference/Web_API_v3/Mail/index.html
import axios, { AxiosRequestConfig } from 'axios';
import ErrorCode from '../models/error-code';
import MailPayload from '../models/mail-payload';
import Result from '../models/result';
import 'dotenv/config';

const sendmail = async (
  payload: MailPayload,
  apikey = process.env.SENDGRID_API_KEY,
  url = process.env.SENDGRID_SEND_URL,
) => {
  const result: Result<boolean> = new Result();

  if (!url || !apikey) {
    if (!url) console.error(`API URL is not defined`);
    if (!apikey) console.error(`API URL is not defined`);
    result.setFailure('Server Config Error', ErrorCode.GenericError);
    return result;
  }

  const data = JSON.stringify({
    personalizations: [
      {
        to: [...payload.to],
        cc: payload.cc ? [...payload.cc] : undefined,
        bcc: payload.bcc ? [...payload.bcc] : undefined,
      },
    ],
    from: payload.from,
    subject: payload.subject,
    content: [{ type: 'text/plain', value: payload.body }],
  });

  console.debug(`sendgrid request: `, data);

  const options: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${apikey}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post(url, data, options);
    if (response.status === 202 || response.status === 200) {
      result.data = true;
      result.message = 'success';
      console.debug(`sendgrid: Mail Sent!`);
    }
  } catch (error) {
    if (error.response) {
      // The request was made
      // the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`[sendgrid.sendmail] (${error.response.status}) `, error.response.data);

      if (error.response.status === 401) result.setFailure('Not Authorised', ErrorCode.UnAuthorized);
      else if (error.response.status >= 500)
        result.setFailure(`Service Provider Error ${error.response.status}`, ErrorCode.ServiceProviderFault);
      else if (error.response.status >= 400)
        result.setFailure(`Request Error ${error.response.status}`, ErrorCode.RequestError);
      else {
        console.error(`[sendgrid.sendmail] ` + error);
        result.setFailure('Failed when calling Service Provider', ErrorCode.Exception);
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest
      // is an instance of http.ClientRequest in node.js
      console.error(`[sendgrid.sendmail] Rquest: `, error.request);
      result.setFailure('No Response from Service Provider', ErrorCode.RequestError);
    } else {
      // Something happened in setting up the request
      // that triggered an Error
      console.error(`[sendgrid.sendmail] Msg: `, error.message);
      result.setFailure('Failed when calling Service Provider', ErrorCode.Exception);
    }
  }

  return result;
};

export { sendmail };
