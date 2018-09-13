const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const storage = name => {
  const pathName = path.join(__dirname, `${name}.json`);

  return {
    read: async () => {
      try {
        return JSON.parse(await readFile(pathName));
      } catch (e) {
        return [];
      }
    },
    readSync: () => {
      try {
        return JSON.parse(fs.readFileSync(pathName));
      } catch (e) {
        return [];
      }
    },
    write: data => writeFile(pathName, JSON.stringify(data, null, 2)),
  };
};

module.exports = {
  privKeys: storage('privKeys'),
  pubKeys: storage('pubKeys'),
  deposits: storage('deposits'),
};
