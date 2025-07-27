/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import {
  FundOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  StockOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { clearToken } from "../services/authService";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { type RootState } from "../store";

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  console.log("User Role:", userRole);

  const location = useLocation();

  const normalizePath = (() => {
    //console.log(location.pathname);
    if (location.pathname.startsWith("/user/userdetail"))
      return "/user/userdetail";
    if (location.pathname.startsWith("/user/userslist"))
      return "/user/userslist";
    if (location.pathname.startsWith("/users/edit")) return "/user/userdetail";
    if (location.pathname.startsWith("/user/create")) return "/user/userdetail";
    return location.pathname;
  })();

  const pathToKey: Record<string, string> = {
    "/home": "1",
    "/user/userdetail": "2",
    "/user/userslist": "3",
    "/trip": "4",
    "/triphistory": "5",
    "/users/edit": "6",
    "/user/create": "7",
  };

  const selectedKey = pathToKey[normalizePath] || "";
  //console.log("selectedKey:", selectedKey);

  const handleLogout = () => {
    clearToken();
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          style={{
            height: 53,
            margin: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Trip Tracker
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => {
            if (key === "1") navigate("/home");
            if (key === "2") navigate("/user/userdetail");
            if (key === "3") navigate("/user/userslist");
            if (key === "4") navigate("/trip");
            if (key === "5") navigate("/triphistory");
            if (key === "6") handleLogout();
          }}
          items={[
            {
              key: "1",
              icon: <HomeOutlined />,
              label: "Home",
            },
            {
              key: "2",
              icon: <UserOutlined />,
              label: "Profile",
            },
            ...(userRole?.trim().toLowerCase() === "admin"
              ? [
                  {
                    key: "3",
                    icon: <UsergroupAddOutlined />,
                    label: "Profiles List",
                  },
                ]
              : []),
            {
              key: "4",
              icon: <StockOutlined />,
              label: "Trip",
            },
            {
              key: "5",
              icon: <FundOutlined />,
              label: "Trip History",
            },
            {
              key: "6",
              icon: <LogoutOutlined />,
              label: "Logout",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />

          {location.pathname === "/user/userslist" && (
            <Button
              type="primary"
              onClick={() => navigate("/user/create")}
              style={{ marginRight: 16 }}
            >
              Create New User
            </Button>
          )}
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
