// DraftContext.js
import { createContext, useContext, useState } from "react";

const DraftContext = createContext();

export function DraftProvider({ children }) {
  const [activeDraftId, setActiveDraftId] = useState(
    localStorage.getItem("draftId")
  );
  const [hasChanges, setHasChanges] = useState(false);

  const value = {
    activeDraftId,
    setActiveDraftId,
    hasChanges,
    setHasChanges,
  };

  return (
    <DraftContext.Provider value={value}>{children}</DraftContext.Provider>
  );
}

export function useDraft() {
  return useContext(DraftContext);
}
