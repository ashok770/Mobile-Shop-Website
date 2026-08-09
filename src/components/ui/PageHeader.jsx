export default function PageHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-10">
      {eyebrow && (
        <p className="uppercase tracking-[0.25em] text-blue-600 font-semibold text-sm">
          {eyebrow}
        </p>
      )}

      <h1 className="text-4xl font-bold text-gray-900 mt-2">{title}</h1>

      {description && (
        <p className="text-gray-500 mt-3 max-w-2xl">{description}</p>
      )}
    </div>
  );
}
