import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mockPlans = [
  { id: '1', title: 'Basic Monthly', price: 9.99, features: ['Feature 1', 'Feature 2'], category: 'monthly', isActive: true },
  { id: '2', title: 'Pro Monthly', price: 19.99, features: ['Feature 1', 'Feature 2', 'Feature 3'], category: 'monthly', isActive: false },
  { id: '3', title: 'Basic Yearly', price: 99.99, features: ['Feature 1', 'Feature 2'], category: 'yearly', isActive: false },
  { id: '4', title: 'Pro Yearly', price: 199.99, features: ['Feature 1', 'Feature 2', 'Feature 3'], category: 'yearly', isActive: false },
]

export default function Plans() {
  const [category, setCategory] = useState('all')

  const filteredPlans = category === 'all' ? mockPlans : mockPlans.filter(plan => plan.category === category)

  return (
    (<div>
      <div className="mb-6">
        <Select onValueChange={(value) => setCategory(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Card key={plan.id} className={`${plan.isActive ? 'border-primary' : ''}`}>
            <CardHeader>
              <CardTitle>{plan.title}</CardTitle>
              <CardDescription>${plan.price}/{plan.category === 'monthly' ? 'month' : 'year'}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={plan.isActive ? 'secondary' : 'default'}>
                {plan.isActive ? 'Current Plan' : 'Subscribe'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>)
  );
}

