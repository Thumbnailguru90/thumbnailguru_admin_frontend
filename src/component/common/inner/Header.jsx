import React, { useState } from "react";
import { Dropdown, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
// import profi from "../../../assets/profile.jpg";
import Sidebar from "../../admin/adminLayout/Sidebar";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const handleLogout = () => {
    message.success("Logged out successfully!");
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.clear();
    setTimeout(() => {
      window.location.href = `/`;
    }, 2000);
  };

  const dropdownMenu = {
    items: [
      {
        key: "1",
        label: (
          <span
            onClick={handleLogout}
            className="flex items-center text-red-600"
          >
            <LogoutOutlined className="mr-2" />
            Logout
          </span>
        ),
      },
    ],
  };

  return (
    <div className="flex justify-between items-center bg-[#D56A25] h-20">
      {/* Left Side: Logo or Name */}
      <div className="md:hidden">
        <Sidebar />
      </div>

      <div className="text-white text-xl font-semibold md:pl-3">
        Welcome, <span className="font-bold">Admin</span>
      </div>

      <div className="flex items-center space-x-4 pr-3">
        <Dropdown menu={dropdownMenu} placement="bottomRight" arrow>
          <FaUserCircle className="text-3xl text-white cursor-pointer" />
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
