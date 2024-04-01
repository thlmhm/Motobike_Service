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
  { title: "Dịch vụ", dataIndex: "name", render: defaultRenderer },
  { title: "Mã dịch vụ", dataIndex: "code", render: defaultRenderer },
  { title: "Giá dịch vụ", dataIndex: "price", render: moneyRenderer },
  { title: "Số lượng", dataIndex: "quantity", render: defaultRenderer },
  { title: "Doanh thu", dataIndex: "income", render: moneyRenderer },
];

const ServiceStatistic = () => {
  const location = useLocation();
  const params = queryString.parse(location.search);
  const { startTime, endTime } = params;

  const [serviceStats, setServiceStats] = useState([]);
  const [loading, setLoading] = useState(false);

  const totalEarn = useMemo(() => serviceStats.reduce((sum, prod) => (sum += prod.income), 0), [serviceStats]);

  useEffect(() => {
    setLoading(true);
    apiCaller(
      statisticAPI.getServiceStatistic({
        startTime: toYYYY_MM_DD(startTime || dayjs().subtract(1, "month")),
        endTime: toYYYY_MM_DD(endTime),
        pageSize: 1000,
        pageNumber: 1,
      }),
      (data) => {
        setServiceStats(data?.data?.content);
        setLoading(false);
      }
    );
  }, [endTime, startTime]);

  const exportTable = useCallback(() => {
    new Excel()
      .addSheet("Doanh thu từ dịch vụ")
      .addColumns(labels)
      .addDataSource(serviceStats, { str2Percent: true })
      .saveAs(`Doanh thu dịch vụ - (${toDDMMYYYY(startTime)} - ${toDDMMYYYY(endTime)}).xlsx`);
  }, [serviceStats, startTime, endTime]);

  const columns = [
    {
      title: "Dịch vụ",
      dataIndex: "name",
      render: (name, record) => <Link to={`/services/edit/${record?.id}`}>{name}</Link>,
    },
    { title: "Mã dịch vụ", dataIndex: "code", align: "center", render: defaultRenderer },
    { title: "Giá dịch vụ", dataIndex: "price", align: "center", render: moneyRenderer },
    { title: "Số lượng", dataIndex: "quantity", align: "center", render: defaultRenderer },
    { title: "Doanh thu", dataIndex: "income", align: "center", render: moneyRenderer },
  ];

  return (
    <StatisticPageLayout
      title="Doanh thu từ dịch vụ"
      navigatePath="/statistics/services-income"
      handleExport={exportTable}
    >
      <Card title="Doanh thu từ dịch vụ" bordered={false} className="mt-8">
        <Table
          size="small"
          columns={columns}
          rowKey={(record) => record.id + record.price}
          dataSource={serviceStats}
          loading={loading}
          pagination={{ hideOnSinglePage: true, pageSize: 1000 }}
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
      <Card bordered={false} className="mt-8">
        <Typography.Title level={4} className="mb-0">
          <Space className="mr-4" style={{ display: "flex", justifyContent: "center" }}>
            <span>Tổng thu cuối:</span>
            <span>{moneyRenderer(totalEarn)}</span>
          </Space>
        </Typography.Title>
      </Card>
    </StatisticPageLayout>
  );
};

export default ServiceStatistic;
