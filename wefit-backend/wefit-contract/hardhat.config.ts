import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    xrplEvmTestnet: {
      url: "https://rpc-evm-sidechain.xrpl.org",
      accounts: [process.env.DEV_PRIVATE_KEY || ''],
    },
  },
  etherscan: {
    apiKey: {
      'XRPL_EVM_Sidechain_Devnet': "void"
    },
    customChains: [
      {
        network: "xrplEvmTestnet",
        chainId: 1440002,
        urls: {
          apiURL: "https://explorer.xrplevm.org/api",
          browserURL: "https://explorer.xrplevm.org/",
        }
      }
    ]
  }
};

export default config;
