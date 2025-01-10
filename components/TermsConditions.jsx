import React from "react";

const TermsConditions = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Terms and Conditions</h1>
      <p className="mb-4">
        Welcome to <strong>MCODEV</strong>! By using our website and services, you agree to comply with and be bound by
        the following terms and conditions. Please read them carefully before using our services.
      </p>
      <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
      <p className="mb-4">
        By accessing and using this website, you agree to be bound by these Terms and Conditions, which together with
        our Privacy Policy govern MCODEV's relationship with you.
      </p>
      <h2 className="text-2xl font-semibold mb-4">2. Use of the Website</h2>
      <ul className="list-disc list-inside mb-4">
        <li>You agree to use the website only for lawful purposes.</li>
        <li>You must not use the website in any way that may harm MCODEV or its users.</li>
      </ul>
      <h2 className="text-2xl font-semibold mb-4">3. Payment Terms</h2>
      <p className="mb-4">
        All payments made through this website are subject to the terms specified in our Refund Policy.
      </p>
      <h2 className="text-2xl font-semibold mb-4">4. Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us at{" "}
        <a href="mailto:mcodevbiz@gmail.com" className="text-blue-500 underline">
        mcodevbiz@gmail.com
        </a>{" "}
        or +91-98472 74569
      </p>
    </div>
  );
};

export default TermsConditions;
