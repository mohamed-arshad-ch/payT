import DashPage from '@/components/dash';
import { withAuth } from '@/lib/withAuth';






function InvoicesPage() {
 return <DashPage/>
}


export default withAuth(InvoicesPage)