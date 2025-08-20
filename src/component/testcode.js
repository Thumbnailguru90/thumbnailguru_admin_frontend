//---------------------------------working code -------------------------------------------------//

// import React, { useState, useEffect, useCallback, useRef } from "react";
// import "@blueprintjs/core/lib/css/blueprint.css";
// import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
// import { Workspace } from "polotno/canvas/workspace";
// import { SidePanel } from "polotno/side-panel";
// import { Toolbar } from "polotno/toolbar/toolbar";
// import { PagesTimeline } from "polotno/pages-timeline";
// import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
// import { createStore } from "polotno/model/store";
// import { DEFAULT_SECTIONS } from "polotno/side-panel";
// import { TemplatesSection } from "./TemplateSection";
// import { useParams } from "react-router-dom";
// import { IP } from "../../../utils/Constent";
// import ActionControls from "./ActionControls";
// import { FontsTab } from "./FontsSection";
// import CustomElements from "./ElementsPanel";
// import { UploadSection } from "./UploadSection";

// // Create store instance
// const store = createStore({
//   key: "nFA5H9elEytDyPyvKL7T",
//   showCredit: true,
// });

// // Template cache
// const templateCache = new Map();

// const sections = [
//   TemplatesSection,
//   CustomElements,
//   UploadSection,
//   FontsTab,
//   ...DEFAULT_SECTIONS.filter(
//     (section) => section.name !== "templates" && section.name !== "upload"
//   ),
// ];

// function Editor() {
//   const { id } = useParams();
//   const [lastUpdated, setLastUpdated] = useState(Date.now());
//   const [isSaving, setIsSaving] = useState(false);
//   const [saveStatus, setSaveStatus] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const lastSavedJSON = useRef(null);
//   const hasChanges = useRef(false);

//   // Debounce utility
//   const debounce = (func, delay) => {
//     let timer;
//     return function (...args) {
//       clearTimeout(timer);
//       timer = setTimeout(() => func.apply(this, args), delay);
//     };
//   };

//   // Save template to server
//   const saveTemplate = useCallback(async () => {
//     if (!id || isSaving || !hasChanges.current) return;

//     setIsSaving(true);
//     setSaveStatus("Saving...");

//     try {
//       const json = store.toJSON();

//       if (JSON.stringify(json) === JSON.stringify(lastSavedJSON.current)) {
//         setSaveStatus("No changes to save");
//         setTimeout(() => setSaveStatus(""), 2000);
//         return;
//       }

//       const response = await fetch(`${IP}/api/v1/templates/${id}/json`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(json),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           errorData.message || `HTTP error! status: ${response.status}`
//         );
//       }

//       templateCache.set(id, json);
//       lastSavedJSON.current = json;
//       hasChanges.current = false;

//       setSaveStatus("Saved");
//       setTimeout(() => setSaveStatus(""), 2000);
//     } catch (err) {
//       console.error("Error saving template:", err);
//       setSaveStatus(`Error: ${err.message}`);
//     } finally {
//       setIsSaving(false);
//     }
//   }, [id, isSaving]);

//   const debouncedSave = useRef(
//     debounce(() => {
//       if (hasChanges.current) {
//         saveTemplate();
//       }
//     }, 3000)
//   ).current; // Save after 3 seconds of no activity

//   // Load template
//   const loadTemplate = useCallback(async (templateId) => {
//     if (!templateId) return;

//     setIsLoading(true);

//     try {
//       if (templateCache.has(templateId)) {
//         const cached = templateCache.get(templateId);
//         store.loadJSON(cached);
//         lastSavedJSON.current = cached;
//         setIsLoading(false);
//         return;
//       }

//       const jsonRes = await fetch(
//         `${IP}/api/v1/templates/${templateId}/json?timestamp=${Date.now()}`
//       );

//       if (!jsonRes.ok) throw new Error("Failed to fetch template");

//       const json = await jsonRes.json();

//       if (json.objects) {
//         json.objects = json.objects.map((obj) => {
//           if (obj.type === "image") {
//             return {
//               ...obj,
//               crossOrigin: "anonymous",
//             };
//           }
//           return obj;
//         });
//       }

//       store.clear();
//       store.loadJSON(json);

//       templateCache.set(templateId, json);
//       lastSavedJSON.current = json;
//       hasChanges.current = false;
//     } catch (err) {
//       console.error("Error loading template:", err);
//       setSaveStatus(`Error loading: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // Load template on ID change
//   useEffect(() => {
//     if (id) {
//       loadTemplate(id);
//     }
//   }, [id, loadTemplate]);

//   // Store change listener
//   useEffect(() => {
//     if (!id) return;

//     const onChangeDisposer = store.on("change", () => {
//       hasChanges.current = true;
//       debouncedSave();
//     });

//     return () => onChangeDisposer();
//   }, [id, debouncedSave]);

//   const handleTemplateUpdate = () => {
//     if (id) templateCache.delete(id);
//     setLastUpdated(Date.now());
//   };

//   return (
//     <div className="w-screen h-screen flex flex-col overflow-hidden">
//       {isLoading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="text-white text-xl">Loading template...</div>
//         </div>
//       )}

//       <main className="flex-1 relative">
//         <div className="w-full h-[calc(100vh-60px)] absolute top-0 left-0">
//           <PolotnoContainer>
//             <SidePanelWrap>
//               <SidePanel store={store} sections={sections} />
//             </SidePanelWrap>
//             <WorkspaceWrap>
//               <Toolbar
//                 store={store}
//                 components={{
//                   ActionControls: () => (
//                     <ActionControls
//                       store={store}
//                       templateId={id}
//                       onUpdate={handleTemplateUpdate}
//                     />
//                   ),
//                 }}
//               />
//               <Workspace store={store} />
//               <ZoomButtons store={store} />
//               <PagesTimeline store={store} />
//             </WorkspaceWrap>
//           </PolotnoContainer>
//         </div>

//         {saveStatus && (
//           <div className="absolute bottom-2 right-2 bg-gray-800 text-white px-4 py-1 rounded text-sm shadow-lg z-50">
//             {saveStatus}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// export default Editor;

//------------------------------------------------------the older editot code-----------------------//

// import React, { useState, useEffect } from "react";
// // import "../editor/editor.css";
// import "@blueprintjs/core/lib/css/blueprint.css";

// // Polotno imports
// import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
// import { Workspace } from "polotno/canvas/workspace";
// import { SidePanel } from "polotno/side-panel";
// import { Toolbar } from "polotno/toolbar/toolbar";
// import { PagesTimeline } from "polotno/pages-timeline";
// import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
// import { createStore } from "polotno/model/store";
// import { addGlobalFont } from "polotno/config";
// import { DEFAULT_SECTIONS } from "polotno/side-panel";

// // Local imports
// import { TemplatesSection } from "./TemplateSection";
// import { useParams } from "react-router-dom";
// import { IP } from "../../../utils/Constent";
// import Header from "../Header/Header";
// // import { AuthProvider } from "./context/AuthContext";
// import ActionControls from "./ActionControls";
// import { FontsTab } from "./FontsSection";

// import CustomElements from "./ElementsPanel";

// // Create store instance
// const store = createStore({
//   key: "nFA5H9elEytDyPyvKL7T", // Demo key, replace with your own
//   showCredit: true,
// });

// // Filter out the "Templates" section and add Custom Templates
// const sections = [
//   TemplatesSection,
//   CustomElements,
//   // UploadSection,
//   FontsTab,
//   ...DEFAULT_SECTIONS.filter(
//     (section) => section.name !== "templates"
//     // section.name !== "elements" &&s
//     // section.name !== "upload"
//   ),
// ];

// // const sections = [
// //     { ...TemplatesSection, templateId },
// //     CustomElements,
// //     ResizePanel,
// //     RemoveBackgroundSection,
// //     ...DEFAULT_SECTIONS.filter(section => section.name !== 'templates' && section.name !== 'elements'),
// //   ];

// function Editor() {
//   const { id } = useParams();
//   const [lastUpdated, setLastUpdated] = useState(Date.now());

//   useEffect(() => {
//     const loadTemplate = async () => {
//       try {
//         // Start loading timer
//         const startTime = performance.now();

//         // Parallelize requests
//         const [templateRes, jsonRes] = await Promise.all([
//           fetch(`${IP}/api/v1/templates/${id}?timestamp=${lastUpdated}`), // Cache busting
//           fetch(`${IP}/api/v1/templates/${id}/json?timestamp=${lastUpdated}`),
//         ]);

//         if (!templateRes.ok || !jsonRes.ok)
//           throw new Error("Failed to fetch template");

//         const [template, json] = await Promise.all([
//           templateRes.json(),
//           jsonRes.json(),
//         ]);

//         // Process objects more efficiently
//         if (json.objects) {
//           for (let i = 0; i < json.objects.length; i++) {
//             if (json.objects[i].type === "image") {
//               json.objects[i].crossOrigin = "anonymous";
//             }
//           }
//         }

//         // Clear existing content before loading new
//         store.clear();
//         store.loadJSON(json);

//         // Log loading time for debugging
//         console.log(`Template loaded in ${performance.now() - startTime}ms`);
//       } catch (err) {
//         console.error("Error loading template:", err);
//         alert("Error loading template: " + err.message);
//       }
//     };

//     loadTemplate();
//   }, [id, lastUpdated]);

//   // Add this to your ActionControls component props:
//   const handleTemplateUpdate = () => {
//     setLastUpdated(Date.now()); // This will trigger reload
//   };
//   return (
//     <div className="w-screen h-screen flex flex-col overflow-hidden">
//       {/* <Header /> */}
//       <main className="flex-1 relative">
//         <div className="w-full h-[calc(100vh-60px)] absolute top-0 left-0">
//           <PolotnoContainer>
//             <SidePanelWrap>
//               <SidePanel store={store} sections={sections} />
//             </SidePanelWrap>
//             <WorkspaceWrap>
//               <Toolbar
//                 store={store}
//                 components={{
//                   ActionControls: () => (
//                     <ActionControls
//                       store={store}
//                       templateId={id}
//                       onUpdate={handleTemplateUpdate} // Pass the update handler
//                     />
//                   ),
//                 }}
//               />

//               <Workspace store={store} />
//               <ZoomButtons store={store} />
//               <PagesTimeline store={store} />
//             </WorkspaceWrap>
//           </PolotnoContainer>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Editor;

// import React, { useState, useEffect, useCallback, useRef } from "react";
// import "@blueprintjs/core/lib/css/blueprint.css";
// import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
// import { Workspace } from "polotno/canvas/workspace";
// import { SidePanel } from "polotno/side-panel";
// import { Toolbar } from "polotno/toolbar/toolbar";
// import { PagesTimeline } from "polotno/pages-timeline";
// import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
// import { createStore } from "polotno/model/store";
// import { addGlobalFont } from "polotno/config";
// import { DEFAULT_SECTIONS } from "polotno/side-panel";
// import { TemplatesSection } from "./TemplateSection";
// import { useParams } from "react-router-dom";
// import { IP } from "../../../utils/Constent";
// import ActionControls from "./ActionControls";
// import { FontsTab } from "./FontsSection";
// import CustomElements from "./ElementsPanel";

// // Create store instance
// const store = createStore({
//   key: "nFA5H9elEytDyPyvKL7T",
//   showCredit: true,
// });

// const sections = [
//   TemplatesSection,
//   CustomElements,
//   FontsTab,
//   ...DEFAULT_SECTIONS.filter((section) => section.name !== "templates"),
// ];

// function Editor() {
//   const { id } = useParams();
//   const [lastUpdated, setLastUpdated] = useState(Date.now());
//   const [isSaving, setIsSaving] = useState(false);
//   const [saveStatus, setSaveStatus] = useState("");
//   const lastSavedJSON = useRef(null);
//   const hasChanges = useRef(false);

//   // Debounce time for saving after changes
//   const SAVE_DEBOUNCE_TIME = 2000; // 2 seconds

//   // Save template to server
//   const saveTemplate = useCallback(async () => {
//     if (!id || isSaving || !hasChanges.current) return;

//     setIsSaving(true);
//     setSaveStatus("Saving...");

//     try {
//       const json = store.toJSON();

//       // Only save if there are actual changes
//       if (JSON.stringify(json) === JSON.stringify(lastSavedJSON.current)) {
//         setSaveStatus("No changes to save");
//         setTimeout(() => setSaveStatus(""), 2000);
//         return;
//       }

//       const response = await fetch(`${IP}/api/v1/templates/${id}/json`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(json),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         console.error("Error details:", errorData);
//         throw new Error(
//           errorData.message || `HTTP error! status: ${response.status}`
//         );
//       }

//       // Update last saved state
//       lastSavedJSON.current = json;
//       hasChanges.current = false;

//       setSaveStatus("Saved");
//       setTimeout(() => setSaveStatus(""), 2000);
//     } catch (err) {
//       console.error("Error saving template:", err);
//       setSaveStatus(`Error: ${err.message}`);
//     } finally {
//       setIsSaving(false);
//     }
//   }, [id, isSaving]);

//   // Debounced save function
//   const debouncedSave = useCallback(() => {
//     const timer = setTimeout(() => {
//       saveTemplate();
//     }, SAVE_DEBOUNCE_TIME);
//     return () => clearTimeout(timer);
//   }, [saveTemplate]);

//   // Load template
//   useEffect(() => {
//     const loadTemplate = async () => {
//       try {
//         const [templateRes, jsonRes] = await Promise.all([
//           fetch(`${IP}/api/v1/templates/${id}?timestamp=${lastUpdated}`),
//           fetch(`${IP}/api/v1/templates/${id}/json?timestamp=${lastUpdated}`),
//         ]);

//         if (!templateRes.ok || !jsonRes.ok)
//           throw new Error("Failed to fetch template");

//         const [template, json] = await Promise.all([
//           templateRes.json(),
//           jsonRes.json(),
//         ]);

//         if (json.objects) {
//           for (let i = 0; i < json.objects.length; i++) {
//             if (json.objects[i].type === "image") {
//               json.objects[i].crossOrigin = "anonymous";
//             }
//           }
//         }

//         store.clear();
//         store.loadJSON(json);

//         // Store the initial state
//         lastSavedJSON.current = json;
//         hasChanges.current = false;
//       } catch (err) {
//         console.error("Error loading template:", err);
//         alert("Error loading template: " + err.message);
//       }
//     };

//     if (id) loadTemplate();
//   }, [id, lastUpdated]);

//   // Set up change listeners
//   useEffect(() => {
//     if (!id) return;

//     // Listen for changes in the store
//     const onChangeDisposer = store.on("change", () => {
//       hasChanges.current = true;
//       debouncedSave();
//     });

//     return () => {
//       onChangeDisposer(); // Unsubscribe from changes
//     };
//   }, [id, debouncedSave]);

//   const handleTemplateUpdate = () => {
//     setLastUpdated(Date.now());
//   };

//   return (
//     <div className="w-screen h-screen flex flex-col overflow-hidden">
//       <main className="flex-1 relative">
//         <div className="w-full h-[calc(100vh-60px)] absolute top-0 left-0">
//           <PolotnoContainer>
//             <SidePanelWrap>
//               <SidePanel store={store} sections={sections} />
//             </SidePanelWrap>
//             <WorkspaceWrap>
//               <Toolbar
//                 store={store}
//                 components={{
//                   ActionControls: () => (
//                     <>
//                       <ActionControls
//                         store={store}
//                         templateId={id}
//                         onUpdate={handleTemplateUpdate}
//                       />
//                       {saveStatus && (
//                         <span
//                           style={{
//                             marginLeft: "10px",
//                             color:
//                               saveStatus === "Saved"
//                                 ? "green"
//                                 : saveStatus.startsWith("Error")
//                                 ? "red"
//                                 : "inherit",
//                           }}
//                         >
//                           {saveStatus}
//                         </span>
//                       )}
//                     </>
//                   ),
//                 }}
//               />
//               <Workspace store={store} />
//               <ZoomButtons store={store} />
//               <PagesTimeline store={store} />
//             </WorkspaceWrap>
//           </PolotnoContainer>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Editor;


//----------------------------------------------------------

// ekdm new code-----------------------------

// import React, { useState, useEffect } from "react";
// import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
// import { Workspace } from "polotno/canvas/workspace";
// import { SidePanel } from "polotno/side-panel";
// import { Toolbar } from "polotno/toolbar/toolbar";
// import { PagesTimeline } from "polotno/pages-timeline";
// import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
// import { createStore } from "polotno/model/store";
// import { DEFAULT_SECTIONS } from "polotno/side-panel";
// import { useParams } from "react-router-dom";
// import { IP } from "../../../utils/Constent";
// import ActionControls from "./ActionControls";
// import { TemplatesSection } from "./TemplateSection";
// import CustomElements from "./ElementsPanel";
// import { UploadSection } from "./UploadSection";
// import { FontsTab } from "./FontsSection";

// // Create store instance
// const store = createStore({
//   key: "nFA5H9elEytDyPyvKL7T",
//   showCredit: true,
// });

// const sections = [
//   TemplatesSection,
//   CustomElements,
//   UploadSection,
//   FontsTab,
//   ...DEFAULT_SECTIONS.filter(
//     (section) => section.name !== "templates" && section.name !== "upload"
//   ),
// ];

// function Editor() {
//   const { id } = useParams();
//   const [initialLoad, setInitialLoad] = useState(true);

//   // Load template
//   useEffect(() => {
//     if (!id || !initialLoad) return;

//     const loadTemplate = async () => {
//       try {
//         const res = await fetch(`${IP}/api/v1/templates/${id}/json`);
//         const json = await res.json();
        
//         // Prepare images
//         if (json.objects) {
//           json.objects.forEach(obj => {
//             if (obj.type === "image") obj.crossOrigin = "anonymous";
//           });
//         }

//         store.clear();
//         store.loadJSON(json);
//         setInitialLoad(false);
//       } catch (err) {
//         console.error("Error loading template:", err);
//       }
//     };

//     loadTemplate();
//   }, [id, initialLoad]);

//   // Save changes when unmounting
//   // useEffect(() => {
//   //   let changeDisposer;
//   //   let currentChanges = null;

//   //   // Track changes
//   //   changeDisposer = store.on("change", () => {
//   //     currentChanges = store.toJSON();
//   //   });

//   //   return () => {
//   //     // Clean up listener
//   //     if (changeDisposer) changeDisposer();
      
//   //     // Save changes
//   //     if (currentChanges && id) {
//   //       fetch(`${IP}/api/v1/templates/${id}/json`, {
//   //         method: "PUT",
//   //         headers: { "Content-Type": "application/json" },
//   //         body: JSON.stringify(currentChanges),
//   //       }).catch(err => console.error("Error saving changes:", err));
//   //     }
//   //   };
//   // }, [id]);

//   return (
//     <div className="w-screen h-screen flex flex-col overflow-hidden">
//       <main className="flex-1 relative">
//         <div className="w-full h-[calc(100vh-60px)] absolute top-0 left-0">
//           <PolotnoContainer>
//             <SidePanelWrap>
//               <SidePanel store={store} sections={sections} />
//             </SidePanelWrap>
//             <WorkspaceWrap>
//               <Toolbar
//                 store={store}
//                 components={{
//                   ActionControls: () => <ActionControls store={store} 
//                     templateId={id}
//                       onUpdate={() => {
//                         templateCache.delete(id);
//                         loadTemplate(id);
//                       }}
// />
//                 }}
//               />
//               <Workspace store={store} />
//               <ZoomButtons store={store} />
//               <PagesTimeline store={store} />
//             </WorkspaceWrap>
//           </PolotnoContainer>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Editor;