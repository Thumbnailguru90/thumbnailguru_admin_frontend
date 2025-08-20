import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Tag,
  Popconfirm,
  message,
  Switch,
  Select,
  Pagination,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom"; // Added imports for routing
import { IP } from "../utils/Constent";

export default function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDraft, setIsDraft] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate(); // Added for navigation

  const fetchBlogs = async (page = 1, isDraftFilter = null) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
      };
      if (isDraftFilter !== null) {
        params.isDraft = isDraftFilter;
      }

      const res = await axios.get(`${IP}/api/v1/blogs`, {
        params,
      });

      setBlogs(res.data.data);
      setPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.totalItems);
    } catch (err) {
      console.error(err);
      message.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(page, isDraft);
  }, [page, isDraft]);

  const handleDelete = async (slug) => {
    try {
      await axios.delete(`${IP}/api/v1/blogs/${slug}`);
      message.success("Blog deleted");
      fetchBlogs(page, isDraft);
    } catch (err) {
      console.error(err);
      message.error("Failed to delete blog");
    }
  };

  const handleEdit = (slug) => {
    navigate(`/admin/blog/edit/${slug}`); // Navigate to edit route
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Author",
      dataIndex: "authorName",
      key: "authorName",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => (
        <>
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: "Draft",
      dataIndex: "isDraft",
      key: "isDraft",
      render: (isDraft) =>
        isDraft ? (
          <Tag color="orange">Draft</Tag>
        ) : (
          <Tag color="green">Published</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <div className="flex space-x-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.slug)} // Updated to use handleEdit
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this blog?"
            onConfirm={() => handleDelete(record.slug)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <Link to="/admin/blog">
          {" "}
          {/* Updated to use proper route */}
          <Button type="primary">Create New Blog</Button>
        </Link>
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <Select
          defaultValue="all"
          onChange={(value) =>
            setIsDraft(value === "all" ? null : value === "true")
          }
          options={[
            { value: "all", label: "All" },
            { value: "false", label: "Published" },
            { value: "true", label: "Draft" },
          ]}
          className="w-40"
        />
      </div>

      <Table
        rowKey="slug"
        columns={columns}
        dataSource={blogs}
        loading={loading}
        pagination={false}
      />

      <div className="flex justify-end mt-4">
        <Pagination
          current={page}
          total={totalItems}
          pageSize={10}
          onChange={(newPage) => setPage(newPage)}
        />
      </div>
    </div>
  );
}
