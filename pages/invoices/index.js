'use client';
import DashPage from '@/components/dash';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { withAuth } from '@/lib/withAuth';






function InvoicesPage() {
    return (
        <>
        <Header/>
        <DashPage/>
        <Footer/>
        </>
     )
}


export default withAuth(InvoicesPage)