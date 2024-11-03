import React, { useEffect, useState } from "react";
import { Layout, Card, Typography, Button, Tag } from "antd";
import HeaderComp from "../components/HeaderComp";
import Footer from "../components/Footer";

const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const ContactUs = () => {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 445);

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
            width: isMobileView ? "100%" : "600px",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            padding: "40px",
            borderRadius: "10px",
          }}
        >
          <Title level={2}>Get In Touch</Title>
          <Paragraph>
            We’d love to hear from you! Whether you have a question, a
            suggestion, or just want to say hello, feel free to reach out. You
            can always contact us via email, and we’ll get back to you as soon
            as possible.
          </Paragraph>

          <div style={{ margin: "20px 0" }}>
            <Text strong>Email us at: &nbsp;</Text>
            <Tag color="blue" style={{ padding: "5px 15px 0px 15px" }}>
              <Paragraph
                style={{
                  fontSize: "16px",
                  marginTop: "8px",
                  display: "inline-block",
                }}
                copyable={{ text: "test@test.com" }} // Only the plain email is copyable
              >
                <a href="mailto:test@test.com">test@test.com</a>{" "}
                {/* Clickable email */}
              </Paragraph>
            </Tag>
          </div>

          <Paragraph>
            We are always happy to assist you in any way we can. Don't hesitate
            to get in touch with us. Whether you’re seeking support or just want
            to know more about our services, we’re here to help!
          </Paragraph>

          <Button type="primary" size="large" href="mailto:test@test.com">
            Contact Us
          </Button>
        </Card>
      </Content>
      <Footer />
    </Layout>
  );
};

export default ContactUs;
