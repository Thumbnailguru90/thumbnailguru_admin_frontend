import React from "react";
import { Table, Space, Button, Tag, Popconfirm } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  DownOutlined,
  RightOutlined,
} from "@ant-design/icons";

const CategorySubCategoryTable = ({
  categories,
  subCategories,
  handleAddNew,
  openEditModal,
  deleteSubCategory,
  expandedRowKeys,
  onExpand,
}) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          {record.type === "category" ? (
            <FolderOpenOutlined />
          ) : (
            <FolderOutlined />
          )}
          <span>{text}</span>
          {record.description && (
            <span className="text-gray-500 text-sm">
              ({record.description})
            </span>
          )}
        </Space>
      ),
    },
    {
      title: "Type",
      key: "type",
      render: (record) => (
        <Tag color={record.type === "category" ? "blue" : "green"}>
          {record.type === "category" ? "Category" : "SubCategory"}
        </Tag>
      ),
    },
    {
      title: "Level",
      key: "level",
      render: (record) => {
        if (record.type === "category") return null;
        let level = 0;
        let current = record;
        while (current.parentId) {
          level++;
          current = subCategories.find((item) => item._id === current.parentId);
        }
        return (
          <Tag color={level === 0 ? "green" : level === 1 ? "orange" : "red"}>
            Level {level}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (record) => (
        <Space size="small">
          <Button
            icon={<PlusOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleAddNew(
                record.type === "category" ? null : record._id,
                record.type === "category" ? record._id : record.categoryId
              );
            }}
            size="small"
            type="text"
          />
          {record.type === "subcategory" && (
            <>
              <Button
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(record);
                }}
                size="small"
                type="text"
              />
              <Popconfirm
                title={`Delete this ${record.type} and all its children?`}
                description="This action cannot be undone."
                onConfirm={(e) => {
                  e?.stopPropagation();
                  deleteSubCategory(record._id);
                }}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  size="small"
                  type="text"
                  onClick={(e) => e.stopPropagation()}
                />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  // Transform data into hierarchical structure
  const dataSource = categories.map((category) => ({
    key: `category-${category._id}`,
    _id: category._id,
    name: category.categoryName,
    type: "category",
    description: category.description,
    children: subCategories
      .filter(
        (sub) => sub.categoryId === category._id && !sub.parentSubCategoryId
      )
      .map((sub) => ({
        key: `subcategory-${sub._id}`,
        _id: sub._id,
        name: sub.subCategoryName,
        type: "subcategory",
        description: sub.description,
        categoryId: sub.categoryId,
        parentId: sub.parentSubCategoryId,
        children: getNestedSubcategories(sub._id),
      })),
  }));

  function getNestedSubcategories(parentId) {
    return subCategories
      .filter((sub) => sub.parentSubCategoryId === parentId)
      .map((sub) => ({
        key: `subcategory-${sub._id}`,
        _id: sub._id,
        name: sub.subCategoryName,
        type: "subcategory",
        description: sub.description,
        categoryId: sub.categoryId,
        parentId: sub.parentSubCategoryId,
        children: getNestedSubcategories(sub._id),
      }));
  }

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey="key"
      size="middle"
      pagination={false}
      scroll={{ x: true }}
      expandable={{
        expandedRowKeys,
        onExpand: (expanded, record) => {
          if (expanded) {
            onExpand([...expandedRowKeys, record.key]);
          } else {
            onExpand(expandedRowKeys.filter((key) => key !== record.key));
          }
        },
        expandIcon: ({ expanded, onExpand, record }) =>
          record.children?.length > 0 ? (
            <Button
              type="text"
              size="small"
              icon={expanded ? <DownOutlined /> : <RightOutlined />}
              onClick={(e) => {
                onExpand(record, e);
                e.stopPropagation();
              }}
            />
          ) : null,
      }}
    />
  );
};

export default CategorySubCategoryTable;
