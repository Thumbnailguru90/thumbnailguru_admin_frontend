import React, { useState } from "react";
import { Menu, Drawer, Button } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { BiCategory } from "react-icons/bi";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { FaFont } from "react-icons/fa";
import { PiUploadSimpleBold } from "react-icons/pi";
import { FaShapes } from "react-icons/fa";
import { FaRegFileAlt } from "react-icons/fa"; // Template Icon

const Sidebar = () => {
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
      key: "/admin/dashboard",
      icon: <AppstoreOutlined />,
      label: (
        <Link to="/admin/dashboard" onClick={onClose}>
          Dashboard
        </Link>
      ),
    },
    {
      key: "/admin/category",
      icon: <BiCategory />,
      label: (
        <Link to="/admin/category" onClick={onClose}>
          Category
        </Link>
      ),
    },
    {
      key: "/admin/sub-category",
      icon: <BiCategory />,
      label: (
        <Link to="/admin/sub-category" onClick={onClose}>
          Sub Category
        </Link>
      ),
    },
    {
      key: "templates",
      icon: <FaRegFileAlt />,
      label: "Templates",
      children: [
        {
          key: "/admin/templates/add",
          label: (
            <Link to="/admin/templates/add" onClick={onClose}>
              Add Template
            </Link>
          ),
        },
        {
          key: "/admin/templates/list",
          label: (
            <Link to="/admin/templates/list" onClick={onClose}>
              Template List
            </Link>
          ),
        },
      ],
    },
    {
      key: "/admin/users",
      icon: <FaUsers />,
      label: (
        <Link to="/admin/users" onClick={onClose}>
          Users
        </Link>
      ),
    },

    {
      key: "/admin/fonts",
      icon: <FaFont />,
      label: (
        <Link to="/admin/fonts" onClick={onClose}>
          Fonts
        </Link>
      ),
    },
    {
      key: "/admin/uploads",
      icon: <PiUploadSimpleBold />,
      label: (
        <Link to="/admin/uploads" onClick={onClose}>
          Uploads
        </Link>
      ),
    },
    {
      key: "/admin/elements",
      icon: <FaShapes />,
      label: (
        <Link to="/admin/elements" onClick={onClose}>
          Elements
        </Link>
      ),
    },
    {
      key: "/admin/plans",
      icon: <BiCategory />,
      label: (
        <Link to="/admin/plans" onClick={onClose}>
          Plans
        </Link>
      ),
    },
    {
      key: "/admin/purchase",
      icon: <BiSolidPurchaseTag />,
      label: (
        <Link to="/admin/purchase" onClick={onClose}>
          Purchase
        </Link>
      ),
    },
    {
      key: "blogs",
      icon: <FaRegFileAlt />,
      label: "Blogs",
      children: [
        {
          key: "/admin/blog",
          label: (
            <Link to="/admin/blog" onClick={onClose}>
              Blog
            </Link>
          ),
        },
        {
          key: "/admin/blog/list",
          label: (
            <Link to="/admin/blog/list" onClick={onClose}>
              Blog List
            </Link>
          ),
        },
      ],
    },

    {
      key: "images",
      icon: <FaRegFileAlt />,
      label: "Images",
      children: [
        {
          key: "/admin/images/upload",
          label: (
            <Link to="/admin/images/upload" onClick={onClose}>
              Images Upload
            </Link>
          ),
        },
        {
          key: "/admin/images/list",
          label: (
            <Link to="/admin/images/list" onClick={onClose}>
              Images List
            </Link>
          ),
        },
      ],
    },

    {
      key: "backgrounds",
      icon: <FaRegFileAlt />,
      label: "BackGround",
      children: [
        {
          key: "/admin/background/upload",
          label: (
            <Link to="/admin/background/upload" onClick={onClose}>
              Background Upload
            </Link>
          ),
        },
        {
          key: "/admin/background/list",
          label: (
            <Link to="/admin/background/list" onClick={onClose}>
              Background List
            </Link>
          ),
        },
      ],
    },
  ];

  return (
    <>
      {/* Drawer Button for Mobile */}
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

export default Sidebar;
