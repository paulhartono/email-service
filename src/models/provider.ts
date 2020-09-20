import Status from './status';

type Provider = {
  id: number;
  name: string;
  module: string;
  status: Status;
  priority: number;
  sender: string;
};

export default Provider;
