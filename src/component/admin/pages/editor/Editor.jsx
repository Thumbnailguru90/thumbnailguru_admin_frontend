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
// import { useLocation } from "react-router-dom";

// // Create store instance
// const store = createStore({
//   key: "nFA5H9elEytDyPyvKL7T",
//   showCredit: true,
// });
// // ✅ 2) SET ADMIN ROLE
// store.setRole("admin"); // <<< THIS ENABLES ADMIN MODE
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
//   const currentTemplateId = useRef(null);
//   const saveDebounceTimer = useRef(null);
//   const loadIdRef = useRef(0); // ✅ Add this here

//   const { id } = useParams();
//   const [isLoading, setIsLoading] = useState(false);
//   const [saveStatus, setSaveStatus] = useState("");
//   const lastSavedJSON = useRef(null);
//   const hasChanges = useRef(false);
//   const saveTimer = useRef(null);
//   const location = useLocation();
//   const getDraftKey = (templateId) => `draft-${templateId}`;

//   // Debounce utility
//   const debounce = (func, delay) => {
//     let timer;
//     return function (...args) {
//       clearTimeout(timer);
//       timer = setTimeout(() => func.apply(this, args), delay);
//     };
//   };

//   const clearAllDrafts = () => {
//     Object.keys(localStorage).forEach((key) => {
//       if (key.startsWith("draft-")) {
//         localStorage.removeItem(key);
//       }
//     });
//   };

//   // Save to localStorage
//   const saveToLocal = useCallback(() => {
//     if (!id) return;
//     if (id !== currentTemplateId.current) return;

//     const json = store.toJSON();
//     localStorage.setItem(getDraftKey(id), JSON.stringify(json));
//     hasChanges.current = true;
//   }, [id]);

//   const debouncedSaveToLocal = useCallback(() => {
//     clearTimeout(saveDebounceTimer.current);
//     saveDebounceTimer.current = setTimeout(() => {
//       saveToLocal();
//     }, 1000);
//   }, [saveToLocal]);

//   // Sync to server
//   const syncToServer = useCallback(async () => {
//     if (!id || !hasChanges.current) return;

//     const local = localStorage.getItem(getDraftKey(id));
//     if (!local) return;

//     try {
//       const json = JSON.parse(local);

//       if (
//         lastSavedJSON.current &&
//         JSON.stringify(json) === JSON.stringify(lastSavedJSON.current)
//       ) {
//         return;
//       }

//       setSaveStatus("Syncing...");

//       const res = await fetch(`${IP}/api/v1/templates/${id}/json`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(json),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to sync with server");
//       }

//       lastSavedJSON.current = json;
//       hasChanges.current = false;
//       localStorage.removeItem(getDraftKey(id));
//       setSaveStatus("Synced");
//       setTimeout(() => setSaveStatus(""), 2000);
//     } catch (err) {
//       console.error("Server sync failed:", err);
//       setSaveStatus("Sync failed");
//     }
//   }, [id]);

//   useEffect(() => {
//     // If switching to a new template, clear old draft immediately
//     const lastId = currentTemplateId.current;

//     if (lastId && lastId !== id) {
//       localStorage.removeItem(getDraftKey(lastId));
//       templateCache.delete(lastId);
//       console.log(`Cleared draft/cache for previous template ${lastId}`);
//     }

//     // Store the new ID as current
//     currentTemplateId.current = id;
//   }, [id]);

//   // Load template
//   const loadTemplate = useCallback(async (templateId) => {
//     const currentLoadId = ++loadIdRef.current;

//     clearAllDrafts(); // <<< 🔥 Remove all previous drafts

//     setIsLoading(true);
//     currentTemplateId.current = templateId;

//     try {
//       const res = await fetch(`${IP}/api/v1/templates/${templateId}/json`);
//       if (!res.ok) throw new Error("Fetch failed");

//       const json = await res.json();

//       json.objects = (json.objects || []).map((obj) =>
//         obj.type === "image" ? { ...obj, crossOrigin: "anonymous" } : obj
//       );

//       if (loadIdRef.current !== currentLoadId) return;

//       store.clear();
//       store.loadJSON(json);
//       templateCache.set(templateId, json);
//       lastSavedJSON.current = json;
//     } catch (err) {
//       console.error("Template load error:", err);
//       setSaveStatus("Load failed");
//     } finally {
//       if (loadIdRef.current === currentLoadId) {
//         setIsLoading(false);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     clearAllDrafts();
//   }, [id]);

//   // Handle template updates
//   useEffect(() => {
//     if (id) loadTemplate(id);
//   }, [id, loadTemplate]);

//   // Track store changes
//   useEffect(() => {
//     if (!id) return;
//     // inside store.on change effect
//     const disposer = store.on("change", () => {
//       debouncedSaveToLocal();
//     });

//     return () => disposer();
//   }, [id, saveToLocal]);

//   // Sync to server every 30s
//   useEffect(() => {
//     if (!id) return;
//     saveTimer.current = setInterval(syncToServer, 30000);
//     return () => clearInterval(saveTimer.current);
//   }, [id, syncToServer]);

//   useEffect(() => {
//     return () => {
//       const lastId = currentTemplateId.current;
//       syncToServer().then(() => {
//         if (lastId) {
//           localStorage.removeItem(getDraftKey(lastId));
//           templateCache.delete(lastId);
//           console.log(`Cleared draft and cache for template ${lastId}`);
//         }
//       });
//     };
//   }, []);

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
//                       onUpdate={() => {
//                         templateCache.delete(id);
//                         loadTemplate(id);
//                       }}
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
import React, { useState, useEffect, useCallback, useRef } from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Workspace } from "polotno/canvas/workspace";
import { SidePanel } from "polotno/side-panel";
import { Toolbar } from "polotno/toolbar/toolbar";
import { PagesTimeline } from "polotno/pages-timeline";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { createStore } from "polotno/model/store";
import { DEFAULT_SECTIONS } from "polotno/side-panel";
import { TemplatesSection } from "./TemplateSection";
import { useParams } from "react-router-dom";
import { IP } from "../../../utils/Constent";
import ActionControls from "./ActionControls";
import { FontsTab } from "./FontsSection";
import CustomElements from "./ElementsPanel";
import { UploadSection } from "./UploadSection";
import { useLocation } from "react-router-dom";
import { set, get, del, keys } from "idb-keyval";
import { CustomFontSection } from "./CustomFontPanel";
// Create store instance
// const store = createStore({
//   key: "nFA5H9elEytDyPyvKL7T",
//   showCredit: true,
// });

const store = createStore({
  key: "zlYc9V8m2X8Ev8L3wcL5",
  showCredit: false,
});

// ✅ Set admin role
store.setRole("admin");

const templateCache = new Map();
const sections = [
  TemplatesSection,
  CustomElements,
  UploadSection,
  FontsTab,
  CustomFontSection,
  ...DEFAULT_SECTIONS.filter(
    (section) => section.name !== "templates" && section.name !== "upload"
  ),
];

function Editor() {
  const currentTemplateId = useRef(null);
  const saveDebounceTimer = useRef(null);
  const loadIdRef = useRef(0);

  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const lastSavedJSON = useRef(null);
  const hasChanges = useRef(false);
  const saveTimer = useRef(null);

  const getDraftKey = (templateId) => `draft-${templateId}`;

  const saveToIndexedDB = useCallback(async () => {
    if (!id || id !== currentTemplateId.current) return;

    const json = store.toJSON();
    await set(getDraftKey(id), json);
    hasChanges.current = true;
  }, [id]);

  const debouncedSaveToIndexedDB = useCallback(() => {
    clearTimeout(saveDebounceTimer.current);
    saveDebounceTimer.current = setTimeout(() => {
      saveToIndexedDB();
    }, 1000);
  }, [saveToIndexedDB]);

  const clearAllDrafts = async () => {
    const allKeys = await keys();
    await Promise.all(
      allKeys.filter((key) => key.startsWith("draft-")).map((key) => del(key))
    );
  };

  const syncToServer = useCallback(async () => {
    if (!id || !hasChanges.current) return;

    const json = await get(getDraftKey(id));
    if (!json) return;

    try {
      if (
        lastSavedJSON.current &&
        JSON.stringify(json) === JSON.stringify(lastSavedJSON.current)
      ) {
        return;
      }

      setSaveStatus("Syncing...");

      const res = await fetch(`${IP}/api/v1/templates/${id}/json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });

      if (!res.ok) throw new Error("Failed to sync with server");

      lastSavedJSON.current = json;
      hasChanges.current = false;
      await del(getDraftKey(id));
      setSaveStatus("Synced");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (err) {
      console.error("Server sync failed:", err);
      setSaveStatus("Sync failed");
    }
  }, [id]);

  useEffect(() => {
    const lastId = currentTemplateId.current;
    if (lastId && lastId !== id) {
      del(getDraftKey(lastId));
      templateCache.delete(lastId);
      console.log(`Cleared draft/cache for previous template ${lastId}`);
    }
    currentTemplateId.current = id;
  }, [id]);

  const loadTemplate = useCallback(async (templateId) => {
    const currentLoadId = ++loadIdRef.current;

    await clearAllDrafts(); // 🔄 IndexedDB-based

    setIsLoading(true);
    currentTemplateId.current = templateId;

    try {
      const res = await fetch(`${IP}/api/v1/templates/${templateId}/json`);
      if (!res.ok) throw new Error("Fetch failed");

      const json = await res.json();

      json.objects = (json.objects || []).map((obj) =>
        obj.type === "image" ? { ...obj, crossOrigin: "anonymous" } : obj
      );

      if (loadIdRef.current !== currentLoadId) return;

      store.clear();
      store.loadJSON(json);
      templateCache.set(templateId, json);
      lastSavedJSON.current = json;
    } catch (err) {
      console.error("Template load error:", err);
      setSaveStatus("Load failed");
    } finally {
      if (loadIdRef.current === currentLoadId) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    clearAllDrafts();
  }, [id]);

  useEffect(() => {
    if (id) loadTemplate(id);
  }, [id, loadTemplate]);

  useEffect(() => {
    if (!id) return;

    const disposer = store.on("change", () => {
      debouncedSaveToIndexedDB();
    });

    return () => disposer();
  }, [id, debouncedSaveToIndexedDB]);

  useEffect(() => {
    if (!id) return;
    saveTimer.current = setInterval(syncToServer, 30000);
    return () => clearInterval(saveTimer.current);
  }, [id, syncToServer]);

  useEffect(() => {
    return () => {
      const lastId = currentTemplateId.current;
      syncToServer().then(async () => {
        if (lastId) {
          await del(getDraftKey(lastId));
          templateCache.delete(lastId);
          console.log(`Cleared draft and cache for template ${lastId}`);
        }
      });
    };
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-xl">Loading template...</div>
        </div>
      )}

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
                      templateId={id}
                      onUpdate={() => {
                        templateCache.delete(id);
                        loadTemplate(id);
                      }}
                    />
                  ),
                }}
              />
              <Workspace store={store} />
              <ZoomButtons store={store} />
              <PagesTimeline store={store} />
            </WorkspaceWrap>
          </PolotnoContainer>
        </div>

        {saveStatus && (
          <div className="absolute bottom-2 right-2 bg-gray-800 text-white px-4 py-1 rounded text-sm shadow-lg z-50">
            {saveStatus}
          </div>
        )}
      </main>
    </div>
  );
}

export default Editor;
