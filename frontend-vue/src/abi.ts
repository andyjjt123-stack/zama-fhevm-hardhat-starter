export const FHECOUNTER_ABI = [
  { "inputs": [], "name": "getCount", "outputs": [{"internalType": "bytes", "name": "", "type": "bytes"}], "stateMutability": "view", "type": "function" },
  { "inputs": [{"internalType": "bytes","name": "inputEuint32","type": "bytes"},{"internalType": "bytes","name": "inputProof","type": "bytes"}], "name": "increment", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{"internalType": "bytes","name": "inputEuint32","type": "bytes"},{"internalType": "bytes","name": "inputProof","type": "bytes"}], "name": "decrement", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
] as const
