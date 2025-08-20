// import { useState, useRef, useEffect, useCallback } from "react";
// import debounce from "lodash.debounce";
// import { useLocation } from "react-router-dom";
// import { useDraft } from "../../Context/DraftProvider";

// export function useDraftEditorState(storeRef) {
//   const { saveDraft, getDrafts } = useDraft();
//   const location = useLocation();

//   const [draftName, setDraftName] = useState("");
//   const [currentDraftId, setCurrentDraftId] = useState(null);
//   const [lastSaved, setLastSaved] = useState(null);
//   const [isSaving, setIsSaving] = useState(false);
//   const [ready, setReady] = useState(false);

//   const lastSavedJSON = useRef(null);
//   const hasChanges = useRef(false);

//   const generateTemplateName = useCallback(() => {
//     const now = new Date();
//     return `Draft ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
//   }, []);

//   // Load draft on mount
//   useEffect(() => {
//     const loadUserDraft = async () => {
//       try {
//         const userId = localStorage.getItem("userID");
//         if (!userId) return;

//         // 1. Load passed-in draft
//         if (location.state?.draftToEdit) {
//           const draft = location.state.draftToEdit;
//           const response = await fetch(`${draft.jsonUrl}?t=${Date.now()}`);
//           const json = await response.json();

//           await storeRef.current.loadJSON(json);
//           lastSavedJSON.current = json;
//           setDraftName(draft.name);
//           setCurrentDraftId(draft.templateId);
//           setReady(true);
//           return;
//         }

//         // 2. Load latest user's draft
//         const drafts = await getDrafts();
//         const userDrafts = drafts.filter((d) => d.user === userId);
//         const latest = userDrafts.sort(
//           (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
//         )[0];

//         if (latest) {
//           const response = await fetch(`${latest.jsonUrl}?t=${Date.now()}`);
//           const json = await response.json();

//           await storeRef.current.loadJSON(json);
//           lastSavedJSON.current = json;
//           setDraftName(latest.name);
//           setCurrentDraftId(latest.templateId);
//         } else {
//           // No drafts found — create a new one
//           const newName = generateTemplateName();
//           setDraftName(newName);

//           const json = storeRef.current.toJSON();
//           const preview = await storeRef.current.toDataURL({ pixelRatio: 0.2 });

//           const draftData = {
//             name: newName,
//             json,
//             previewBase64: preview,
//             width: storeRef.current.width,
//             height: storeRef.current.height,
//             userId,
//           };

//           const result = await saveDraft(draftData);

//           if (result?.data?.templateId) {
//             setCurrentDraftId(result.data.templateId);
//             lastSavedJSON.current = json;
//           }
//         }
//       } catch (e) {
//         console.error("Failed to load or create draft:", e);
//       } finally {
//         setReady(true);
//       }
//     };

//     loadUserDraft();
//   }, [getDrafts, location.state, storeRef, saveDraft, generateTemplateName]);

//   const saveCurrentDraft = useCallback(async () => {
//     if (isSaving || !ready) return;

//     setIsSaving(true);

//     try {
//       const userId = localStorage.getItem("userID");
//       if (!userId) throw new Error("User not authenticated");

//       const json = storeRef.current.toJSON();

//       // Only save if changed
//       if (
//         lastSavedJSON.current &&
//         JSON.stringify(json) === JSON.stringify(lastSavedJSON.current)
//       ) {
//         return;
//       }

//       const preview = await storeRef.current.toDataURL({ pixelRatio: 0.2 });

//       const draftData = {
//         name: draftName || generateTemplateName(),
//         json,
//         previewBase64: preview,
//         width: storeRef.current.width,
//         height: storeRef.current.height,
//         userId,
//         id: currentDraftId,
//       };

//       const result = await saveDraft(draftData);

//       if (!currentDraftId && result?.data?.templateId) {
//         setCurrentDraftId(result.data.templateId);
//       }

//       lastSavedJSON.current = json;
//       hasChanges.current = false;
//       setLastSaved(new Date());

//       return result;
//     } catch (err) {
//       console.error("Error saving draft:", err);
//       throw err;
//     } finally {
//       setIsSaving(false);
//     }
//   }, [
//     isSaving,
//     ready,
//     saveDraft,
//     draftName,
//     generateTemplateName,
//     storeRef,
//     currentDraftId,
//   ]);

//   const autoSaveDraft = useCallback(debounce(saveCurrentDraft, 5000), [
//     saveCurrentDraft,
//   ]);

//   useEffect(() => {
//     if (!ready) return;

//     const unsubscribe = storeRef.current.on("change", () => {
//       hasChanges.current = true;
//       autoSaveDraft();
//     });

//     return () => {
//       unsubscribe();
//       autoSaveDraft.flush();
//     };
//   }, [autoSaveDraft, ready, storeRef]);

//   const getStatusMessage = () => {
//     if (isSaving) return "Saving...";
//     if (lastSaved) return `Last saved: ${lastSaved.toLocaleTimeString()}`;
//     return "Changes will be auto-saved";
//   };

//   const clearDraft = () => {
//     const store = storeRef.current;
//     store.clear(); // cleanly resets the editor
//     store.addPage(); // optional: add a fresh blank page
//     setDraftName("");
//     setCurrentDraftId(null);
//     lastSavedJSON.current = store.toJSON();
//     setLastSaved(null);
//   };

//   return {
//     draftName,
//     setDraftName,
//     currentDraftId,
//     getStatusMessage,
//     saveCurrentDraft,
//     clearDraft,
//   };
// }

import { useState, useRef, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import { useLocation } from "react-router-dom";
import { useDraft } from "../../Context/DraftProvider";

export function useDraftEditorState(storeRef) {
  const { saveDraft, getDrafts } = useDraft();
  const location = useLocation();

  const [draftName, setDraftName] = useState("");
  const [currentDraftId, setCurrentDraftId] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [ready, setReady] = useState(false);

  const lastSavedJSON = useRef(null);
  const hasChanges = useRef(false);

  const generateTemplateName = useCallback(() => {
    const now = new Date();
    return `Draft ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  }, []);

  // Load draft on mount
  useEffect(() => {
    const loadUserDraft = async () => {
      try {
        const userId = localStorage.getItem("userID");
        if (!userId) return;

        // 1. Load passed-in draft
        if (location.state?.draftToEdit) {
          const draft = location.state.draftToEdit;
          const response = await fetch(`${draft.jsonUrl}?t=${Date.now()}`);
          const json = await response.json();

          await storeRef.current.loadJSON(json);
          lastSavedJSON.current = json;
          setDraftName(draft.name);
          setCurrentDraftId(draft.templateId);
          setReady(true);
          return;
        }

        // 2. Load latest user's draft
        const drafts = await getDrafts();
        const userDrafts = drafts.filter((d) => d.user === userId);
        const latest = userDrafts.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        )[0];

        if (latest) {
          const response = await fetch(`${latest.jsonUrl}?t=${Date.now()}`);
          const json = await response.json();

          await storeRef.current.loadJSON(json);
          lastSavedJSON.current = json;
          setDraftName(latest.name);
          setCurrentDraftId(latest.templateId);
        } else {
          // No drafts found — create a new one
          const newName = generateTemplateName();
          setDraftName(newName);

          const json = storeRef.current.toJSON();
          const preview = await storeRef.current.toDataURL({ pixelRatio: 0.2 });

          const draftData = {
            name: newName,
            json,
            previewBase64: preview,
            width: storeRef.current.width,
            height: storeRef.current.height,
            userId,
          };

          const result = await saveDraft(draftData);

          if (result?.data?.templateId) {
            setCurrentDraftId(result.data.templateId);
            lastSavedJSON.current = json;
          }
        }
      } catch (e) {
        console.error("Failed to load or create draft:", e);
      } finally {
        setReady(true);
      }
    };

    loadUserDraft();
  }, [getDrafts, location.state, storeRef, saveDraft, generateTemplateName]);

  const saveCurrentDraft = useCallback(async () => {
    if (isSaving || !ready) return;

    setIsSaving(true);

    try {
      const userId = localStorage.getItem("userID");
      if (!userId) throw new Error("User not authenticated");

      const json = storeRef.current.toJSON();

      // Only save if changed
      if (
        lastSavedJSON.current &&
        JSON.stringify(json) === JSON.stringify(lastSavedJSON.current)
      ) {
        return;
      }

      const preview = await storeRef.current.toDataURL({ pixelRatio: 0.2 });

      const draftData = {
        name: draftName || generateTemplateName(),
        json,
        previewBase64: preview,
        width: storeRef.current.width,
        height: storeRef.current.height,
        userId,
        id: currentDraftId,
      };

      const result = await saveDraft(draftData);

      if (!currentDraftId && result?.data?.templateId) {
        setCurrentDraftId(result.data.templateId);
      }

      lastSavedJSON.current = json;
      hasChanges.current = false;
      setLastSaved(new Date());

      return result;
    } catch (err) {
      console.error("Error saving draft:", err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [
    isSaving,
    ready,
    saveDraft,
    draftName,
    generateTemplateName,
    storeRef,
    currentDraftId,
  ]);

  const autoSaveDraft = useCallback(debounce(saveCurrentDraft, 5000), [
    saveCurrentDraft,
  ]);

  useEffect(() => {
    if (!ready) return;

    const unsubscribe = storeRef.current.on("change", () => {
      hasChanges.current = true;
      autoSaveDraft();
    });

    return () => {
      unsubscribe();
      autoSaveDraft.flush();
    };
  }, [autoSaveDraft, ready, storeRef]);

  const getStatusInfo = () => {
    return {
      // message:"Saving...",
      //   ? "Saving..."
      //   : lastSaved
      //   ? `Last saved: ${lastSaved.toLocaleTimeString()}`
      //   : "Changes will be auto-saved",
      showIcon: isSaving,
    };
  };

  const clearDraft = () => {
    const store = storeRef.current;
    store.clear(); // cleanly resets the editor
    store.addPage(); // optional: add a fresh blank page
    setDraftName("");
    setCurrentDraftId(null);
    lastSavedJSON.current = store.toJSON();
    setLastSaved(null);
  };

  return {
    draftName,
    setDraftName,
    currentDraftId,
    getStatusInfo, // Changed from getStatusMessage to getStatusInfo
    saveCurrentDraft,
    clearDraft,
    isSaving, // Expose isSaving state in case you need it elsewhere
  };
}
