
import PaymentButton from "@/components/PaymentButton";
import PlanDetails from "@/components/PlanDetails";
import { DownloadIcon, LayoutDashboardIcon, XCircle } from "lucide-react";
import { useRouter } from "next/router";
import Razorpay from "razorpay";


import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle, Download, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PaymentPage from "@/components/PaymentPage";
import axios from "axios";
import Cookies from "js-cookie";

export async function getServerSideProps(context) {
    const { id, planDemo, redirectUrl, pt } = context.query;
 
  
 


 
  const r = {
   id: id || null,
   planDemo: planDemo || null,
   redirectUrl: redirectUrl || null,
   price: pt || null,
  
 }


  

    return {
      props: r,
    };
  }


export default function Pay({ id, planDemo, redirectUrl, price }) {
 
  const [invoice,setInvoice] = useState(null)

  useEffect(()=>{
    
   const  fetchInvoiceDetails = async()=>{
    
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/invoices?populate=*&filters[invoiceNumber][$eq]=${id}`);

console.log(res.data.data[0]);

   setInvoice(res.data.data[0])
   }


   fetchInvoiceDetails()
  },[])
  
return (

  <>
  
  {
    invoice && <PaymentPage params={{ id, planDemo, redirectUrl, price,invoice }}/>
  }
  </>
  
)
  
}
