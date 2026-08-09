export default function Avatar({ name = "", size = "lg" }) {
  const sizes = {
    sm: "w-10 h-10 text-base",
    md: "w-14 h-14 text-lg",
    lg: "w-24 h-24 text-4xl",
  };

  return (
    <div
      className={`${sizes[size]} rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
