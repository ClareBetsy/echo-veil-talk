/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

function readAddress(network) {
  try {
    const jsonPath = path.join(
      __dirname,
      "..",
      "deployments",
      network,
      "FHECounter.json",
    );
    const raw = fs.readFileSync(jsonPath, "utf8");
    const parsed = JSON.parse(raw);
    return parsed.address;
  } catch (e) {
    return undefined;
  }
}

function upsertEnvVar(lines, key, value) {
  const idx = lines.findIndex((l) => l.startsWith(`${key}=`));
  const line = `${key}=${value ?? ""}`;
  if (idx === -1) lines.push(line);
  else lines[idx] = line;
}

function ensureFrontendEnv(addresses) {
  const frontendDir = path.join(__dirname, "..", "frontend");
  const envPath = path.join(frontendDir, ".env");
  const examplePath = path.join(frontendDir, "env.example");

  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(examplePath)) {
      fs.copyFileSync(examplePath, envPath);
      console.log("[env] Created frontend/.env from env.example");
    } else {
      fs.writeFileSync(envPath, "");
      console.log("[env] Created empty frontend/.env");
    }
  }

  const content = fs.readFileSync(envPath, "utf8");
  const lines = content.split(/\r?\n/).filter((l) => l.length > 0);

  if (addresses.localhost) {
    upsertEnvVar(lines, "VITE_LOCALHOST_FHECOUNTER", addresses.localhost);
  }
  if (addresses.sepolia) {
    upsertEnvVar(lines, "VITE_SEPOLIA_FHECOUNTER", addresses.sepolia);
  }

  fs.writeFileSync(envPath, lines.join("\n") + "\n");
  console.log("[env] Updated frontend/.env with contract addresses", addresses);
}

function main() {
  const localhost = readAddress("localhost");
  const sepolia = readAddress("sepolia");
  if (!localhost && !sepolia) {
    console.warn(
      "[env] No deployments found. Run `npx hardhat deploy --network localhost` or `--network sepolia` first.",
    );
  }
  ensureFrontendEnv({ localhost, sepolia });
}

main();


