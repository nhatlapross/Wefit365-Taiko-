const HDWalletProvider = require("@truffle/hdwallet-provider");
const {wefitCfg} = require('../config/vars');
exports.contractProvider = require('web3-eth-contract');

exports.provider = new HDWalletProvider({ 
    privateKeys: [wefitCfg.contractOwnerPriv], 
    providerOrUrl: wefitCfg.providerUrl,
    pollingInterval: 8000
});

exports.adminProvider = new HDWalletProvider({
    privateKeys: [wefitCfg.wefitAdminPriv],
    providerOrUrl: wefitCfg.providerUrl,
    pollingInterval: 8000,
    networkCheckTimeout: 1000000,
    timeoutBlocks: 200
})

this.contractProvider.setProvider(this.provider)
