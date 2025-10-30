export async function encryptDelta(delta: number): Promise<Uint8Array> {
  // Placeholder: deterministic 32-byte "ciphertext". Replace with Zama SDK.
  // Layout: [0..27]=0x00, [28]=0xED marker, [29]=delta(low byte), [30]=0x00, [31]=0x01 version
  const bytes = new Uint8Array(32);
  bytes.fill(0);
  bytes[28] = 0xed;
  bytes[29] = delta & 0xff;
  bytes[30] = 0x00;
  bytes[31] = 0x01;
  return bytes;
}



