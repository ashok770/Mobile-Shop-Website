export const formatDate = (date) => {
  if (!date) return "—";

  const d = new Date(date);

  if (isNaN(d.getTime())) return "—";

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default formatDate;
