const EClient = require('electrum-client');
const { nodes } = require('./config');

class Electrum {
  getVer() {
    return this.run(ecl => ecl.server_version());
  }

  async getUnspent(scriptHash) {
    const unspent = await this.run(ecl =>
      ecl.blockchainScripthash_listunspent(scriptHash),
    );

    return Promise.all(
      unspent.map(i => this.getTx(i.tx_hash).then(rawtx => ({ ...i, rawtx }))),
    );
  }

  getTx(txhash) {
    return this.run(ecl => ecl.blockchainTransaction_get(txhash));
  }

  async open() {
    const node = nodes[Math.floor(Math.random() * nodes.length)];
    const ecl = new EClient(node.port, node.host, 'tls');

    try {
      await ecl.connect();
      return ecl;
    } catch (e) {
      console.log(`cannot connext to ${node.host}: ${e.message}`);
      return this.open();
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
