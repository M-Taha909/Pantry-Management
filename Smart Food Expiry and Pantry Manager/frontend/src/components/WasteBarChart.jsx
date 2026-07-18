import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function WasteBarChart({
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
    "#FF6B6B",
    "#FF8787",
    "#FFA94D",
    "#FFD43B",
    "#69DB7C"
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="text-xl mb-4">
        Most Wasted Categories
      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value">
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}