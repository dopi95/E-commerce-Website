import React from 'react'
import { useSelector } from 'react-redux'
import NoData from '../components/NoData'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)

  const getPaymentStatusBadge = (status) => {
    if (status === 'PAID') {
      return <span className='bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium'>Paid</span>
    } else if (status === 'CASH ON DELIVERY') {
      return <span className='bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium'>Cash on Delivery</span>
    } else {
      return <span className='bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium'>{status}</span>
    }
  }

  console.log("order Items",orders)
  return (
    <div className='bg-gray-50 min-h-screen'>
      <div className='bg-white shadow-md p-4 font-semibold border-b'>
        <h1 className='text-xl text-gray-800'>My Orders</h1>
      </div>
      
      <div className='container mx-auto p-4'>
        {
          !orders[0] && (
            <NoData/>
          )
        }
        {
          orders.map((order,index)=>{
            return(
              <div key={order._id+index+"order"} className='bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200'>
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <p className='text-sm text-gray-600'>Order No</p>
                    <p className='font-semibold text-gray-800'>{order?.orderId}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm text-gray-600'>Total Amount</p>
                    <p className='font-bold text-lg text-green-600'>{DisplayPriceInRupees(order.totalAmt)}</p>
                  </div>
                </div>
                
                <div className='flex gap-4 items-center mb-4'>
                  <img
                    src={order.product_details.image[0]} 
                    className='w-16 h-16 rounded-lg object-cover border'
                    alt={order.product_details.name}
                  />  
                  <div className='flex-1'>
                    <p className='font-medium text-gray-800 mb-1'>{order.product_details.name}</p>
                    <p className='text-sm text-gray-600'>Subtotal: {DisplayPriceInRupees(order.subTotalAmt)}</p>
                  </div>
                </div>
                
                <div className='flex justify-between items-center pt-4 border-t border-gray-200'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-gray-600'>Payment Status:</span>
                    {getPaymentStatusBadge(order.payment_status)}
                  </div>
                  <div className='text-sm text-gray-500'>
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default MyOrders
