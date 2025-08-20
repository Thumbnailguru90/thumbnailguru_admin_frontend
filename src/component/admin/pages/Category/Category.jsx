import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import SubCategoryTree from "./SubCategoryTree";
import useSubCategory from "../subCategory/useSubCategory";
import { useCategoryContext } from "./useCategory";
const Category = () => {
  const {
    categories,
    loading,
    fetchCategories,
    addOrUpdateCategory,
    deleteCategory,
  } = useCategoryContext();
  const { addOrUpdateSubCategory } = useSubCategory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const openEditModal = (record) => {
    setEditingCategory(record);
    form.setFieldsValue({
      categoryName: record.categoryName,
      description: record.description,
    });
    if (record.categoryImg) {
      setFileList([
        {
          uid: "-1",
          name: "category-image",
          status: "done",
          url: record.categoryImg,
        },
      ]);
    }
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("categoryName", values.categoryName);
    formData.append("description", values.description || "");

    // Only append image if it's a new file
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("cateImg", fileList[0].originFileObj);
    }

    await addOrUpdateCategory(
      formData,
      editingCategory?._id,
      !!editingCategory
    );
    await fetchCategories();
    setIsModalVisible(false);
    setEditingCategory(null);
    setFileList([]);
    form.resetFields();
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    return isImage;
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Image",
      key: "image",
      render: (record) =>
        record.categoryImg ? (
          <img
            src={record.categoryImg}
            alt={record.categoryName}
            style={{ width: 50, height: 50, objectFit: "cover" }}
          />
        ) : null,
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <div className="flex gap-2">
          <Button type="primary" onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => deleteCategory(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-3xl mx-auto">
      <h2 className="text-center font-bold text-2xl mb-4">Manage Categories</h2>
      <Button
        type="primary"
        className="mb-4"
        onClick={() => {
          setIsModalVisible(true);
          setEditingCategory(null);
          form.resetFields();
          setFileList([]);
        }}
      >
        Add Category
      </Button>
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="_id"
        loading={loading}
        expandable={{
          expandedRowRender: (record) => (
            <div className="pl-4">
              <h4 className="font-semibold mb-2">Subcategories:</h4>
              <SubCategoryTree
                subCategories={record.subCategories}
                parentCategoryId={record._id}
                onAddSubCategory={(data) => addOrUpdateSubCategory(data, false)}
              />
            </div>
          ),
          expandIconColumnIndex: 0,
        }}
      />

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingCategory(null);
          form.resetFields();
          setFileList([]);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="categoryName"
            label="Name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Category Image">
            <Upload
              beforeUpload={beforeUpload}
              fileList={fileList}
              onChange={handleChange}
              listType="picture"
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingCategory ? "Update" : "Add"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Category;
