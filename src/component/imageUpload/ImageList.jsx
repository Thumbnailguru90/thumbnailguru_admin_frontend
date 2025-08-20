import React, { useEffect, useState } from "react";
import { Card, Select, Spin, message, Popconfirm, Button } from "antd";
import axios from "axios";
import { IP } from "../utils/Constent";
import { DeleteOutlined } from "@ant-design/icons";

const { Meta } = Card;
const { Option } = Select;

const ImageList = () => {
  const [images, setImages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userID");
      const res = await axios.get(`${IP}/api/v1/images`, {
        params: { userId: userId },
      });
      setImages(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    if (value === "all") {
      setFiltered(images);
    } else {
      setFiltered(images.filter((img) => img.category === value));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${IP}/api/v1/images/${id}`);
      message.success("Image deleted");
      fetchImages();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete image");
    }
  };

  const categoryOptions = [...new Set(images.map((img) => img.category))].map(
    (cat) => ({ label: cat, value: cat })
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">My Images</h2>
        <Select
          value={category}
          onChange={handleCategoryChange}
          className="w-40"
        >
          <Option value="all">All</Option>
          {categoryOptions.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((img) => (
            <Card
              key={img._id}
              hoverable
              cover={
                <img
                  alt={img.name}
                  src={img.imageUrl}
                  className="h-48 object-cover"
                />
              }
              actions={[
                <Popconfirm
                  title="Are you sure you want to delete this image?"
                  onConfirm={() => handleDelete(img._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>,
              ]}
            >
              <Meta title={img.name} description={img.category} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageList;
