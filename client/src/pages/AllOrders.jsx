import React, { useEffect, useState } from 'react'
import { FaFilter, FaDownload, FaTrash } from 'react-icons/fa'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import DisplayTable from '../components/DisplayTable'
import { createColumnHelper } from '@tanstack/react-table'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'

const AllOrders = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const columnHelper = createColumnHelper()

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

  const deleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        const response = await Axios({
          ...SummaryApi.deleteOrder,
          url: `${SummaryApi.deleteOrder.url}/${orderId}`
        })
        
        if (response.data.success) {
          toast.success('Order deleted successfully')
          fetchAllOrders()
        }
      } catch (error) {
        AxiosToastError(error)
      }
    }
  }

  const columns = [
    columnHelper.accessor('_id', {
      header: 'Order ID',
      cell: ({ row }) => (
        <span className='font-mono text-blue-600'>
          #{row.original._id?.slice(-8) || 'N/A'}
        </span>
      )
    }),
    columnHelper.accessor('userId.name', {
      header: 'Customer',
      cell: ({ row }) => (
        <div>
          <div className='font-medium'>{row.original.userId?.name || 'Guest User'}</div>
          <div className='text-gray-500 text-xs'>{row.original.userId?.email || 'No email'}</div>
        </div>
      )
    }),
    columnHelper.accessor('product_details.name', {
      header: 'Product',
      cell: ({ row }) => (
        <div className='text-sm'>{row.original.product_details?.name || 'Product'}</div>
      )
    }),
    columnHelper.accessor('totalAmt', {
      header: 'Amount',
      cell: ({ row }) => (
        <span className='font-semibold text-green-600'>
          {DisplayPriceInRupees(row.original.totalAmt || 0)}
        </span>
      )
    }),
    columnHelper.accessor('payment_status', {
      header: 'Status',
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.original.payment_status?.toLowerCase() === 'paid' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {row.original.payment_status || 'Pending'}
        </span>
      )
    }),
    columnHelper.accessor('createdAt', {
      header: 'Date',
      cell: ({ row }) => (
        <div className='text-sm'>
          {row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: '2-digit' 
          }) : 'N/A'}
        </div>
      )
    }),
    columnHelper.accessor('actions', {
      header: 'Actions',
      cell: ({ row }) => (
        <button
          onClick={() => deleteOrder(row.original._id)}
          className='p-2 bg-red-100 rounded-full text-red-500 hover:text-red-600'
          title='Delete Order'
        >
          <FaTrash size={16} />
        </button>
      )
    })
  ]

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
    <div className='w-full max-w-full'>
      <div className='mb-4 sm:mb-6'>
        <h1 className='text-xl sm:text-2xl font-bold text-gray-800'>All Orders Management</h1>
        <p className='text-gray-600 text-sm sm:text-base'>Manage all customer orders from your store</p>
      </div>

      {/* Filter and Export Controls */}
      <div className='mb-4 sm:mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-3 sm:p-4 rounded-lg shadow-sm border'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto'>
          <div className='flex items-center gap-2 w-full sm:w-auto'>
            <FaFilter className='text-gray-500 flex-shrink-0' />
            <label className='text-xs sm:text-sm font-medium text-gray-700 flex-shrink-0'>Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className='px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-xs sm:text-sm flex-1 sm:flex-none'
            >
              <option value='all'>All Orders</option>
              <option value='paid'>Paid Orders</option>
              <option value='cod'>Cash on Delivery</option>
            </select>
          </div>
          <div className='text-xs sm:text-sm text-gray-600'>
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
        
        <button
          onClick={exportToPDF}
          disabled={filteredOrders.length === 0}
          className='flex items-center gap-2 px-3 sm:px-4 py-2 border-2 border-yellow-500 text-yellow-600 rounded-md hover:bg-yellow-500 hover:text-white hover:font-bold disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm w-full sm:w-auto justify-center transition-all'
        >
          <FaDownload />
          Export PDF
        </button>
      </div>

      <div className='overflow-auto w-full max-w-[95vw]'>
        <DisplayTable
          data={filteredOrders}
          column={columns}
        />
      </div>

      {filteredOrders.length > 0 && (
        <div className='mt-4 sm:mt-6 bg-white rounded-lg shadow-sm border p-3 sm:p-4'>
          <h3 className='text-base sm:text-lg font-semibold text-gray-800 mb-4'>Order Summary</h3>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <div className='text-center p-3 sm:p-4 bg-blue-50 rounded-lg'>
              <div className='text-xl sm:text-2xl font-bold text-blue-600'>{filteredOrders.length}</div>
              <div className='text-blue-600 text-xs sm:text-sm'>
                {filter === 'all' ? 'Total Orders' :
                 filter === 'paid' ? 'Paid Orders' :
                 'COD Orders'}
              </div>
            </div>
            <div className='text-center p-3 sm:p-4 bg-green-50 rounded-lg'>
              <div className='text-xl sm:text-2xl font-bold text-green-600'>
                {filteredOrders.filter(order => order.payment_status?.toLowerCase() === 'paid').length}
              </div>
              <div className='text-green-600 text-xs sm:text-sm'>Paid Orders</div>
            </div>
            <div className='text-center p-3 sm:p-4 bg-orange-50 rounded-lg'>
              <div className='text-xl sm:text-2xl font-bold text-orange-600'>
                {DisplayPriceInRupees(filteredOrders.reduce((sum, order) => sum + (order.totalAmt || 0), 0))}
              </div>
              <div className='text-orange-600 text-xs sm:text-sm'>Total Revenue</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllOrders