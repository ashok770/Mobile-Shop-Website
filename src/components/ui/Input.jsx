import clsx from "clsx";

export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <input
        className={clsx(
          "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition",
          "focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
          error && "border-red-500",
          className,
        )}
        {...props}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
