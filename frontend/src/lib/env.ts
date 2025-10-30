export function validateEnv() {
  const missing: string[] = [];
  if (!import.meta.env.VITE_LOCALHOST_FHECOUNTER) missing.push("VITE_LOCALHOST_FHECOUNTER");
  if (!import.meta.env.VITE_SEPOLIA_FHECOUNTER) missing.push("VITE_SEPOLIA_FHECOUNTER");
  if (missing.length > 0) {
    // Do not crash the app; emit a clear console error for developers.
    // Frontend UI also guards on undefined addresses.
    // eslint-disable-next-line no-console
    console.error(
      `[env] Missing required variables: ${missing.join(
        ", ",
      )}. Copy env.example to .env and fill in values.`,
    );
  }

  // Optional RPC URLs; warn if not provided so developers know where to set them
  if (!import.meta.env.VITE_LOCAL_RPC_URL) {
    // eslint-disable-next-line no-console
    console.warn("[env] VITE_LOCAL_RPC_URL not set. Defaulting to http://127.0.0.1:8545");
  }
  if (!import.meta.env.VITE_SEPOLIA_RPC_URL) {
    // eslint-disable-next-line no-console
    console.warn("[env] VITE_SEPOLIA_RPC_URL not set. Defaulting to https://rpc.sepolia.org");
  }
}
