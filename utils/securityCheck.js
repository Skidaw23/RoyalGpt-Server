function isSuspiciousOrder(email, total) {
  const suspiciousDomains = ['tempmail.com', '10minutemail.com'];
  const domain = email.split('@')[1];
  const isSuspicious = suspiciousDomains.includes(domain.toLowerCase()) || total > 500;
  return isSuspicious;
}

module.exports = { isSuspiciousOrder };
