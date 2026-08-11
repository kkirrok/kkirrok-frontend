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
  const year = parseInt(digits.slice(0, 4), 10);
  const month = parseInt(digits.slice(4, 6), 10);
  const day = parseInt(digits.slice(6), 10);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};
