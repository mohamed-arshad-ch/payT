'use client';
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const mockPayments = [
  { id: '1', date: '2023-05-01', transactionId: 'TRX001', amount: 100, status: 'success' },
  { id: '2', date: '2023-05-02', transactionId: 'TRX002', amount: 200, status: 'failed' },
  { id: '3', date: '2023-05-03', transactionId: 'TRX003', amount: 150, status: 'pending' },
  // Add more mock data as needed
]

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredPayments = mockPayments.filter(payment => 
    payment.date.includes(searchTerm) || payment.transactionId.includes(searchTerm))

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)
  const paginatedPayments = filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    (<div>
      <Input
        type="search"
        placeholder="Search by date or transaction ID"
        className="mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedPayments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.date}</TableCell>
              <TableCell>{payment.transactionId}</TableCell>
              <TableCell>${payment.amount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge
                  variant={payment.status === 'success' ? 'success' : payment.status === 'failed' ? 'destructive' : 'default'}>
                  {payment.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}>
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </div>)
  );
}

