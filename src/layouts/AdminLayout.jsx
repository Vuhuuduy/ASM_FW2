import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate(); // Dùng để điều hướng
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const items = [
    { key: "dashboard", icon: <PieChartOutlined />, label: "Dashboard" },
    { key: "products", icon: <DesktopOutlined />, label: "Product Management" },
    { key: "add-product", icon: <DesktopOutlined />, label: "Add Product" },
    {
      key: "user",
      icon: <UserOutlined />,
      label: "User",
      children: [
        { key: "tom", label: "Tom" },
        { key: "bill", label: "Bill" },
        { key: "alex", label: "Alex" },
      ],
    },
    {
      key: "team",
      icon: <TeamOutlined />,
      label: "Team",
      children: [
        { key: "team-1", label: "Team 1" },
        { key: "team-2", label: "Team 2" },
      ],
    },
    { key: "files", icon: <FileOutlined />, label: "Files" },
  ];

  // Xử lý sự kiện click menu
  const handleMenuClick = ({ key }) => {
    if (key === "dashboard") {
      navigate("/admin");
    } else if (key === "products") {
      navigate("/admin/products");
    } else if (key === "add-product") {
      navigate("/admin/products/add");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["dashboard"]}
          mode="inline"
          items={items}
          onClick={handleMenuClick} // Thêm sự kiện click
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>DUYLONGSHOP</Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
