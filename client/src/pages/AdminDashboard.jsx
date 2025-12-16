import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  })
  const [topProducts, setTopProducts] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  
  const user = useSelector(state => state.user)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch categories
      const categoryResponse = await Axios({...SummaryApi.getCategory})
      
      // Fetch products
      const productResponse = await Axios({
        ...SummaryApi.getProduct,
        data: { page: 1, limit: 1000 }
      })

      // Fetch orders
      const orderResponse = await Axios({...SummaryApi.getAllOrders})
      
      // Fetch user count
      const userCountResponse = await Axios({...SummaryApi.getUserCount})
      
      const orders = orderResponse.data.data || []
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmt || 0), 0)
      
      setStats({
        totalProducts: productResponse.data.totalCount || 0,
        totalCategories: categoryResponse.data.data?.length || 0,
        totalUsers: userCountResponse.data.data || 0, // Real users count from database
        totalOrders: orders.length,
        totalRevenue: totalRevenue
      })

      // Set latest products (most recent 3 products)
      const products = productResponse.data.data || []
      setTopProducts(products.slice(0, 3))

      // Set recent activity based on real data
      const activities = [
        { text: `${products.length} products in inventory`, color: 'blue' },
        { text: `${categoryResponse.data.data?.length || 0} categories active`, color: 'green' },
        { text: `${orders.length} total orders`, color: 'orange' }
      ]
      setRecentActivity(activities)

    } catch (error) {
      console.log('Error fetching stats:', error)
    }
  }

  return (
    <div className='p-6'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Admin Dashboard</h1>
        <p className='text-gray-600'>Welcome back, {user?.name}! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8'>
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-blue-600 text-sm font-medium'>Total Products</p>
              <p className='text-2xl font-bold text-blue-800'>{stats.totalProducts}</p>
            </div>
            <div className='bg-blue-100 p-3 rounded-full'>
              <svg className='w-6 h-6 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'/>
              </svg>
            </div>
          </div>
        </div>

        <div className='bg-green-50 border border-green-200 rounded-lg p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-green-600 text-sm font-medium'>Categories</p>
              <p className='text-2xl font-bold text-green-800'>{stats.totalCategories}</p>
            </div>
            <div className='bg-green-100 p-3 rounded-full'>
              <svg className='w-6 h-6 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z'/>
              </svg>
            </div>
          </div>
        </div>

        <div className='bg-purple-50 border border-purple-200 rounded-lg p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-purple-600 text-sm font-medium'>Total Users</p>
              <p className='text-2xl font-bold text-purple-800'>{stats.totalUsers}</p>
            </div>
            <div className='bg-purple-100 p-3 rounded-full'>
              <svg className='w-6 h-6 text-purple-600' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z'/>
              </svg>
            </div>
          </div>
        </div>

        <div className='bg-orange-50 border border-orange-200 rounded-lg p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-orange-600 text-sm font-medium'>Total Orders</p>
              <p className='text-2xl font-bold text-orange-800'>{stats.totalOrders}</p>
            </div>
            <div className='bg-orange-100 p-3 rounded-full'>
              <svg className='w-6 h-6 text-orange-600' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z'/>
              </svg>
            </div>
          </div>
        </div>

        <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-red-600 text-sm font-medium'>Revenue</p>
              <p className='text-2xl font-bold text-red-800'>{DisplayPriceInRupees(stats.totalRevenue)}</p>
            </div>
            <div className='bg-red-100 p-3 rounded-full'>
              <svg className='w-6 h-6 text-red-600' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z'/>
                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z' clipRule='evenodd'/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className='bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>Quick Actions</h3>
          <div className='space-y-3'>
            <Link to='/dashboard/upload-product' className='block w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 font-medium transition-colors'>
              Add New Product
            </Link>
            <Link to='/dashboard/category' className='block w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 font-medium transition-colors'>
              Manage Categories
            </Link>
            <Link to='/dashboard/orders' className='block w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 font-medium transition-colors'>
              View All Orders
            </Link>
          </div>
        </div>

        <div className='bg-white border rounded-lg p-6'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>Store Statistics</h3>
          <div className='space-y-3 text-sm'>
            {recentActivity.map((activity, index) => (
              <div key={index} className='flex items-center gap-3'>
                <div className={`w-2 h-2 bg-${activity.color}-500 rounded-full`}></div>
                <span className='text-gray-600'>{activity.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-white border rounded-lg p-6'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>Latest Products</h3>
          <div className='space-y-3 text-sm'>
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={index} className='flex justify-between items-center'>
                  <span className='text-gray-600 truncate'>{product.name}</span>
                  <span className='font-medium text-green-600'>{DisplayPriceInRupees(product.price)}</span>
                </div>
              ))
            ) : (
              <span className='text-gray-500'>No products found</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard