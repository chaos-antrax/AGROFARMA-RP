import React from "react";
// import { ReactTyped } from 'react-typed'
import { Link } from "react-router-dom";
import Image1 from "../assets/1.png";
import Image2 from "../assets/2.png";
import Image3 from "../assets/3.png";
import Image4 from "../assets/4.png";

const Hero = () => {
  return (
    <div className="text-white ">
      <div className="max-w-[1340px] mx-auto justify-items-center h-[600px] bg-gradient-to-r from-[#D1FFD6] to-[#ACFFF5] rounded-3xl ">
        <div className="max-w-[1240px] justify-items-center px-[100px] py-10">
          <div></div>
          <p className="text-[#1C5739] font-semibold text-2xl pt-4 ">
            Enhance Your Farm with
          </p>
          <h1 className="text-[170px] font-semibold bg-gradient-to-r from-[#2AB166] to-[#04fff2] text-transparent bg-clip-text uppercase">
            Agrofarma
          </h1>

          {/* <ReactTyped className='md:text-7xl sm:text-3xl text-xl font-semibold bg-gradient-to-r from-[#2AB166] to-[#04fff2] text-transparent bg-clip-text' 
                strings={['AGROFARMA']} 
                typeSpeed={120} 
                 /> */}
          {/* <h3 className='md:text-2xl sm:text-3xl text-2xl py-4 text-[#1C5739] font-normal'>grow the world with technology</h3> */}

          <div className="flex text-xl text-black space-x-4 mt-4">
            <Link to="/growth-analyze">
              <div className="relative w-[150px] group">
                <img
                  className="w-full rounded-lg transform transition duration-500 group-hover:scale-110 shadow-lg"
                  src={Image1}
                  alt=""
                />
                <span className="absolute text-center group-hover:scale-110 inset-0 flex items-center text-bg-black justify-center text-white text-lg font-bold bg-green-700 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg">
                  Growth Rate Analyzer
                </span>
              </div>
            </Link>

            <Link to="/market-price-prediction">
              <div className="relative w-[150px] group">
                <img
                  className="w-full rounded-lg transform transition duration-500 group-hover:scale-110 shadow-lg"
                  src={Image2}
                  alt=""
                />
                <span className="absolute text-center group-hover:scale-110 inset-0 flex items-center justify-center text-white text-lg font-bold bg-green-700 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg">
                  Market Price Predictor
                </span>
              </div>
            </Link>

            <Link to="/solutions">
              <div className="relative w-[150px] group">
                <img
                  className="w-full rounded-lg transform transition duration-500 group-hover:scale-110 shadow-lg"
                  src={Image3}
                  alt=""
                />
                <span className="absolute text-center group-hover:scale-110 inset-0 flex items-center justify-center text-white text-lg font-bold bg-green-700 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg">
                  Alternatives & Solutions
                </span>
              </div>
            </Link>

            <Link to="/agri-assist">
              <div className="relative w-[150px] group">
                <img
                  className="w-full rounded-lg transform transition duration-500 group-hover:scale-110 shadow-lg"
                  src={Image4}
                  alt=""
                />
                <span className="absolute text-center group-hover:scale-110 inset-0 flex items-center justify-center text-white text-lg font-bold bg-green-700 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg">
                  Agri Assistant
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* <img className='w-[500px] me-6 my-4 ' src={heroImg} alt="" /> */}
      </div>
    </div>
  );
};

export default Hero;
