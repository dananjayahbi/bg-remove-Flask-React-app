import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spin, Empty, Image, Button, Modal } from "antd";
import axios from "axios";
import HeaderComp from "../components/HeaderComp";
import Footer from "../components/Footer";
import {
  DownloadOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { v4 as uuid } from "uuid";

const Gallery = () => {
  const isLogged = window.localStorage.getItem("LoggedIn");
  if (!isLogged) {
    window.location.href = "/login";
  }

  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/getUserById/${userId}`
        );
        console.log(response.data);
        setGalleryItems(response.data.gallery);
        // console.log(response.data.gallery);
      } catch (error) {
        console.error("Failed to fetch gallery items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const handleDownload = (url) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        const uniqueId = uuid(); // Add this line to generate a unique ID
        downloadLink.href = url;
        downloadLink.download = `${uniqueId}.png`; // Modify the download filename
        document.body.appendChild(downloadLink);
        downloadLink.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(downloadLink);
      })
      .catch((error) => console.error("Error downloading image:", error));
  };

  const handleDelete = (imageId) => {
    axios
      .put(
        `http://localhost:5000/api/users/deleteGalleryItem/${userId}/${imageId}`
      )
      .then((response) => {
        console.log(response.data);
        setGalleryItems(galleryItems.filter((item) => item._id !== imageId));
      })
      .catch((error) => console.error("Error deleting image:", error));
  };

  const showDeleteModal = (imageId) => {
    setSelectedImageId(imageId);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    handleDelete(selectedImageId);
    setDeleteModalVisible(false);
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
  };

  if (loading) {
    return (
      <Spin
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        indicator={
          <LoadingOutlined
            style={{
              fontSize: 24,
            }}
            spin
          />
        }
      />
    );
  }

  return (
    <div>
      <HeaderComp />
      <div
        style={{
          minHeight: "calc(100vh - 120px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ marginBottom: "50px", marginTop: "50px" }}>
          <h1 style={{ fontFamily: "sans-serif" }}>Your Gallery</h1>
        </div>
        {galleryItems.length === 0 && <Empty />}
        <div style={{ width: "70%" }}>
          <Row gutter={[16, 16]}>
            {galleryItems.map((item, index) => (
              <Col key={index} xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  cover={<Image alt={`Gallery item ${index}`} src={item.url} />}
                  actions={[
                    <Button
                      type="link"
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownload(item.url)}
                    >
                      Download
                    </Button>,
                    <Button
                      danger
                      type="link"
                      icon={<DeleteOutlined />}
                      onClick={() => showDeleteModal(item._id)}
                    >
                      Delete
                    </Button>,
                  ]}
                />
              </Col>
            ))}
          </Row>
        </div>
      </div>
      <Footer />

      <Modal
        title="Confirm Delete"
        visible={deleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
      >
        <p>Are you sure you want to delete this image?</p>
      </Modal>
    </div>
  );
};

export default Gallery;
