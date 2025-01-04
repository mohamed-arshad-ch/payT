
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

export async function getServerSideProps(context) {
    const { id, planDemo, redirectUrl, pt } = context.query;
  
    return {
      props: {
        id: id || null,
        planDemo: planDemo || null,
        redirectUrl: redirectUrl || null,
        price: pt || null,
      },
    };
  }


export default function Pay({ id, planDemo, redirectUrl, price }) {
return (

  
  <PaymentPage params={{ id, planDemo, redirectUrl, price }}/>
  
)
  
}
