import React from "react";

const RefundPolicy = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Refund Policy</h1>
      <p className="mb-4">
        At <strong>MCODEV</strong>, we strive to ensure customer satisfaction. If you are not entirely satisfied with
        your purchase, please read our refund policy below:
      </p>
      <h2 className="text-2xl font-semibold mb-4">1. Eligibility for Refunds</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Refunds are applicable only if requested within 7 days of the purchase date.</li>
        <li>Refunds are not applicable for services already rendered or digital products downloaded.</li>
      </ul>
      <h2 className="text-2xl font-semibold mb-4">2. Process of Refund</h2>
      <p className="mb-4">
        To request a refund, contact us at{" "}
        <a href="mailto:support@mcodev.com" className="text-blue-500 underline">
          support@mcodev.com
        </a>{" "}
        with your order details. Once we review your request, we will notify you of the approval or rejection of your
        refund.
      </p>
      <h2 className="text-2xl font-semibold mb-4">3. Refund Method</h2>
      <p>
        If approved, your refund will be processed to your original payment method within 7-10 business days.
      </p>
    </div>
  );
};

export default RefundPolicy;
