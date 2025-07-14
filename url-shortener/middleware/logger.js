const axios = require("axios");

const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";

const VALID_STACKS = ["backend"];
const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const VALID_PACKAGES = [
  "cache", "controller", "cron_job", "db", "domain", "handler",
  "repository", "route", "service", "auth", "config", "middleware", "utils"
];

function isValidField(value, validList) {
  return validList.includes(value.toLowerCase());
}

async function Log(stack, level, pkg, message) {
  if (
    !isValidField(stack, VALID_STACKS) ||
    !isValidField(level, VALID_LEVELS) ||
    !isValidField(pkg, VALID_PACKAGES)
  ) {
    console.warn("Invalid log field values provided:", { stack, level, pkg });
    return;
  }

  const logPayload = {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: pkg.toLowerCase(),
    message
  };

  try {
    await axios.post(LOG_API_URL, logPayload);
  } catch (error) {
    console.error("Failed to send log:", error.message);
  }
}

function loggingMiddleware(req, res, next) {
  Log("backend", "info", "middleware", `Incoming request ${req.method} ${req.originalUrl}`);
  next();
}

module.exports = {
  Log,
  loggingMiddleware
};
