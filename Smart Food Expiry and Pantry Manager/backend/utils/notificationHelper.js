export const getNotificationMessage = (item) => {
  const today = new Date();

  const expiry = new Date(item.expiryDate);

  const diff = Math.ceil(
    (expiry - today) / (1000 * 60 * 60 * 24)
  );

  if (diff < 0) {
    return `${item.name} expired ${Math.abs(diff)} day(s) ago`;
  }

  if (diff === 0) {
    return `${item.name} expires today`;
  }

  if (diff <= 7) {
    return `${item.name} expires in ${diff} day(s)`;
  }

  return null;
};