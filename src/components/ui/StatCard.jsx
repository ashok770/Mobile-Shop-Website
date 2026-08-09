import Card from "./Card";

export default function StatCard({ icon, title, value, subtitle }) {
  const Icon = icon;

  return (
    <Card hover className="p-6">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
        <Icon size={28} />
      </div>

      <p className="mt-6 text-sm text-gray-500">{title}</p>

      <h2 className="text-3xl font-bold text-gray-900 mt-1">{value}</h2>

      {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}
    </Card>
  );
}
