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
import { dateFormatToDay, encryptAmount } from '@/lib/utils';

import axios from 'axios';
import Cookies from 'js-cookie';







// Status options
const statusOptions = ['Pending', 'Approved', 'Rejected', 'Refunded'];
const paymentStatusOptions = ['Pending', 'Completed', 'Failed'];


function DashPage() {
  const [invoices, setInvoices] = useState([]);
  const [plans, setPlans] = useState([]);
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

  const handleAddInvoice = async (newInvoice) => {
    console.log(newInvoice);
    console.log(plans);
    
    const selectedPlan = plans.find(p => p.name === newInvoice.subscription_plan);
    const invoiceNumber = `INV-${(invoices.length + 1).toString().padStart(3, '0')}`;
    const paymentLink = `${process.env.NEXT_PUBLIC_HOST_NAME}/pay?id=${invoiceNumber}&planDemo=${selectedPlan.name}&pt=${encryptAmount(selectedPlan?.price) || encryptAmount(0)}`;

    try {
      console.log("selectedPlan",selectedPlan);
      
      const user_token = Cookies.get("user_token");
     const res =  await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/invoices`, {
        data: {
          invoiceNumber,
          subscription_plan: selectedPlan.id,
          dueDate:  new Date(newInvoice.dueDate).toISOString().split('T')[0] ,
          clientName: newInvoice.clientName,
          clientAddress: newInvoice.clientAddress,
          paymentLink,
          publishedAt:new Date(),
          paymentId:newInvoice.paymentId
        },
      }, {
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      });

      console.log(res.data);
      
      // Refresh the invoice list
      fetchInvoices();
      setIsAddInvoiceOpen(false);
    } catch (error) {
      console.error('Error adding invoice:', error);
    }
  };

  const handleEditInvoice = async (updatedInvoice) => {
    console.log(updatedInvoice,"updatedInvoice");
    
    try {
      const user_token = Cookies.get("user_token");
      const selectedPlan = plans.find(p => p.name === updatedInvoice.subscription_plan);
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/invoices/${updatedInvoice.documentId}`, {
        data: {
          subscription_plan: selectedPlan.id, // Assuming planId is part of updatedInvoice
          dueDate: new Date(updatedInvoice.dueDate).toISOString().split('T')[0] ,
          clientName: updatedInvoice.clientName,
          clientAddress: updatedInvoice.clientAddress,
        },
      }, {
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      });

      // Update local state
      fetchInvoices()
      setIsEditInvoiceOpen(false);
      setSelectedInvoice(null);
    } catch (error) {
      console.error('Error updating invoice:', error);
    }
  };

  const handleAddPlan = async (newPlan) => {
    try {
     
      const user_token = Cookies.get("user_token");
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/subscription-plans`, {
        data:{
          "name":newPlan.name,
          "price":newPlan.price,
          "features":newPlan.features,
          "category":newPlan.category
        },
      }, {
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      });
      fetchPlans();
      setIsAddPlanOpen(false);
    } catch (error) {
      console.error('Error adding plan:', error);
    }
  };

  const handleDownloadPDF = (invoice) => {

    console.log("iiii",invoice);
    
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

  const [activeTab, setActiveTab] = useState('invoices')
 
  const [editingPlan, setEditingPlan] = useState(null)

  const openEditModal = (plan) => {
    setEditingPlan(plan)
  }

  const closeEditModal = () => {
    setEditingPlan(null)
  }

  const savePlanChanges = async (updatedPlan) => {
    try {
      const user_token = Cookies.get("user_token");
     
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/subscription-plans/${updatedPlan.documentId}`, {
        data: {
          name:updatedPlan.name,
          "price":calculateTotalAmount(updatedPlan.price),
        "features":updatedPlan.features,
        "category":updatedPlan.category

        },
      }, {
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      });
      fetchPlans();
      closeEditModal();
    } catch (error) {
      console.error('Error updating plan:', error);
    }
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

  const fetchInvoices = async () => {
    try {
      const user_token = Cookies.get("user_token");
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/invoices?populate=*`, {
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      });
      const fetchedInvoices = response.data.data.map(invoice => ({
        invoiceNumber: invoice.invoiceNumber,
        id: invoice.id,
        plan: invoice.subscription_plan.name,
        date: new Date(invoice.createdAt).toLocaleDateString(),
        dueDate: new Date(invoice.dueDate).toISOString().split('T')[0] ,
        paymentId: invoice.paymentId,
        amount: invoice.subscription_plan.price,
        documentId:invoice.documentId,
        subscription_plan:invoice.subscription_plan,
        status: invoice.transactionStatus,
        paymentStatus: invoice.paymentStatus,
        clientName: invoice.clientName,
        clientAddress: invoice.clientAddress,
        paymentLink: invoice.paymentLink,
        
      }));
      setInvoices(fetchedInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  // Simulating data fetching
  useEffect(() => {
    // Fetch invoices from the API
   
    fetchInvoices();
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
            const user_token = Cookies.get("user_token");

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/subscription-plans`, {
        headers: {
          Authorization: `Bearer ${user_token}`,
        },
      });
      setPlans(response.data.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const isDueDateClose = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = Math.abs(due - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7; // Highlight if due date is within 7 days
  };
  
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
            <div className="text-2xl font-bold">₹{data.totalPaidAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoice Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{data.totalInvoiceAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoice Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{data.pendingInvoiceAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{data.todayAmount.toLocaleString()}</div>
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
                  <TableCell className="text-right">₹{payment.amount.toLocaleString()}</TableCell>
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
              <TableHead>Due Date</TableHead>
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
              <TableRow 
                key={invoice.id} 
               
              >
                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                <TableCell className="font-medium">{invoice.dueDate}</TableCell>
                <TableCell>{invoice.plan}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.paymentId}</TableCell>
                <TableCell>₹{invoice.amount.toFixed(2)}</TableCell>
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
        {plans.map((plan) => (
           <Card key={plan.id} className={`${plan.isActive ? 'border-primary' : ''}`}>
           <CardHeader>
             <div className="flex justify-between items-center">
               <CardTitle>{plan.name}</CardTitle>
               <Button variant="ghost" size="icon" onClick={() => openEditModal(plan)}>
                 <Edit className="h-4 w-4" />
               </Button>
             </div>
             <CardDescription>₹{plan.price}/{plan.category}</CardDescription>
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

function calculateTotalAmount(amount) {
  // Calculate 2% of the amount
  const twoPercent = Number(amount) * 0.02;

  // Calculate 18% tax on the 2% amount
  const tax = twoPercent * 0.18;

  // Calculate the total amount
  const totalAmount = Number(amount) + twoPercent + tax;

  return totalAmount;
}

function AddPlanForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [features, setFeatures] = useState('');
  const [category, setCategory] = useState('daily');

  const handleCategoryChange = (value)=>{
    setCategory(value)
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      price: calculateTotalAmount(parseFloat(price)),
      features: features.split('\n').filter(f => f.trim()),
      category
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
      <Select 
                    onValueChange={(value) => handleCategoryChange(value)}
                    defaultValue={category}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue>{"Daily"}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      
                        <SelectItem key={1} value={"daily"}>{"Daily"}</SelectItem>
                        <SelectItem key={4} value={"weekly"}>{"Weekly"}</SelectItem>
                        <SelectItem key={2} value={"monthly"}>{"Monthly"}</SelectItem>
                        <SelectItem key={3} value={"yearly"}>{"Yearly"}</SelectItem>
                        
                      
                    </SelectContent>
                  </Select>
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