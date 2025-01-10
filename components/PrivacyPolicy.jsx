import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        At <strong>MCODEV</strong>, we value your privacy and are committed to protecting your personal information. This
        Privacy Policy outlines how we collect, use, and protect your data.
      </p>
      <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
      <p className="mb-4">We may collect personal details like your name, email address, and payment information.</p>
      <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
      <ul className="list-disc list-inside mb-4">
        <li>To process payments and subscriptions.</li>
        <li>To send updates and promotional offers (with your consent).</li>
      </ul>
      <h2 className="text-2xl font-semibold mb-4">3. Contact Us</h2>
      <p>
        For questions about this Privacy Policy, contact us at{" "}
        <a href="mailto:support@mcodev.com" className="text-blue-500 underline">
          support@mcodev.com
        </a>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
