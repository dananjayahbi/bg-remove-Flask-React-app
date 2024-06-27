import React, { useState } from "react";
import { Form, Input, Button, Row, Col, message } from "antd";
import axios from "axios";

const Register = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/users",
        {
          email: values.email,
          password: values.password,
        }
      );
      //If response status is 200, registration is successful
      if (response.status === 201) {
        message.success("Registration successful!");
        window.location.href = "/login";
      }
    } catch (error) {
      message.error("Registration failed. Please try again.");
    }
    setLoading(false);
  };

  const validatePassword = (_, value) => {
    const passwordRegex = /^(?=.*[0-9])|(?=.*[!@#$%^&*])/;
    if (!value) {
      return Promise.reject(new Error("Please input your password!"));
    } else if (value.length < 8) {
      return Promise.reject(
        new Error("Password must be at least 8 characters long!")
      );
    } else if (!passwordRegex.test(value)) {
      return Promise.reject(
        new Error("Password must contain a number or special character!")
      );
    }
    return Promise.resolve();
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
            Register
          </h2>
          <Form
            name="register"
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
              rules={[{ validator: validatePassword }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Register
              </Button>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "5px",
                }}
              >
                <p>Already a member? &nbsp; </p>
                <a href="/login" style={{ textDecoration: "none" }}>
                  <p style={{ color: "#1677ff" }}>login</p>
                </a>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default Register;
