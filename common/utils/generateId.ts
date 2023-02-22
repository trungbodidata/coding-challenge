import generate from "nanoid/generate";

export default function generateId(
  random: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  size: number = 20
): string {
  return generate(random, size);
}
