import React, { useState } from "react";
import { Upload, Button, message, Form, Select, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { IP } from "../utils/Constent";

const { Option } = Select;

const BackgroundUploader = () => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [type, setType] = useState("photo");
  const [name, setName] = useState("");
  const [tags, setTags] = useState(""); // ✅ New state

  const handleUpload = async () => {
    if (!fileList.length) return message.error("Please select a file");

    const userId = localStorage.getItem("userID");

    if (!userId) {
      return message.error("User not found in localStorage");
    }

    const formData = new FormData();
    formData.append("background", fileList[0]);
    formData.append("type", type);
    formData.append("userId", userId);
    if (name.trim()) {
      formData.append("name", name.trim());
    }
    if (tags.trim()) {
      formData.append("tags", tags.trim()); // ✅ Include tags
    }

    setUploading(true);

    try {
      const res = await axios.post(`${IP}/api/v1/upload-background`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Background uploaded successfully");
      setFileList([]);
      setType("photo");
      setName("");
      setTags(""); // ✅ Reset tags
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
    <div className="max-w-xl mx-auto p-6 bg-white shadow-xl rounded-xl space-y-6">
      <h2 className="text-2xl font-semibold text-center">
        Upload Background Image
      </h2>

      <Form layout="vertical">
        <Form.Item label="Type">
          <Select value={type} onChange={setType}>
            <Option value="photo">Photo</Option>
            <Option value="pattern">Pattern</Option>
            <Option value="gradient">Gradient</Option>
          </Select>
        </Form.Item>

        <Form.Item name="name" label="Background Name">
          <Input
            placeholder="Enter name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>

        {/* ✅ New Tags Field */}
        <Form.Item name="tags" label="Tags (comma-separated)">
          <Input
            placeholder="e.g. nature, dark, abstract"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Select Background Image">
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
          block
          onClick={handleUpload}
          loading={uploading}
          disabled={!fileList.length}
        >
          {uploading ? "Uploading..." : "Upload Background"}
        </Button>
      </Form>
    </div>
  );
};

export default BackgroundUploader;
