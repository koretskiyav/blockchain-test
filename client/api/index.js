import Depo from './depo';
import Unspent from './unspent';

export default {
  depo: new Depo('/depo'),
  unspent: new Unspent('/unspent'),
};
