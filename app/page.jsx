import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Payments from './components/payments'
import Plans from './components/plans'

export default function Home() {
  const [activeTab, setActiveTab] = useState('payments')

  return (
    (<main className="container mx-auto p-4 font-sans">
      <h1 className="text-3xl font-bold mb-6">PayT Dashboard</h1>
      <Tabs defaultValue="payments" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
        </TabsList>
        <TabsContent value="payments" className="mt-6">
          <Payments />
        </TabsContent>
        <TabsContent value="plans" className="mt-6">
          <Plans />
        </TabsContent>
      </Tabs>
    </main>)
  );
}

