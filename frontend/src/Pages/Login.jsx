import React, { useState } from "react";
import { Form, Input, Button, Row, Col, message } from "antd";
import axios from "axios";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/users/login",
        {
          email: values.email,
          password: values.password,
        }
      );
      //If response status is 200, login is successful
      if (response.status === 200) {
        // window.localStorage.setItem("token", response.data.token);
        window.localStorage.setItem("LoggedIn", true);
        window.localStorage.setItem("userId", response.data.user_id);
        window.localStorage.setItem("email", response.data.email);
        message.success("Login successful!");
        window.location.href = "/home";
      }
    } catch (error) {
      message.error("Login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Row style={{ minHeight: "100vh" }}>
      {window.innerWidth >= 1000 && (
        <Col
          span={14}
          style={{
            backgroundImage:
              "url(https://images.pexels.com/photos/25626587/pexels-photo-25626587/free-photo-of-protein-folding.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)",
            backgroundSize: "cover",
          }}
        />
      )}
      <Col
        span={window.innerWidth >= 1000 ? 10 : 24}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          backgroundColor: "#ffffff",
          backgroundImage:
            window.innerWidth < 1000
              ? "url(https://images.pexels.com/photos/25626587/pexels-photo-25626587/free-photo-of-protein-folding.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)"
              : "none",
          backgroundSize: window.innerWidth < 1000 ? "cover" : "initial",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
            Login
          </h2>
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Login
              </Button>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "5px",
                }}
              >
                <p>Not a member? &nbsp; </p>
                <a href="/register" style={{ textDecoration: "none" }}>
                  <p style={{ color: "#1677ff" }}>Register</p>
                </a>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default Login;
