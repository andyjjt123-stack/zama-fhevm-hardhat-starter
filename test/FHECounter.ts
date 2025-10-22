import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { FhevmType } from "@fhevm/hardhat-plugin";

describe("FHECounter", () => {
  it("inc & dec", async () => {
    const [alice] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("FHECounter");
    const c = await factory.deploy();
    const addr = await c.getAddress();

    const enc1 = await fhevm.createEncryptedInput(addr, alice.address).add32(1).encrypt();
    await (await c.connect(alice).increment(enc1.handles[0], enc1.inputProof)).wait();

    const handle = await c.getCount();
    const clear = await fhevm.userDecryptEuint(FhevmType.euint32, handle, addr, alice);
    expect(clear).to.eq(1);

    await (await c.connect(alice).decrement(enc1.handles[0], enc1.inputProof)).wait();
    const handle2 = await c.getCount();
    const clear2 = await fhevm.userDecryptEuint(FhevmType.euint32, handle2, addr, alice);
    expect(clear2).to.eq(0);
  });
});
