import { Line } from "@ant-design/plots";
import { Card } from "antd";

const ChartService12Month = ({ services = [] }) => {
  const config = {
    data: services,
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
    <Card title="Khoản thu từ dịch vụ">
      <Line {...config} />;
    </Card>
  );
};

export default ChartService12Month;
