const crypto = require('crypto');

const bcoin = require('bcoin');
const reverse = require('buffer-reverse');
const ETHutil = require('ethereumjs-util');
const keccak = require('keccak');

const HD = bcoin.hd;
const { Mnemonic, PublicKey } = HD;

const { Script, KeyRing } = bcoin;
const { Output } = bcoin.primitives;

const NETWORK = 'main';

module.exports.generateKeys = () =>
  Array(3)
    .fill()
    .map(() => {
      const mnemonic = new Mnemonic({ bits: 256 });
      const mkey = HD.fromMnemonic(mnemonic);

      return {
        mnemonic: mnemonic.toString(),
        privKey: mkey.toBase58(NETWORK),
      };
    });

module.exports.getPrivKeyFromMnemonic = phrase => {
  const mnemonic = new Mnemonic(phrase);
  return HD.fromMnemonic(mnemonic).toBase58(NETWORK);
};

module.exports.getBTCPublicKey = privKey =>
  HD.fromBase58(privKey, NETWORK)
    .derivePath("m/44'/0'/0'/0")
    .toPublic()
    .toBase58(NETWORK);

module.exports.getETHPublicKey = privKey =>
  HD.fromBase58(privKey, NETWORK)
    .derivePath("m/44'/60'/0'/0")
    .toPublic()
    .toBase58(NETWORK);

module.exports.getScriptHash = address => {
  const script = Output.fromScript(address, 10000).script.toRaw();

  const hash = crypto
    .createHash('sha256')
    .update(script, 'utf8')
    .digest();
  return reverse(hash).toString('hex');
};

module.exports.getBTCAddress = (pubKeys, index) => {
  const keys = pubKeys.map(
    key => PublicKey.fromBase58(key, NETWORK).derive(index).publicKey,
  );

  const multisigScript = Script.fromMultisig(2, keys.length, keys);
  const oldAddress = multisigScript.getAddress().toBase58(NETWORK);

  const rings = keys.map(key => {
    const ring = KeyRing.fromPublic(key);
    ring.witness = true;
    return ring;
  });

  rings[0].script = multisigScript;

  const address = rings[0].getAddress().toString();
  const nestedAddress = rings[0].getNestedAddress().toString();

  return {
    index,
    oldAddress,
    address,
    nestedAddress,
  };
};

module.exports.getETHAddress = (pubKey, index) => {
  const { publicKey } = PublicKey.fromBase58(pubKey, NETWORK).derive(index);
  const address = ETHutil.publicToAddress(publicKey, true).toString('hex');

  const hash = keccak('keccak256')
    .update(address)
    .digest('hex');

  const checksum = address
    .split('')
    .map((a, i) => (parseInt(hash[i], 16) >= 8 ? a.toUpperCase() : a))
    .join('');

  return `0x${checksum}`;
};
