


import React, { useState } from "react";
import { Menu, Drawer, Button } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { BiCategory } from "react-icons/bi";
import { FaRegFileAlt } from "react-icons/fa"; // Template Icon
import { FaFont } from "react-icons/fa";
import { PiUploadSimpleBold } from "react-icons/pi";
import { FaShapes } from "react-icons/fa";


const SubAdminSidebar = () => {
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
      key: "/subadmin/dashboard",
      icon: <AppstoreOutlined />,
      label: (
        <Link to="/subadmin/dashboard" onClick={onClose}>
          Dashboard
        </Link>
      ),
    },
     {
          key: "/subadmin/sub-category",
          icon: <BiCategory />,
          label: (
            <Link to="/subadmin/sub-category" onClick={onClose}>
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
                  key: "/subadmin/templates/add",
                  label: (
                    <Link to="/subadmin/templates/add" onClick={onClose}>
                      Add Template
                    </Link>
                  ),
                },
                {
                  key: "/subadmin/templates/list",
                  label: (
                    <Link to="/subadmin/templates/list" onClick={onClose}>
                      Template List
                    </Link>
                  ),
                },
              ],
            },
             {
                  key: "/subadmin/fonts",
                  icon: <FaFont />,
                  label: (
                    <Link to="/subadmin/fonts" onClick={onClose}>
                      Fonts
                    </Link>
                  ),
                },

                 {
                      key: "/subadmin/uploads",
                      icon: <PiUploadSimpleBold />,
                      label: (
                        <Link to="/subadmin/uploads" onClick={onClose}>
                          Uploads
                        </Link>
                      ),
                    },
                    {
                      key: "/subadmin/elements",
                      icon: <FaShapes />,
                      label: (
                        <Link to="/subadmin/elements" onClick={onClose}>
                          Elements
                        </Link>
                      ),
                    },
                     {
                          key: "images",
                          icon: <FaRegFileAlt />,
                          label: "Images",
                          children: [
                            {
                              key: "/subadmin/images/upload",
                              label: (
                                <Link to="/subadmin/images/upload" onClick={onClose}>
                                  Images Upload
                                </Link>
                              ),
                            },
                            {
                              key: "/subadmin/images/list",
                              label: (
                                <Link to="/subadmin/images/list" onClick={onClose}>
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
                              key: "/subadmin/background/upload",
                              label: (
                                <Link to="/subadmin/background/upload" onClick={onClose}>
                                  Background Upload
                                </Link>
                              ),
                            },
                            {
                              key: "/subadmin/background/list",
                              label: (
                                <Link to="/subadmin/background/list" onClick={onClose}>
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
      <h2 className="text-lg font-semibold p-4">SubAdmin Panel</h2>
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

export default SubAdminSidebar;
