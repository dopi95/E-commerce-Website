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
              <div key={order._id+index+"order"} className='bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200'>
                {/* Header Section */}
                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4'>
                  <div className='flex-1'>
                    <p className='text-xs text-gray-500 uppercase tracking-wide'>Order No</p>
                    <p className='font-semibold text-gray-800 text-sm break-all'>{order?.orderId}</p>
                  </div>
                  <div className='text-left sm:text-right'>
                    <p className='text-xs text-gray-500 uppercase tracking-wide'>Total Amount</p>
                    <p className='font-bold text-lg text-green-600'>{DisplayPriceInRupees(order.totalAmt)}</p>
                  </div>
                </div>
                
                {/* Product Section */}
                <div className='flex gap-3 items-start mb-4'>
                  <img
                    src={order.product_details.image[0]} 
                    className='w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover border flex-shrink-0'
                    alt={order.product_details.name}
                  />  
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium text-gray-800 mb-1 text-sm leading-tight line-clamp-2'>{order.product_details.name}</p>
                    <p className='text-xs text-gray-600'>Subtotal: {DisplayPriceInRupees(order.subTotalAmt)}</p>
                  </div>
                </div>
                
                {/* Footer Section */}
                <div className='flex flex-col gap-3 pt-3 border-t border-gray-200'>
                  <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2'>
                    <div className='flex items-center gap-2'>
                      <span className='text-xs text-gray-500 uppercase tracking-wide'>Payment:</span>
                      {getPaymentStatusBadge(order.payment_status)}
                    </div>
                    <div className='text-xs text-gray-500'>
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
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default MyOrders
