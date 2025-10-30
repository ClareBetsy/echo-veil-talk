export const FHECOUNTER_ADDRESSES: Record<number, string | undefined> = {
  31337: import.meta.env.VITE_LOCALHOST_FHECOUNTER,
  11155111: import.meta.env.VITE_SEPOLIA_FHECOUNTER,
};

export function getFheCounterAddress(chainId?: number): string | undefined {
  if (!chainId) return undefined;
  return FHECOUNTER_ADDRESSES[chainId];
}


// Minimal ABI for FHECounter used in the frontend
export const FHECOUNTER_ABI = [
  {
    inputs: [],
    name: "getCount",
    outputs: [{ internalType: "euint32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// TX-only ABI (matches fheClient usage sending a single encrypted bytes arg)
export const FHECOUNTER_TX_ABI = [
  {
    type: "function",
    name: "increment",
    stateMutability: "nonpayable",
    inputs: [{ name: "encryptedDelta", type: "bytes" }],
    outputs: [],
  },
  {
    type: "function",
    name: "decrement",
    stateMutability: "nonpayable",
    inputs: [{ name: "encryptedDelta", type: "bytes" }],
    outputs: [],
  },
] as const;


