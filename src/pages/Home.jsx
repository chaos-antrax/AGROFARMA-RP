import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Addvertise from "../components/Addvertise";
import Footer from "../components/Footer";
import Components from "../components/Components";

const Home = () => {
  return (
    <div>
      <Hero />
      {/* <Addvertise/>
        <Packages/> */}
      <Components />
    </div>
  );
};

export default Home;
