/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express';
import ErrorCode from '../models/error-code';
import MailPayload from '../models/mail-payload';
import 'dotenv/config';

/*********************************
 * The use of db.json below is for illustration purpose.
 * In Production scenario, this should have a real database connected to this micro services
 *
 **********************************/
import db from '../db.json';
import MailService, { SendEmailRequest } from '../services/mail-service';
import Result from '../models/result';

const indexRouter = express.Router();

const sendEmail = async (req: Request, res: Response) => {
  const payload: MailPayload = req.body;

  const result: Result<boolean> = await new MailService(db).sendEmail({ payload } as SendEmailRequest);
  if (result.isSuccessful()) {
    res.status(200).send(result);
  } else {
    if (result.code === ErrorCode.Exception) res.status(500).send(result);
    else res.status(400).send(result);
  }
};

/* Send Email */
indexRouter.post('/', sendEmail);

export default indexRouter;
