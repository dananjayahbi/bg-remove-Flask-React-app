import React from "react";
import { Typography, Divider } from "antd";
import HeaderComp from "../components/HeaderComp";
import Footer from "../components/Footer";

const { Title, Paragraph } = Typography;

const About = () => {
  const isLogged = window.localStorage.getItem("LoggedIn");

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
          <Title level={2}>About Us</Title>
          <Divider />
          <Paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            ornare nisl sed turpis fermentum, non faucibus lacus condimentum.
            Suspendisse potenti. Vivamus varius ipsum at arcu congue eleifend.
            In in ante ut lorem molestie ullamcorper. Aenean varius, magna eu
            ultricies aliquam, libero sapien accumsan lorem, vel congue tortor
            nisi non dolor. Integer sit amet bibendum sapien.
          </Paragraph>
          <Paragraph>
            Curabitur vel feugiat odio. Suspendisse potenti. Integer nec magna
            in leo hendrerit rhoncus nec vitae odio. Vivamus eleifend, lectus
            vel dapibus semper, purus lacus pulvinar urna, ut consectetur sapien
            arcu ac mauris. Quisque vel arcu condimentum, maximus justo sit
            amet, fermentum ipsum. Donec eget ligula semper, lobortis urna et,
            tempus ipsum.
          </Paragraph>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
