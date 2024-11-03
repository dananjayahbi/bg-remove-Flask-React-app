import React, { useState } from "react";
import {
  Upload,
  message,
  Card,
  Row,
  Col,
  Layout,
  Button,
  Skeleton,
  Typography,
  Image,
  List,
  Avatar,
} from "antd";
import {
  UploadOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import HeaderComp from "../components/HeaderComp";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";

const { Header, Content } = Layout;
const { Dragger } = Upload;
const { Title } = Typography;

const Home = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);
  const [processingStatus, setProcessingStatus] = useState([]);

  // Function to generate previews using FileReader
  const generatePreview = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle file addition
  const handleAdd = async ({ fileList }) => {
    // Create previews for new files and update the file list
    const updatedFiles = await Promise.all(
      fileList.map(async (file) => {
        if (!file.preview) {
          file.preview = await generatePreview(file.originFileObj || file);
        }
        return file;
      })
    );
    setFiles(updatedFiles);
  };

  // Handle file removal
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

      const response = await axios.post(
        "http://localhost:5000/upload", // Ensure this URL is correct
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set correct content type
          },
        }
      );

      const data = response.data;

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

  // Restrict to image files
  const beforeUpload = (file) => {
    if (file.type.startsWith("image/")) {
      setFiles((prevFiles) => [...prevFiles, { ...file, originFileObj: file }]);
    } else {
      message.error("You can only upload image files!");
    }
    return false; // Prevent automatic upload
  };

  const handleDownload = (url) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = downloadUrl;
        downloadLink.download = "processed_image.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(downloadLink);
      })
      .catch((error) => console.error("Error downloading image:", error));
  };

  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Header style={{ background: "transparent", padding: "0", zIndex: 999 }}>
        <HeaderComp /> <br />
      </Header>
      <Content style={{ minHeight: "calc(100vh - 125px)" }}>
        <Row gutter={16} justify="center" style={{ marginBottom: "80px" }}>
          <HeroSection />
        </Row>
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
                beforeUpload={beforeUpload}
                showUploadList={false}
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

              {/* Display thumbnails of added files */}
              {files.length > 0 && (
                <List
                  itemLayout="horizontal"
                  dataSource={files}
                  renderItem={(file) => (
                    <List.Item
                      actions={[
                        <Button
                          type="link"
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemove(file)}
                        />,
                      ]}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {/* Thumbnail */}
                        {file.preview && (
                          <Avatar
                            src={file.preview} // Render file preview
                            shape="square"
                            size={64}
                          />
                        )}
                        {/* File name */}
                        <span style={{ marginLeft: 10, fontWeight: 500 }}>
                          {file.name}
                        </span>
                      </div>
                    </List.Item>
                  )}
                />
              )}

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
                ></Card>
              </Col>
            ))}
          </Row>
        )}
      </Content>
      <Footer style={{ position: "fixed", bottom: 0, width: "100%" }} />
    </Layout>
  );
};

export default Home;
