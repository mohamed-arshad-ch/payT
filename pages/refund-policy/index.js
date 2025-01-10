'use client';
import DashPage from '@/components/dash';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import RefundPolicy from '@/components/RefundPolicy';
import TermsConditions from '@/components/TermsConditions';
import { withAuth } from '@/lib/withAuth';






function RefundPolicyPage() {
    return (
        <>
        <Header/>
        <RefundPolicy/>
        <Footer/>
        </>
     )
}


export default RefundPolicyPage