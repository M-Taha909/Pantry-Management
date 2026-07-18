export default function AnalyticsCards({
  stats,
  financial
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

      <div className="bg-white p-5 rounded-xl shadow">
        <h3>Total Items</h3>
        <p className="text-3xl font-bold">
          {stats.total}
        </p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow">
        <h3>Expired</h3>
        <p className="text-3xl font-bold text-red-500">
          {stats.expired}
        </p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow">
        <h3>Expiring Soon</h3>
        <p className="text-3xl font-bold text-orange-500">
          {stats.expiringSoon}
        </p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow">
        <h3>Inventory Value</h3>
        <p className="text-3xl font-bold">
          Rs {financial.activeInventoryValue || 0}
        </p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow">
        <h3>Estimated Waste</h3>
        <p className="text-3xl font-bold text-red-500">
          Rs {financial.estimatedWaste || 0}
        </p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow">
        <h3>Potential Savings</h3>
        <p className="text-3xl font-bold text-green-600">
          Rs {financial.potentialSavings || 0}
        </p>
      </div>

    </div>
  );
}