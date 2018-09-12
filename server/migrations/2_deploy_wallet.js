/* global artifacts */
const core = require('../core');
const storage = require('../storage');

const WalletSimple = artifacts.require('WalletSimple');

module.exports = async deployer => {
  const privKeys = await storage.privKeys.read();
  const addresses = privKeys.map(k => {
    const pubKey = core.getETHPublicKey(k.privKey);
    return core.getETHAddress(pubKey, 0);
  });

  deployer.deploy(WalletSimple, addresses);
};
