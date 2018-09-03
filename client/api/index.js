import Client from './client';

import Depo from './depo';
import Unspent from './unspent';

const client = new Client();

export default {
  depo: new Depo('/depo'),
  unspent: new Unspent('/unspent'),
};
