import { ethers } from "hardhat";

async function main() {
  // Deploy the Lock contract
  console.log("Start Lock deployment...");

  // Prepare deployments args to be passed to the constructor
  const unlockTime = Math.floor(Date.now() / 1000) + 60*5; // 5 minutes in the future
  const value_im_locking = ethers.parseEther("10"); // Parsing ETH/XRP value into WEI (1ETH = 10^18wei)
  console.log("Deploy Wefit Challenge");

  const Lock = await ethers.getContractFactory("WeFitChallenge");
  const lock = await Lock.deploy("0x90De83FD2cD4D01660cD6909692568a14661CdF1");

  console.log("Lock contract deployed to:", lock.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
