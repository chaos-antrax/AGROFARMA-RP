import React from "react";

const Button = ({ children, type }) => {
  return (
    <button
      type={type}
      className="bg-[#f7c35f] font-semibold text-lg px-4 py-2 rounded-lg w-full"
    >
      {children}
    </button>
  );
};

export default Button;
