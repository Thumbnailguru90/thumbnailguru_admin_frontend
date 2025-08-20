// import { Button, Popconfirm } from "antd";

// const TemplateCard = ({ template, onDelete, onClick }) => {
//   const handleDelete = (e) => {
//     e.stopPropagation();
//     // The actual deletion will be handled after confirmation
//   };

//   return (
//     <div
//       className="relative cursor-pointer rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out group"
//       onClick={() => onClick(template)}
//     >
//       <div className="absolute top-2 right-2 z-10 flex gap-2">
//         <Popconfirm
//           title="Are you sure to delete this template?"
//           onConfirm={(e) => {
//             e?.stopPropagation();
//             onDelete(template._id);
//           }}
//           onCancel={(e) => e?.stopPropagation()}
//           okText="Yes"
//           cancelText="No"
//         >
//           <Button
//             danger
//             size="small"
//             onClick={handleDelete}
//             className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//           >
//             Delete
//           </Button>
//         </Popconfirm>
//       </div>

//       <div className="w-full h-48 overflow-hidden">
//         <img
//           src={template.previewPath}
//           alt={template.name}
//           className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//         />
//       </div>
//       <div className="p-3 text-center">
//         <h3 className="text-base font-semibold text-gray-800 truncate">
//           {template.name}
//         </h3>
//       </div>
//     </div>
//   );
// };
// export default TemplateCard;
import { Button, Popconfirm, Dropdown, Menu, message } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { templateApiService } from "./services/templateApiService";
import { FaEllipsisV, FaDownload, FaTrash } from "react-icons/fa";

const TemplateCard = ({ template, onDelete, onClick, fetchTemplates }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    // The actual deletion will be handled after confirmation
  };

  const handleMenuClick = (e, template) => {
    e.domEvent.stopPropagation();
  };

  const toggleTemplateStatus = async (templateId) => {
    try {
      const response = await templateApiService.toggleTemplateStatus(
        templateId
      );
      const updatedTemplate = response.template;

      message.success(
        `Template ${
          updatedTemplate.isActive ? "activated" : "deactivated"
        } successfully`
      );
      fetchTemplates();
    } catch (error) {
      message.error(error.message || "Failed to toggle template status");
    }
  };

  const menu = (
    <Menu onClick={(e) => handleMenuClick(e, template)}>
      <Menu.Item
        key="toggle-status"
        onClick={() => toggleTemplateStatus(template._id)}
      >
        {template.isActive ? "Disable" : "Enable"}
      </Menu.Item>
      <Menu.Item key="delete">
        <Popconfirm
          title="Are you sure to delete this template?"
          onConfirm={(e) => {
            e?.stopPropagation();
            onDelete(template); // pass the full template object
          }}
          onCancel={(e) => e?.stopPropagation()}
          okText="Yes"
          cancelText="No"
        >
          <span className="text-red-500">Delete</span>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  return (
    <div
      className="relative cursor-pointer rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out group"
      onClick={() => onClick(template)}
    >
      <div className="absolute top-2 right-2 z-10 flex gap-2 bg-white">
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button
            type="text"
            size="small"
            icon={<FaEllipsisV className="text-black" />} // icon color black
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="bg-white text-black  group-hover:opacity-100 transition-opacity duration-200 rounded"
          />
        </Dropdown>
      </div>

      {!template.isActive && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-60 flex items-center justify-center z-0">
          <span className="text-gray-700 font-semibold text-sm">Disabled</span>
        </div>
      )}

      <div className="w-full h-48 overflow-hidden">
        <img
          src={template.previewPath}
          alt={template.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-3 text-center">
        <h3 className="text-base font-semibold text-gray-800 truncate">
          {template.name}
        </h3>
      </div>
    </div>
  );
};

export default TemplateCard;
