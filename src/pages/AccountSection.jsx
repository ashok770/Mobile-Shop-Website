export default function AccountSection({ title, description }) {
  return (
    <main className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-slate-900">{title}</h1>
      <p className="mt-4 text-slate-500">{description}</p>
    </main>
  );
}
