import React, { useEffect, useState } from "react";
import {
  Layout,
  Card,
  Avatar,
  Typography,
  Input,
  Button,
  message,
  Tag,
} from "antd";
import { EditOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import HeaderComp from "../components/HeaderComp";
import Footer from "../components/Footer";
import axios from "axios";

const { Header, Content } = Layout;
const { Text } = Typography;

const Profile = () => {
  const isLogged = window.localStorage.getItem("LoggedIn");
  const userId = window.localStorage.getItem("userId");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 445);
  const [email, setEmail] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  // Password change states
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Handle window resize
  const handleResize = () => {
    setIsMobileView(window.innerWidth < 445);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Fetch user data by userId
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/users/${userId}`
        );
        setEmail(response.data.email);
        setEmailInput(response.data.email);
      } catch (error) {
        message.error("Failed to fetch user data");
      }
    };
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (!isLogged) {
    // Redirect to login page if not logged in
    window.location.href = "/login";
    return null;
  }

  const handleSaveEmail = async () => {
    try {
      await axios.put(`http://localhost:5000/users/${userId}`, {
        email: emailInput,
      });
      setEmail(emailInput);
      setIsEditingEmail(false);
      message.success("Profile updated successfully");
    } catch (error) {
      message.error("Failed to update profile");
    }
  };

  const handleCancelEmail = () => {
    setEmailInput(email);
    setIsEditingEmail(false);
  };

  const handleChangePassword = async () => {
    try {
      await axios.post(
        `http://localhost:5000/users/${userId}/change-password`,
        {
          old_password: currentPassword,
          new_password: newPassword,
        }
      );
      message.success("Password changed successfully");
      // Clear password fields after success
      setCurrentPassword("");
      setNewPassword("");
      setShowPasswordFields(false);
    } catch (error) {
      message.error("Failed to change password");
    }
  };

  // Get the first letter of the email for the avatar
  const avatarLetter = email.charAt(0).toUpperCase();

  return (
    <Layout>
      <Header style={{ background: "transparent", padding: "0", zIndex: 999 }}>
        <HeaderComp />
        <br />
      </Header>
      <Content
        style={{
          padding: isMobileView ? "50px 10px" : "50px 50px",
          minHeight: "calc(100vh - 120px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          style={{
            width: isMobileView ? "100%" : "400px",
            position: "relative",
            textAlign: "center",
            overflow: "hidden",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            paddingBottom: "50px",
          }}
          cover={
            <div
              style={{
                height: "150px",
                backgroundImage:
                  "url('https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?auto=compress&cs=tinysrgb&w=600')",
                backgroundSize: "cover",
                position: "relative",
                borderBottomLeftRadius: "50%",
                borderBottomRightRadius: "50%",
              }}
            />
          }
        >
          <Avatar
            size={100}
            style={{
              backgroundColor: "#87d068",
              fontSize: "40px",
              position: "absolute",
              top: "100px",
              left: "50%",
              transform: "translateX(-50%)",
              border: "4px solid white",
            }}
          >
            {avatarLetter}
          </Avatar>
          <div
            style={{
              marginTop: "60px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {isEditingEmail ? (
              <div>
                <Text strong>Update email</Text>
                <Input
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  style={{ marginTop: "8px" }}
                  addonAfter={
                    <span>
                      <CheckOutlined
                        style={{
                          color: "green",
                          marginRight: 8,
                          cursor: "pointer",
                        }}
                        onClick={handleSaveEmail}
                      />
                      <CloseOutlined
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={handleCancelEmail}
                      />
                    </span>
                  }
                />
              </div>
            ) : (
              <div>
                <Text strong>Email: &nbsp;</Text>
                <Tag color="magenta">{email}</Tag>
                <EditOutlined
                  style={{ fontSize: "14px", cursor: "pointer" }}
                  onClick={() => setIsEditingEmail(true)}
                />
              </div>
            )}
          </div>

          <div style={{ marginTop: "20px" }}>
            <Button
              type="primary"
              onClick={() => setShowPasswordFields(!showPasswordFields)}
            >
              {showPasswordFields ? "Cancel" : "Change Password"}
            </Button>
          </div>

          {showPasswordFields && (
            <div style={{ marginTop: "20px" }}>
              <Input.Password
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{ marginBottom: "10px" }}
              />
              <Input.Password
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div style={{ marginTop: "10px" }}>
                <Button type="primary" onClick={handleChangePassword}>
                  Save
                </Button>
              </div>
            </div>
          )}
        </Card>
      </Content>
      <Footer />
    </Layout>
  );
};

export default Profile;
