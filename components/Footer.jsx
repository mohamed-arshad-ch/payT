import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto text-center">
        <p className="mb-2">
          © {new Date().getFullYear()} MCODEV. All rights reserved.
        </p>
        <p>
          Email: <a href="mailto:mcodevbiz@gmail.com" className="hover:underline">mcodevbiz@gmail.com</a> | Phone: +91-98472 74569
        </p>
        <p>Address: Vadakkemanna, Malappuram, Kerala, India</p>
      </div>
    </footer>
  );
};

export default Footer;
