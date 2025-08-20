import React from "react";

const Loader = () => {
  const loaderStyle = {
    width: "50px",
    aspectRatio: "1",
    borderRadius: "50%",
    padding: "3px",
    background:
      "radial-gradient(farthest-side, #ffa516 95%, #0000) 50% 0/12px 12px no-repeat, " +
      "radial-gradient(farthest-side, #0000 calc(100% - 5px), #ffa516 calc(100% - 4px)) content-box",
    animation: "l6 2s infinite",
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div style={loaderStyle}></div>
    </div>
  );
};

export default Loader;
