import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { sepolia, hardhat } from 'wagmi/chains';

// Network configuration aligned with @shield-trade-loop local/testnet pattern.
// - Always expose Hardhat (31337) and Sepolia (11155111)
// - Prefer explicit RPC URLs via env to avoid CORS/cache surprises
// Vite envs must be prefixed with VITE_
const localRpcUrl = import.meta.env.VITE_LOCAL_RPC_URL || 'http://127.0.0.1:8545';
const sepoliaRpcUrl = import.meta.env.VITE_SEPOLIA_RPC_URL || 'https://rpc.sepolia.org';

// Patch Hardhat chain to use the explicit local RPC URL (chain id 31337)
const customHardhat = {
  ...hardhat,
  rpcUrls: {
    ...hardhat.rpcUrls,
    default: { http: [localRpcUrl] },
    public: { http: [localRpcUrl] },
  },
} as const;

// Build wagmi config with injected connector only (no WalletConnect/AppKit)
export const config = createConfig({
  chains: [customHardhat, sepolia],
  connectors: [injected()],
  transports: {
    [customHardhat.id]: http(localRpcUrl, { timeout: 10_000 }),
    [sepolia.id]: http(sepoliaRpcUrl, { timeout: 12_000 }),
  },
  ssr: false,
});
