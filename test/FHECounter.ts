import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { FhevmType } from "@fhevm/hardhat-plugin";
import { FHECounter, FHECounter__factory } from "../types";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("FHECounter")) as FHECounter__factory;
  const fheCounterContract = (await factory.deploy()) as FHECounter;
  const fheCounterContractAddress = await fheCounterContract.getAddress();
  return { fheCounterContract, fheCounterContractAddress };
}

describe("FHECounter", function () {
  let signers: Signers;
  let fheCounterContract: FHECounter;
  let fheCounterContractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
  });

  beforeEach(async () => {
    ({ fheCounterContract, fheCounterContractAddress } = await deployFixture());
  });

  it("encrypted count should be uninitialized after deployment", async function () {
    const encryptedCount = await fheCounterContract.getCount();
    expect(encryptedCount).to.eq(ethers.ZeroHash);
  });

  it("increment the counter by 1", async function () {
    const clearOne = 1;
    const encryptedOne = await fhevm
      .createEncryptedInput(fheCounterContractAddress, signers.alice.address)
      .add32(clearOne)
      .encrypt();

    const tx = await fheCounterContract
      .connect(signers.alice)
      .increment(encryptedOne.handles[0], encryptedOne.inputProof);
    await tx.wait();

    const encryptedCountAfterInc = await fheCounterContract.getCount();
    const clearCountAfterInc = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedCountAfterInc,
      fheCounterContractAddress,
      signers.alice,
    );
    expect(clearCountAfterInc).to.eq(1);
  });

  it("decrement the counter by 1 back to zero", async function () {
    const clearOne = 1;
    const encryptedOne = await fhevm
      .createEncryptedInput(fheCounterContractAddress, signers.alice.address)
      .add32(clearOne)
      .encrypt();

    // inc -> 1
    let tx = await fheCounterContract
      .connect(signers.alice)
      .increment(encryptedOne.handles[0], encryptedOne.inputProof);
    await tx.wait();

    // dec -> 0
    tx = await fheCounterContract
      .connect(signers.alice)
      .decrement(encryptedOne.handles[0], encryptedOne.inputProof);
    await tx.wait();

    const encryptedCountAfterDec = await fheCounterContract.getCount();
    const clearCountAfterDec = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      encryptedCountAfterDec,
      fheCounterContractAddress,
      signers.alice,
    );
    expect(clearCountAfterDec).to.eq(0);
  });
});
