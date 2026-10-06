export interface ValidationResult {
  valid: boolean;
  errors: {
    name?: string;
    phone?: string;
  };
}

// Accepts formats like: +1234567890, (123) 456-7890, 123-456-7890, 123.456.7890, 1234567890
// Requires at least 7 digits and at most 15 (E.164-ish upper bound), allows a leading +.
const PHONE_REGEX = /^\+?[0-9()\-.\s]{7,20}$/;

export function validateName(rawName: unknown): string | undefined {
  if (typeof rawName !== "string") return "Name is required.";
  const name = rawName.trim();
  if (name.length === 0) return "Name is required.";
  if (name.length > 100) return "Name must be 100 characters or fewer.";
  return undefined;
}

export function validatePhone(rawPhone: unknown): string | undefined {
  if (typeof rawPhone !== "string") return "Phone number is required.";
  const phone = rawPhone.trim();
  if (phone.length === 0) return "Phone number is required.";

  const digitCount = phone.replace(/\D/g, "").length;
  if (digitCount < 7) return "Phone number is too short.";
  if (digitCount > 15) return "Phone number is too long.";
  if (!PHONE_REGEX.test(phone)) {
    return "Enter a valid phone number (digits, spaces, +, -, ., ( ) only).";
  }
  return undefined;
}

export function validateContactInput(input: {
  name: unknown;
  phone: unknown;
}): ValidationResult {
  const errors: ValidationResult["errors"] = {};

  const nameError = validateName(input.name);
  if (nameError) errors.name = nameError;

  const phoneError = validatePhone(input.phone);
  if (phoneError) errors.phone = phoneError;

  return { valid: Object.keys(errors).length === 0, errors };
}

export function normalizeContactInput(input: { name: string; phone: string }) {
  return {
    name: input.name.trim(),
    phone: input.phone.trim(),
  };
}
