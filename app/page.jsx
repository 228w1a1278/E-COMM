'use client'
import React from "react";
import HeaderSlider from "@/components/HeaderSlider.jsx";
import HomeProducts from "@/components/HomeProducts.jsx";
import Banner from "@/components/Banner.jsx";
import NewsLetter from "@/components/NewsLetter.jsx";
import FeaturedProduct from "@/components/FeaturedProduct.jsx";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";

const Home = () => {
  return (
    <>
      <Navbar/>
      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />
        <HomeProducts />
        <FeaturedProduct />
        <Banner />
        <NewsLetter />
      </div>
      <Footer />
    </>
  );
};

export default Home;
