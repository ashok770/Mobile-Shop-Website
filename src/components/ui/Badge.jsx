import clsx from "clsx";

const variants = {
  success: "bg-green-100 text-green-700",

  warning: "bg-yellow-100 text-yellow-700",

  info: "bg-blue-100 text-blue-700",

  danger: "bg-red-100 text-red-700",
};

export default function Badge({ children, variant = "info", className = "" }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
