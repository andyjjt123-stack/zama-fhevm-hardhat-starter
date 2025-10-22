import { ethers } from "hardhat";
async function main() {
  const factory = await ethers.getContractFactory("FHECounter");
  const c = await factory.deploy();
  console.log("FHECounter deployed to:", await c.getAddress());
}
main().catch((e)=>{ console.error(e); process.exitCode = 1; });
