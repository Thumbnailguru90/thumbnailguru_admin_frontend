
import React, { useState, useEffect } from "react";
import { Card, Breadcrumb, Space, Button, Spin, Divider, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SubCategoryTreeView from "./SubCategoryTreeView";
import SubCategoryTableView from "./SubCategoryTableView";
import SubCategoryModal from "./SubCategoryModal";
import useSubCategory from "./useSubCategory";

const SubCategory = () => {
  const {
    subCategories,
    categories,
    loading,
    addOrUpdateSubCategory,
    deleteSubCategory,
    fetchSubCategories,
  } = useSubCategory();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [viewMode, setViewMode] = useState("tree");
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [form] = Form.useForm();

  // Build tree data structure
  const buildTree = (data, parentId = null) => {
    return data
      .filter((item) => (item.parentSubCategoryId?._id || null) === parentId)
      .map((item) => ({
        key: item._id,
        title: item.subCategoryName,
        description: item.description,
        category: item.categoryId?.categoryName,
        isLeaf: !data.some(
          (child) => child.parentSubCategoryId?._id === item._id
        ),
        children: buildTree(data, item._id),
      }));
  };

  const treeData = buildTree(subCategories);

  // Automatically expand relevant nodes when editing
  useEffect(() => {
    if (editingSubCategory?.parentSubCategoryId?._id) {
      setExpandedKeys((prev) => [
        ...new Set([...prev, editingSubCategory.parentSubCategoryId._id]),
      ]);
      setAutoExpandParent(true);
    }
  }, [editingSubCategory]);

  const openEditModal = (record) => {
    setEditingSubCategory(record);
    form.setFieldsValue({
      ...record,
      categoryId: record.categoryId?._id,
      parentSubCategoryId: record.parentSubCategoryId?._id || null,
    });
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      await addOrUpdateSubCategory(
        { ...values, _id: editingSubCategory?._id },
        !!editingSubCategory
      );
      await fetchSubCategories();
      setIsModalVisible(false);
      setEditingSubCategory(null);
      form.resetFields();
    } catch (error) {
      console.error("Error saving subcategory:", error);
    }
  };

  const handleAddNew = (parentId = null, categoryId = null) => {
    setEditingSubCategory(null);
    form.resetFields();
    form.setFieldsValue({
      parentSubCategoryId: parentId || null,
      categoryId: categoryId || null,
    });
    setIsModalVisible(true);
  };

  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  return (
    <div className="p-4">
      <Card
        title={
          <Breadcrumb>
            <Breadcrumb.Item>Content Management</Breadcrumb.Item>
            <Breadcrumb.Item>SubCategories</Breadcrumb.Item>
          </Breadcrumb>
        }
        extra={
          <Space>
            <Button
              type={viewMode === "table" ? "primary" : "default"}
              onClick={() => setViewMode("table")}
            >
              Table View
            </Button>
            <Button
              type={viewMode === "tree" ? "primary" : "default"}
              onClick={() => setViewMode("tree")}
            >
              Tree View
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleAddNew()}
            >
              Add SubCategory
            </Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
          {viewMode === "table" ? (
            <SubCategoryTableView
              subCategories={subCategories}
              handleAddNew={handleAddNew}
              openEditModal={openEditModal}
              deleteSubCategory={deleteSubCategory}
            />
          ) : (
            <SubCategoryTreeView
              treeData={treeData}
              subCategories={subCategories}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              handleAddNew={handleAddNew}
              openEditModal={openEditModal}
              deleteSubCategory={deleteSubCategory}
            />
          )}
        </Spin>
      </Card>

      <SubCategoryModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        editingSubCategory={editingSubCategory}
        form={form}
        handleSubmit={handleSubmit}
        categories={categories}
        subCategories={subCategories}
      />
    </div>
  );
};

export default SubCategory;
