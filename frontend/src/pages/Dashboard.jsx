import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import Container from "../components/styled/Container";
import { Card, Col, Row, Typography } from "antd";
import { FileDoneOutlined, InboxOutlined, TeamOutlined, ToolOutlined } from "@ant-design/icons";
import CardCount from "../components/CardCount";
import TableTop5Product from "../components/table/TableTop5Product";
import TableTop5Service from "../components/table/TableTop5Service";
import TableTop3OutStock from "../components/table/TableTop3OutStock";
import TableTop3LowStock from "../components/table/TableTop3LowStock";
import ChartProductInOut12Month from "../components/chart/ChartProductInOut12Month";
import customerAPI from "../api/requests/customer";
import productAPI from "../api/requests/product";
import serviceAPI from "../api/requests/service";
import orderAPI from "../api/requests/order";
import { toYYYY_MM_DD } from "../utils/converter";
import { addMonth } from "../utils/date";
import _ from "lodash";
import statisticAPI from "../api/requests/statistic";
import { moneyRenderer } from "../utils/renderer";
import Loading from "./Loading";
import ChartService12Month from "../components/chart/ChartService12Month";
import ChartIncome12Month from "../components/chart/ChartIncome12Month";
import InfoPopover from "../components/styled/IconPopover";

const { Title } = Typography;

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState({ customer: 0, product: 0, service: 0, order: 0 });
  const [lowProducts, setLowProducts] = useState([]);
  const [outProducts, setOutProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topServices, setTopServices] = useState([]);
  const [totalPriceProductsIn, setTotalPriceProductsIn] = useState(0);
  const [totalPriceProductsOut, setTotalPriceProductsOut] = useState(0);
  const [totalPriceServices, setTotalPriceServices] = useState(0);
  const [productsInOutYear, setProductsInOutYear] = useState([]);
  const [servicesYear, setServicesYear] = useState([]);
  const [incomesYear, setIncomesYear] = useState([]);

  useEffect(() => {
    const timeParams = {
      startTime: toYYYY_MM_DD(addMonth(new Date(), -1)),
      endTime: toYYYY_MM_DD(),
    };

    setLoading(true);

    Promise.all([
      customerAPI.getAll({ pageSize: 1, pageNumber: 1 }),
      productAPI.getAll({ pageSize: 1000, pageNumber: 1 }),
      serviceAPI.getAll({ pageSize: 1, pageNumber: 1 }),
      orderAPI.getAll({ pageSize: 1, pageNumber: 1, type: "INVOICE", ...timeParams }),
      statisticAPI.getTopProductStatistic(timeParams),
      statisticAPI.getTopServiceStatistic(timeParams),
      statisticAPI.getProductInStatistic({ pageSize: 1000, pageNumber: 1, ...timeParams }),
      statisticAPI.getProductOutStatistic({ pageSize: 1000, pageNumber: 1, ...timeParams }),
      statisticAPI.getServiceStatistic({ pageSize: 1000, pageNumber: 1, ...timeParams }),
      statisticAPI.getProductInYearStatistic(),
      statisticAPI.getProductOutYearStatistic(),
      statisticAPI.getServiceYearStatistic(),
    ])
      .then(
        ([
          customersRes,
          productsRes,
          servicesRes,
          ordersRes,
          topProductsRes,
          topServicesRes,
          productsInRes,
          productsOutRes,
          servicesStatsRes,
          productsInYearRes,
          productsOutYearRes,
          servicesYearRes,
        ]) => {
          const customers = customersRes?.data?.data;
          const products = productsRes?.data?.data;
          const services = servicesRes?.data?.data;
          const orders = ordersRes?.data?.data;
          const topProducts = topProductsRes?.data?.data;
          const topServices = topServicesRes?.data?.data;
          const productsIn = productsInRes?.data?.data?.content;
          const productsOut = productsOutRes?.data?.data?.content;
          const servicesStats = servicesStatsRes?.data?.data?.content;
          let productsInYear = productsInYearRes?.data?.data;
          let productsOutYear = productsOutYearRes?.data?.data;
          let servicesYear = servicesYearRes?.data?.data;

          setCount({
            customer: customers?.totalElements || 0,
            product: products?.totalElements | 0,
            service: services?.totalElements || 0,
            order: orders?.totalElements || 0,
          });

          let lowStock = products?.content?.filter((prod) => prod.status === "LOW_STOCK");
          lowStock = _.chunk(lowStock, 3)[0]?.map((p, i) => ({ ...p, top: i + 1 }));
          setLowProducts(lowStock);

          let outStock = products?.content?.filter((prod) => prod.status === "OUT_STOCK");
          outStock = _.chunk(outStock, 3)[0]?.map((p, i) => ({ ...p, top: i + 1 }));
          setOutProducts(outStock);

          let top5Products = _.chunk(topProducts, 5)[0]?.map((p, i) => ({ ...p, top: i + 1 }));
          let top5Services = _.chunk(topServices, 5)[0]?.map((s, i) => ({ ...s, top: i + 1 }));
          setTopProducts(top5Products);
          setTopServices(top5Services);

          let totalProductsIn = productsIn.reduce((sum, p) => (sum += p.quantity * p.price), 0);
          let totalProductsOut = productsOut.reduce((sum, p) => (sum += p.quantity * p.price), 0);
          let totalServices = servicesStats.reduce((sum, s) => (sum += s.quantity * s.price), 0);
          setTotalPriceProductsIn(totalProductsIn);
          setTotalPriceProductsOut(totalProductsOut);
          setTotalPriceServices(totalServices);

          productsInYear = productsInYear.map((p) => ({
            ...p,
            monthYear: p.month + "/" + p.year,
            name: "Chi phí nhập linh kiên",
            expense: Number(p.expense),
          }));

          productsOutYear = productsOutYear.map((p) => ({
            ...p,
            monthYear: p.month + "/" + p.year,
            name: "Khoản thu bán linh kiên",
            expense: Number(-p.expense),
          }));

          servicesYear = servicesYear.map((s) => ({
            ...s,
            monthYear: s.month + "/" + s.year,
            name: "Khoản thu từ dịch vụ",
            expense: Number(s.expense),
          }));

          const incomesYear = servicesYear.map((s, i) => ({
            ...s,
            name: "Lợi nhuận",
            expense: s.expense + productsOutYear[i].expense - productsInYear[i].expense,
          }));

          setProductsInOutYear([...productsInYear, ...productsOutYear]);
          setServicesYear(servicesYear);
          setIncomesYear(incomesYear);

          setLoading(false);
        }
      )
      .catch((error) => console.log(error));
  }, []);

  if (loading) return <Loading />;

  return (
    <Container size="lg">
      <Title level={2}>Xin chào, {user?.username}</Title>
      <Row gutter={[18, 18]} className="mt-8">
        <Col span={24}>
          <Card
            title={
              <InfoPopover label="Tổng quan kinh doanh">
                Thống kê hiện tại được tính theo 30 ngày gần nhất. Chúng tôi sẽ cập nhật thêm các bộ lọc chi tiết hơn
                trong tương lai
              </InfoPopover>
            }
            bordered={false}
          >
            <Row gutter={18}>
              <Col xs={8} lg={5}>
                <div>Khoản thu từ dịch vụ</div>
                <Title level={4}>{moneyRenderer(totalPriceServices)}</Title>
              </Col>
              <Col xs={8} lg={5}>
                <div>Khoản thu từ linh kiện</div>
                <Title level={4}>{moneyRenderer(totalPriceProductsOut)}</Title>
              </Col>
              <Col xs={8} lg={5}>
                <div>Chi phí nhập linh kiện</div>
                <Title level={4}>{moneyRenderer(totalPriceProductsIn)}</Title>
              </Col>
              <Col xs={8} lg={5}>
                <div>Doanh thu</div>
                <Title level={4}>{moneyRenderer(totalPriceServices + totalPriceProductsOut)}</Title>
              </Col>
              <Col xs={16} lg={4}>
                <div>Lợi nhuận</div>
                <Title level={4}>
                  {moneyRenderer(totalPriceServices + totalPriceProductsOut - totalPriceProductsIn)}
                </Title>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Row gutter={[12, 12]}>
            <Col xs={12} lg={6}>
              <CardCount icon={<TeamOutlined />} title="Khách hàng" count={count.customer} color="#0F83FF" />
            </Col>
            <Col xs={12} lg={6}>
              <CardCount icon={<InboxOutlined />} title="Sản phẩm" count={count.product} color="#00C2FE" />
            </Col>
            <Col xs={12} lg={6}>
              <CardCount icon={<ToolOutlined />} title="Dịch vụ" count={count.service} color="#7D48F4" />
            </Col>
            <Col xs={12} lg={6}>
              <CardCount icon={<FileDoneOutlined />} title="Hóa đơn" count={count.order} color="#F4628D" />
            </Col>
          </Row>
        </Col>
        <Col xs={24} lg={12}>
          <TableTop3OutStock products={outProducts} />
        </Col>
        <Col xs={24} lg={12}>
          <TableTop3LowStock products={lowProducts} />
        </Col>
        <Col span={24}>
          <ChartIncome12Month incomes={incomesYear} />
        </Col>
        <Col span={24}>
          <ChartProductInOut12Month products={productsInOutYear} />
        </Col>
        <Col span={24}>
          <ChartService12Month services={servicesYear} />
        </Col>
        <Col xs={24} lg={12}>
          <TableTop5Service services={topServices} />
        </Col>
        <Col xs={24} lg={12}>
          <TableTop5Product products={topProducts} />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
