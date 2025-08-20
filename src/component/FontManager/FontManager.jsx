import React, { useEffect, useState } from "react";
import { Modal, Button, List } from "antd";
import { getFonts } from "./fontService";
import { addGlobalFont } from "polotno/config";
import { IP } from "../utils/Constent";

function FontManager() {
  const [fonts, setFonts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    family: "",
    weight: 400,
    style: "normal",
    file: null,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchFonts = async () => {
    try {
      const fontList = await getFonts();
      setFonts(fontList);

      fontList.forEach((font) => {
        addGlobalFont({
          fontFamily: font.family,
          styles: [
            {
              src: `url(${font.url})`,
              fontStyle: font.style,
              fontWeight: font.weight,
            },
          ],
        });
      });
    } catch (err) {
      console.error(err);
      alert("Could not load fonts");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("family", form.family);
      formData.append("weight", form.weight);
      formData.append("style", form.style);
      formData.append("file", form.file);

      const response = await fetch(`${IP}/api/v1/fonts`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload font");
      }

      setForm({
        name: "",
        family: "",
        weight: 400,
        style: "normal",
        file: null,
      });

      setIsModalVisible(false); // Close modal on success
      fetchFonts(); // Refresh list
    } catch (err) {
      console.error(err);
      alert("Error uploading font");
    }
  };

  useEffect(() => {
    fetchFonts();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Font Manager</h2>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add Font
        </Button>
      </div>

      {/* Font List */}
      <List
        bordered
        dataSource={fonts}
        renderItem={(item) => (
          <List.Item>
            <span className="font-semibold">{item.name}</span>{" "}
            <span className="text-sm text-gray-600 ml-2">
              ({item.family}, {item.weight}, {item.style})
            </span>
          </List.Item>
        )}
      />

      {/* Modal for Adding Font */}
      <Modal
        title="Add New Font"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 border rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Family"
            className="w-full p-2 border rounded"
            value={form.family}
            onChange={(e) => setForm({ ...form, family: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Weight"
            className="w-full p-2 border rounded"
            value={form.weight}
            onChange={(e) =>
              setForm({ ...form, weight: parseInt(e.target.value) })
            }
            required
          />
          <input
            type="text"
            placeholder="Style"
            className="w-full p-2 border rounded"
            value={form.style}
            onChange={(e) => setForm({ ...form, style: e.target.value })}
            required
          />
          <input
            type="file"
            accept=".ttf,.otf,.woff,.woff2"
            className="w-full p-2 border rounded"
            onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default FontManager;
