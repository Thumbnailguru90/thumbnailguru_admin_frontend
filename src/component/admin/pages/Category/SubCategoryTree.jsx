// import React, { useState } from "react";
// import { Button, Input, message } from "antd";
// import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

// const SubCategoryTree = ({
//   subCategories,
//   parentCategoryId,
//   onAddSubCategory,
// }) => {
//   return (
//     <ul className="pl-4 list-disc">
//       {subCategories.map((sub) => (
//         <SubCategoryNode
//           key={sub._id}
//           node={sub}
//           parentCategoryId={parentCategoryId}
//           onAddSubCategory={onAddSubCategory}
//         />
//       ))}
//     </ul>
//   );
// };

// const SubCategoryNode = ({ node, parentCategoryId, onAddSubCategory }) => {
//   const [expanded, setExpanded] = useState(false);
//   const [showInput, setShowInput] = useState(false);
//   const [newSubCatName, setNewSubCatName] = useState("");

//   const handleAddSubCategory = () => {
//     if (!newSubCatName.trim()) {
//       message.warning("Subcategory name is required");
//       return;
//     }

//     const payload = {
//       subCategoryName: newSubCatName,
//       categoryId: parentCategoryId,
//       parentSubCategoryId: node._id,
//     };

//     onAddSubCategory(payload);
//     setNewSubCatName("");
//     setShowInput(false);
//     setExpanded(true); // auto-expand after adding
//   };

//   return (
//     <li className="mb-2">
//       <div className="flex items-center gap-2">
//         {node.subCategories?.length > 0 && (
//           <Button
//             type="text"
//             size="small"
//             icon={expanded ? <MinusOutlined /> : <PlusOutlined />}
//             onClick={() => setExpanded(!expanded)}
//           />
//         )}
//         <span>{node.subCategoryName}</span>
//         <Button
//           type="link"
//           size="small"
//           icon={<PlusOutlined />}
//           onClick={() => setShowInput(!showInput)}
//         >
//           Add
//         </Button>
//       </div>

//       {showInput && (
//         <div className="ml-6 my-2 flex items-center gap-2">
//           <Input
//             size="small"
//             placeholder="Subcategory name"
//             value={newSubCatName}
//             onChange={(e) => setNewSubCatName(e.target.value)}
//             style={{ width: 200 }}
//           />
//           <Button type="primary" size="small" onClick={handleAddSubCategory}>
//             Save
//           </Button>
//           <Button size="small" onClick={() => setShowInput(false)}>
//             Cancel
//           </Button>
//         </div>
//       )}

//       {expanded && node.subCategories?.length > 0 && (
//         <SubCategoryTree
//           subCategories={node.subCategories}
//           parentCategoryId={parentCategoryId}
//           onAddSubCategory={onAddSubCategory}
//         />
//       )}
//     </li>
//   );
// };

// export default SubCategoryTree;




import React, { useState } from "react";
import { Table, Button, Input, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const SubCategoryTree = ({ subCategories, parentCategoryId, onAddSubCategory }) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [newSubCatName, setNewSubCatName] = useState("");

  const handleAddSubCategory = (record) => {
    if (!newSubCatName.trim()) {
      message.warning("Subcategory name is required");
      return;
    }

    const payload = {
      subCategoryName: newSubCatName,
      categoryId: parentCategoryId,
      parentSubCategoryId: record._id,
    };

    onAddSubCategory(payload);
    setNewSubCatName("");
    setEditingRow(null);
  };

  const columns = [
    {
      title: "SubCategory Name",
      dataIndex: "subCategoryName",
      key: "subCategoryName",
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <>
          {editingRow === record._id ? (
            <div className="flex items-center gap-2">
              <Input
                size="small"
                placeholder="Subcategory name"
                value={newSubCatName}
                onChange={(e) => setNewSubCatName(e.target.value)}
                style={{ width: 200 }}
              />
              <Button
                type="primary"
                size="small"
                onClick={() => handleAddSubCategory(record)}
              >
                Save
              </Button>
              <Button size="small" onClick={() => setEditingRow(null)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              type="link"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => setEditingRow(record._id)}
            >
              Add SubCategory
            </Button>
          )}
        </>
      ),
    },
  ];

  const handleExpand = (expanded, record) => {
    setExpandedRowKeys((prev) =>
      expanded ? [...prev, record._id] : prev.filter((key) => key !== record._id)
    );
  };

  return (
    <Table className="  rounded"
     bordered
      columns={columns}
      dataSource={subCategories}
      rowKey="_id"
      expandable={{
        expandedRowKeys,
        onExpand: handleExpand,
        expandedRowRender: (record) => (
          <SubCategoryTree
            subCategories={record.subCategories || []}
            parentCategoryId={parentCategoryId}
            onAddSubCategory={onAddSubCategory}
          />
        ),
      }}
      pagination={false}
    />
  );
};

export default SubCategoryTree;