import React, { useState } from "react";
import { Upload, Button, message, Form, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { IP } from "../utils/Constent";

const ImageUploader = () => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [tags, setTags] = useState("");

  const handleUpload = async () => {
    if (!fileList.length) {
      return message.error("Please select a file");
    }

    const userId = localStorage.getItem("userID");
    if (!userId) {
      return message.error("User not found in localStorage");
    }

    const formData = new FormData();
    formData.append("image", fileList[0]);
    formData.append("userId", userId);
    formData.append("category", category);
    formData.append("name", name);
    formData.append("tags", tags); // comma-separated

    setUploading(true);

    try {
      await axios.post(`${IP}/api/v1/images/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Image uploaded successfully");
      setFileList([]);
      setCategory("");
      setName("");
      setTags("");
    } catch (err) {
      console.error(err);
      message.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const beforeUpload = (file) => {
    setFileList([file]);
    return false;
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl space-y-6">
      <h2 className="text-2xl font-semibold text-center">Upload an Image</h2>

      <Form layout="vertical">
        <Form.Item label="Name (optional)">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter image name"
          />
        </Form.Item>

        <Form.Item label="Category (optional)">
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., stock, personal"
          />
        </Form.Item>

        <Form.Item label="Tags (comma-separated)">
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., nature, flowers"
          />
        </Form.Item>

        <Form.Item label="Select Image">
          <Upload
            beforeUpload={beforeUpload}
            fileList={fileList}
            onRemove={() => setFileList([])}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Choose File</Button>
          </Upload>
        </Form.Item>

        <Button
          type="primary"
          onClick={handleUpload}
          loading={uploading}
          disabled={!fileList.length}
          block
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </Form>
    </div>
  );
};

export default ImageUploader;
