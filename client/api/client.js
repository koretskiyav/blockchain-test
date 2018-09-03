import axios from 'axios';

export default class Client {
  constructor(prefix = '') {
    this.axios = axios.create({
      baseURL: `http://localhost:3222/api/v1${prefix}`,
    });
  }

  get(url, params = {}) {
    return this.request({ url, method: 'get', params });
  }

  post(url, data) {
    return this.request({ url, method: 'post', data });
  }

  request(req) {
    return this.axios(req).then(res => {
      if (!res.data.status) throw res.data.error;
      return res.data.data;
    });
  }
}
