export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPassword = (pw: string) =>
  pw.length >= 8 &&
  /[a-zA-Z]/.test(pw) &&
  /[0-9]/.test(pw) &&
  /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw);

export const isValidPhone = (digits: string) =>
  digits.length >= 10 && digits.length <= 11;

export const isValidBirthdate = (digits: string) => {
  if (digits.length !== 8) return false;
  const month = parseInt(digits.slice(4, 6), 10);
  const day = parseInt(digits.slice(6), 10);
  return month >= 1 && month <= 12 && day >= 1 && day <= 31;
};
