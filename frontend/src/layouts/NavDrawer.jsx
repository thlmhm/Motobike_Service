import {
  FileDoneOutlined,
  FileTextOutlined,
  HomeOutlined,
  InboxOutlined,
  LineChartOutlined,
  SettingOutlined,
  TeamOutlined,
  ToolOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { styled } from "styled-components";
import { IcLogo, IcLogoSm } from "../components/Icon";
import AuthContext from "../context/AuthContext";

const keyToItem = (key, routes) => {
  const route = routes.find((r) => r.key === key);
  return {
    key: route.key,
    label: <Link to={route.pathname}>{route.label}</Link>,
    icon: route.icon,
  };
};

const routesManager = [
  { key: "1", label: "Tổng quan", pathname: "/", icon: <HomeOutlined /> },
  { key: "2", label: "Doanh thu từ dịch vụ", pathname: "/statistics/services-income" },
  { key: "3", label: "Doanh thu từ linh kiện", pathname: "/statistics/products-income" },
  { key: "4", label: "Phiếu sửa chữa", pathname: "/orders", icon: <FileTextOutlined /> },
  { key: "5", label: "Hóa đơn", pathname: "/invoices", icon: <FileDoneOutlined /> },
  { key: "6", label: "Dịch vụ sửa chữa", pathname: "/services", icon: <ToolOutlined /> },
  { key: "7", label: "Nhân viên", pathname: "/employees", icon: <UserOutlined /> },
  { key: "8", label: "Khách hàng", pathname: "/customers", icon: <TeamOutlined /> },
  { key: "9", label: "Tài khoản", pathname: "/accounts", icon: <UserAddOutlined /> },
  { key: "10", label: "Danh sách linh kiện", pathname: "/products" },
  { key: "11", label: "Nhập kho", pathname: "/stock-in" },
  { key: "12", label: "Xuất kho", pathname: "/stock-out" },
  { key: "13", label: "Lịch sử kho", pathname: "/stock-history" },
  { key: "14", label: "Cài đặt", pathname: "/settings", icon: <SettingOutlined /> },
];

const itemsManager = [
  keyToItem("1", routesManager),
  {
    key: "sub1",
    label: "Thống kê",
    icon: <LineChartOutlined />,
    children: [keyToItem("2", routesManager), keyToItem("3", routesManager)],
  },
  keyToItem("4", routesManager),
  keyToItem("5", routesManager),
  keyToItem("6", routesManager),
  keyToItem("7", routesManager),
  keyToItem("8", routesManager),
  keyToItem("9", routesManager),
  {
    key: "sub2",
    label: "Kho linh kiện",
    icon: <InboxOutlined />,
    children: [
      keyToItem("10", routesManager),
      keyToItem("11", routesManager),
      keyToItem("12", routesManager),
      keyToItem("13", routesManager),
    ],
  },
  keyToItem("14", routesManager),
];

const routesDispatcher = [
  { key: "1", label: "Tổng quan", pathname: "/", icon: <HomeOutlined /> },
  { key: "2", label: "Phiếu sửa chữa", pathname: "/orders", icon: <FileTextOutlined /> },
  { key: "3", label: "Hóa đơn", pathname: "/invoices", icon: <FileDoneOutlined /> },
  { key: "4", label: "Dịch vụ sửa chữa", pathname: "/services", icon: <ToolOutlined /> },
  { key: "5", label: "Nhân viên", pathname: "/employees", icon: <UserOutlined /> },
  { key: "6", label: "Khách hàng", pathname: "/customers", icon: <TeamOutlined /> },
  { key: "7", label: "Danh sách linh kiện", pathname: "/products" },
  { key: "8", label: "Lịch sử kho", pathname: "/stock-history" },
];

const itemsDispatcher = [
  keyToItem("1", routesDispatcher),
  keyToItem("2", routesDispatcher),
  keyToItem("3", routesDispatcher),
  keyToItem("4", routesDispatcher),
  keyToItem("5", routesDispatcher),
  keyToItem("6", routesDispatcher),
  {
    key: "sub2",
    label: "Kho linh kiện",
    icon: <InboxOutlined />,
    children: [keyToItem("7", routesDispatcher), keyToItem("8", routesDispatcher)],
  },
];

const LogoWrapper = styled(Link)`
  display: block;
  padding-left: ${({ collapsed }) => (collapsed ? "25px" : "70px")};
  padding-top: 15px;
  padding-bottom: 5px;
  transition: padding-left 300ms;
  top: 0;
  z-index: 10;
  height: 60px;
  position: sticky;
  background-color: #001529;
`;

const NavSider = styled(Sider)`
  &&& {
    top: 0;
    z-index: 15;
    position: sticky;
    max-height: 100vh;
    overflow-y: auto;
  }
`;

const NavDrawer = () => {
  const { user } = useContext(AuthContext);
  const { pathname } = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const role = user?.role;

    if (!role) return;
    if (role === "MANAGER") {
      setRoutes(routesManager);
      setItems(itemsManager);
    }
    if (role === "DISPATCHER") {
      setRoutes(routesDispatcher);
      setItems(itemsDispatcher);
    }
  }, [user]);

  let activeKey = "1";
  if (pathname !== "/") {
    const existedRoute = routes.find((r) => r.pathname !== "/" && pathname.includes(r.pathname));
    activeKey = existedRoute?.key;
  }

  return (
    <NavSider
      collapsible
      collapsed={collapsed}
      width="240px"
      onCollapse={(value) => setCollapsed(value)}
      breakpoint="xl"
    >
      <LogoWrapper collapsed={collapsed} to="/">
        {collapsed && <IcLogoSm />}
        {!collapsed && <IcLogo />}
      </LogoWrapper>
      <Menu theme="dark" selectedKeys={[activeKey]} mode="inline" items={items} />;
    </NavSider>
  );
};

export default NavDrawer;
