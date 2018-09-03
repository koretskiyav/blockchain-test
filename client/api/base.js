import Client from './client';

export default class Base {
  constructor(prefix) {
    this.client = new Client(prefix);
  }
}
