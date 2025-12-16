import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaCheckCircle } from 'react-icons/fa'

const Success = () => {
  const location = useLocation()
    
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
      <div className='bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center'>
        <FaCheckCircle className='text-green-500 text-6xl mx-auto mb-4' />
        <h1 className='text-2xl font-bold text-gray-800 mb-2'>
          {Boolean(location?.state?.text) ? location?.state?.text : "Payment" } Successful!
        </h1>
        <p className='text-gray-600 mb-6'>
          Your order has been processed successfully.
        </p>
        
        <div className='flex flex-col gap-3'>
          <Link 
            to="/dashboard/myorders" 
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
          >
            View My Orders
          </Link>
          <Link 
            to="/" 
            className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Success
