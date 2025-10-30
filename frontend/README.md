# Echo Veil Talk — Frontend

React + Vite app wired with RainbowKit and Wagmi (injected wallet only) for wallet connections.

## Requirements
- Node.js 18+ and npm
- A local Hardhat/Anvil node for localhost (31337) or a Sepolia RPC URL

## Quick start
```sh
cd echo-veil-talk/frontend
npm install
cp env.example .env
# Optionally customize RPCs; defaults are fine for local dev
npm run dev
```

## Environment
Copy `env.example` to `.env` and set:
```
VITE_LOCAL_RPC_URL=http://127.0.0.1:8545
VITE_SEPOLIA_RPC_URL=https://rpc.sepolia.org
VITE_LOCALHOST_FHECOUNTER=0xYourLocalFheCounterAddress
VITE_SEPOLIA_FHECOUNTER=0xYourSepoliaFheCounterAddress
```

## Scripts
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build
  
## Wallet config
Wagmi/RainbowKit configuration lives in `src/lib/wagmi.ts` and enables `hardhat` (31337) and `sepolia` (11155111) using explicit RPC transports. No WalletConnect/AppKit is used; only the injected connector (e.g., MetaMask).

## Tech stack
- Vite, React, TypeScript
- shadcn/ui, Tailwind CSS
- RainbowKit, Wagmi, Viem
