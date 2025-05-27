import React from "react";

const header = { title: "agrofarma" };
const user = { name: "perera m n t" };

const tabs = ["services", "areas", "home", "about", "contact"];

const Header = () => {
  return (
    <div className="w-full h-24 mt-1 flex items-center justify-between px-10 relative z-50">
      {/* logo */}
      <div>
        <span className="tracking-4 text-xl tracking-widest">
          {header.title.toUpperCase()}
        </span>
      </div>
      {/* user */}
      <div>
        <span className="tracking-widest">{user.name.toUpperCase()}</span>
      </div>
      {/* section 2 - absolute */}
      <div className="absolute shadow-lg left-1/2 -translate-x-1/2 px-10 flex top-1/2 gap-4 bg-white rounded-2xl items-center">
        {tabs.map((tab, index) => (
          <span
            className="px-10 py-6 font-bold tracking-wider text-lg"
            key={index}
          >
            {tab.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Header;
