const { isValidUrl, isValidShortcode } = require('../utils/validators');
const { Log } = require('../middleware/logger');
const { nanoid } = require('nanoid');

// In-memory store
const urlStore = {};

function createShortUrl(req, res) {
  const { url, validity = 30, shortcode } = req.body;

  if (!url || !isValidUrl(url)) {
    Log("backend", "error", "handler", "Invalid or missing URL");
    return res.status(400).json({ error: 'Invalid or missing URL' });
  }

  const code = shortcode && isValidShortcode(shortcode) ? shortcode : nanoid(6);

  if (urlStore[code]) {
    Log("backend", "error", "handler", "Shortcode already exists");
    return res.status(400).json({ error: 'Shortcode already exists' });
  }

  const now = Date.now();
  const expiresAt = now + validity * 60 * 1000; // validity in minutes

  urlStore[code] = {
    originalUrl: url,
    createdAt: now,
    expiresAt,
    clicks: []
  };

  Log("backend", "info", "handler", `Short URL created for code: ${code}`);

  res.json({
    message: 'Short URL created',
    shortcode: code,
    shortUrl: `http://localhost:3000/${code}`,
    expiresInMinutes: validity
  });
}

function redirectUrl(req, res) {
  const { shortcode } = req.params;
  const entry = urlStore[shortcode];

  if (!entry) {
    Log("backend", "warn", "route", `Short URL not found: ${shortcode}`);
    return res.status(404).json({ error: 'Short URL not found' });
  }

  if (Date.now() > entry.expiresAt) {
    Log("backend", "warn", "route", `Expired shortcode access attempt: ${shortcode}`);
    return res.status(410).json({ error: 'Short URL expired' });
  }

  entry.clicks.push({
    timestamp: new Date().toISOString(),
    referrer: req.get('Referer') || 'direct',
    ip: req.ip
  });

  res.redirect(entry.originalUrl);
}

function getShortUrlInfo(req, res) {
  const { shortcode } = req.params;
  const entry = urlStore[shortcode];

  if (!entry) {
    Log("backend", "warn", "handler", `Shortcode not found in info lookup: ${shortcode}`);
    return res.status(404).json({ error: 'Shortcode not found' });
  }

  res.json({
    total_clicks: entry.clicks.length,
    info: {
      original_url: entry.originalUrl,
      creation_date: new Date(entry.createdAt).toISOString(),
      expiry_date: new Date(entry.expiresAt).toISOString()
    },
    detail: entry.clicks
  });
}

module.exports = {
  createShortUrl,
  redirectUrl,
  getShortUrlInfo
};
