'use client';

import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Check, Copy, Download, Edit, Link, Plus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import AddInvoiceForm from '@/components/add-invoice-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { EditPlanModal } from '@/components/edit-plan-modal';
import { encryptAmount } from '@/lib/utils';
import { withAuth } from '@/lib/withAuth';




const mockPlans = [
    { id: '1', name: 'Basic Monthly', price: 9.99, features: ['Feature 1', 'Feature 2'], category: 'monthly', isActive: true },
    { id: '2', name: 'Pro Monthly', price: 19.99, features: ['Feature 1', 'Feature 2', 'Feature 3'], category: 'monthly', isActive: false },
    { id: '3', name: 'Basic Yearly', price: 99.99, features: ['Feature 1', 'Feature 2'], category: 'yearly', isActive: false },
    { id: '4', name: 'Pro Yearly', price: 199.99, features: ['Feature 1', 'Feature 2', 'Feature 3'], category: 'yearly', isActive: false },
  ]

// Status options
const statusOptions = ['Pending', 'Approved', 'Rejected', 'Refunded'];
const paymentStatusOptions = ['Pending', 'Completed', 'Failed'];

// Mock data for invoices
const mockInvoices = [
  { 
    id: 'INV-001', 
    plan: 'Basic', 
    date: '2023-01-15', 
    dueDate: '2023-02-14',
    paymentId: 'PAY-001', 
    amount: 110.00, 
    status: 'Pending',
    paymentStatus: 'Pending',
    clientName: 'Hannah Morales',
    clientAddress: '123 Street, City',
    paymentLink: `${process.env.HOST_NAME}/pay?id=INV-001&planDemo=Gold&pt=${encryptAmount("110")}`,
    paymentMethod: {
      bankName: 'Borcelle Company',
      accountNo: '1234567890'
    }
  },
  { 
    id: 'INV-002', 
    plan: 'Premium', 
    date: '2023-01-16', 
    dueDate: '2023-02-15',
    paymentId: 'PAY-002', 
    amount: 199.99, 
    status: 'Approved',
    paymentStatus: 'Completed',
    clientName: 'John Doe',
    clientAddress: '456 Avenue, Town',
    paymentLink:`${process.env.HOST_NAME}/pay?id=INV-001&planDemo=Gold&pt=${encryptAmount("199")}`,
    paymentMethod: {
      bankName: 'Borcelle Company',
      accountNo: '1234567890'
    }
  },
];

function DashPage() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [plans, setPlans] = useState(mockPlans);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [isEditInvoiceOpen, setIsEditInvoiceOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const { toast } = useToast();
  const itemsPerPage = 10;

  const handleStatusChange = (invoiceId, newStatus, type) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === invoiceId ? { ...invoice, [type]: newStatus } : invoice
    ));
  };

  const handleCopyPaymentLink = (invoice) => {
    navigator.clipboard.writeText(invoice.paymentLink);
    setCopiedId(invoice.id);
    toast({
      title: "Payment link copied",
      description: "The payment link has been copied to your clipboard.",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddInvoice = (newInvoice) => {
    const selectedPlan = plans.find(p => p.name === newInvoice.plan);
    const invoice = {
      ...newInvoice,
      id: `INV-${invoices.length + 1}`.padStart(7, '0'),
      amount: selectedPlan?.price || 0,
      paymentMethod: {
        bankName: 'Borcelle Company',
        accountNo: '1234567890'
      },
      paymentLink: `${process.env.HOST_NAME}/pay?id=INV-${`INV-${invoices.length + 1}`.padStart(7, '0')}&planDemo=${selectedPlan.name}&pt=${encryptAmount(selectedPlan?.price) || encryptAmount(0)}`,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]
    };
    setInvoices([...invoices, invoice]);
    setIsAddInvoiceOpen(false);
  };

  const handleEditInvoice = (updatedInvoice) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === updatedInvoice.id ? updatedInvoice : invoice
    ));
    setIsEditInvoiceOpen(false);
    setSelectedInvoice(null);
  };

  const handleAddPlan = (newPlan) => {
    setPlans([...plans, { ...newPlan, id: plans.length + 1 }]);
    setIsAddPlanOpen(false);
  };

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
    doc.text('MCODEV', 150, 30);
    doc.setFontSize(14);
    doc.text('COMPANY', 150, 40);

    // Add invoice title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(40);
    doc.text('INVOICE', 105, 90, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`${invoice.id}`, 105, 97, { align: 'center' });
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Date : ${invoice.date}`, 105, 103, { align: 'center' });

    // Add invoice details
    doc.setFontSize(14);
    doc.text('INVOICE TO:', 20, 120);
    doc.setFontSize(20);
    doc.text(invoice.clientName, 20, 130);

   

    // Add plan details table
    doc.autoTable({
      startY: 150,
      head: [['Description', 'Qty', 'Price', 'Total']],
      body: [[
        invoice.plan,
        '1',
        `$${invoice.amount.toFixed(2)}`,
        `$${invoice.amount.toFixed(2)}`
      ]],
      headStyles: {
        fillColor: [0, 43, 150],
        textColor: [255, 255, 255],
        fontSize: 12
      },
      styles: {
        fontSize: 12,
        cellPadding: 8
      },
      theme: 'grid'
    });

    // Add subtotal and tax
    const finalY = (doc).lastAutoTable.finalY || 180;
    doc.text('Total AMount:', 110, finalY + 20);
    doc.text(`$${(invoice.amount).toFixed(2)}`, 170, finalY + 20);
   
    
   

  

    // Add contact information
    const contactY = finalY + 70;
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
    
   

    // Add bottom wave pattern
    doc.setFillColor(0, 43, 150);
    doc.rect(0, 280, 210, 17, 'F');
    
    // Save the PDF
    doc.save(`Invoice-${invoice.id}.pdf`);
  };

  const [activeTab, setActiveTab] = useState('invoices')
 
  const [editingPlan, setEditingPlan] = useState(null)

  const openEditModal = (plan) => {
    setEditingPlan(plan)
  }

  const closeEditModal = () => {
    setEditingPlan(null)
  }

  const savePlanChanges = (updatedPlan) => {
    setPlans(prevPlans =>
      prevPlans.map(plan =>
        plan.id === updatedPlan.id ? updatedPlan : plan
      )
    )
  }

  const financialData = {
    totalPaidAmount: 50000,
    totalInvoiceAmount: 75000,
    pendingInvoiceAmount: 25000,
    todayAmount: 1500,
  }
  
  const latestPayments = [
    { id: 1, date: '2023-05-01', amount: 1000, customer: 'John Doe' },
    { id: 2, date: '2023-05-02', amount: 1500, customer: 'Jane Smith' },
    { id: 3, date: '2023-05-03', amount: 2000, customer: 'Bob Johnson' },
    { id: 4, date: '2023-05-04', amount: 1200, customer: 'Alice Brown' },
    { id: 5, date: '2023-05-05', amount: 1800, customer: 'Charlie Davis' },
  ]

  const [data, setData] = useState(financialData)
  const [payments, setPayments] = useState(latestPayments)

  // Simulating data fetching
  useEffect(() => {
    // In a real application, you would fetch data from an API here
    setData(financialData)
    setPayments(latestPayments)
    setInvoices(invoices)
  }, [])
  return (
    <div className="container mx-auto py-10 max-w-6xl px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
       
        <div className="space-x-4">
          <Dialog open={isAddPlanOpen} onOpenChange={setIsAddPlanOpen}>
            <DialogTrigger asChild>
              <Button variant="outline"><Plus className="mr-2 h-4 w-4" /> Add New Plan</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Plan</DialogTitle>
              </DialogHeader>
              <AddPlanForm onSubmit={handleAddPlan} />
            </DialogContent>
          </Dialog>
          <Dialog open={isAddInvoiceOpen} onOpenChange={setIsAddInvoiceOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Add New Invoice</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Invoice</DialogTitle>
              </DialogHeader>
              <AddInvoiceForm onSubmit={handleAddInvoice} plans={plans} />
            </DialogContent>
          </Dialog>
        </div>
      </div>


      <Tabs defaultValue="dash" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">

          <TabsTrigger value="dash">Dash</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
        </TabsList>


        <TabsContent value="dash" className="mt-6">
      <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.totalPaidAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoice Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.totalInvoiceAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoice Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.pendingInvoiceAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.todayAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.customer}</TableCell>
                  <TableCell className="text-right">${payment.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </div>
        </TabsContent>


        <TabsContent value="invoices" className="mt-6">
        <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Payment ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.plan}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.paymentId}</TableCell>
                <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Select 
                    onValueChange={(value) => handleStatusChange(invoice.id, value, 'status')}
                    defaultValue={invoice.status}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue>{invoice.status}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select 
                    onValueChange={(value) => handleStatusChange(invoice.id, value, 'paymentStatus')}
                    defaultValue={invoice.paymentStatus}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue>{invoice.paymentStatus}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {paymentStatusOptions.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setIsEditInvoiceOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDownloadPDF(invoice)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyPaymentLink(invoice)}
                    >
                      {copiedId === invoice.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Link className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
        </TabsContent>
        <TabsContent value="plans" className="mt-6">
        <div>
     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPlans.map((plan) => (
           <Card key={plan.id} className={`${plan.isActive ? 'border-primary' : ''}`}>
           <CardHeader>
             <div className="flex justify-between items-center">
               <CardTitle>{plan.title}</CardTitle>
               <Button variant="ghost" size="icon" onClick={() => openEditModal(plan)}>
                 <Edit className="h-4 w-4" />
               </Button>
             </div>
             <CardDescription>${plan.price}/{plan.category === 'monthly' ? 'month' : 'year'}</CardDescription>
           </CardHeader>
           <CardContent>
             <ul className="list-disc list-inside">
               {plan.features.map((feature, index) => (
                 <li key={index}>{feature}</li>
               ))}
             </ul>
           </CardContent>
           <CardFooter className="flex justify-between items-center">
           
             <div className="flex items-center space-x-2">
               <Switch
                 checked={plan.isActive}
                 onCheckedChange={() => togglePlanStatus(plan.id)}
               />
               <span>{plan.isActive ? 'Active' : 'Inactive'}</span>
             </div>
           </CardFooter>
         </Card>
        ))}
      </div>
    </div>
        </TabsContent>


      </Tabs>
      <EditPlanModal
        plan={editingPlan}
        isOpen={!!editingPlan}
        onClose={closeEditModal}
        onSave={savePlanChanges}
      />



      <Dialog open={isEditInvoiceOpen} onOpenChange={setIsEditInvoiceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <AddInvoiceForm 
              onSubmit={handleEditInvoice} 
              plans={plans} 
              initialData={selectedInvoice} 
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="flex justify-center mt-6 space-x-2">
        <Button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button 
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={currentPage * itemsPerPage >= invoices.length}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function AddPlanForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [features, setFeatures] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      price: parseFloat(price),
      features: features.split('\n').filter(f => f.trim()),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Plan Name</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input 
          id="price" 
          type="number" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="features">Features (one per line)</Label>
        <Textarea 
          id="features" 
          value={features} 
          onChange={(e) => setFeatures(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Add Plan</Button>
    </form>
  );
}


export default DashPage