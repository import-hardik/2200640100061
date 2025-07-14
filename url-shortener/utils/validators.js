function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidShortcode(code) {
  return /^[a-zA-Z0-9_-]{4,10}$/.test(code);
}

module.exports = {
  isValidUrl,
  isValidShortcode
};
