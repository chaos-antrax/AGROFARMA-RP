import React from "react";

const content = {
  logo: "Agrofarma",
  copyright: "© 2025 Eco All Rights Reserved",
  links: [
    "Privacy Policy",
    "Terms and Conditions",
    "FAQ",
    "Developed by Team Agrofarma",
  ],
};

const Footer = () => {
  return (
    <div className="bg-[#ededed] w-full py-8 flex justify-between items-center px-10 absolute">
      <div className="flex items-center gap-4">
        <div className="text-2xl tracking-widest font-semibold">
          {content.logo.toUpperCase()}
        </div>
        <div>{content.copyright}</div>
      </div>
      <div className="flex items-center gap-4">
        {content.links.map((link, index) => (
          <div key={index}>
            <a className="underline">{link}</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Footer;
