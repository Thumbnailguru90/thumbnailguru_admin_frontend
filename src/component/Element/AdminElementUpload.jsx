import React, { useState, useEffect } from "react";
import {
  Modal,
  Upload,
  Button,
  Form,
  Input,
  Select,
  message,
  Table,
  Popconfirm,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { uploadShape, getShapes, deleteShape } from "./shapeApi";

const { Option } = Select;

const shapeCategories = [
  "Basic",
  "Arrows",
  "Symbols",
  "Decorations",
  "Flowchart",
  "Callouts",
];

const AdminShapeManager = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shapes, setShapes] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  const fetchShapes = async () => {
    try {
      setTableLoading(true);
      const { data } = await getShapes();
      console.log(data);
      setShapes(data || []);
    } catch (error) {
      message.error("Failed to fetch shapes");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchShapes();
  }, []);

  const showModal = () => setVisible(true);

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setVisible(false);
  };

  const beforeUpload = (file) => {
    const isSvg = file.type === "image/svg+xml";
    if (!isSvg) message.error("You can only upload SVG files!");
    return isSvg || Upload.LIST_IGNORE;
  };

  const handleUpload = async () => {
    try {
      const values = await form.validateFields();

      if (fileList.length === 0) {
        message.error("Please select an SVG file to upload");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append("tags", values.tags);
      formData.append("file", fileList[0].originFileObj);

      await uploadShape(formData);
      message.success("Shape uploaded successfully!");
      handleCancel();
      fetchShapes();
    } catch (error) {
      console.error("Upload error:", error);
      message.error(error.response?.data?.message || "Failed to upload shape");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteShape(id);
      message.success("Shape deleted");
      fetchShapes();
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Failed to delete shape");
    }
  };

  const columns = [
    {
      title: "Preview",
      dataIndex: "url",
      key: "url",
      render: (url) => <img src={url} alt="shape" style={{ height: 40 }} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => tags.join(", "),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this shape?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        style={{ marginBottom: 16, float: "right" }}
      >
        Upload Shape
      </Button>

      <Table
        dataSource={shapes}
        columns={columns}
        rowKey="_id"
        loading={tableLoading}
      />

      <Modal
        title="Upload New Shape"
        visible={visible}
        onOk={handleUpload}
        onCancel={handleCancel}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Shape Name"
            rules={[{ required: true, message: "Please enter shape name" }]}
          >
            <Input placeholder="e.g., Rounded Rectangle, Curved Arrow" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select category" }]}
          >
            <Select placeholder="Select category">
              {shapeCategories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="tags" label="Tags (comma separated)">
            <Input placeholder="e.g., arrow, pointer, direction" />
          </Form.Item>

          <Form.Item label="SVG File" required>
            <Upload
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={({ fileList }) => setFileList(fileList)}
              maxCount={1}
              accept=".svg"
            >
              <Button icon={<UploadOutlined />}>Select SVG File</Button>
            </Upload>
            <div style={{ marginTop: 8, fontSize: 12, color: "#999" }}>
              Only SVG files are accepted
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminShapeManager;
