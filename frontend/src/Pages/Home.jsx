import React, { useState } from "react";
import { Upload, message, Card, Row, Col, Button, Skeleton, Typography, Image } from "antd";
import {
  UploadOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import HeaderComp from "../components/HeaderComp";
import Footer from "../components/Footer";

const { Dragger } = Upload;
const { Title } = Typography;

const Home = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);
  const [processingStatus, setProcessingStatus] = useState([]);

  const handleAdd = ({ fileList }) => {
    const newFiles = [...fileList];
    setFiles(newFiles);
  };

  const handleRemove = (file) => {
    const newFiles = files.filter((f) => f.uid !== file.uid);
    setFiles(newFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      message.error("Please select files to upload.");
      return;
    }

    setLoading(true);
    setProcessingStatus([...files.map(() => "Processing...")]); // Display skeleton cards

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file.originFileObj);
      });

      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("Upload success:", data);

      // Prepend base URL to processed image URLs
      const baseImageUrl = "http://localhost:5000";
      const processedImagesWithUrl = data.processed_file_urls.map((url) => ({
        name: `Processed Image`,
        url: `${baseImageUrl}${url}`,
      }));

      // Update processed images state
      setProcessedImages(processedImagesWithUrl);

      message.success("Upload and processing successfully.");

    } catch (error) {
      console.error("Error uploading:", error);
      message.error("Error uploading.");
    } finally {
      setLoading(false);
      setProcessingStatus([]); // Clear skeleton cards
      setFiles([]); // Clear input files after successful upload
    }
  };

  const handleDownload = (url) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "processed_image.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(downloadLink);
      })
      .catch((error) => console.error("Error downloading image:", error));
  };

  return (
    <>
      <HeaderComp />
      <div style={{ minHeight: "calc(100vh - 125px)" }}>
        <Row gutter={16} justify="center">
          <Col
            span={24}
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "50px",
            }}
          >
            <Card
              title="Upload Images"
              style={{
                textAlign: "center",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                minHeight: "150px",
                width: "900px",
              }}
              bodyStyle={{ padding: "20px" }}
            >
              <Dragger
                multiple
                fileList={files}
                onChange={handleAdd}
                onRemove={handleRemove}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag images to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload.
                </p>
              </Dragger>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <Button
                  type="primary"
                  icon={<CloudUploadOutlined />}
                  onClick={handleUpload}
                  style={{ width: "300px", marginTop: 20 }}
                  disabled={files.length === 0 || loading}
                >
                  Upload and Process Images
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
        {loading ? (
          <>
            <Title level={3} style={{ textAlign: "center", marginTop: 40 }}>
              Processing Images...
            </Title>
            <Row gutter={[16, 16]} justify="center">
              {processingStatus.map((status, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  <Card
                    style={{
                      textAlign: "center",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      minHeight: "150px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    bodyStyle={{ padding: "20px" }}
                  >
                    <Skeleton avatar active />
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <Row gutter={[16, 16]} justify="center" style={{ marginTop: 20 }}>
            {processedImages.map((image, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card
                  cover={<Image src={image.url} alt={image.name} />}
                  actions={[
                    <Button
                      type="link"
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownload(image.url)}
                    >
                      Download
                    </Button>,
                  ]}
                >
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
      <Footer style={{ position: "fixed", bottom: 0, width: "100%" }} />
    </>
  );
};

export default Home;
