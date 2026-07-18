export const getPriority = (expiryDate) => {
  const today = new Date();

  const diff = Math.ceil(
    (new Date(expiryDate) - today) /
    (1000 * 60 * 60 * 24)
  );

  if (diff < 0)
    return "Expired";

  if (diff <= 1)
    return "Critical";

  if (diff <= 3)
    return "High";

  if (diff <= 7)
    return "Medium";

  return "Low";
};