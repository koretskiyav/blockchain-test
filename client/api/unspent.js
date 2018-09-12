import Base from './base';

export default class Unspent extends Base {
  list() {
    return this.client.get('');
  }
}
