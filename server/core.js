const crypto = require('crypto');

const bcoin = require('bcoin');
const reverse = require('buffer-reverse');

const HD = bcoin.hd;
const Mnemonic = bcoin.hd.Mnemonic;
const PrivateKey = bcoin.hd.PrivateKey;
const PublicKey = bcoin.hd.PublicKey;

const Script = bcoin.Script;
const KeyRing = bcoin.KeyRing;
const { Output } = bcoin.primitives;

const NETWORK = 'main';

module.exports.generateKeys = () => Array(3).fill().map(() => {
  const mnemonic = new Mnemonic({ bits: 256 });
  const mkey = HD.fromMnemonic(mnemonic);

  return {
    mnemonic: mnemonic.toString(),
    privKey: mkey.toBase58(NETWORK),
  }
});

module.exports.getPublicKey = privKey =>
  HD
    .fromBase58(privKey, NETWORK)
    .derivePath("m/44'/0'/0'/0")
    .toPublic()
    .toBase58(NETWORK);

module.exports.getAddress = (pubKeys, index) => {
  const keys = pubKeys.map(key =>
    PublicKey
      .fromBase58(key, NETWORK)
      .derive(index)
      .toPublic().publicKey,
  );

  const oldAddress = Script
    .fromMultisig(2, keys.length, keys)
    .getAddress()
    .toBase58(NETWORK);

  const rings = keys.map(key => KeyRing.fromPublic(key));

  rings.forEach(ring => ring.witness = true);

  rings[0].script = Script.fromMultisig(2, rings.length, rings.map(r => r.publicKey));

  const address = rings[0].getAddress().toString();

  const rawAddress = Output.fromScript(address, 10000).script.toRaw();
  const script = crypto.createHash('sha256').update(rawAddress, 'utf8').digest();
  const scriptHash = reverse(script).toString('hex');

  return { index, oldAddress, address, scriptHash };
}