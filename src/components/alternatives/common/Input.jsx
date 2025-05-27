import React from "react";

const Input = ({ placeholder, name }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      name={name}
      className="px-4 py-2 bg-[#e9f1ee] w-full rounded-lg text-lg"
    />
  );
};

export default Input;
