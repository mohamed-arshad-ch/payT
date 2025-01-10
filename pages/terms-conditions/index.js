'use client';
import DashPage from '@/components/dash';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import TermsConditions from '@/components/TermsConditions';
import { withAuth } from '@/lib/withAuth';






function TermsConditionPage() {
    return (
        <>
        <Header/>
        <TermsConditions/>
        <Footer/>
        </>
     )
}


export default TermsConditionPage