import { Line } from "@ant-design/plots";
import { Card } from "antd";

const ChartIncome12Month = ({ incomes = [] }) => {
  const config = {
    data: incomes,
    xField: "monthYear",
    yField: "expense",
    // seriesField: "name",
    yAxis: {
      label: {
        formatter: (v) =>
          Number(v / 10e5)
            .toFixed(1)
            .toLocaleString() + "M ₫",
      },
    },
    legend: { position: "top" },
    point: {
      size: 5,
      shape: "circle",
      color: "#5B8FF9",
    },
    tooltip: { showMarkers: false },
  };

  return (
    <Card title="Lợi nhuận 12 tháng gần nhất">
      <Line {...config} />
    </Card>
  );
};

export default ChartIncome12Month;
