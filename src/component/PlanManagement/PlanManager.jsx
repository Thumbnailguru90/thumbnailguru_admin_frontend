import React, { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, message, Tag, Badge } from "antd";
import { getPlans, createPlan, updatePlan, deletePlan } from "./planApi";
import PlanForm from "./PlanForm";

const PlanManager = () => {
  const [plans, setPlans] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  const loadPlans = async () => {
    const res = await getPlans();
    setPlans(res.data);
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (editing) {
        await updatePlan(editing._id, values);
        message.success("Plan updated successfully");
      } else {
        await createPlan(values);
        message.success("Plan created successfully");
      }
      setFormVisible(false);
      setEditing(null);
      loadPlans();
    } catch (err) {
      message.error(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePlan(id);
      message.success("Plan deleted successfully");
      loadPlans();
    } catch (err) {
      message.error(err.response?.data?.error || "Failed to delete plan");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Offer Price",
      dataIndex: "offerPrice",
      render: (offerPrice) => (offerPrice ? `$${offerPrice.toFixed(2)}` : "-"),
    },
    {
      title: "Credits",
      dataIndex: "planCredit",
      render: (credit) => (
        <Badge count={credit} style={{ backgroundColor: "#52c41a" }} />
      ),
    },
    {
      title: "Features",
      dataIndex: "features",
      render: (features) => (
        <>
          {features?.map((f, idx) => (
            <Tag key={idx} color="blue">
              {f}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditing(record);
              setFormVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this plan?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="text">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            setEditing(null);
            setFormVisible(true);
          }}
        >
          Add New Plan
        </Button>
      </Space>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={plans}
        bordered
        pagination={{ pageSize: 8 }}
      />

      <PlanForm
        visible={formVisible}
        onCancel={() => {
          setFormVisible(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        plan={editing}
      />
    </div>
  );
};

export default PlanManager;
