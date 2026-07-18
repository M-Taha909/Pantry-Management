export default function HealthScoreCard({
  stats
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">
        Pantry Health Score
      </h2>

      <p className="text-5xl font-bold text-[#3F6C51]">
        {stats.healthScore}/100
      </p>

      <p className="mt-2 text-lg">
        {stats.healthStatus}
      </p>

      <p className="text-gray-500">
        {stats.riskCategory}
      </p>
    </div>
  );
}