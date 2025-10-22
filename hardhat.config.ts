import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@fhevm/hardhat-plugin";
import * as dotenv from "dotenv";
dotenv.config();

const SEPOLIA_RPC = process.env.SEPOLIA_RPC || "";
const MNEMONIC = process.env.MNEMONIC || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } }
  },
  networks: {
    hardhat: {},
    sepolia: {
      url: SEPOLIA_RPC,
      accounts: MNEMONIC ? { mnemonic: MNEMONIC } : undefined
    }
  }
};

export default config;
