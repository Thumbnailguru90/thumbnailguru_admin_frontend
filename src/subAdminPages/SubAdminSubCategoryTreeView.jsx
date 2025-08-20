import React from "react";
import { Tree, Space, Button, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const SubAdminSubCategoryTreeView = ({
  treeData,
  subCategories,
  onExpand,
  expandedKeys,
  autoExpandParent,
  handleAddNew,
}) => {
  return (
    <div className="p-4 border rounded">
      <Tree
        showLine
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onExpand={onExpand}
        treeData={treeData}
        titleRender={(node) => (
          <div className="flex items-center justify-between w-full">
            <div>
              <span className="font-medium">{node.title}</span>
              {node.description && (
                <span className="text-gray-500 ml-2 text-sm">
                  - {node.description}
                </span>
              )}
              <Tag color="blue" className="ml-2">
                {node.category}
              </Tag>
            </div>
            <Space size="small">
              <Button
                icon={<PlusOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  const record = subCategories.find(
                    (item) => item._id === node.key
                  );
                  handleAddNew(record._id, record.categoryId?._id);
                }}
                size="small"
                type="text"
              />
            </Space>
          </div>
        )}
      />
    </div>
  );
};

export default SubAdminSubCategoryTreeView;
