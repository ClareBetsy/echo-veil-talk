# Echo Veil Talk

A full-stack template for FHEVM that demonstrates a "homomorphic encrypted chat + smart contract" example. It includes:
- Frontend (Vite + React + Tailwind + RainbowKit/Wagmi): the encrypted chat UI WhisperChat with wallet-authorized encrypt/decrypt demo.
- Smart contracts (Hardhat + TypeScript): FHE counter FHECounter.sol showing homomorphic ops (add/sub) on encrypted data.

## Demo

- Live demo: https://echo-veil-talk-mcb.vercel.app/
- Demo video: [watch](./video.mp4)

<video src="./video.mp4" controls width="720"></video>

## Features

- End-to-end message encryption (local encrypt/decrypt in the browser), showcasing an FHE-based encrypted-data workflow
- FHECounter contract: uses `@fhevm/solidity` `FHE.add / FHE.sub` to perform homomorphic operations over an encrypted counter
- One-command deploy with frontend sync: `deploy:localhost`/`deploy:sepolia` automatically writes addresses into the frontend env (`scripts/update-frontend-env.js`)
- Supports local chains (hardhat/anvil) and Sepolia testnet

## Project structure

```
.
├── contracts/            # Smart contracts (FHECounter.sol)
├── deploy/               # Deploy script (deploy.ts)
├── scripts/              # Utility scripts (update frontend env)
├── tasks/                # Hardhat tasks
├── test/                 # Contract tests
├── frontend/             # Frontend (Vite + React)
├── hardhat.config.ts     # Hardhat config
├── package.json          # Root project scripts
└── video.mp4             # Demo video
```

## Quick start

### Prerequisites
- Node.js ≥ 20, plus one of npm/pnpm/yarn
- Optional: Infura API Key (for Sepolia)

### Backend (contracts)
```bash
# Install dependencies
npm install

# Compile and test
npm run compile
npm run test

# Start a local node (in another terminal)
npx hardhat node

# Deploy to localhost (auto-syncs address to frontend/.env)
npm run deploy:localhost
```

When deploying to Sepolia, prepare environment variables (root .env) like:
```bash
SEPOLIA_PRIVATE_KEY=0x<YOUR_SEPOLIA_PRIVATE_KEY>
INFURA_API_KEY=<YOUR_INFURA_API_KEY>
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/<YOUR_INFURA_API_KEY>
```
Then:
```bash
npm run deploy:sepolia
```

### Frontend (app)
```bash
cd frontend
npm install
cp env.example .env   # copy the example on first run
# If you want to set manually, configure in .env:
# VITE_LOCAL_RPC_URL=http://127.0.0.1:8545
# VITE_SEPOLIA_RPC_URL=https://rpc.sepolia.org
# VITE_LOCALHOST_FHECOUNTER=0x...
# VITE_SEPOLIA_FHECOUNTER=0x...

npm run dev
```

## Contract: FHECounter
- `getCount() -> euint32`: returns the encrypted counter
- `increment(externalEuint32 input, bytes proof)`: homomorphic add to the encrypted counter
- `decrement(externalEuint32 input, bytes proof)`: homomorphic subtract from the encrypted counter
- Built on `@fhevm/solidity` and `ZamaConfig` (SepoliaConfig)

Core snippet (simplified):
```solidity
_count = FHE.add(_count, encryptedEuint32);
FHE.allowThis(_count);
FHE.allow(_count, msg.sender);
```

## Root scripts
- `npm run compile`: compile contracts
- `npm run test`: run tests
- `npm run node`: run local node
- `npm run deploy:localhost`: deploy to localhost and sync frontend env
- `npm run deploy:sepolia`: deploy to Sepolia and sync frontend env
- `npm run coverage`, `npm run lint`, `npm run clean`: quality and cleanup

## References
- FHEVM docs: https://docs.zama.ai/fhevm
- Hardhat guide (FHEVM): https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat

## License
BSD-3-Clause-Clear. See [LICENSE](./LICENSE).
