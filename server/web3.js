const Web3 = require('web3');

const { networks } = require('./truffle');

const {
  development: { port, host },
} = networks;

const provider = new Web3.providers.HttpProvider(`http://${host}:${port}`);
const web3 = new Web3(provider);

module.exports = web3;
module.exports.getBalance = address => web3.eth.getBalance(address).toString();
