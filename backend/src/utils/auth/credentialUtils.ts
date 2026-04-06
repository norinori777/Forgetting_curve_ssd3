import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SALT_SIZE = 16;
const KEY_SIZE = 64;

export const normalizeEmail = (emailRaw: string): string => emailRaw.trim().toLowerCase();

export const hashPassword = (passwordRaw: string): string => {
  const salt = randomBytes(SALT_SIZE).toString("hex");
  const key = scryptSync(passwordRaw, salt, KEY_SIZE).toString("hex");
  return `${salt}:${key}`;
};

export const verifyPassword = (passwordRaw: string, hashedPassword: string): boolean => {
  const [salt, currentKey] = hashedPassword.split(":");
  if (!salt || !currentKey) {
    return false;
  }

  const inputKey = scryptSync(passwordRaw, salt, KEY_SIZE).toString("hex");
  return timingSafeEqual(Buffer.from(inputKey, "hex"), Buffer.from(currentKey, "hex"));
};
