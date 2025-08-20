import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Select,
  Space,
  Typography,
  Tag,
  Switch,
  message,
  Button,
  Modal,
  Form,
  InputNumber,
} from "antd";
import { fetchUsers, updateUser, updateCredit } from "./userApi";

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("createdAt");

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [form] = Form.useForm();

  const loadUsers = async (
    page = pagination.current,
    pageSize = pagination.pageSize,
    searchValue = search,
    sortField = sortBy,
    sortDir = sortOrder
  ) => {
    setLoading(true);
    try {
      const data = await fetchUsers(
        page,
        pageSize,
        searchValue,
        sortField,
        sortDir
      );
      setUsers(data.data);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: data.pagination.totalUsers,
      });
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (userId, checked) => {
    try {
      await updateUser(userId, { isActive: checked });
      message.success(`User ${checked ? "activated" : "deactivated"}`);
      loadUsers();
    } catch {
      message.error("Failed to update status");
    }
  };

  const handleCreditUpdate = async (values) => {
    try {
      await updateCredit(selectedUser._id, values.creditChange);
      message.success("Credit updated successfully");
      setIsModalVisible(false);
      form.resetFields();
      loadUsers();
    } catch (error) {
      message.error("Failed to update credit");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleTableChange = (pag, _filters, sorter) => {
    const order = sorter.order === "ascend" ? "asc" : "desc";
    const field = sorter.field || "createdAt";

    setSortOrder(order);
    setSortBy(field);

    loadUsers(pag.current, pag.pageSize, search, field, order);
  };

  const handleSearch = (value) => {
    setSearch(value);
    loadUsers(1, pagination.pageSize, value, sortBy, sortOrder);
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      sorter: true,
    },
    {
      title: "Credit",
      dataIndex: "credit",
      key: "credit",
      sorter: true,
      render: (credit) => <Tag color="blue">{credit}</Tag>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (val) => (
        <Tag color={val ? "green" : "red"}>{val ? "Active" : "Inactive"}</Tag>
      ),
    },
    {
      title: "Toggle Active",
      key: "toggle",
      render: (_, record) => (
        <Switch
          checked={record.isActive}
          onChange={(checked) => handleToggle(record._id, checked)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            setSelectedUser(record);
            setIsModalVisible(true);
          }}
        >
          Update Credit
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={3}>User Management</Title>

      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search by name, email, or number"
          onSearch={handleSearch}
          enterButton
          allowClear
          style={{ width: 300 }}
        />
        <Select
          value={sortOrder}
          onChange={(value) => {
            setSortOrder(value);
            loadUsers(
              pagination.current,
              pagination.pageSize,
              search,
              sortBy,
              value
            );
          }}
        >
          <Option value="asc">Sort: Ascending</Option>
          <Option value="desc">Sort: Descending</Option>
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />

      {/* Modal for Credit Update */}
      <Modal
        title={`Update Credit for ${selectedUser?.userName}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreditUpdate}>
          <Form.Item
            label="Credit Change"
            name="creditChange"
            rules={[{ required: true, message: "Please enter credit amount" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Update Credit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UserManagement;






// // src/components/UserManagement.jsx
// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Input,
//   Select,
//   Space,
//   Typography,
//   Tag,
//   Switch,
//   message,
// } from "antd";
// import { fetchUsers, updateUser } from "./userApi";
// // import { fetchUsers } from "../api/userApi";

// const { Search } = Input;
// const { Option } = Select;
// const { Title } = Typography;

// function UserManagement() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10,
//     total: 0,
//   });
//   const [search, setSearch] = useState("");
//   const [sortOrder, setSortOrder] = useState("desc");
//   const [sortBy, setSortBy] = useState("createdAt");

//   const loadUsers = async (
//     page = pagination.current,
//     pageSize = pagination.pageSize,
//     searchValue = search,
//     sortField = sortBy,
//     sortDir = sortOrder
//   ) => {
//     setLoading(true);
//     try {
//       const data = await fetchUsers(
//         page,
//         pageSize,
//         searchValue,
//         sortField,
//         sortDir
//       );
//       setUsers(data.data);
//       console.log(data.data);
//       setPagination({
//         current: page,
//         pageSize: pageSize,
//         total: data.pagination.totalUsers,
//       });
//     } catch (error) {
//       console.error("Failed to fetch users:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleToggle = async (userId, checked) => {
//     try {
//       await updateUser(userId, { isActive: checked });
//       message.success(`User ${checked ? "activated" : "deactivated"}`);
//       loadUsers();
//     } catch {
//       message.error("Failed to update status");
//     }
//   };

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const handleTableChange = (pag, _filters, sorter) => {
//     const order = sorter.order === "ascend" ? "asc" : "desc";
//     const field = sorter.field || "createdAt";

//     setSortOrder(order);
//     setSortBy(field);

//     loadUsers(pag.current, pag.pageSize, search, field, order);
//   };

//   const handleSearch = (value) => {
//     setSearch(value);
//     loadUsers(1, pagination.pageSize, value, sortBy, sortOrder);
//   };

//   const columns = [
//     {
//       title: "Username",
//       dataIndex: "userName",
//       key: "userName",
//       sorter: true,
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       key: "email",
//       sorter: true,
//     },
//     {
//       title: "Mobile Number",
//       dataIndex: "mobileNumber",
//       key: "mobileNumber",
//       sorter: true,
//     },
//     {
//       title: "Credit",
//       dataIndex: "credit",
//       key: "credit",
//       sorter: true,
//       render: (credit) => <Tag color="blue">{credit}</Tag>,
//     },
//     {
//       title: "Created At",
//       dataIndex: "createdAt",
//       key: "createdAt",
//       sorter: true,
//       render: (date) => new Date(date).toLocaleString(),
//     },
//     {
//       title: "Status",
//       dataIndex: "isActive",
//       key: "isActive",
//       render: (val) => (
//         <Tag color={val ? "green" : "red"}>{val ? "Active" : "Inactive"}</Tag>
//       ),
//     },
//     {
//       title: "Toggle Active",
//       key: "toggle",
//       render: (_, record) => (
//         <Switch
//           checked={record.isActive}
//           onChange={(checked) => handleToggle(record._id, checked)}
//         />
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: "2rem" }}>
//       <Title level={3}>User Management</Title>

//       <Space style={{ marginBottom: 16 }}>
//         <Search
//           placeholder="Search by name, email, or number"
//           onSearch={handleSearch}
//           enterButton
//           allowClear
//           style={{ width: 300 }}
//         />
//         <Select
//           value={sortOrder}
//           onChange={(value) => {
//             setSortOrder(value);
//             loadUsers(
//               pagination.current,
//               pagination.pageSize,
//               search,
//               sortBy,
//               value
//             );
//           }}
//         >
//           <Option value="asc">Sort: Ascending</Option>
//           <Option value="desc">Sort: Descending</Option>
//         </Select>
//       </Space>

//       <Table
//         columns={columns}
//         dataSource={users}
//         rowKey="_id"
//         loading={loading}
//         pagination={{
//           current: pagination.current,
//           pageSize: pagination.pageSize,
//           total: pagination.total,
//           showSizeChanger: true,
//         }}
//         onChange={handleTableChange}
//       />
//     </div>
//   );
// }

// export default UserManagement;
