// src/components/FontManager/fontService.js

import { IP } from "../utils/Constent";

export const getFonts = async () => {
  const res = await fetch(`${IP}/api/v1/fonts`);
  if (!res.ok) throw new Error("Failed to load fonts");
  return res.json();
};

export const createFont = async (fontData) => {
  const res = await fetch(`${IP}/api/v1/fonts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fontData),
  });

  if (!res.ok) throw new Error("Failed to create font");
  return res.json();
};
