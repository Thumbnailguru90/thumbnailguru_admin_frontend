const handleSubmit = async (values) => {
  try {
    const formData = new FormData();

    formData.append("subCategoryName", values.subCategoryName);
    formData.append("description", values.description || "");
    formData.append("categoryId", values.categoryId);
    if (values.parentSubCategoryId) {
      formData.append("parentSubCategoryId", values.parentSubCategoryId);
    }

    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0].originFileObj);
    }

    // Add ID if editing
    if (editingSubCategory?._id) {
      formData.append("_id", editingSubCategory._id);
    }
    await addOrUpdateSubCategory(
      formData,
      !!editingSubCategory,
      editingSubCategory?._id || null
    );

    await fetchSubCategories();
    setIsModalVisible(false);
    setEditingSubCategory(null);
    form.resetFields();
  } catch (error) {
    console.error("Error saving subcategory:", error);
  }
};

<Form.Item
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
</Form.Item>;

import React from "react";
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Workspace } from "polotno/canvas/workspace";
import { SidePanel } from "polotno/side-panel";
import { Toolbar } from "polotno/toolbar/toolbar";
import { PagesTimeline } from "polotno/pages-timeline";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { createStore } from "polotno/model/store";
import { DEFAULT_SECTIONS } from "polotno/side-panel";
import { TemplatesSection } from "./TemplateSection";
import { FontsTab } from "./FontsSection";
import ActionControls from "./ActionControls";
import { DraftsTab } from "./DraftsSeection";
import { UploadSection } from "./UploadSection";
import { useDraftEditorState } from "./useDraftEditorState";
import GIF from "../../../../assets/data_cloud.gif";
import CustomElements from "./ElementsPanel";
import { observer } from "mobx-react-lite";
import { unstable_useHtmlTextRender } from "polotno/config";
import "@blueprintjs/core/lib/css/blueprint.css";
import {
  quillRef,
  createQuill,
  setQuillContent,
} from "polotno/canvas/html-element";
import { Button } from "@blueprintjs/core";

// Enable HTML text rendering
unstable_useHtmlTextRender(true);

const store = createStore({
  key: "nFA5H9elEytDyPyvKL7T",
  showCredit: true,
});
const storeRef = { current: store };

// Add a default page with rich text example
const page = store.addPage();
store.activePage.addElement({
  type: "text",
  text: 'Hello <strong>from rich</strong> <u>text</u> <span style="color: red;">support</span>!',
  y: 300,
  x: store.width / 2 - 200,
  fontSize: 80,
  width: 400,
});

const createTempQuill = ({ html }) => {
  const el = document.createElement("div");
  document.body.appendChild(el);
  el.style.display = "none";
  el.style.whiteSpace = "pre-wrap";
  const quill = createQuill(el);
  setQuillContent(quill, html);
  return quill;
};

const removeTempQuill = (quill) => {
  quill.root.parentElement.remove();
};

const ToggleButton = observer(
  ({
    active,
    globalActive,
    format,
    element,
    disableGlobal,
    enableGlobal,
    icon,
    ...props
  }) => {
    return (
      <Button
        {...props}
        minimal
        icon={icon}
        active={active}
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          let quill = window.__polotnoQuill;
          let selection =
            quill?.getSelection?.() || window.__lastQuillSelection;

          if (quill && selection && selection.length > 0) {
            // Apply format to selected range
            quill.formatText(
              selection.index,
              selection.length,
              format,
              !quillRef.currentFormat[format],
              "user"
            );
            if (globalActive) disableGlobal();
            return;
          }

          // Fallback: apply format to whole element text
          quill = createTempQuill({ html: element.text });
          quill.setSelection(0, quill.getLength(), "api");
          quill.format(format, false);
          const innerHtml = quill.root.innerHTML;
          removeTempQuill(quill);

          element.set({ text: innerHtml });

          if (globalActive) {
            disableGlobal();
          } else {
            enableGlobal();
          }
        }}
      />
    );
  }
);

export const TextBold = observer(({ element }) => {
  return (
    <ToggleButton
      format="bold"
      active={
        quillRef.currentFormat.bold ||
        element.fontWeight === "bold" ||
        element.fontWeight === "700"
      }
      globalActive={
        element.fontWeight === "bold" || element.fontWeight === "700"
      }
      element={element}
      disableGlobal={() => element.set({ fontWeight: "normal" })}
      enableGlobal={() => element.set({ fontWeight: "bold" })}
      text="Bold"
    />
  );
});

const sections = [
  TemplatesSection,
  DraftsTab,
  CustomElements,
  UploadSection,
  FontsTab,
  ...DEFAULT_SECTIONS.filter(
    (section) => section.name !== "templates" && section.name !== "upload"
  ),
];

function AddTemplateEditor() {
  const {
    draftName,
    setDraftName,
    currentDraftId,
    getStatusInfo,
    saveCurrentDraft,
    clearDraft,
  } = useDraftEditorState(storeRef);
  const { message, showIcon } = getStatusInfo();

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <main className="flex-1 relative">
        <div className="w-full h-[calc(100vh-60px)] absolute top-0 left-0">
          <PolotnoContainer>
            <SidePanelWrap>
              <SidePanel store={store} sections={sections} />
            </SidePanelWrap>
            <WorkspaceWrap>
              <Toolbar
                store={store}
                components={{
                  ActionControls: () => (
                    <ActionControls
                      store={store}
                      clearDraft={clearDraft}
                      CloudIcon={showIcon && GIF}
                    />
                  ),
                  TextBold, // Add the rich text button to the toolbar
                }}
              />
              <Workspace store={store} />
              <ZoomButtons store={store} />
              <PagesTimeline store={store} />
            </WorkspaceWrap>
          </PolotnoContainer>
        </div>
      </main>
    </div>
  );
}

export default AddTemplateEditor;
