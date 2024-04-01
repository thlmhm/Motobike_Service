import { Card, Table, Typography } from "antd";
import BlankContent from "../styled/BlankContent";
import { BarChartOutlined } from "@ant-design/icons";
const { Title } = Typography;

const colorRanking = ["gold", "silver", "#cd7f32", "lightskyblue", "#0b0a0a"];

const TableTop5Service = ({ services = [] }) => {
  return (
    <Card title="Top dịch vụ sử dụng nhiều" className="h-100">
      {Boolean(services?.length) && (
        <Table
          columns={[
            {
              title: "Top",
              dataIndex: "top",
              align: "center",
              render: (name) => (
                <Title level={4} style={{ color: colorRanking[name - 1] }}>
                  {name}
                </Title>
              ),
            },
            {
              title: "Dịch vụ",
              dataIndex: "name",
              align: "center",
              render: (name) => (
                <Title level={5} className="line-1">
                  {name}
                </Title>
              ),
            },
            {
              title: "Số lượng",
              dataIndex: "quantity",
              align: "center",
              render: (qty) => <Title level={5}>{qty}</Title>,
            },
          ]}
          rowKey={(record) => record.id}
          dataSource={services}
          size="small"
          bordered
          pagination={{ pageSize: 100, hideOnSinglePage: true }}
        />
      )}
      {Boolean(!services?.length) && (
        <BlankContent>
          <BarChartOutlined />
          <Title level={5} className="mt-4">
            Hiện chưa có thống kê về dịch vụ
          </Title>
        </BlankContent>
      )}
    </Card>
  );
};

export default TableTop5Service;
