import React from "react";

const About = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">About Us</h1>
      <p className="mb-4">
        Welcome to <strong>MCODEV</strong>, your trusted partner in delivering top-notch SaaS solutions. Our mission is
        to empower businesses with innovative tools that simplify operations and drive growth.
      </p>
      <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
      <p className="mb-4">
        At MCODEV, we provide a range of SaaS products tailored to meet the unique needs of businesses across various
        industries. From subscription management to advanced analytics, we aim to make technology accessible and
        impactful for everyone.
      </p>
      <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Innovation: Continuously improving and adapting to the latest trends.</li>
        <li>Customer Focus: Putting our clients at the heart of everything we do.</li>
        <li>Integrity: Maintaining transparency and trust in all our dealings.</li>
      </ul>
      <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
      <p>
        Have questions? Reach out to us at <a href="mailto:mcodevbiz@gmail.com" className="text-blue-500 hover:underline">mcodevbiz@gmail.com</a>.
      </p>
    </div>
  );
};

export default About;
