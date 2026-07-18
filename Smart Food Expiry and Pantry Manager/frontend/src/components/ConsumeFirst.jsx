export default function ConsumeFirst({
  items
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-[#3F6C51]/10 p-6 mb-6">
      <h2 className="text-2xl font-semibold text-[#3F6C51] mb-5">
        Consumption Priority
      </h2>

      <div className="space-y-3">
        {items.slice(0, 5).map((item, index) => (
          <div
            key={item._id}
            className="flex items-center justify-between p-4 rounded-xl bg-[#EEF3EA]/60 border border-[#3F6C51]/10"
          >
            <div>
              <p className="font-semibold text-[#1F2A22]">
                {index + 1}. {item.name}
              </p>

              <p className="text-sm text-[#1F2A22]/60">
                {item.category}
              </p>
            </div>

            <span
              className={`
                px-3 py-1 rounded-full text-sm font-medium
                ${
                  item.priority === "Expired"
                    ? "bg-red-100 text-red-700"
                    : item.priority === "Critical"
                    ? "bg-red-50 text-red-600"
                    : item.priority === "High"
                    ? "bg-orange-100 text-orange-700"
                    : item.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }
              `}
            >
              {item.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}