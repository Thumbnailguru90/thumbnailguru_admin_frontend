// import { Spin } from "antd";
// import TemplateCard from "./TemplateCard";

// const TemplatesGrid = ({ templates, loading, onDelete, onClick }) => {
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//       {templates.map((template) => (
//         <TemplateCard
//           key={template._id}
//           template={template}
//           onDelete={onDelete}
//           onClick={onClick}
//         />
//       ))}
//     </div>
//   );
// };

// export default TemplatesGrid;

import { Spin } from "antd";
import TemplateCard from "./TemplateCard";

const TemplatesGrid = ({
  templates,
  loading,
  onDelete,
  onClick,
  fetchTemplates,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {templates.map((template) => (
        <TemplateCard
          key={template._id}
          template={template}
          onDelete={onDelete}
          onClick={onClick}
          fetchTemplates={fetchTemplates}
        />
      ))}
    </div>
  );
};

export default TemplatesGrid;
