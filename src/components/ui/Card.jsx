import clsx from "clsx";

export default function Card({ children, className = "", hover = false }) {
  return (
    <div
      className={clsx(
        "bg-white rounded-3xl border border-gray-200 shadow-sm",
        hover && "hover:shadow-lg transition-all duration-300",
        className,
      )}
    >
      {children}
    </div>
  );
}
