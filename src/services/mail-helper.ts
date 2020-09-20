import ErrorCode from '../models/error-code';
import MailPayload from '../models/mail-payload';
import Result from '../models/result';

const callProvider = async (module: string, payload: MailPayload): Promise<Result<boolean>> => {
  let result: Result<boolean> = new Result();

  try {
    // console.debug(`module: `, module);
    const { sendmail } = await import(`../modules/${module}`);
    result = await sendmail(payload);

    if (!result.isSuccessful()) {
      console.error(result);

      // Update DB: lower the priority
      // update priority++
      // If priority has reached lets say 10, then reset all records priority field to 1
    }
  } catch (e) {
    console.error(e);
    result.setFailure(`Provider Module Error: ${e.message} `, ErrorCode.Exception);
    // Update DB: lower the priority
    // update priority++
    // If priority has reached lets say 10, then reset all records priority field to 1
  }

  return result;
};
export default callProvider;
