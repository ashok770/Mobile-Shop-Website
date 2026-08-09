import clsx from "clsx";

const variants = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",

  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",

  outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-900",

  danger: "bg-red-600 hover:bg-red-700 text-white",
};

const sizes = {
  sm: "px-3 py-2 text-sm",

  md: "px-5 py-3",

  lg: "px-7 py-4 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <button
      className={clsx(
        "rounded-xl font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
