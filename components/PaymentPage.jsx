
import PaymentButton from "@/components/PaymentButton";
import PlanDetails from "@/components/PlanDetails";
import { CheckCircle2, DownloadIcon, LayoutDashboardIcon, XCircle } from "lucide-react";
import { useRouter } from "next/router";
import Razorpay from "razorpay";





import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle, Download, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dateFormatToDay, decryptAmount, encryptAmount } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";

export default function PaymentPage({params}){
const [plan,setPlan] = useState(params.planDemo)
  const [mainPrice,setMainPrice] = useState(decryptAmount(params.price))
  const [transactionId,setTransactionId] = useState("")
  const [order,setOrder] = useState(null)
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [storyType,setStoryType] = useState(0)

  // Mock function to generate a transaction ID
const generateTransactionId = () => {
    return `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };
  
  // Mock plan data
  const planDetails = {
    name: plan,
    features: [
      "Access to all premium content",
      "24/7 customer support",
      "Ad-free experience",
      "Offline viewing"
    ],
    amount: mainPrice || 0,
    currency: "₹"
  };
 

  useEffect(()=>{
    
    
   
      
    const payId = generateTransactionId()
    setTransactionId(payId)
    
   
    
  
       

  

   
  },[router])

  

 

  const handlePayment = async () => {
    setLoading(true);

    
    try {
      // Call backend to create an order
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(mainPrice) *100, currency: 'INR', receipt: 'receipt#1' }),
      });

      const orderData = await response.json();
      if (!orderData.id) {
        throw new Error('Failed to create order');
      }

      const options = {
        key_id: 'rzp_test_PxwSSyGr04P2ms', 
     
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.id,
        name: 'MCODEV Bytes',
        description: 'Purchase Description',
        handler: async (response) => {
          // Step 4: Verify Payment on Backend
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyResponse.json();
  
          if (verifyData.success) {
            setStoryType(1)
          } else {
            setStoryType(-1)
          }
        },
        image: 'https://lh3.googleusercontent.com/a/ACg8ocKTvdklFXllXmRpX3ChlLtzi1GQ_-RXT_Ucp3-CTqCJkblPNzw=s576-c-no', 
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '1234567890',
        },
        theme: {
          color: '#4CAF50', // Primary button color (e.g., green)
          backdrop_color: '#F5F5F5', // Light grey backdrop color
          font_family: 'Poppins', // Modern font
          hide_topbar: false, // Show the top bar
        },
        modal: {
            ondismiss: function () {
              alert('Payment window closed without completing the payment');
            }
          }
      };

      const paymentObject = new window.Razorpay(options);
   
   paymentObject.open();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment initiation failed. Please try again.');
    }

    setLoading(false);
  };


  
  
  return (
  <div
        className="min-h-screen  flex items-center justify-center p-4">
       
         {
          storyType == 0 && <>
            <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Transaction ID</p>
             {transactionId !=null &&  <p className="font-mono font-medium text-gray-900">{transactionId}</p>}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Amount to Pay</p>
             {planDetails !=null &&  <p className="text-3xl font-bold text-gray-900">{planDetails.currency}{planDetails.amount}</p>}
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-gray-900">{planDetails.name}</h3>
              <ul className="space-y-2">
                {planDetails.features.map((feature, index) => (
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
              className="w-full text-lg py-6 bg-green-600 hover:bg-green-700 transition-colors"
              onClick={handlePayment}
            >
              Pay Now
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
          </>
         }

         {
          storyType == 1 && <PaymentSuccessPage/>
         }
         {
          storyType == -1 && <PaymentFailedPage/>
         }
        </div>
     
  );
}




function PaymentFailedPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-red-600">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <p className="text-lg">We're sorry, but your payment could not be processed. Please try again or contact support.</p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Link href="/payment">
            <Button variant="outline">Try Again</Button>
          </Link>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

  
  const PaymentSuccessPage = () => {
    const transactionDetails = {
      amount: '$99.99',
      transactionId: 'TRX123456789',
      paymentMethod: 'Credit Card',
      date: new Date()
    };
  
    useEffect(() => {
      // Trigger confetti effect on component mount
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, []);
  
    return (
      (<>
        <div
         
          className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div
               >
                <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-4" />
              </div>
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
                  
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => alert('Downloading receipt...')}>
                <DownloadIcon className="mr-2 h-4 w-4" /> Download Receipt
              </Button>
              <Link href="/dashboard" className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50">
                  <LayoutDashboardIcon className="mr-2 h-4 w-4" /> Go to Dashboard
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        </>
      )
    );
  };