import Button from "./Button";

export default function EmptyState({
  title,
  description,
  buttonText,
  onClick,
}) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-16 px-8 text-center">
      <div className="text-6xl mb-5">📦</div>

      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

      <p className="text-gray-500 mt-3 max-w-md mx-auto">{description}</p>

      {buttonText && (
        <Button className="mt-8" onClick={onClick}>
          {buttonText}
        </Button>
      )}
    </div>
  );
}
