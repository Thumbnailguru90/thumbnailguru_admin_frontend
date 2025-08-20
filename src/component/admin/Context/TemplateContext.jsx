import { createContext, useContext, useState } from "react";
import { IP } from "../../utils/Constent";

export const TemplateContext = createContext();

export const TemplateProvider = ({ children }) => {
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTemplate = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const [templateRes, jsonRes] = await Promise.all([
        fetch(`${IP}/api/v1/templates/${id}`),
        fetch(`${IP}/api/v1/templates/${id}/json`),
      ]);

      if (!templateRes.ok || !jsonRes.ok) {
        throw new Error("Failed to fetch template");
      }

      const [template, json] = await Promise.all([
        templateRes.json(),
        jsonRes.json(),
      ]);

      // Process objects
      if (json.objects) {
        for (let i = 0; i < json.objects.length; i++) {
          if (json.objects[i].type === "image") {
            json.objects[i].crossOrigin = "anonymous";
          }
        }
      }

      setCurrentTemplate({ ...template, json });
      return json;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTemplate = async (id, updates) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${IP}/api/v1/update/templates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        throw new Error("Failed to update template");
      }

      // Reload the updated template
      return await loadTemplate(id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TemplateContext.Provider
      value={{
        currentTemplate,
        isLoading,
        error,
        loadTemplate,
        updateTemplate,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

// Custom hook to use the template context
export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error("useTemplate must be used within a TemplateProvider");
  }
  return context;
};
