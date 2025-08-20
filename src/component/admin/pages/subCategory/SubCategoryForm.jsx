// import React from "react";
// import {
//   Form,
//   Input,
//   Select,
//   Collapse,
//   Alert,
//   Divider,
//   Space,
//   Button,
//   Tag,
// } from "antd";
// import {
//   EditOutlined,
//   PlusOutlined,
//   ArrowDownOutlined,
//   FolderOpenOutlined,
// } from "@ant-design/icons";

// const { Panel } = Collapse;

// const SubCategoryForm = ({
//   form,
//   handleSubmit,
//   editingSubCategory,
//   categories,
//   selectedCategory,
//   handleCategoryChange,
//   subCategories,
//   getParentOptions,
//   setIsModalVisible,
// }) => {
//   return (
//     <>
//       <Divider />
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleSubmit}
//         initialValues={{ parentSubCategoryId: null }}
//       >
//         <Collapse bordered={false} defaultActiveKey={["1"]}>
//           <Panel header="Basic Information" key="1">
//             <Form.Item
//               name="subCategoryName"
//               label="SubCategory Name"
//               rules={[
//                 { required: true, message: "Please enter subcategory name" },
//                 { max: 50, message: "Maximum 50 characters allowed" },
//               ]}
//             >
//               <Input placeholder="e.g. Electronics, Clothing, etc." />
//             </Form.Item>

//             <Form.Item
//               name="description"
//               label="Description"
//               rules={[{ max: 200, message: "Maximum 200 characters allowed" }]}
//             >
//               <Input.TextArea
//                 rows={3}
//                 placeholder="Short description of this subcategory"
//                 showCount
//                 maxLength={200}
//               />
//             </Form.Item>
//           </Panel>

//           <Panel header="Hierarchy Settings" key="2">
//             <Alert
//               message="Hierarchy Information"
//               description="Select the parent category and optionally a parent subcategory to create a hierarchy."
//               type="info"
//               showIcon
//               className="mb-4"
//             />

//             <Form.Item
//               name="categoryId"
//               label="Parent Category"
//               rules={[{ required: true, message: "Please select a category" }]}
//             >
//               <Select
//                 placeholder="Select parent category"
//                 showSearch
//                 optionFilterProp="children"
//                 filterOption={(input, option) =>
//                   option.children.toLowerCase().includes(input.toLowerCase())
//                 }
//                 onChange={handleCategoryChange}
//                 disabled={!!editingSubCategory}
//               >
//                 {categories.map((cat) => (
//                   <Select.Option key={cat._id} value={cat._id}>
//                     {cat.categoryName}
//                   </Select.Option>
//                 ))}
//               </Select>
//             </Form.Item>

//             <Form.Item
//               name="parentSubCategoryId"
//               label="Parent SubCategory (Optional)"
//               tooltip="Leave empty to create a top-level subcategory"
//             >
//               <Select
//                 allowClear
//                 placeholder="Select parent subcategory"
//                 showSearch
//                 optionFilterProp="children"
//                 filterOption={(input, option) =>
//                   option.children.toLowerCase().includes(input.toLowerCase())
//                 }
//                 disabled={!selectedCategory && !editingSubCategory}
//               >
//                 {getParentOptions().map((sub) => (
//                   <Select.Option key={sub._id} value={sub._id}>
//                     <div className="flex items-center">
//                       {sub.parentSubCategoryId ? (
//                         <ArrowDownOutlined className="mr-2" />
//                       ) : (
//                         <FolderOpenOutlined className="mr-2" />
//                       )}
//                       {sub.subCategoryName}
//                       <Tag color="blue" className="ml-2">
//                         {sub.categoryId?.categoryName}
//                       </Tag>
//                     </div>
//                   </Select.Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Panel>
//         </Collapse>

//         <Divider />
//         <Form.Item className="text-right mb-0">
//           <Space>
//             <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
//             <Button type="primary" htmlType="submit">
//               {editingSubCategory ? "Update" : "Create"}
//             </Button>
//           </Space>
//         </Form.Item>
//       </Form>
//     </>
//   );
// };

// export default SubCategoryForm;
import React, { useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Collapse,
  Alert,
  Divider,
  Space,
  Button,
  Tag,
} from "antd";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import {
  EditOutlined,
  PlusOutlined,
  ArrowDownOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";

const { Panel } = Collapse;

const SubCategoryForm = ({
  form,
  handleSubmit,
  editingSubCategory,
  categories,
  subCategories,
  setIsModalVisible,
}) => {
  const selectedParentId = Form.useWatch("parentSubCategoryId", form);

  // Get available parent options based on selected category
  const getParentOptions = () => {
    if (!form.getFieldValue("categoryId")) return [];
    return subCategories.filter(
      (sub) =>
        sub.categoryId === form.getFieldValue("categoryId") &&
        sub._id !== editingSubCategory?._id
    );
  };

  // Automatically set category based on parent selection
  useEffect(() => {
    if (selectedParentId) {
      const parentSub = subCategories.find(
        (sub) => sub._id === selectedParentId
      );
      if (parentSub) {
        form.setFieldsValue({
          categoryId: parentSub.categoryId,
        });
      }
    }
  }, [selectedParentId, form, subCategories]);

  return (
    <>
      <Divider />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ parentSubCategoryId: null }}
      >
        <Collapse bordered={false} defaultActiveKey={["1"]}>
          <Panel header="Basic Information" key="1">
            <Form.Item
              name="subCategoryName"
              label="SubCategory Name"
              rules={[
                { required: true, message: "Please enter subcategory name" },
                { max: 50, message: "Maximum 50 characters allowed" },
              ]}
            >
              <Input placeholder="e.g. Electronics, Clothing, etc." />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ max: 200, message: "Maximum 200 characters allowed" }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Short description of this subcategory"
                showCount
                maxLength={200}
              />
            </Form.Item>

            {/* <Form.Item
              name="image"
              label="SubCategory Image"
              valuePropName="file"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) return e;
                return e && e.fileList;
              }}
            >
              <Upload
                beforeUpload={() => false} // prevent auto upload
                maxCount={1}
                accept="image/*"
                listType="picture"
              >
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
            </Form.Item> */}
          </Panel>

          <Panel header="Hierarchy Settings" key="2">
            <Alert
              message="Hierarchy Information"
              description="Select a category and optionally a parent subcategory to create a hierarchy."
              type="info"
              showIcon
              className="mb-4"
            />

            <Form.Item
              name="categoryId"
              label="Category"
              rules={[{ required: true, message: "Category is required" }]}
            >
              <Select
                placeholder="Select category"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                disabled={
                  !!selectedParentId || !!editingSubCategory?.categoryId
                }
              >
                {categories.map((cat) => (
                  <Select.Option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="parentSubCategoryId"
              label="Parent SubCategory (Optional)"
              tooltip="Leave empty to create a top-level subcategory"
            >
              <Select
                allowClear
                placeholder="Select parent subcategory"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                disabled={
                  !form.getFieldValue("categoryId") && !editingSubCategory
                }
              >
                {getParentOptions().map((sub) => (
                  <Select.Option key={sub._id} value={sub._id}>
                    <div className="flex items-center">
                      {sub.parentSubCategoryId ? (
                        <ArrowDownOutlined className="mr-2" />
                      ) : (
                        <FolderOpenOutlined className="mr-2" />
                      )}
                      {sub.subCategoryName}
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Panel>
        </Collapse>

        <Divider />
        <Form.Item className="text-right mb-0">
          <Space>
            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingSubCategory ? "Update" : "Create"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default SubCategoryForm;
