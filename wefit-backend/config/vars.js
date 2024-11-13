const path = require('path');
const env = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
require('dotenv').config();
console.log("Provider url: ",process.env.WEFIT_API_URL)


module.exports = Object.freeze({
  env                 : process.env.NODE_ENV || 'production',
  port                : process.env.PORT || 3001,
  logs                : process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  logLevels           : {
    file              : process.env.FILE_LOG_LEVEL || 'info',
    console           : process.env.CONSOLE_LOG_LEVEL || 'debug',
    sentry            : process.env.SENTRY_LOG_LEVEL || 'error'
  },
  redisUrl            : process.env.REDIS_URL || "redis://127.0.0.1:6379",
  wefitCfg:{
      name: 'wefit',
      network: process.env.WEFIT_NETWORK || 'testnet',
      contractOwnerPriv: process.env.WEFIT_CONTRACT_OWNER_PRIV || 'b5c03e290e78040b117c807f9389eb24b0a02f3005d98d901e9af63aee43ecb5',
      contractOwnerAddr: process.env.WEFIT_CONTRACT_OWNER_ADDR || '0x90De83FD2cD4D01660cD6909692568a14661CdF1',
      providerUrl: process.env.WEFIT_API_URL || 'https://rpc-evm-sidechain.xrpl.org',
      wefitTokenAddress: process.env.WEFIT_TOKEN_ADDRESS || '0x63c3A8780860EB632030c0Cfb019544Dc404E635',
      wefitWalletAddress: process.env.WEFIT_WALLET_ADDRESS || '0xF7FCCFc3DE0789362B5B998782992a27b12040c8',
      wefitAdminAddress: process.env.WEFIT_ADMIN_ADDRESS || '0x07c59A919b64924a9326BB8c44F13c755f54c645',
      wefitAdminPriv: process.env.WEFIT_ADMIN_PRIV || '',
      gasPrice: process.env.WEFIT_GAS_PRICE,
      wefitChallengeAddress: process.env.WEFIT_CHALLENGE_ADDRESS || '0x95691fD90c9c28898912906C19BCc6569A736762',
      wefitNFTAddress: process.env.WEFIT_NFT_ADDRESS || '0x0A0C45eEA92e2eB06F318Db0761C700D42a65DE6',
  },
  contractParams:{
    from    : process.env.WEFIT_CONTRACT_OWNER_ADDR || '0xF7FCCFc3DE0789362B5B998782992a27b12040c8',
    gasPrice: parseInt(process.env.WEFIT_GAS_PRICE) || 5000000000,
    gas     : parseInt(process.env.WEFIT_ETH_GAS_LIMIT) || 500000
  },
});
