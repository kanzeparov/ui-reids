import * as Deployer from 'truffle-deployer'

const Notary = artifacts.require('./Notary.sol')

module.exports = function (deployer: Deployer) {
  return deployer.deploy(Notary)
}
