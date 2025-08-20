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
// import { fetchUsers, updateUser } from "../admin/pages/user/userApi";
// // import { fetchUsers } from "../api/userApi";

// const { Search } = Input;
// const { Option } = Select;
// const { Title } = Typography;

// function StaffUser() {
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
//    {
//   title: "Mobile Number",
//   dataIndex: "mobileNumber",
//   key: "mobileNumber",
//   sorter: true,
//   render: (number) => (
//     <Space direction="vertical">
//       <div>{number}</div>
//       <Space>
//         <a href={`tel:${number}`}>
//           <Tag color="blue">Call</Tag>
//         </a>
//         <a href={`https://wa.me/${number}`} target="_blank" rel="noopener noreferrer">
//           <Tag color="green">WhatsApp</Tag>
//         </a>
//       </Space>
//     </Space>
//   ),
// },

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
    
//   ];

//   return (
//     <div style={{ padding: "2rem" , overflowX: "auto"}}>
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

// export default StaffUser;
// src/components/UserManagement.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Select,
  Space,
  Typography,
  Tag,
  message,
  Modal,
  Button,
} from "antd";
import {
  fetchUsers,
  updateCallStatusApi, // new API function
} from "../admin/pages/user/userApi";

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;
function StaffUser() {
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
  const [isNotesModalVisible, setIsNotesModalVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  // Load users
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
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Handle table change
  const handleTableChange = (pag, _filters, sorter) => {
    const order = sorter.order === "ascend" ? "asc" : "desc";
    const field = sorter.field || "createdAt";

    setSortOrder(order);
    setSortBy(field);

    loadUsers(pag.current, pag.pageSize, search, field, order);
  };

  // Handle search
  const handleSearch = (value) => {
    setSearch(value);
    loadUsers(1, pagination.pageSize, value, sortBy, sortOrder);
  };

  // Call status update handler
  const handleUpdateCallStatus = async (userId, payload) => {
    try {
      await updateCallStatusApi(userId, payload);
      message.success("Call status updated");
      loadUsers(); // reload table
    } catch (error) {
      console.error("Error updating call status:", error);
      message.error("Failed to update call status");
    }
  };

  // Handle open notes modal
  const handleOpenNotesModal = (userId, notes) => {
    setCurrentUserId(userId);
    setCurrentNote(notes || "");
    setIsNotesModalVisible(true);
  };

  // Handle save notes
  const handleSaveNotes = async () => {
    if (!currentUserId) return;
    
    try {
      await handleUpdateCallStatus(currentUserId, {
        callNotes: currentNote,
      });
      setIsNotesModalVisible(false);
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  };

  // Table columns
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
      render: (number) => (
        <Space direction="vertical">
          <div>{number}</div>
          <Space>
            <a href={`tel:${number}`}>
              <Tag color="blue">Call</Tag>
            </a>
            <a
              href={`https://wa.me/${number}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Tag color="green">WhatsApp</Tag>
            </a>
          </Space>
        </Space>
      ),
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
      title: "Call Status",
      dataIndex: "callStatus",
      key: "callStatus",
      render: (status, record) => (
        <Select
          value={status || "Not Called"}
          onChange={(value) =>
            handleUpdateCallStatus(record._id, { callStatus: value })
          }
          style={{ width: 200 }}
        >
          <Option value="Not Called">Not Called</Option>
          <Option value="Ringing">Ringing</Option>
          <Option value="Connected">Connected</Option>
          <Option value="Busy">Busy</Option>
          <Option value="No Answer">No Answer</Option>
          <Option value="Purchase">Purchase</Option>
          <Option value="Call Back Scheduled">Call Back Scheduled</Option>
          <Option value="Wrong Number">Wrong Number</Option>
          <Option value="Switched Off / Unreachable">
            Switched Off / Unreachable
          </Option>
          <Option value="Interested">Interested</Option>
          <Option value="Not Interested">Not Interested</Option>
        </Select>
      ),
    },
    {
      title: "Call Notes",
      dataIndex: "callNotes",
      key: "callNotes",
      render: (notes, record) => (
        <Button onClick={() => handleOpenNotesModal(record._id, notes)}>
          {notes ? "View/Edit Notes" : "Add Notes"}
        </Button>
      ),
    },
    {
      title: "Next Call Back",
      dataIndex: "nextCallBackDate",
      key: "nextCallBackDate",
      render: (date, record) => (
        <Input
          type="datetime-local"
          defaultValue={date ? new Date(date).toISOString().slice(0, 16) : ""}
          onBlur={(e) =>
            handleUpdateCallStatus(record._id, {
              nextCallBackDate: e.target.value,
            })
          }
        />
      ),
    },
  ];

  return (
    <div style={{ padding: "2rem", overflowX: "auto" }}>
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

      {/* Notes Modal */}
      <Modal
        title="Call Notes"
        visible={isNotesModalVisible}
        onOk={handleSaveNotes}
        onCancel={() => setIsNotesModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
        width={700}
      >
        <Input.TextArea
          rows={10}
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="Enter call notes here..."
        />
      </Modal>
    </div>
  );
}

export default StaffUser;