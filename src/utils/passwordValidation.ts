export interface PasswordValidation {
  length: boolean;
  uppercase: boolean;
  number: boolean;
  special: boolean;
}

export function validatePassword(password: string): PasswordValidation {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
}

export function isPasswordValid(password: string): boolean {
  const validation = validatePassword(password);
  return Object.values(validation).every(Boolean);
}
