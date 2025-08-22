import { useEffect, useState } from "react";
import { Card, Button, Spin, message } from "antd";
import { IP } from "../utils/Constent";

const { Meta } = Card;

const SoftDeletedTemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch soft-deleted templates
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${IP}/api/v1/template/soft-deleted`);
      const data = await res.json();
      if (res.ok) {
        setTemplates(data.templates || []);
      } else {
        message.error(data.message || "Failed to fetch templates");
      }
    } catch (error) {
      message.error("Error fetching templates");
    } finally {
      setLoading(false);
    }
  };

  // Restore a template
  const restoreTemplate = async (id) => {
    try {
      const res = await fetch(`${IP}/api/v1/template/restore/${id}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (res.ok) {
        message.success("Template restored successfully");
        setTemplates((prev) => prev.filter((t) => t._id !== id));
      } else {
        message.error(data.message || "Failed to restore template");
      }
    } catch (error) {
      message.error("Error restoring template");
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Spin size="large" />
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <p className="text-center text-gray-500 py-6">
        No soft deleted templates found.
      </p>
    );
  }

  return (
    <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <Card
          key={template._id}
          hoverable
          cover={
            <img
              alt={template.name}
              src={template.previewPath}
              className="h-48 w-full object-cover"
            />
          }
          actions={[
            <Button
              type="primary"
              onClick={() => restoreTemplate(template._id)}
            >
              Restore
            </Button>,
          ]}
        >
          <Meta
            title={template.name}
            description={
              <>
                <p>
                  <strong>Category:</strong>{" "}
                  {template?.category?.categoryName || "N/A"}
                </p>
                <p>
                  <strong>Deleted:</strong>{" "}
                  {new Date(template.updatedAt).toLocaleDateString()}
                </p>
              </>
            }
          />
        </Card>
      ))}
    </div>
  );
};

export default SoftDeletedTemplatesPage;
