import React from "react";
// import img from "../../../../assets/foxIcon.jpg";
import { Spin } from "antd";

const LoadDashboard = () => {
  return (
    <>
      <style>
        {`
          @keyframes scaleInOut {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
        `}
      </style>
      <div className="flex items-center justify-center p-10 sm:p-20">
        <Spin>
          <img
            alt="Loading"
            className=" w-24 h-24 rounded-full animate-[scaleInOut_2s_ease-in-out_infinite]"
          />
        </Spin>
      </div>
    </>
  );
};

export default LoadDashboard;
