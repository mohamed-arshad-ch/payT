
import PaymentButton from "@/components/PaymentButton";
import PlanDetails from "@/components/PlanDetails";
import { CheckCircle2, DownloadIcon, LayoutDashboardIcon, XCircle } from "lucide-react";
import { useRouter } from "next/router";
import Razorpay from "razorpay";
import 'jspdf-autotable';




import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle, Download, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dateFormatToDay, decryptAmount, encryptAmount } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import jsPDF from "jspdf";
import { useReactToPrint } from "react-to-print";
import axios from "axios";

export default function PaymentPage({params}){
const [plan,setPlan] = useState(params.planDemo)
const [invoice,setInvoice] = useState(params.invoice)
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
    name: invoice?.subscription_plan?.name,
    features: invoice?.subscription_plan?.features,
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
        key_id: process.env.NEXT_PUBLIC_RAZOR_PAY_KEY_ID, 
     
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.id,
        name: 'MCODEV Bytes',
        description: 'Coldest place on ice',
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

            const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/invoices/${invoice.documentId}`,{
              data:{
                paymentStatus:"paid"
              }
            })
          } else {
            setStoryType(-1)

            const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/invoices/${invoice.documentId}`,{
              data:{
                paymentStatus:"unpaid"
              }
            })
          }
        },
        image: 'https://lh3.googleusercontent.com/a/ACg8ocKTvdklFXllXmRpX3ChlLtzi1GQ_-RXT_Ucp3-CTqCJkblPNzw=s576-c-no', 
       
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


  if(invoice.paymentStatus == "paid"){

    return <div
    className="min-h-screen  flex items-center justify-center p-4"><PaymentAlreadyDonePage/></div>
  }
  
  return (
  <div
        className="min-h-screen  flex items-center justify-center p-4">


       
         {
          storyType == 0 && <>
            <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4 md:px-6"
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Transaction ID</p>
             {invoice !=null &&  <p className="font-mono font-medium text-gray-900">{invoice.paymentId}</p>}
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
          storyType == 1 && <PaymentSuccessPage invoice={invoice}/>
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
      <Card className="w-full max-w-md px-4 md:px-6">
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

function PaymentAlreadyDonePage() {
  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md px-4 md:px-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-red-600">Payment Already Done</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <p className="text-lg">We're sorry. Please try again or contact Administrator.</p>
        </CardContent>
       
      </Card>
    </div>
  )
}
  const PaymentSuccessPage = ({invoice}) => {
    const transactionDetails = {
      amount: invoice.subscription_plan.price,
      transactionId: invoice.paymentId,
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

  



  const handleDownloadPDF = (invoice) => {

     const doc = new jsPDF();
          // Add background pattern (top)
          doc.setFillColor(0, 43, 150); // #002B96
          doc.rect(0, 0, 210, 60, 'F');
          
          // Add diagonal stripes pattern
          // for (let i = 0; i < 5; i++) {
          //   doc.setFillColor(255, 255, 255, 0.1);
          //   doc.rect(20 + (i * 30), 0, 15, 60, 'F');
          // }
       
         // Add company logo
       doc.setTextColor(255, 255, 255);
       doc.setFontSize(24);
       doc.text('MCODEV', 105, 30,{ align: 'center' });
       doc.setFontSize(10);
       doc.text('Coldest Place On Ice', 105, 40,{ align: 'center' });
    
       // Add invoice title
       doc.setTextColor(0, 0, 0);
       doc.setFontSize(24);
       doc.text('INVOICE', 185, 90, { align: 'right' });
    
       doc.setTextColor(0, 0, 0);
       doc.setFontSize(14);
       doc.text(`${invoice.invoiceNumber}`, 185, 97, { align: 'right' });
       
       // Add date
       doc.setFontSize(12);
       doc.text(`Date : ${dateFormatToDay(new Date())}`, 185, 103, { align: 'right' });
       
          // Add invoice details
          doc.setFontSize(14);
          doc.text('INVOICE TO:', 20, 90);
          doc.setFontSize(12);
          doc.text(invoice.clientName, 20, 97);
          doc.setFontSize(12);
          doc.text(invoice.clientAddress, 20, 103);
       
          const tableHeaders = [
           { title: 'Description', dataKey: 'description', width: 80 },
           { title: 'Qty', dataKey: 'quantity', width: 20 },
           { title: 'Price (Rs)', dataKey: 'price', width: 40, align: 'right' },
           { title: 'Total (Rs)', dataKey: 'total', width: 40, align: 'right' },
         ];
       
         const tableBody = [
          
           invoice.subscription_plan.name,
           '1',
         `${invoice.subscription_plan.price.toFixed(2)}`,
           `${invoice.subscription_plan.price.toFixed(2)}`
         
          ]
       
          // Add plan details table
          doc.autoTable(
           {
            startY: 130,
            margin: { top: 10 },
            head: [tableHeaders],
            body: [tableBody],
            styles: {
             fontSize: 10,
             cellPadding: 5,
             overflow: 'ellipsize',
             halign: 'center',
             valign: 'middle',
           },
           headStyles: {
             fillColor: [221, 221, 221], // Light gray background for header
             textColor: [0, 0, 0],
             fontSize: 11,
             fontStyle: 'bold',
           },
           columns: tableHeaders,
            theme: 'grid'
          },
          
         
         );
       
          // Add subtotal and tax
          const finalY = (doc).lastAutoTable.finalY || 180;
          doc.setFontSize(16);
          doc.text('Total Amount:', 110, finalY + 20);
          doc.setFontSize(16);
          doc.text(`Rs.${(invoice.subscription_plan.price).toFixed(2)}`, 160, finalY + 20);
         
          
         
       
        
       
          // Add contact information
          const contactY = finalY + 100;
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          
          // Phone
          doc.text('Phone.', 20, contactY);
          doc.setTextColor(100, 100, 100);
          doc.text('+91 98472 74569', 20, contactY + 10);
          
          // Email
          doc.setTextColor(0, 0, 0);
          doc.text('Email.', 85, contactY);
          doc.setTextColor(100, 100, 100);
          doc.text('mcodevbiz@gmail.com', 85, contactY + 10);
       
          doc.setTextColor(0, 0, 0);
          doc.text('Address.', 150, contactY);
          doc.setTextColor(100, 100, 100);
          doc.text('Kerala,India', 150, contactY + 10);
          
         
       
          // Add bottom wave pattern
          doc.setFillColor(0, 43, 150);
          doc.rect(0, 280, 210, 17, 'F');
          
          // Save the PDF
          doc.save(`${invoice.invoiceNumber}.pdf`);
  };

  
    return (
      (<>




        <div
         
          className="w-full max-w-md px-4 md:px-6">
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
                  <span className="font-medium text-gray-900">₹{transactionDetails.amount}</span>
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium text-gray-900">{transactionDetails.transactionId}</span>
                 
                 
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium text-gray-900">{dateFormatToDay(transactionDetails.date)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleDownloadPDF(invoice)}>
                <DownloadIcon className="mr-2 h-4 w-4" /> Download Receipt
              </Button>
             
            </CardFooter>
          </Card>
        </div>
        </>
      )
    );
  };