export function getExpiryStatus(expiryDate) {
  const today = new Date();

  today.setHours(0,0,0,0);

  const expiry = new Date(expiryDate);

  expiry.setHours(0,0,0,0);

  const diffDays = Math.ceil(
    (expiry - today) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0)
    return "expired";

  if (diffDays <= 7)
    return "expiringSoon";

  return "safe";
}

export function getDaysRemaining(expiryDate) {
  const today = new Date();

  today.setHours(0,0,0,0);

  const expiry = new Date(expiryDate);

  expiry.setHours(0,0,0,0);

  return Math.ceil(
    (expiry - today) /
    (1000 * 60 * 60 * 24)
  );
}