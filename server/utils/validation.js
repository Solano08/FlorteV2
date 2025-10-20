const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : "";

const normalizeEmail = (value) => normalizeString(value).toLowerCase();

const isValidEmail = (value) => EMAIL_REGEX.test(normalizeEmail(value));

const parsePositiveInt = (value) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

module.exports = {
  normalizeString,
  normalizeEmail,
  isValidEmail,
  parsePositiveInt,
};
