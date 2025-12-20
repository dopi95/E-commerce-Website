import React, { useEffect, useState } from 'react'
import { FaFilter, FaDownload } from 'react-icons/fa'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const AllOrders = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchAllOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, filter])

  const fetchAllOrders = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getAllOrders
      })
      
      if (response.data.success) {
        setOrders(response.data.data || [])
      }
    } catch (error) {
      console.log('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders
    if (filter === 'paid') {
      filtered = orders.filter(order => order.payment_status?.toLowerCase() === 'paid')
    } else if (filter === 'cod') {
      filtered = orders.filter(order => order.payment_status?.toLowerCase() === 'cash on delivery')
    }
    setFilteredOrders(filtered)
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    
    // Title
    const title = filter === 'all' ? 'All Orders Report' : 
                  filter === 'paid' ? 'Paid Orders Report' : 
                  'Cash on Delivery Orders Report'
    
    doc.setFontSize(20)
    doc.text(title, 20, 20)
    
    // Date
    doc.setFontSize(12)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35)
    
    // Table data
    const tableData = filteredOrders.map(order => [
      order._id?.slice(-8) || 'N/A',
      order.userId?.name || 'Guest User',
      order.product_details?.name || 'Product',
      `ETB ${order.totalAmt || 0}`,
      order.payment_status || 'Pending',
      order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'
    ])

    // Table
    doc.autoTable({
      head: [['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date']],
      body: tableData,
      startY: 50,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [16, 185, 129] }
    })

    // Summary
    const finalY = doc.lastAutoTable.finalY + 20
    doc.setFontSize(14)
    doc.text('Summary:', 20, finalY)
    doc.setFontSize(12)
    doc.text(`Total Orders: ${filteredOrders.length}`, 20, finalY + 15)
    doc.text(`Total Revenue: ETB ${filteredOrders.reduce((sum, order) => sum + (order.totalAmt || 0), 0)}`, 20, finalY + 30)

    // Save
    const fileName = filter === 'all' ? 'all-orders.pdf' : 
                     filter === 'paid' ? 'paid-orders.pdf' : 
                     'cod-orders.pdf'
    doc.save(fileName)
  }

  if (loading) {
    return (
      <div className='p-6'>
        <div className='animate-pulse space-y-4'>
          <div className='h-8 bg-gray-200 rounded w-1/4'></div>
          <div className='h-32 bg-gray-200 rounded'></div>
          <div className='h-32 bg-gray-200 rounded'></div>
        </div>
      </div>
    )
  }

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>All Orders Management</h1>
        <p className='text-gray-600'>Manage all customer orders from your store</p>
      </div>

      {/* Filter and Export Controls */}
      <div className='mb-6 flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm border'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <FaFilter className='text-gray-500' />
            <label className='text-sm font-medium text-gray-700'>Filter by Payment:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
            >
              <option value='all'>All Orders</option>
              <option value='paid'>Paid Orders</option>
              <option value='cod'>Cash on Delivery</option>
            </select>
          </div>
          <div className='text-sm text-gray-600'>
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
        
        <button
          onClick={exportToPDF}
          disabled={filteredOrders.length === 0}
          className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <FaDownload />
          Export PDF
        </button>
      </div>

      <div className='bg-white rounded-lg shadow-sm border'>
        <div className='p-4 border-b bg-gray-50'>
          <div className='grid grid-cols-6 gap-4 font-semibold text-gray-700 text-sm'>
            <div>Order ID</div>
            <div>Customer</div>
            <div>Items</div>
            <div>Total Amount</div>
            <div>Status</div>
            <div>Date</div>
          </div>
        </div>

        <div className='divide-y'>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <div key={order._id || index} className='p-4 hover:bg-gray-50'>
                <div className='grid grid-cols-6 gap-4 items-center text-sm'>
                  <div className='font-mono text-blue-600'>
                    #{order._id?.slice(-8) || 'N/A'}
                  </div>
                  
                  <div>
                    <div className='font-medium'>{order.userId?.name || 'Guest User'}</div>
                    <div className='text-gray-500 text-xs'>{order.userId?.email || 'No email provided'}</div>
                  </div>
                  
                  <div>
                    <div className='font-medium'>1 item</div>
                    <div className='text-gray-500 text-xs'>
                      {order.product_details?.name || 'Product'}
                    </div>
                  </div>
                  
                  <div className='font-semibold text-green-600'>
                    {DisplayPriceInRupees(order.totalAmt || 0)}
                  </div>
                  
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.payment_status?.toLowerCase() === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.payment_status || 'Pending'}
                    </span>
                  </div>
                  
                  <div className='text-gray-600'>
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: '2-digit' 
                    }) : 'N/A'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='p-8 text-center text-gray-500'>
              <div className='mb-4'>
                <svg className='mx-auto h-12 w-12 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                </svg>
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>No orders found</h3>
              <p className='text-gray-500'>
                {filter === 'all' ? 'Orders from customers will appear here.' :
                 filter === 'paid' ? 'No paid orders found.' :
                 'No cash on delivery orders found.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {filteredOrders.length > 0 && (
        <div className='mt-6 bg-white rounded-lg shadow-sm border p-4'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>Order Summary</h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='text-center p-4 bg-blue-50 rounded-lg'>
              <div className='text-2xl font-bold text-blue-600'>{filteredOrders.length}</div>
              <div className='text-blue-600 text-sm'>
                {filter === 'all' ? 'Total Orders' :
                 filter === 'paid' ? 'Paid Orders' :
                 'COD Orders'}
              </div>
            </div>
            <div className='text-center p-4 bg-green-50 rounded-lg'>
              <div className='text-2xl font-bold text-green-600'>
                {filteredOrders.filter(order => order.payment_status?.toLowerCase() === 'paid').length}
              </div>
              <div className='text-green-600 text-sm'>Paid Orders</div>
            </div>
            <div className='text-center p-4 bg-orange-50 rounded-lg'>
              <div className='text-2xl font-bold text-orange-600'>
                {DisplayPriceInRupees(filteredOrders.reduce((sum, order) => sum + (order.totalAmt || 0), 0))}
              </div>
              <div className='text-orange-600 text-sm'>Total Revenue</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllOrders