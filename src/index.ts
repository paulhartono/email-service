/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import bodyparser from 'body-parser';

import indexRouter from './routes';

// Our Express APP config
const app = express();
app.set('port', process.env.PORT || 3000);

// parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyparser.json());

app.get('/version', (req: Request, res: Response) => {
  let version = '';
  try {
    version = 'not found';

    if (process.env.VERSION) {
      version = process.env.VERSION;
    }
  } catch (e) {
    version = 'not found';
  }

  res.send({
    version: version,
  });
});

app.use('/', indexRouter);

// Catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  const err: any = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Development error handler
// Will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err: any, req: Request, res: Response) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// Production error handler
// No stacktraces leaked to user
app.use(function (err: any, req: Request, res: Response) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`Example app listening at http://localhost:${process.env.PORT || 3000}`),
);
