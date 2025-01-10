import React from "react";

const ContactUs = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <p className="mb-4">
        If you have any questions or concerns, feel free to reach out to us using the details below:
      </p>
      <h2 className="text-2xl font-semibold mb-4">Address</h2>
      <p className="mb-4">MCODEV Bytes,Malappuram,Kerala,India,676504</p>
      <h2 className="text-2xl font-semibold mb-4">Email</h2>
      <p className="mb-4">
        <a href="mailto:support@mcodev.com" className="text-blue-500 underline">
          mcodevbiz@gmail.com
        </a>
      </p>
      <h2 className="text-2xl font-semibold mb-4">Phone</h2>
      <p>+91-98472 74569</p>
    </div>
  );
};

export default ContactUs;
