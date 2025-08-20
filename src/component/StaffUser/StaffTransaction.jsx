import React, { useEffect, useState } from "react";
import { Table, Tag, Typography, message, Spin, Select } from "antd";
import axios from "axios";
import moment from "moment";
import { IP } from "../utils/Constent";

const { Title } = Typography;
const { Option } = Select;

const StaffTransaction = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const API_URL = `${IP}/api/v1/get-all/purchases`;

  const fetchPurchases = async (status) => {
    setLoading(true);
    try {
      const query = status && status !== "all" ? `?paymentStatus=${status}` : "";
      const res = await axios.get(`${API_URL}${query}`);
      setPurchases(res.data.purchases);
    } catch (error) {
      message.error("Failed to load purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases(statusFilter);
  }, [statusFilter]);

  const handleFilterChange = (value) => {
    setStatusFilter(value);
  };

  const columns = [
    {
      title: "User",
      dataIndex: ["userId", "name"],
      key: "user",
      render: (text, record) => (
        <div className="whitespace-nowrap">
          <div>{record.userId?.name}</div>
          <div style={{ fontSize: "12px", color: "#888" }}>
            {record.userId?.email}
          </div>
        </div>
      ),
    },
    {
      title: "Plan",
      dataIndex: ["planId", "name"],
      key: "plan",
      render: (text, record) => (
        <div className="whitespace-nowrap">
          <strong>{record.planId?.name}</strong>
          <div style={{ fontSize: "12px", color: "#888" }}>
            ₹{record.amountPaid}
          </div>
        </div>
      ),
    },
    {
      title: "Credits",
      dataIndex: "creditsEarned",
      key: "creditsEarned",
      className: "whitespace-nowrap",
    },
    {
      title: "Payment ID",
      dataIndex: "paymentId",
      key: "paymentId",
      className: "whitespace-nowrap",
    },
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      className: "whitespace-nowrap",
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <Tag color={status === "completed" ? "green" : status === "pending" ? "orange" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
      className: "whitespace-nowrap",
    },
    {
      title: "Expiry",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date) => moment(date).format("YYYY-MM-DD"),
      className: "whitespace-nowrap",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("YYYY-MM-DD HH:mm"),
      className: "whitespace-nowrap",
    },
  ];

  return (
    <div style={{ padding: "24px", overflowX: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Title level={3}>All Purchases</Title>
        <Select
          value={statusFilter}
          onChange={handleFilterChange}
          style={{ width: 180 }}
        >
          <Option value="all">All Statuses</Option>
          <Option value="pending">Pending</Option>
          <Option value="completed">Completed</Option>
          <Option value="failed">Failed</Option>
        </Select>
      </div>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={purchases}
          bordered
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
      )}
    </div>
  );
};

export default StaffTransaction;
