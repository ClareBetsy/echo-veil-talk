// Simple AES-GCM helpers using a per-session key (in-memory).
// This is a lightweight demo implementation meant for local UI behavior.

let sessionKey: CryptoKey | null = null;

async function ensureKey(): Promise<CryptoKey> {
  if (!sessionKey) {
    sessionKey = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }
  return sessionKey;
}

export async function encryptMessage(plaintext: string): Promise<{ ivB64: string; dataB64: string }> {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await ensureKey();
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plaintext));
  const ivB64 = btoa(String.fromCharCode(...iv));
  const dataB64 = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
  return { ivB64, dataB64 };
}

export async function decryptMessage(ivB64: string, dataB64: string): Promise<string> {
  const dec = new TextDecoder();
  const iv = Uint8Array.from(atob(ivB64), (c) => c.charCodeAt(0));
  const data = Uint8Array.from(atob(dataB64), (c) => c.charCodeAt(0));
  const key = await ensureKey();
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
  return dec.decode(plaintext);
}

