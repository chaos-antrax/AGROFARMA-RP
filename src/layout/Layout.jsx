import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Router from "../routes/Router";

const location = window.location.pathname;

const Layout = () => {
  return (
    <div>
      {!["/signin", "/signup", "/dashboard"].includes(location) && <Navbar />}
      <Router />
      {!["/signin", "/signup", "/dashboard"].includes(location) && <Footer />}
    </div>
  );
};

export default Layout;
