import { useCallback, useEffect, useMemo, useState } from "react";
import { apiCaller } from "../../utils/api";
import statisticAPI from "../../api/requests/statistic";
import StatisticPageLayout from "../../layouts/StatisticPageLayout";
import { Card, Space, Table, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
import { toDDMMYYYY, toYYYY_MM_DD } from "../../utils/converter";
import queryString from "query-string";
import { defaultRenderer, moneyRenderer } from "../../utils/renderer";
import TableRowExpand from "../../components/TableRowExpand";
import { Excel } from "antd-table-saveas-excel";
import dayjs from "dayjs";

const labels = [
  { title: "Linh kiện", dataIndex: "name" },
  { title: "Mã linh kiện", dataIndex: "code" },
  { title: "Đơn vị", dataIndex: "unit" },
  { title: "Giá tiền", dataIndex: "price", render: moneyRenderer },
  { title: "Phân loại", dataIndex: "income", render: (income) => (income > 0 ? "Xuất hàng" : "Nhập hàng") },
  { title: "Số lượng", dataIndex: "quantity" },
  { title: "Thu / Chi", dataIndex: "income", render: moneyRenderer },
];

const ProductStatistic = () => {
  const location = useLocation();
  const params = queryString.parse(location.search);
  const { startTime, endTime } = params;

  const [prodIn, setProdIn] = useState([]);
  const [prodOut, setProdOut] = useState([]);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const totalLost = useMemo(() => prodIn.reduce((sum, prod) => (sum += prod.income), 0), [prodIn]);
  const totalEarn = useMemo(() => prodOut.reduce((sum, prod) => (sum += prod.income), 0), [prodOut]);

  useEffect(() => {
    setLoading1(true);
    apiCaller(
      statisticAPI.getProductInStatistic({
        startTime: toYYYY_MM_DD(startTime || dayjs().subtract(1, "month")),
        endTime: toYYYY_MM_DD(endTime),
        pageSize: 1000,
        pageNumber: 1,
      }),
      (data) => {
        setProdIn(data.data.content);
        setLoading1(false);
      }
    );

    setLoading2(true);
    apiCaller(
      statisticAPI.getProductOutStatistic({
        startTime: toYYYY_MM_DD(startTime || dayjs().subtract(1, "month")),
        endTime: toYYYY_MM_DD(endTime),
        pageSize: 1000,
        pageNumber: 1,
      }),
      (data) => {
        setProdOut(data.data.content);
        setLoading2(false);
      }
    );
  }, [endTime, startTime]);

  const exportTable = useCallback(() => {
    new Excel()
      .addSheet("Doanh thu từ linh kiện")
      .addColumns(labels)
      .addDataSource([...prodIn, ...prodOut], { str2Percent: true })
      .saveAs(`Doanh thu linh kiện - (${toDDMMYYYY(startTime)} - (${toDDMMYYYY(endTime)})).xlsx`);
  }, [prodIn, prodOut, startTime, endTime]);

  const columnsOut = [
    {
      title: "Linh kiện",
      dataIndex: "name",
      render: (name, record) => (
        <Link
          to={`/stock-history?${queryString.stringify({
            productName: record.name,
            unit: record.unit,
            priceOut: record.price,
            action: "EXPORT",
            startTime: toYYYY_MM_DD(startTime || dayjs().subtract(1, "month")),
            endTime: toYYYY_MM_DD(endTime),
          })}`}
        >
          {name}
        </Link>
      ),
    },
    { title: "Mã linh kiện", dataIndex: "code", align: "center", render: defaultRenderer },
    { title: "Đơn vị", dataIndex: "unit", align: "center", render: defaultRenderer },
    { title: "Số lượng", dataIndex: "quantity", align: "center", render: defaultRenderer },
    { title: "Giá tiền", dataIndex: "price", align: "center", render: moneyRenderer },
    { title: "Doanh thu", dataIndex: "income", align: "center", render: moneyRenderer },
  ];

  const columnsIn = [
    {
      title: "Linh kiện",
      dataIndex: "name",
      render: (name, record) => (
        <Link
          to={`/stock-history?${queryString.stringify({
            productName: record.name,
            unit: record.unit,
            priceIn: record.price,
            action: "IMPORT",
            startTime: toYYYY_MM_DD(startTime || dayjs().subtract(1, "month")),
            endTime: toYYYY_MM_DD(endTime),
          })}`}
        >
          {name}
        </Link>
      ),
    },
    { title: "Mã linh kiện", dataIndex: "code", align: "center", render: defaultRenderer },
    { title: "Đơn vị", dataIndex: "unit", align: "center", render: defaultRenderer },
    { title: "Số lượng", dataIndex: "quantity", align: "center", render: defaultRenderer },
    { title: "Giá tiền", dataIndex: "price", align: "center", render: moneyRenderer },
    { title: "Chi phí", dataIndex: "income", align: "center", render: moneyRenderer },
  ];

  return (
    <StatisticPageLayout
      title="Doanh thu từ linh kiện"
      navigatePath="/statistics/products-income"
      handleExport={exportTable}
    >
      <Card title="Doanh thu bán linh kiện" bordered={false} className="mt-8">
        <Table
          size="small"
          columns={columnsOut}
          rowKey={(record) => record.id + record.price}
          dataSource={prodOut}
          loading={loading2}
          pagination={{ hideOnSinglePage: true, pageSize: 10, size: "default" }}
          expandable={{
            expandedRowRender: (record) => <TableRowExpand record={record} labels={labels} />,
          }}
          scroll={{ x: 576 }}
        />
        <Space className="mt-4 mr-4" style={{ display: "flex", justifyContent: "end" }}>
          <span className="text-semibold">Tổng doanh thu:</span>
          <span>{moneyRenderer(totalEarn)}</span>
        </Space>
      </Card>
      <Card title="Chi phí nhập linh kiện" bordered={false} className="mt-8">
        <Table
          size="small"
          columns={columnsIn}
          rowKey={(record) => record.id}
          dataSource={prodIn}
          loading={loading1}
          pagination={{ hideOnSinglePage: true, pageSize: 10, size: "default" }}
          expandable={{
            expandedRowRender: (record) => <TableRowExpand record={record} labels={labels} />,
          }}
          scroll={{ x: 576 }}
        />
        <Space className="mt-4 mr-4" style={{ display: "flex", justifyContent: "end" }}>
          <span className="text-semibold">Tổng chi phí:</span>
          <span>{moneyRenderer(totalLost)}</span>
        </Space>
      </Card>
      <Card bordered={false} className="mt-8">
        <Typography.Title level={4} className="mb-0">
          <Space className="mr-4" style={{ display: "flex", justifyContent: "center" }}>
            <span>Tổng thu cuối:</span>
            <span>{moneyRenderer(totalLost + totalEarn)}</span>
          </Space>
        </Typography.Title>
      </Card>
    </StatisticPageLayout>
  );
};

export default ProductStatistic;
