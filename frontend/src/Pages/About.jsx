import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import HeaderComp from "../components/HeaderComp";
import Footer from "../components/Footer";

const { Header, Content } = Layout;

const About = () => {
  const isLogged = window.localStorage.getItem("LoggedIn");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 445);

  //Function to handle window resize
  const handleResize = () => {
    setIsMobileView(window.innerWidth < 445);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isLogged) {
    // Redirect to login page if not logged in
    window.location.href = "/login";
  }

  return (
    <Layout>
      <Header style={{ background: "transparent", padding: "0", zIndex: 999 }}>
        <HeaderComp /> <br />
      </Header>
      <Content
        style={{
          padding: isMobileView ? "50px 10px" : "50px 50px",
          minHeight: "calc(100vh - 120px)",
        }}
      >
        {/* Add content */}
        <p>About Us</p>
      </Content>
      <Footer />
    </Layout>
  );
};

export default About;
