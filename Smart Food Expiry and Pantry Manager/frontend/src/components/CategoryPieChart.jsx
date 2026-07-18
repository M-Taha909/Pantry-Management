import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function CategoryPieChart({
  data
}) {
  const chartData =
    Object.entries(data).map(
      ([name, value]) => ({
        name,
        value
      })
    );
  const COLORS = [
    "#3F6C51", // dark green
    "#E3A542", // amber
    "#6C63FF", // purple
    "#FF6B6B", // red
    "#4ECDC4", // teal
    "#A66DD4", // violet
    "#FFA94D", // orange
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="text-xl mb-4">
        Inventory Distribution
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={index}
              fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}