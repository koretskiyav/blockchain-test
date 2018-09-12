import Base from './base';

export default class Depo extends Base {
  list() {
    return this.client.get('');
  }

  create() {
    return this.client.post('');
  }
}
