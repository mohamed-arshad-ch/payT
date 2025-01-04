'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2 } from 'lucide-react';

// Mock function to generate a transaction ID
const generateTransactionId = () => {
  return `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// Mock plan data
const plan = {
  name: "Premium Plan",
  features: [
    "Access to all premium content",
    "24/7 customer support",
    "Ad-free experience",
    "Offline viewing"
  ],
  amount: 500,
  currency: "₹"
};

export default function PaymentScreen() {
  const [transactionId, setTransactionId] = useState('');
  const router = useRouter();

  useEffect(() => {
    setTransactionId(generateTransactionId());
  }, []);

  const handlePayNow = () => {
    // Here you would typically integrate with a payment gateway
    // For now, we'll just redirect to the success page
    router.push('/payment/success');
  };

  return (
    (<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md">
        <Card className="shadow-lg p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Transaction ID</p>
              <p className="font-mono font-medium text-gray-900">{transactionId}</p>
            </div>
            <div className="text-center py-4">
              <p className="text-sm text-gray-600 mb-1">Amount to Pay</p>
              <p className="text-4xl font-bold text-gray-900">{plan.currency}{plan.amount}</p>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full text-lg py-6 bg-black hover:bg-gray-800 transition-colors"
              onClick={handlePayNow}>
              Pay Now
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>)
  );
}

