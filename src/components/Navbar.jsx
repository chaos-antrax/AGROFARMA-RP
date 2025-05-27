import React, { useContext, useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";
import agroLogo from "../assets/AGROFARMA (12).png";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const { isLoggedIn, logout } = useContext(AuthContext);
  // const navigate = useNavigate();

  // const redirect = () => {
  //   navigate("/signin");
  // };

  return (
    <div className="flex justify-between items-center h-20 max-w[1240px] mx-[100px] px-4 bg-white text-black">
      <img className="w-[200px] mx-0" src={agroLogo} alt="" />
      {/* <div className="bg-[#ffffff] shadow-xl rounded-b-lg px-8 mt-14 h-[40px] flex space-x-16 items-center font-poppins"> */}
      <div className="hidden md:flex bg-[#ffffff] shadow-xl rounded-b-lg px-8 mt-14 h-[40px] space-x-16 items-center font-poppins">
        <Link to="/services#" className="text-gray-700 hover:text-green-700">
          Services
        </Link>
        {isLoggedIn && (
          <a href="/dashboard" className="text-gray-700 hover:text-green-700">
            Dashboard
          </a>
        )}
        <Link to="/areas" className="text-gray-700 hover:text-green-700">
          Areas
        </Link>
        <Link to="/" className="text-green-900 font-bold relative">
          Home
          <span className="absolute left-0 -bottom-1 w-full h-[-2px] bg-green-800"></span>
        </Link>
        <Link to="/about" className="text-gray-700 hover:text-green-700">
          About
        </Link>
        <Link to="/contact" className="text-gray-700 hover:text-green-700">
          Contact
        </Link>
      </div>
      <div></div>
      <div>
        {isLoggedIn ? (
          <button
            onClick={logout}
            className="px-5 py-2 w-[100px] bg-gradient-to-r from-[#89ffbe] to-[#63ffed] text-[#1C5739] uppercase font-poppins font-semibold rounded-lg"
          >
            Logout
          </button>
        ) : (
          <a href="/signin">
            <button
              onClick={logout}
              className="px-5 py-2 w-[100px] bg-gradient-to-r from-[#89ffbe] to-[#63ffed] text-[#1C5739] uppercase font-poppins font-semibold rounded-lg"
            >
              Login
            </button>
          </a>
        )}
      </div>
      {/* <div onClick={handleNav} className="block md:hidden">
        {!nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div> */}
      <div onClick={handleNav} className="block md:hidden">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>
      <div
        className={
          nav
            ? "fixed z-50 left-0 top-0 w-[60%] border-r border-r-gray-900 h-full bg-[#000300] ease-in-out duration-500"
            : "fixed left-[-100%]"
        }
      >
        <h1 className="w-full px-4 text-3xl font-bold text-[#00df9a] mt-8">
          Agrofarma
        </h1>
        <ul className="pt-6 uppercase">
          <li className="p-4 border-b border-gray-700">
            <Link to="/">Home</Link>
          </li>
          <li className="p-4 border-b border-gray-700">
            <Link to="/areas">Areas</Link>
          </li>
          <li className="p-4 border-b border-gray-700">
            <Link to="/about">About</Link>
          </li>
          <li className="p-4">
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
