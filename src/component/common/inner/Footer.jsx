import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#1F2937] to-[#2d3949] text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-12 py-4 flex flex-col sm:flex-row justify-between items-center">
        {/* Copyright */}
        <p className="text-sm sm:text-base">© 2025 All Rights Reserved</p>

        {/* Social Icons */}
        <div className="flex space-x-4 mt-3 sm:mt-0">
          <a href="#" className="hover:text-gray-300">
            <FaFacebook size={20} />
          </a>
          <a href="#" className="hover:text-gray-300">
            <FaTwitter size={20} />
          </a>
          <a href="#" className="hover:text-gray-300">
            <FaInstagram size={20} />
          </a>
          <a href="#" className="hover:text-gray-300">
            <FaLinkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
