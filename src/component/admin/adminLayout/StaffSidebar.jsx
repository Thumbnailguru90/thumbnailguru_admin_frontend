// // ./StaffSidebar.jsx
// import React from "react";
// import { Link } from "react-router-dom";


// const StaffSidebar = () => {
//   return (
//     <div className="p-4">
//       <h2 className="text-lg font-semibold mb-4">Staff Panel</h2>
//       <ul className="space-y-2">
//         <li>
//           <Link to="/staff/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
//         </li>
//         <li>
//           <Link to="/staff/users" className="text-blue-600 hover:underline">Users</Link>
//         </li>
//         <li>
//           <Link to="/staff/transactions" className="text-blue-600 hover:underline">Transaction</Link>
//         </li>
//         {/* Add more staff-specific links here */}
//       </ul>
//     </div>
//   );
// };

// export default StaffSidebar;


import React, { useState } from "react";
import { Menu, Drawer, Button } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { BiCategory } from "react-icons/bi";


const StaffSidebar = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);

  const showDrawer = () => setDrawerVisible(true);
  const onClose = () => setDrawerVisible(false);

  const handleSubMenuChange = (keys) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const menuItemsArray = [
    {
      key: "/staff/users",
      icon: <AppstoreOutlined />,
      label: (
        <Link to="/staff/users" onClick={onClose}>
          Users
        </Link>
      ),
    },
    {
      key: "/staff/transactions",
      icon: <BiCategory />,
      label: (
        <Link to="/staff/transactions" onClick={onClose}>
          Transactions
        </Link>
      ),
    },
  
  ];

  return (
    <>
      {/* Drawer Button for Mobile */}
      <h2 className="text-lg font-semibold p-4">Staff Panel</h2>
      <Button
        className="sidebar-toggle text-xl relative top-0 h-10 w-10"
        onClick={showDrawer}
      >
        <AppstoreOutlined className="relative top-0 left-0 text-2xl" />
      </Button>

      {/* Drawer for Mobile */}
      <Drawer
        title="OZONE"
        placement="left"
        closable
        onClose={onClose}
        open={drawerVisible}
      >
        <Menu
          className="w-full"
          mode="inline"
          openKeys={openKeys}
          onOpenChange={handleSubMenuChange}
          items={menuItemsArray}
        />
      </Drawer>

      {/* Sidebar for Desktop */}
      <div className="sidebar-desktop overflow-x-scroll h-screen">
        <Menu
          className="w-full"
          mode="inline"
          openKeys={openKeys}
          onOpenChange={handleSubMenuChange}
          items={menuItemsArray}
        />
      </div>
    </>
  );
};

export default StaffSidebar;
