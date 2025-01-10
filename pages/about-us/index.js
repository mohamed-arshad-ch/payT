'use client';
import About from '@/components/About';
import ContactUs from '@/components/ContactUs';
import DashPage from '@/components/dash';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PrivacyPolicy from '@/components/PrivacyPolicy';
import TermsConditions from '@/components/TermsConditions';
import { withAuth } from '@/lib/withAuth';






function AboutUsPage() {
 return (
    <>
    <Header/>
    <About/>
    <Footer/>
    </>
 )
}


export default AboutUsPage