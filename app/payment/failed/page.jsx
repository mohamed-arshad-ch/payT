import { XCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

export default function PaymentFailedPage() {
  return (
    (<div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-red-600">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <p className="text-lg">We're sorry, but your payment could not be processed. Please try again or contact support.</p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Link href="/payment">
            <Button variant="outline">Try Again</Button>
          </Link>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>)
  );
}

