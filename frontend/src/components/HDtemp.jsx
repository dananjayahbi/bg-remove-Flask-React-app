import React from "react";
import { Layout, Menu, Avatar, Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
const { Header } = Layout;
import logo from "../assets/logo.png";

const HeaderComp = () => {
  const location = useLocation(); // Get current location

  const items = [
    { key: "1", label: "Home", url: "/home" },
    { key: "2", label: "About Us", url: "/about" },
    { key: "3", label: "Contact Us", url: "/contact" },
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
      <Menu.Item key="gallery">
        <Link to="/gallery">Gallery</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const currentKey = items.find((item) => item.url === location.pathname)?.key; // Find key based on URL


  return (
    <div>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
      >
        <a href="/home">
          <div
            className="demo-logo"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={logo}
              alt="Company Logo"
              style={{ width: "80px", height: "auto", marginTop: "15px" }}
            />
          </div>
        </a>
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
            <Menu.Item key={item.key}>
              <Link to={item.url}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
        <Dropdown overlay={menu} trigger={["click"]}>
          <a
            className="ant-dropdown-link"
            onClick={(e) => e.preventDefault()}
            style={{ marginLeft: "auto" }}
          >
            <Avatar icon={<UserOutlined />} />
          </a>
        </Dropdown>
      </Header>
    </div>
  );
};

export default HeaderComp;
