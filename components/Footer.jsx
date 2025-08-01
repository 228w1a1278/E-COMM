import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <Image className="w-28 md:w-32" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm">
            Quick Cart is a simple e-commerce website built with Next.js and Tailwind CSS.
            It consits of the product list page, product details page, cart page and checkout page.
            It also uses the latest technologies like clerk and inngest for authenication and Event handling.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="font-bold" > QuickCart </a>
              </li>
              <li>
                <a className="font-bold">Electronic based Web.
                </a>
              </li>
              <li>
                <a className="font-semibold">Contact us -LandLine:8666-678759</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+91 6792720000</p>
              <p>contact@Chilla Sai Charan</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2025 ©QuickCart All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;