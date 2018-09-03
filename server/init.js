module.exports = async function init(storage, core) {
  let privKeys = await storage.privKeys.read();
  let pubKeys = await storage.pubKeys.read();

  if (!privKeys.length) {
    privKeys = core.generateKeys();
    await storage.privKeys.write(privKeys);
  }

  if (!pubKeys.length) {
    pubKeys = privKeys.map(({ privKey }) => core.getPublicKey(privKey));
    await storage.pubKeys.write(pubKeys);
  }
}
