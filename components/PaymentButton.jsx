import { useState } from 'react'

export default function PaymentButton({handlePayment}) {
  const [isLoading, setIsLoading] = useState(false)

  // const handlePayment = () => {
  //   setIsLoading(true)
  //   // Mock Razorpay integration
  //   setTimeout(() => {
  //     alert('Razorpay payment initiated!')
  //     setIsLoading(false)
  //   }, 1500)
  // }

  return (
    (<button
      onClick={handlePayment}
      disabled={isLoading}
      
      className={`w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md 
                  transition-all duration-300 ease-in-out
                  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transform hover:-translate-y-1 active:translate-y-0`}
      aria-label="Pay with Razorpay">
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        'Pay with Razorpay'
      )}
    </button>)
  );
}

