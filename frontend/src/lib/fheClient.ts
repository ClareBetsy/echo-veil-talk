import { FHECOUNTER_TX_ABI, getFheCounterAddress } from "@/lib/contracts";
import { encryptDelta } from "@/lib/fheSdk";
import { createPublicClient, createWalletClient, custom, http, toHex } from "viem";
import { hardhat, sepolia } from "wagmi/chains";

function getChainConfig(chainId: number) {
  if (chainId === sepolia.id) return sepolia;
  // Default to hardhat local chain (31337)
  return hardhat;
}

function rpcUrlFor(chainId: number): string {
  if (chainId === sepolia.id) {
    return (
      import.meta.env.VITE_SEPOLIA_RPC_URL ||
      "https://rpc.sepolia.org"
    );
  }
  return import.meta.env.VITE_LOCAL_RPC_URL || "http://127.0.0.1:8545";
}

export async function sendEncryptedDelta(opts: {
  chainId: number;
  delta: number;
  direction: "inc" | "dec";
}): Promise<`0x${string}`> {
  const { chainId, delta, direction } = opts;
  const chain = getChainConfig(chainId);
  const contractAddress = getFheCounterAddress(chainId);
  if (!contractAddress) {
    throw new Error("FHECounter address not configured for current network");
  }
  const encryptedBytes = await encryptDelta(delta);
  const encryptedHex = toHex(encryptedBytes) as `0x${string}`;

  // Use the user's injected wallet
  // @ts-expect-error window.ethereum is injected by wallet
  const ethereum = window.ethereum;
  if (!ethereum) {
    throw new Error("Wallet not found. Please install a wallet extension.");
  }
  const walletClient = createWalletClient({
    chain,
    transport: custom(ethereum),
  });
  const [account] = await walletClient.getAddresses();

  const publicClient = createPublicClient({
    chain,
    transport: http(rpcUrlFor(chainId)),
  });

  const { request } = await publicClient.simulateContract({
    address: contractAddress as `0x${string}`,
    abi: FHECOUNTER_TX_ABI,
    functionName: direction === "inc" ? "increment" : "decrement",
    args: [encryptedHex],
    account,
  });
  const txHash = await walletClient.writeContract(request);
  return txHash;
}
