import { Card, Table, Typography } from "antd";
import BlankContent from "../styled/BlankContent";
import { BarChartOutlined } from "@ant-design/icons";
const { Title } = Typography;

const colorRanking = ["gold", "silver", "#cd7f32", "lightskyblue", "#0b0a0a"];

const TableTop5Product = ({ products = [] }) => {
  return (
    <Card title="Top linh kiện sử dụng nhiều" className="h-100">
      {Boolean(products?.length) && (
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
              title: "Linh kiện",
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
              render: (qty, record) => <Title level={5}>{qty + " " + record.unit}</Title>,
            },
          ]}
          rowKey={(record) => record.id}
          dataSource={products}
          size="small"
          bordered
          pagination={{ pageSize: 100, hideOnSinglePage: true }}
        />
      )}
      {Boolean(!products?.length) && (
        <BlankContent>
          <BarChartOutlined />
          <Title level={5} className="mt-4">
            Hiện chưa có thống kê về linh kiện
          </Title>
        </BlankContent>
      )}
    </Card>
  );
};

export default TableTop5Product;
