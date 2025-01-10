import Link from "next/link";
import React from "react";


const Header = () => {
  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        <h1 className="text-xl font-bold">MCODEV</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:text-gray-400">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about-us" className="hover:text-gray-400">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/terms-conditions" className="hover:text-gray-400">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-gray-400">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-gray-400">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/contact-us" className="hover:text-gray-400">
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
