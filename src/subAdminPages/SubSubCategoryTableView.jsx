import React from "react";
import { Table, Space, Button, Tag } from "antd";
import {
  PlusOutlined,
  FolderOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";

const SubSubCategoryTableView = ({
  subCategories,
  handleAddNew,
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
      width: 100,
      render: (record) => (
        <Space size="small">
          <Button
            icon={<PlusOutlined />}
            onClick={() => handleAddNew(record._id, record.categoryId?._id)}
            size="small"
            type="text"
          />
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

export default SubSubCategoryTableView;
