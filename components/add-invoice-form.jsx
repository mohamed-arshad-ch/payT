'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function AddInvoiceForm({ 
  onSubmit, 
  plans, 
  initialData, 
  isEditing = false 
}) {
  console.log(initialData);
  
  const [plan, setPlan] = useState(initialData?.plan || '');
  const [clientName, setClientName] = useState(initialData?.clientName || '');
  const [clientAddress, setClientAddress] = useState(initialData?.clientAddress || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    
    const invoice = {
      subscription_plan:plan,
      date: new Date().toISOString().split('T')[0],
      paymentId:  `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: initialData?.status || 'Pending',
      paymentStatus: initialData?.paymentStatus || 'Pending',
      clientName,
      invoiceNumber:initialData?.invoiceNumber,
      clientAddress,
      dueDate: new Date(dueDate).toISOString().split('T')[0],
      ...initialData,
    };
    console.log("in",invoice);

    onSubmit(invoice);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
     
     <div>
     <p>{initialData?.id}</p>
     </div>
      <div>
        <Label htmlFor="plan">Plan</Label>
        <Select onValueChange={setPlan} defaultValue={plan}>
          <SelectTrigger>
            <SelectValue placeholder="Select a plan" />
          </SelectTrigger>
          <SelectContent>
            {plans.map((p) => (
              <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="clientName">Client Name</Label>
        <Input 
          id="clientName" 
          value={clientName} 
          onChange={(e) => {
            console.log(e.target.value);
            setClientName(e.target.value)
            
          }}
          required
        />
      </div>
      <div>
        <Label htmlFor="clientAddress">Client Address</Label>
        <Textarea 
          id="clientAddress" 
          value={clientAddress} 
          onChange={(e) => setClientAddress(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input 
          id="dueDate" 
          type="date" 
          value={dueDate} 
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>
      <Button type="submit">{isEditing ? 'Update Invoice' : 'Add Invoice'}</Button>
    </form>
  );
}

