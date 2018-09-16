const truffleContract = require('truffle-contract');
const util = require('ethereumjs-util');

const storage = require('../storage');

const WalletSimpleJSON = require('../build/contracts/WalletSimple.json');
const ForwarderJSON = require('../build/contracts/Forwarder.json');

const web3 = require('../web3');

const WalletSimple = truffleContract(WalletSimpleJSON);
WalletSimple.setProvider(web3.currentProvider);

const Forwarder = web3.eth.contract(ForwarderJSON.abi);

module.exports = {
  async list(req, res) {
    const forwarders = await storage.forwarders.read();
    return res.send({ status: 1, data: forwarders });
  },

  async create(req, res) {
    const instance = await WalletSimple.deployed();

    const nonce = web3.eth.getTransactionCount(instance.address);
    const address = util.bufferToHex(
      util.generateAddress(instance.address, nonce),
    );
    await instance.createForwarder({ from: web3.eth.accounts[0], gas: 500000 });
    const { address: forwarder } = Forwarder.at(address);

    const forwarders = await storage.forwarders.read();

    forwarders.push({ address: forwarder });
    await storage.forwarders.write(forwarders);

    return res.send({ status: 1, data: { address: forwarder } });
  },
};
