// Minimal auth gates for send/decrypt using a wallet signature.
// Stores one-session flags in sessionStorage.

async function getAddress(): Promise<string | null> {
  // @ts-expect-error injected by wallet
  const ethereum = window.ethereum;
  if (!ethereum) return null;
  const accounts: string[] = await ethereum.request({ method: 'eth_requestAccounts' });
  return accounts?.[0] ?? null;
}

async function sign(message: string): Promise<string | null> {
  // @ts-expect-error injected by wallet
  const ethereum = window.ethereum;
  if (!ethereum) return null;
  const addr = await getAddress();
  if (!addr) return null;
  // Metamask personal_sign expects [message, address]
  try {
    const sig: string = await ethereum.request({ method: 'personal_sign', params: [message, addr] });
    return sig;
  } catch {
    return null;
  }
}

export function isSendAuthorized(): boolean {
  return sessionStorage.getItem('wc.sendAuth') === '1';
}
export async function ensureSendAuth(): Promise<boolean> {
  if (isSendAuthorized()) return true;
  const sig = await sign('WhisperChat: authorize encrypted send');
  if (sig) {
    sessionStorage.setItem('wc.sendAuth', '1');
    return true;
  }
  return false;
}

export function isDecryptAuthorized(): boolean {
  return sessionStorage.getItem('wc.decryptAuth') === '1';
}
export async function ensureDecryptAuth(): Promise<boolean> {
  if (isDecryptAuthorized()) return true;
  const sig = await sign('WhisperChat: authorize decrypt');
  if (sig) {
    sessionStorage.setItem('wc.decryptAuth', '1');
    return true;
  }
  return false;
}

