import { ethers } from "hardhat";

async function main() {
  const factory = await ethers.getContractFactory("FHECounter");
  const contract = await factory.deploy();
  const address = await contract.getAddress();
  console.log("FHECounter deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
