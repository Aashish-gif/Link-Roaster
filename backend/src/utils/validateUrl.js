export function validateUrl(input) {
  if (!input || typeof input !== 'string') {
    throw { code: 'INVALID_URL', message: 'URL must be a non-empty string' };
  }

  let trimmed = input.trim();

  // Auto-prepend https:// if no protocol
  if (!/^[a-zA-Z0-9+-.]+:\/\//.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(trimmed);
  } catch (err) {
    throw { code: 'INVALID_URL', message: 'Invalid URL format' };
  }

  // Only allow http: and https: protocols
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw { code: 'INVALID_URL', message: 'Only HTTP and HTTPS protocols are allowed' };
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  // Block localhost, 127.0.0.1, 0.0.0.0, ::1
  const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]'];
  if (blockedHosts.includes(hostname)) {
    throw { code: 'INVALID_URL', message: 'Access to localhost and loopback addresses is blocked' };
  }

  // Block private IP ranges: 10.x, 172.16-31.x, 192.168.x
  if (/^10\./.test(hostname)) {
    throw { code: 'INVALID_URL', message: 'Access to private IP ranges is blocked' };
  }
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)) {
    throw { code: 'INVALID_URL', message: 'Access to private IP ranges is blocked' };
  }
  if (/^192\.168\./.test(hostname)) {
    throw { code: 'INVALID_URL', message: 'Access to private IP ranges is blocked' };
  }

  return parsedUrl.toString();
}

export function extractDomain(url) {
  try {
    const parsedUrl = new URL(url);
    let hostname = parsedUrl.hostname.toLowerCase();
    if (hostname.startsWith('www.')) {
      hostname = hostname.substring(4);
    }
    return hostname;
  } catch (err) {
    return url;
  }
}
