'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Mock data for payment details
const paymentDetails = {
  amount: "₹1,499.00",
  orderId: "ORDER-123456789",
  paymentId: "PAY-1234567890",
  date: new Date().toLocaleString('en-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  }),
  status: "Successful",
  method: "Credit Card",
  cardNumber: "**** **** **** 1234",
}

export default function PaymentDetailsPage() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    (<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Successful</h1>
          <p className="text-gray-600 mt-1">Your transaction has been completed</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900">{paymentDetails.amount}</p>
            <p className="text-sm text-gray-600 mt-1">Amount Paid</p>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID</span>
              <span className="font-medium text-gray-900">{paymentDetails.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="font-medium text-gray-900">{paymentDetails.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium text-gray-900">{paymentDetails.method}</span>
            </div>
            {paymentDetails.cardNumber && (
              <div className="flex justify-between">
                <span className="text-gray-600">Card Number</span>
                <span className="font-medium text-gray-900">{paymentDetails.cardNumber}</span>
              </div>
            )}
          </div>
          <Separator />
          <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Payment ID</p>
              <p className="font-medium text-gray-900">{paymentDetails.paymentId}</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(paymentDetails.paymentId)}>
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => alert('Downloading receipt...')}>
            Download Receipt
          </Button>
        </CardFooter>
      </Card>
    </div>)
  );
}

