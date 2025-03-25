function isSuspiciousOrder(email, total) {
    const suspiciousDomains = ['tempmail.com', 'disposablemail.com'];
    const domain = email.split('@')[1];
    const isSuspicious = suspiciousDomains.includes(domain.toLowerCase()) || parseFloat(total) > 500;
    return isSuspicious;
}

module.exports = { isSuspiciousOrder };
