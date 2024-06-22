import React from "react";
import { Typography, Form, Input, Button } from "antd";
import HeaderComp from "../components/HeaderComp";
import Footer from "../components/Footer";

const { Title } = Typography;

const Contact = () => {
  const isLogged = window.localStorage.getItem("LoggedIn");

  const onFinish = (values) => {
    console.log("Received values:", values);
  };

  if (!isLogged) {
    // Redirect to login page if not logged in
    window.location.href = "/login";
  }

  return (
    <div>
      <HeaderComp />
      <div
        style={{
          padding: "0 50px",
          marginTop: 64,
          minHeight: "calc(100vh - 185px)",
        }}
      >
        <div style={{ background: "#fff", padding: 24, minHeight: 380 }}>
          <Title level={2}>Contact Us</Title>
          <Form name="contact-form" onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter your name!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please enter your email!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Message"
              name="message"
              rules={[
                { required: true, message: "Please enter your message!" },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
