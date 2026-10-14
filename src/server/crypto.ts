import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // Recommended IV length for AES-GCM

function getSecretKey(): Buffer {
  const secret =
    process.env.ENCRYPTION_SECRET ||
    process.env.BETTER_AUTH_SECRET ||
    "repomemo-fallback-secret-key-32b";
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Symmetrically encrypts a string using AES-256-GCM.
 * Returns formatted string: iv:authTag:ciphertext (hex-encoded).
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) {
    return "";
  }

  const key = getSecretKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

/**
 * Decrypts an AES-256-GCM encrypted string.
 * Expects formatted string: iv:authTag:ciphertext (hex-encoded).
 */
export function decrypt(ciphertext: string): string {
  if (!ciphertext) {
    return "";
  }

  const parts = ciphertext.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid ciphertext format");
  }

  const [ivHex, authTagHex, encryptedHex] = parts;
  const key = getSecretKey();
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

/**
 * Safely decrypts an encrypted token, returning null if missing or decryption fails.
 */
export function decryptSafe(ciphertext?: string | null): string | null {
  if (!ciphertext) return null;
  try {
    return decrypt(ciphertext);
  } catch (error) {
    console.error("Failed to decrypt token:", error);
    return null;
  }
}
