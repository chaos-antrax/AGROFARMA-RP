import React from "react";

const Card = ({ children, className, rounded, bgColor, padding, action }) => {
  return (
    <div
      onClick={action}
      className={`${padding ? padding : "px-6 py-4"} ${
        bgColor ? bgColor : "bg-white"
      } w-full ${rounded ? rounded : "rounded-lg"} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
