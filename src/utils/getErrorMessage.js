const DEFAULT_MESSAGE = "Something went wrong. Please try again.";

const STATUS_MESSAGES = {
  400: "That request wasn't valid. Please check your details and try again.",
  401: "Your session has expired. Please log in again.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you were looking for.",
  409: "That conflicts with existing data.",
  429: "Too many attempts. Please wait a moment and try again.",
};

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// Turns raw backend text like
// "ERROR: User validation failed: gender: Male is not a valid gender"
// into something a user can read: "Male is not a valid gender".
const cleanMessage = (raw) => {
  let text = String(raw).trim();
  if (!text) return "";

  if (/E11000|duplicate key/i.test(text)) {
    return /email/i.test(text)
      ? "An account with this email already exists."
      : "That value is already in use.";
  }

  const fieldName = (key) => capitalize(key.replace(/([A-Z])/g, " $1").toLowerCase());

  text = text
    // mongoose built-in validators
    .replace(/Path `(\w+)` \(.*?\) is less than minimum allowed value \((.*?)\)\.?/g, (_, k, n) => `${fieldName(k)} must be at least ${n}.`)
    .replace(/Path `(\w+)` \(.*?\) is more than maximum allowed value \((.*?)\)\.?/g, (_, k, n) => `${fieldName(k)} must be at most ${n}.`)
    .replace(/Path `(\w+)` \(.*?\) is shorter than the minimum allowed length \((.*?)\)\.?/g, (_, k, n) => `${fieldName(k)} must be at least ${n} characters.`)
    .replace(/Path `(\w+)` \(.*?\) is longer than the maximum allowed length \((.*?)\)\.?/g, (_, k, n) => `${fieldName(k)} must be at most ${n} characters.`)
    .replace(/Path `(\w+)` is required\.?/g, (_, k) => `${fieldName(k)} is required.`)
    .replace(/^ERROR:\s*/i, "")
    .replace(/^(User )?validation failed:\s*/i, "")
    // drop the leading "fieldName: " that mongoose adds to each message
    .replace(/(^|,\s*)\w+:\s+(?=\S)/g, "$1");

  return capitalize(text.trim());
};

const isHtml = (text) => /^\s*</.test(text);

/**
 * Convert any thrown error (axios or otherwise) into a short, user-friendly
 * message. Server internals are never shown for 5xx responses.
 */
export const getErrorMessage = (err, fallback = DEFAULT_MESSAGE) => {
  if (!err) return fallback;

  if (err.code === "ECONNABORTED") {
    return "The request took too long. Please try again.";
  }
  if (err.code === "ERR_NETWORK" || (err.request && !err.response)) {
    return "Can't reach the server. Check your internet connection and try again.";
  }

  const status = err.response?.status;
  if (status >= 500) {
    return "Our server ran into a problem. Please try again in a moment.";
  }

  const data = err.response?.data;
  let raw = "";
  if (typeof data === "string") {
    raw = data;
  } else if (data && typeof data === "object") {
    raw =
      data.message ||
      data.error ||
      (Array.isArray(data.errors)
        ? data.errors.map((e) => e?.message || e).join(", ")
        : "");
  }

  if (raw && !isHtml(raw)) {
    const cleaned = cleanMessage(raw);
    if (cleaned) return cleaned;
  }

  return STATUS_MESSAGES[status] || fallback;
};
