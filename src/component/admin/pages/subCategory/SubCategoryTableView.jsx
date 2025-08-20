import React from "react";
import { Table, Space, Button, Tag, Popconfirm } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";

const SubCategoryTableView = ({
  subCategories,
  handleAddNew,
  openEditModal,
  deleteSubCategory,
}) => {
  const columns = [
    {
      title: "SubCategory",
      dataIndex: "subCategoryName",
      key: "subCategoryName",
      render: (text, record) => (
        <Space>
          {record.parentSubCategoryId ? (
            <FolderOutlined />
          ) : (
            <FolderOpenOutlined />
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
      title: "Category",
      dataIndex: ["categoryId", "categoryName"],
      key: "categoryName",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Level",
      key: "level",
      render: (_, record) => {
        let level = 0;
        let current = record;
        while (current.parentSubCategoryId) {
          level++;
          current = subCategories.find(
            (item) => item._id === current.parentSubCategoryId._id
          );
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
            onClick={() => handleAddNew(record._id, record.categoryId?._id)}
            size="small"
            type="text"
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            size="small"
            type="text"
          />
          <Popconfirm
            title="Delete this subcategory and all its children?"
            description="This action cannot be undone."
            onConfirm={() => deleteSubCategory(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger size="small" type="text" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={subCategories}
      rowKey="_id"
      size="middle"
      pagination={{ pageSize: 10 }}
      scroll={{ x: true }}
      expandable={{
        defaultExpandAllRows: true,
        childrenColumnName: "children",
        rowExpandable: (record) =>
          record.children && record.children.length > 0,
      }}
    />
  );
};

export default SubCategoryTableView;
