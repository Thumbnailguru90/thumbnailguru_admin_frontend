import { IP } from "../../../utils/Constent";

export const fetchCategories = async () => {
  const res = await fetch(`${IP}/api/v1/get/categories`);
  return res.json();
};

export const fetchTemplate = async (templateId) => {
  const res = await fetch(`${IP}/api/v1/templates/${templateId}`);
  return res.json();
};

export const saveTemplate = async (templateId, payload) => {
  const url = templateId
    ? `${IP}/api/v1/update/templates/${templateId}`
    : `${IP}/api/v1/create/template`;

  const method = templateId ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};
