export default function first<T>(maybeArray: T | T[]): T | null {
  if (Array.isArray(maybeArray)) {
    if (maybeArray.length >= 1) return maybeArray[0];
    return null;
  }

  return maybeArray;
}
