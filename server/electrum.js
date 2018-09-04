const eClient = require('electrum-client');
const config = require('../config');

class Electrum {
  getVer() {
    return this.run(ecl => ecl.server_version());
  }

  async getUnspent(scriptHash) {
    const unspent = await this.run(ecl => ecl.blockchainScripthash_listunspent(scriptHash));

    return Promise.all(unspent.map(i => this.getTx(i.tx_hash).then(rawtx => ({ ...i, rawtx }))));
  }

  getTx(txhash) {
    return this.run(ecl => ecl.blockchainTransaction_get(txhash));
  }

  getRandomServer() {
    return config.nodes[Math.floor(Math.random() * config.nodes.length)];
  }

  async open() {
    const node = this.getRandomServer();
    const ecl = new eClient(node.port, node.host, 'tls');

    try {
      await ecl.connect();
      return ecl;
    } catch (e) {
      console.log(`cannot connext to ${node.host}: ${e.message}`);
      return await this.open();
    }
  }

  async run(call) {
    const ecl = await this.open();
    const res = await call(ecl);
    await ecl.close();
    return res;
  }
}

module.exports = new Electrum();
