import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { SectionTab } from "polotno/side-panel";
import { useDraft } from "../../Context/DraftProvider";
import { useNavigate } from "react-router-dom";
const DraftsSection = observer(({ store }) => {
  const { getDrafts, deleteDraft } = useDraft();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDrafts() {
      setLoading(true);
      const data = await getDrafts();
      setDrafts(data);
      setLoading(false);
    }
    fetchDrafts();
  }, [getDrafts]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this draft?")) return;
    const res = await deleteDraft(id);
    if (res.success) {
      setDrafts((prev) => prev.filter((d) => d._id !== id));
    } else {
      alert(`Delete failed: ${res.message}`);
    }
  };

  const handleDraftSelect = async (draft) => {
    try {
      const response = await fetch(draft.jsonUrl);
      if (!response.ok) throw new Error("Failed to fetch draft JSON");

      const json = await response.json();

      if (json.objects) {
        json.objects = json.objects.map((obj) => {
          if (obj.type === "image") {
            return { ...obj, crossOrigin: "anonymous" };
          }
          return obj;
        });
      }

      store.clear(); // ⬅️ clear previous canvas content
      await store.loadJSON(json);
    } catch (error) {
      console.error("Error loading draft:", error);
      alert(`Failed to load draft: ${error.message}`);
    }
  };

  if (loading) return <p style={{ padding: 10 }}>Loading drafts...</p>;
  if (drafts.length === 0)
    return <p style={{ padding: 10 }}>No drafts available.</p>;

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: 10 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(1, 1fr)",
          gap: "10px",
        }}
      >
        {drafts.map((draft) => (
          <div
            key={draft._id || draft.templateId}
            style={{
              border: "1px solid #ccc",
              borderRadius: 6,
              padding: 10,
              position: "relative",
              cursor: "pointer",
            }}
            title={`Last updated: ${new Date(
              draft.updatedAt
            ).toLocaleString()}`}
            onClick={() => handleDraftSelect(draft)}
          >
            <img
              src={draft.previewUrl}
              alt={draft.name}
              style={{
                width: "100%",
                maxHeight: 150,
                objectFit: "cover",
                borderRadius: 4,
                marginBottom: 8,
              }}
            />
            <div style={{ fontWeight: "bold", fontSize: 14, marginBottom: 4 }}>
              {draft.name}
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {draft.width} × {draft.height}
            </div>
            <button
              onClick={(e) => handleDelete(draft._id || draft.templateId, e)}
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                background: "red",
                color: "white",
                border: "none",
                borderRadius: 4,
                padding: "2px 6px",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

export const DraftsTab = {
  name: "drafts",
  Tab: (props) => (
    <SectionTab name="Drafts" {...props}>
      <div className="flex flex-col items-center space-y-1">📝</div>
    </SectionTab>
  ),
  Panel: DraftsSection,
};
