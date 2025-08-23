import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Form, Input, Upload, message, Tag, Space, Card } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { IP } from "../utils/Constent";

export default function CustomFontManager() {
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);

  // ✅ Fetch fonts
  const fetchFonts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${IP}/api/v1/customfont`);
      
      setFonts(res.data);
    } catch (err) {
      message.error("Failed to fetch fonts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFonts();
  }, []);

  // ✅ Upload font
  const handleUpload = async (values) => {
    if (!file) {
      return message.warning("Please select a font file");
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", values.name);
    formData.append("tags", values.tags);

    try {
      await axios.post( `${IP}/api/v1/customfont/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
     
      message.success("Font uploaded successfully");
      setFile(null);
      form.resetFields();
      fetchFonts();
    } catch (err) {
      message.error("Upload failed");
    }
  };

  // ✅ Delete font
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${IP}/api/v1/customfont/${id}`);
      message.success("Font deleted");
      fetchFonts();
    } catch (err) {
      message.error("Delete failed");
    }
  };

  // ✅ Table columns
  const columns = [
    {
      title: "Font Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) =>
        tags?.map((tag, idx) => (
          <Tag color="blue" key={idx}>
            {tag}
          </Tag>
        )),
    },
    {
      title: "Preview",
      dataIndex: "fontUrl",
      key: "fontUrl",
      render: (url) => (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
          View
        </a>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🎨 Custom Font Manager</h1>

      {/* Upload Form */}
      <Card className="shadow-lg rounded-2xl">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpload}
          className="space-y-4"
        >
          <Form.Item
            name="name"
            label="Font Name"
            rules={[{ required: true, message: "Please enter font name" }]}
          >
            <Input placeholder="Enter font name" />
          </Form.Item>

          <Form.Item name="tags" label="Tags">
            <Input placeholder="Comma separated tags (e.g. bold, serif)" />
          </Form.Item>

          <Form.Item label="Font File">
            <Upload
              beforeUpload={(file) => {
                setFile(file);
                return false; // Prevent auto upload
              }}
              fileList={file ? [file] : []}
              onRemove={() => setFile(null)}
            >
              <Button icon={<UploadOutlined />}>Select Font File</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Upload Font
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Fonts List */}
      <Card className="shadow-lg rounded-2xl">
        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={fonts}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
}
