import React from "react";

const Loader: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        height: "100vh",
      }}
    >
      <div id="preloader"></div>
    </div>
  );
};

export default Loader;
