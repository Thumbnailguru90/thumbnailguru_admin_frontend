import React, { useEffect, useState } from "react";
import { Card, Spin, message, Select, Popconfirm, Button } from "antd";
import axios from "axios";
import { IP } from "../utils/Constent";
import { DeleteOutlined } from "@ant-design/icons";

const { Meta } = Card;
const { Option } = Select;

const BackgroundList = () => {
  const [backgrounds, setBackgrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchBackgrounds();
  }, [filterType]);

  const fetchBackgrounds = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userID");
      const res = await axios.get(`${IP}/api/v1/backgrounds`, {
        params: { userId: userId },
      });
      const filtered =
        filterType === "all"
          ? res.data
          : res.data.filter((bg) => bg.type === filterType);
      setBackgrounds(filtered);
    } catch (err) {
      console.error(err);
      message.error("Failed to load backgrounds");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${IP}/api/v1/backgrounds/${id}`);
      message.success("Background deleted");
      // Remove the deleted background from state
      setBackgrounds((prev) => prev.filter((bg) => bg._id !== id));
    } catch (err) {
      console.error(err);
      message.error("Failed to delete background");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Backgrounds</h1>
        <Select value={filterType} onChange={setFilterType} className="w-40">
          <Option value="all">All</Option>
          <Option value="photo">Photo</Option>
          <Option value="pattern">Pattern</Option>
          <Option value="gradient">Gradient</Option>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {backgrounds.map((bg) => (
            <Card
              key={bg._id}
              hoverable
              cover={
                <img
                  alt={bg.name}
                  src={bg.imageUrl}
                  className="h-48 object-cover"
                />
              }
              actions={[
                <Popconfirm
                  title="Are you sure you want to delete this background?"
                  onConfirm={() => handleDelete(bg._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger type="text" icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>,
              ]}
            >
              <Meta title={bg.name} description={bg.type} />
              {bg.tags && bg.tags.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  Tags: {bg.tags.join(", ")}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BackgroundList;
