import { useRouter } from "next/router"
import { useState } from "react"

export default function PaymentSuccess() {
const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const router = useRouter()

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  // Mock payment details
  const paymentDetails = {
    planName: "Gold Plan",
    amountPaid: "₹499",
    paymentId: "PAY-1234567890"
  }

  return (
    (<div
      className="min-h-screen bg-gradient-to-br  flex items-center justify-center p-4">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={200} />
      <div
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full space-y-8 text-center relative overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r "></div>
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
        <h1 className="text-3xl font-bold text-gray-800">Payment Successful!</h1>
        <div className="space-y-4">
          <p className="text-xl text-gray-600">Thank you for your purchase</p>
          <div className="bg-gray-50 rounded-xl p-6 space-y-2">
            <p className="text-gray-700"><span className="font-semibold">Plan:</span> {paymentDetails.planName}</p>
            <p className="text-gray-700"><span className="font-semibold">Amount Paid:</span> {paymentDetails.amountPaid}</p>
            <p className="text-gray-700"><span className="font-semibold">Payment ID:</span> {paymentDetails.paymentId}</p>
          </div>
        </div>
        <Button
          onClick={() => router.push('/dashboard')}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md 
                     transition-all duration-300 ease-in-out hover:from-blue-600 hover:to-purple-700
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
                     transform hover:-translate-y-1 active:translate-y-0">
          Go to Dashboard
        </Button>
      </div>
    </div>)
  );
}