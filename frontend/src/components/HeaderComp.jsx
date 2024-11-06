import React from "react";
import { Menu, Avatar, Dropdown, ConfigProvider } from "antd";
import {
  GithubOutlined,
  QuestionCircleOutlined,
  HomeOutlined,
  UserOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom"; // Import useLocation

const HeaderComp = () => {
  const location = useLocation(); // Get current location
  const email = window.localStorage.getItem("email");

  // Get the first letter of the email for the avatar
  const avatarLetter = email?.charAt(0).toUpperCase();

  const items = [
    { key: "1", label: "Home", url: "/home", icon: <HomeOutlined /> },
    {
      key: "2",
      label: "About",
      url: "/about",
      icon: <QuestionCircleOutlined />,
    },
    { key: "3", label: "Contact", url: "/contact", icon: <PhoneOutlined /> },
    {
      key: "4",
      label: "GitHub",
      url: "https://github.com/dananjayahbi",
      external: true,
      icon: <GithubOutlined />,
    },
  ];

  const handleLogout = () => {
    // Clear local storage and redirect to login page
    window.localStorage.clear();
    window.location.href = "/login";
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const currentKey = items.find((item) => item.url === location.pathname)?.key; // Find key based on URL

  return (
    <header style={styles.header}>
      <ConfigProvider
        theme={{
          token: {
            // Seed Token
            colorPrimary: "#1677FF",
            borderRadius: 2,

            // Alias Token
            colorBgContainer: "transparent",
          },
        }}
      >
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={[currentKey]}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          {items.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              {item.external ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.label}
                </a>
              ) : (
                <Link to={item.url}>{item.label}</Link>
              )}
            </Menu.Item>
          ))}
        </Menu>
      </ConfigProvider>
      <Dropdown overlay={menu} trigger={["click"]}>
        <a
          className="ant-dropdown-link"
          onClick={(e) => e.preventDefault()}
          style={{ marginLeft: "auto" }}
        >
          <Avatar style={{ backgroundColor: "#007bff" }}>
            {" "}
            {avatarLetter}{" "}
          </Avatar>
        </a>
      </Dropdown>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 50px",
    backgroundColor: "#f8f9fa", // Light background
    borderBottom: "2px solid #e0e0e0",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    position: "fixed",
    top: 0,
    width: "100%",
    zIndex: 1000,
  },
  // Mobile responsiveness
  "@media (maxWidth: 768px)": {},
};

export default HeaderComp;
