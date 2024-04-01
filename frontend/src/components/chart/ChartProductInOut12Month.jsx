import { Line } from "@ant-design/plots";
import { Card } from "antd";

const ChartProductInOut12Month = ({ products = [] }) => {
  const config = {
    data: products,
    xField: "monthYear",
    yField: "expense",
    seriesField: "name",
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
      color: ["#5B8FF9", "#5AD8A6"],
    },
    tooltip: { showMarkers: false },
  };

  return (
    <Card title="Khoản thu và chi phí từ nhập - xuất linh kiện">
      <Line {...config} />;
    </Card>
  );
};

export default ChartProductInOut12Month;
