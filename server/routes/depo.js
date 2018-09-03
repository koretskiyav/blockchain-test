const storage = require('../storage');
const core = require('../core');
const electrum = require('../electrum');

async function getInfo(depo) {
  const unspent = await electrum.getUnspent(depo.oldAddress);

  return unspent.map(i => ({ ...i, ...depo}));
}

const flat = arr => arr.reduce((acc, val) => acc.concat(val), []);

module.exports = {
  async list(req, res, next) {
    const deposits = await storage.deposits.read();
    return res.send({ status: 1, data: deposits });
  },

  async create(req, res, next) {
    const deposits = await storage.deposits.read();

    const nextIndex = deposits.length ? deposits[deposits.length - 1].index + 1 : 0;

    const pubKeys = await storage.pubKeys.read();
    const address = core.getAddress(pubKeys, nextIndex);

    deposits.push(address);
    await storage.deposits.write(deposits)

    return res.send({ status: 1, data: address });
  },

  async unspent(req, res, next) {
    const deposits = await storage.deposits.read();

    const list = await Promise.all(deposits.map(getInfo));

    return res.send({ status: 1, data: flat(list) });
  },
};
