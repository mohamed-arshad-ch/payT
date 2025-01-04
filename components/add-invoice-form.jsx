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
  const [plan, setPlan] = useState(initialData?.plan || '');
  const [clientName, setClientName] = useState(initialData?.clientName || '');
  const [clientAddress, setClientAddress] = useState(initialData?.clientAddress || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const invoice = {
      plan,
      date: new Date().toISOString().split('T')[0],
      paymentId: initialData?.paymentId || `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: initialData?.status || 'Pending',
      paymentStatus: initialData?.paymentStatus || 'Pending',
      clientName,
      clientAddress,
      ...(initialData && { id: initialData.id }),
    };
    onSubmit(invoice);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          onChange={(e) => setClientName(e.target.value)}
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
      <Button type="submit">{isEditing ? 'Update Invoice' : 'Add Invoice'}</Button>
    </form>
  );
}

