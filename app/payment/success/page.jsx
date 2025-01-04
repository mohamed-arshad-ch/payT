'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle, Download, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for the transaction details
const transactionDetails = {
  amount: '$99.99',
  transactionId: 'TRX123456789',
  paymentMethod: 'Credit Card',
  date: new Date().toLocaleString()
};

const PaymentSuccessPage = () => {
  useEffect(() => {
    // Trigger confetti effect on component mount
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    (<div
      className="container flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 10 }}>
              <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-4" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-green-600">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-green-700">Transaction Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-medium text-gray-900">{transactionDetails.amount}</span>
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-medium text-gray-900">{transactionDetails.transactionId}</span>
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium text-gray-900">{transactionDetails.paymentMethod}</span>
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-medium text-gray-900">{transactionDetails.date}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => alert('Downloading receipt...')}>
              <Download className="mr-2 h-4 w-4" /> Download Receipt
            </Button>
            <Link href="/dashboard" className="w-full">
              <Button
                variant="outline"
                className="w-full border-green-600 text-green-600 hover:bg-green-50">
                <LayoutDashboard className="mr-2 h-4 w-4" /> Go to Dashboard
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>)
  );
};

export default PaymentSuccessPage;

