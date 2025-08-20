import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Upload, message, Card, Spin } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import axios from "axios";
import { IP } from "../../../utils/Constent";
import { useCategoryContext } from "../Category/useCategory";

const { TextArea } = Input;
const { Dragger } = Upload;

const AddTemplate = () => {
  const [form] = Form.useForm();
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false); // Added subcategory loading state
  const {
    categories,
    loading: categoriesLoading,
    fetchCategories,
  } = useCategoryContext();

  // Fetch subcategories only when category is selected
  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) return; // Do not fetch if categoryId is not provided
    setSubCategoriesLoading(true);
    try {
      setSubCategories([]);
      const response = await axios.get(
        `${IP}/api/v1/subcategory/by-category/${categoryId}`
      );
      console.log(response);
      setSubCategories(response.data || []);
    } catch (error) {
      message.error("Failed to fetch subcategories");
    } finally {
      setSubCategoriesLoading(false);
    }
  };

  const onFinish = async (values) => {
    const {
      name,
      categoryId,
      subCategoryId,
      tags,
      templateFile,
      previewImages,
    } = values;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("categoryId", categoryId);
    formData.append("subCategoryId", subCategoryId);
    formData.append("tags", tags);

    // Add file uploads to FormData
    formData.append("templateFile", templateFile[0].originFileObj);
    previewImages.forEach((file) => {
      formData.append("previewImages", file.originFileObj);
    });

    setLoading(true);
    try {
      const response = await axios.post(
        `${IP}/api/v1/create/template`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success("Template created successfully!");
      form.resetFields();
    } catch (error) {
      message.error("Failed to create template.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (categoriesLoading || !categories.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card title="Add New Template" className="max-w-3xl mx-auto shadow-lg">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            categoryId: categories[0]?._id, // Set default value if available
          }}
        >
          <Form.Item
            label="Template Name"
            name="name"
            rules={[
              { required: true, message: "Please input the template name!" },
            ]}
          >
            <Input placeholder="Enter template name" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="categoryId"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select
              placeholder="Select a category"
              onChange={(value) => {
                form.setFieldsValue({ subCategoryId: undefined }); // Clear subcategory
                fetchSubCategories(value); // Fetch subcategories for the selected category
              }}
            >
              {categories.map((category) => (
                <Select.Option key={category._id} value={category._id}>
                  {category.categoryName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Subcategory"
            name="subCategoryId"
            rules={[
              { required: true, message: "Please select a subcategory!" },
            ]}
          >
            {subCategoriesLoading ? (
              <Spin size="small" />
            ) : (
              <Select placeholder="Select a subcategory">
                {subCategories.map((subCategory) => (
                  <Select.Option key={subCategory._id} value={subCategory._id}>
                    {subCategory.subCategoryName}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>

          <Form.Item
            label="Tags"
            name="tags"
            rules={[{ required: true, message: "Please input tags!" }]}
          >
            <Input placeholder="Enter comma separated tags" />
          </Form.Item>

          <Form.Item
            label="Template File"
            name="templateFile"
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
            rules={[
              { required: true, message: "Please upload the template file!" },
            ]}
          >
            <Dragger
              name="templateFile"
              accept=".psd" // Only allow .psd files
              beforeUpload={(file) => {
                // Check if the uploaded file is a PSD file
                const isPsd = file.type === "application/vnd.adobe.photoshop";
                if (!isPsd) {
                  message.error("You can only upload .psd files!");
                }
                return isPsd; // Allow file upload if it's a .psd, otherwise reject it
              }}
              multiple={false} // Allow only one file to be uploaded
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag a .psd file to this area to upload
              </p>
              <p className="ant-upload-hint">Only .psd files are allowed.</p>
            </Dragger>
          </Form.Item>

          <Form.Item
            label="Preview Images"
            name="previewImages"
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
            rules={[
              { required: true, message: "Please upload preview images!" },
            ]}
          >
            <Dragger
              name="previewImages"
              accept="image/*"
              beforeUpload={() => false}
              multiple
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag images to this area to upload
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="mt-4"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddTemplate;
