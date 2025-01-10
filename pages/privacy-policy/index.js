'use client';
import DashPage from '@/components/dash';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PrivacyPolicy from '@/components/PrivacyPolicy';
import TermsConditions from '@/components/TermsConditions';
import { withAuth } from '@/lib/withAuth';






function PrivacyPolicyPage() {
    return (
        <>
        <Header/>
        <PrivacyPolicy/>
        <Footer/>
        </>
     )
}


export default PrivacyPolicyPage