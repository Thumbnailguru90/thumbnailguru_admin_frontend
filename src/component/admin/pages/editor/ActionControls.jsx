// import { useState } from "react";
// import {
//   Button,
//   Dialog,
//   InputGroup,
//   Menu,
//   MenuItem,
//   Popover,
//   Position,
// } from "@blueprintjs/core";
// // import SaveTemplateDialog from "./SaveTemplateDialog";

// import SaveTemplateDialog from "./SaveTemplateDialog";

// const ActionControls = ({ store, templateId }) => {
//   const isEditMode = Boolean(templateId);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
//   const [fileName, setFileName] = useState(getDefaultFileName(store));
//   const [fileFormat, setFileFormat] = useState("Normal JPG");
//   const [exportSize, setExportSize] = useState("1280 x 720 px");
//   const [exportScale, setExportScale] = useState("1x");

//   function getDefaultFileName(store) {
//     const firstPage = store.pages[0];
//     if (firstPage && firstPage.children.length > 0) {
//       const textElements = firstPage.children.filter(
//         (child) => child.type === "text"
//       );
//       if (textElements.length > 0) {
//         return (
//           textElements[0].text.split("\n")[0].replace(/[^a-zA-Z0-9]/g, "_") ||
//           "design_export"
//         );
//       }
//     }
//     return "design_export";
//   }

//   const FileFormatMenu = (
//     <Menu>
//       <MenuItem text="Normal JPG" onClick={() => setFileFormat("Normal JPG")} />
//       <MenuItem text="Normal PNG" onClick={() => setFileFormat("Normal PNG")} />
//       <MenuItem text="PDF" onClick={() => setFileFormat("PDF")} />
//     </Menu>
//   );

//   const ExportScaleMenu = (
//     <Menu>
//       <MenuItem text="1x" onClick={() => setExportScale("1x")} />
//       <MenuItem text="2x" onClick={() => setExportScale("2x")} />
//       <MenuItem text="3x" onClick={() => setExportScale("3x")} />
//     </Menu>
//   );

//   const handleExport = async () => {
//     try {
//       await store.waitLoading();
//       if (fileFormat === "PDF") {
//         await store.saveAsPDF({
//           fileName,
//           pixelRatio: parseInt(exportScale),
//         });
//       } else {
//         await store.saveAsImage({
//           fileName,
//           mimeType: fileFormat === "Normal JPG" ? "image/jpeg" : "image/png",
//           pixelRatio: parseInt(exportScale),
//         });
//       }
//       setIsDialogOpen(false);
//     } catch (error) {
//       console.error("Export failed:", error);
//     }
//   };

//   return (
//     <>
//       <div style={{ display: "flex", gap: "10px" }}>
//         <Button
//           intent="primary"
//           style={{
//             backgroundColor: "#007bff",
//             color: "#fff",
//             borderRadius: "5px",
//             padding: "5px 15px",
//             fontWeight: "bold",
//           }}
//           onClick={() => setIsDialogOpen(true)}
//         >
//           Download
//         </Button>

//         <Button
//           intent="success"
//           style={{
//             backgroundColor: "#28a745",
//             color: "#fff",
//             borderRadius: "5px",
//             padding: "5px 15px",
//             fontWeight: "bold",
//           }}
//           onClick={() => setIsSaveDialogOpen(true)}
//         >
//           {isEditMode ? "Edit Template" : "Save as Template"}
//         </Button>
//       </div>

//       <Dialog
//         isOpen={isDialogOpen}
//         onClose={() => setIsDialogOpen(false)}
//         title="Download Design"
//         style={{ width: "400px" }}
//       >
//         <div style={{ padding: "20px" }}>
//           <div style={{ marginBottom: "15px" }}>
//             <label style={{ fontSize: "14px", fontWeight: "bold" }}>
//               File Name
//             </label>
//             <InputGroup
//               value={fileName}
//               onChange={(e) => setFileName(e.target.value)}
//               placeholder="Enter file name"
//             />
//           </div>

//           <div style={{ marginBottom: "15px" }}>
//             <label style={{ fontSize: "14px", fontWeight: "bold" }}>
//               File Format
//             </label>
//             <Popover content={FileFormatMenu} position={Position.BOTTOM}>
//               <Button
//                 text={fileFormat}
//                 rightIcon="caret-down"
//                 style={{ width: "100%", textAlign: "left" }}
//               />
//             </Popover>
//           </div>

//           <div style={{ marginBottom: "15px" }}>
//             <label style={{ fontSize: "14px", fontWeight: "bold" }}>
//               Export Size
//             </label>
//             <div style={{ display: "flex", gap: "10px" }}>
//               <InputGroup
//                 value={exportSize}
//                 onChange={(e) => setExportSize(e.target.value)}
//               />
//               <Popover content={ExportScaleMenu} position={Position.BOTTOM}>
//                 <Button text={exportScale} rightIcon="caret-down" />
//               </Popover>
//             </div>
//           </div>

//           <Button
//             intent="primary"
//             fill
//             text="Download"
//             style={{
//               backgroundColor: "#007bff",
//               color: "#fff",
//             }}
//             onClick={handleExport}
//           />
//         </div>
//       </Dialog>

//       <SaveTemplateDialog
//         isOpen={isSaveDialogOpen}
//         onClose={() => setIsSaveDialogOpen(false)}
//         store={store}
//         templateId={templateId}
//       />
//     </>
//   );
// };

// export default ActionControls;
import { useState } from "react";
import {
  Button,
  Dialog,
  InputGroup,
  Menu,
  MenuItem,
  Popover,
  Position,
} from "@blueprintjs/core";
import { useNavigate } from "react-router-dom";
import { Icon } from "@blueprintjs/core";
import SaveTemplateDialog from "./SaveTemplateDialog";

const ActionControls = ({ store, templateId, clearDraft, CloudIcon }) => {
  const isEditMode = Boolean(templateId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [fileName, setFileName] = useState(getDefaultFileName(store));
  const [fileFormat, setFileFormat] = useState("Normal JPG");
  const [exportSize, setExportSize] = useState("1280 x 720 px");
  const [exportScale, setExportScale] = useState("1x");

  const navigate = useNavigate();

  function getDefaultFileName(store) {
    const firstPage = store.pages[0];
    if (firstPage && firstPage.children.length > 0) {
      const textElements = firstPage.children.filter(
        (child) => child.type === "text"
      );
      if (textElements.length > 0) {
        return (
          textElements[0].text.split("\n")[0].replace(/[^a-zA-Z0-9]/g, "_") ||
          "design_export"
        );
      }
    }
    return "design_export";
  }

  const FileFormatMenu = (
    <Menu>
      <MenuItem text="Normal JPG" onClick={() => setFileFormat("Normal JPG")} />
      <MenuItem text="Normal PNG" onClick={() => setFileFormat("Normal PNG")} />
      <MenuItem text="PDF" onClick={() => setFileFormat("PDF")} />
    </Menu>
  );

  const ExportScaleMenu = (
    <Menu>
      <MenuItem text="1x" onClick={() => setExportScale("1x")} />
      <MenuItem text="2x" onClick={() => setExportScale("2x")} />
      <MenuItem text="3x" onClick={() => setExportScale("3x")} />
    </Menu>
  );

  const handleExport = async () => {
    try {
      await store.waitLoading();
      if (fileFormat === "PDF") {
        await store.saveAsPDF({
          fileName,
          pixelRatio: parseInt(exportScale),
        });
      } else {
        await store.saveAsImage({
          fileName,
          mimeType: fileFormat === "Normal JPG" ? "image/jpeg" : "image/png",
          pixelRatio: parseInt(exportScale),
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const ActionMenu = (
    <Menu>
      <MenuItem
        icon="download"
        text="Download"
        onClick={() => setIsDialogOpen(true)}
      />
      <MenuItem
        icon="floppy-disk"
        text={isEditMode ? "Edit Template" : "Save as Template"}
        onClick={() => setIsSaveDialogOpen(true)}
      />
      <MenuItem
        icon="new-object"
        text="Create New"
        onClick={() => clearDraft()}
      />
    </Menu>
  );

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        {CloudIcon && (
          <img
            src={CloudIcon}
            alt="Loading Icon"
            style={{ width: "16px", height: "16px", marginRight: "8px" }}
          />
        )}
        <Popover content={ActionMenu} position={Position.BOTTOM_RIGHT}>
          <Button icon={<Icon icon="more" iconSize={20} />} minimal />
        </Popover>
      </div>

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Download Design"
        style={{ width: "400px" }}
      >
        <div style={{ padding: "20px" }}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontSize: "14px", fontWeight: "bold" }}>
              File Name
            </label>
            <InputGroup
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontSize: "14px", fontWeight: "bold" }}>
              File Format
            </label>
            <Popover content={FileFormatMenu} position={Position.BOTTOM}>
              <Button
                text={fileFormat}
                rightIcon="caret-down"
                style={{ width: "100%", textAlign: "left" }}
              />
            </Popover>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontSize: "14px", fontWeight: "bold" }}>
              Export Size
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <InputGroup
                value={exportSize}
                onChange={(e) => setExportSize(e.target.value)}
              />
              <Popover content={ExportScaleMenu} position={Position.BOTTOM}>
                <Button text={exportScale} rightIcon="caret-down" />
              </Popover>
            </div>
          </div>

          <Button
            intent="primary"
            fill
            text="Download"
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
            }}
            onClick={handleExport}
          />
        </div>
      </Dialog>

      <SaveTemplateDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        store={store}
        templateId={templateId}
      />
    </>
  );
};

export default ActionControls;
