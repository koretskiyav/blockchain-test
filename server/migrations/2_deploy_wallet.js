/* global artifacts */
const core = require('../core');
const storage = require('../storage');

const WalletSimple = artifacts.require('WalletSimple.sol');

module.exports = deployer => {
  const privKeys = storage.privKeys.readSync();
  const addresses = privKeys.map(k => {
    const pubKey = core.getETHPublicKey(k.privKey);
    return core.getETHAddress(pubKey, 0);
  });

  deployer.deploy(WalletSimple, addresses);
};
