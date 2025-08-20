import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaBox,
  FaList,
  FaShoppingCart,
  FaUser,
  FaImage,
  FaHeart,
} from "react-icons/fa";
import { IP } from "../../../utils/Constent";

const Dashboard = () => {
  const [data, setData] = useState({
    totalCategories: 0,
    totalTemplates: 0,
    totalUsers: 0,
    totalElement: 0,
    totalFonts: 0,
    totalImages: 0,
    totalBackgroundImage: 0,
    totalDraftTemplate: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`${IP}/api/v1/dashboard-data`);

        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    {
      title: "Categories",
      count: data.totalCategories,
      icon: <FaList className="text-blue-500 text-4xl" />,
    },
    {
      title: "Templates",
      count: data.totalTemplates,
      icon: <FaBox className="text-green-500 text-4xl" />,
    },
    {
      title: "Elements/Shapes",
      count: data.totalElement,
      icon: <FaImage className="text-red-500 text-4xl" />,
    },
    {
      title: "Background Images",
      count: data.totalBackgroundImage,
      icon: <FaHeart className="text-purple-500 text-4xl" />,
    },
    {
      title: "Fonts",
      count: data.totalFonts,
      icon: <FaUser className="text-indigo-500 text-4xl" />,
    },
    {
      title: "Images",
      count: data.totalImages,
      icon: <FaShoppingCart className="text-yellow-500 text-4xl" />,
    },
    {
      title: "Users",
      count: data.totalUsers,
      icon: <FaUser className="text-orange-400 text-4xl" />,
    },
    {
      title: "Draft Templates",
      count: data.totalDraftTemplate,
      icon: <FaBox className="text-blue-400 text-4xl" />,
    },
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white shadow-lg border rounded-xl p-6 flex items-center space-x-4"
          >
            {card.icon}
            <div>
              <h2 className="text-lg font-semibold capitalize ">
                {card.title}
              </h2>
              <p className="text-2xl font-bold">{card.count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
