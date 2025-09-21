import type { emailObjectType } from "@/types";

export function isValidEmail(email: string | undefined) {
  if (!email) {
    return false;
  }
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email.trim());
}

function areArraysEqual(first: string[], second: string[]) {
  if (first.length != second.length) {
    return false;
  }
  for (let i = 0; i < first.length; i++) {
    if (first[i] != second[i]) {
      return false;
    }
  }
  return true;
}

export function areEmailObjectsEqual(first: emailObjectType, second: emailObjectType) {
  if (
    first.email == second.email &&
    first.note.length == second.note.length &&
    areArraysEqual(first.tags, second.tags)
  ) {
    return true;
  }
  return false;
}
