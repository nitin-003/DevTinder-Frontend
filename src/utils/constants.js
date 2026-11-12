
export const BASE_URL = location.hostname == "localhost" ? "http://localhost:3000" : "/api";

// Stock "no photo" images that should be treated as if the user has no photo
const PLACEHOLDER_PHOTO_PATTERNS = [
  /pngall\.com\/wp-content\/uploads\/\d+\/Profile-Male/i,
  /Profile-(Male|Female)-Transparent/i,
  /default[-_]?(avatar|user|profile|photo)/i,
];

export const isPlaceholderPhoto = (url) =>
  !url || PLACEHOLDER_PHOTO_PATTERNS.some((pattern) => pattern.test(url));
