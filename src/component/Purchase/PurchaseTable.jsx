import React, { useEffect, useState } from "react";
import { Table, Tag, Typography, message, Spin } from "antd";
import axios from "axios";
import moment from "moment";
import { IP } from "../utils/Constent";

const { Title } = Typography;

const PurchaseTable = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = `${IP}/api/v1/get-all/purchases`;

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setPurchases(res.data.purchases);
    } catch (error) {
      message.error("Failed to load purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

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
        <Tag color={status === "completed" ? "green" : "red"}>
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
      <Title level={3}>All Purchases</Title>
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

export default PurchaseTable;
