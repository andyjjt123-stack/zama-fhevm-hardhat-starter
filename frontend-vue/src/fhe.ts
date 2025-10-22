import { createInstance, FhevmInstance } from '@zama-fhe/relayer-sdk'

const DEFAULTS = {
  ACL_CONTRACT: '0x687820221192C5B662b25367F70076A37bc79b6c',
  KMS_VERIFIER_CONTRACT: '0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC',
  INPUT_VERIFIER_CONTRACT: '0xbc91f3daD1A5F19F8390c400196e58073B6a0BC4',
  VERIFYING_CONTRACT_DECRYPTION: '0xb6E160B1ff80D67Bfe90A85eE06Ce0A2613607D1',
  VERIFYING_CONTRACT_INPUT: '0x7048C39f048125eDa9d678AEbaDfB22F7900a29F',
  RELAYER_URL: 'https://relayer.testnet.zama.cloud',
} as const

export async function getFheInstance(): Promise<FhevmInstance> {
  const instance = await createInstance({
    aclContractAddress: import.meta.env.VITE_ACL_CONTRACT || DEFAULTS.ACL_CONTRACT,
    kmsContractAddress: import.meta.env.VITE_KMS_VERIFIER_CONTRACT || DEFAULTS.KMS_VERIFIER_CONTRACT,
    inputVerifierContractAddress: import.meta.env.VITE_INPUT_VERIFIER_CONTRACT || DEFAULTS.INPUT_VERIFIER_CONTRACT,
    verifyingContractAddressDecryption: import.meta.env.VITE_VERIFYING_CONTRACT_DECRYPTION || DEFAULTS.VERIFYING_CONTRACT_DECRYPTION,
    verifyingContractAddressInputVerification: import.meta.env.VITE_VERIFYING_CONTRACT_INPUT || DEFAULTS.VERIFYING_CONTRACT_INPUT,
    relayerUrl: import.meta.env.VITE_RELAYER_URL || DEFAULTS.RELAYER_URL,
  })
  return instance
}
