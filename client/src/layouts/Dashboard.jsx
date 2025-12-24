import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const user = useSelector(state => state.user)

  return (
    <section className='bg-gray-50 min-h-screen overflow-hidden'>
        <div className='container mx-auto px-2 sm:px-4 grid lg:grid-cols-[250px,1fr] gap-4 lg:gap-6 lg:pt-4'>
                {/**left for menu */}
                <div className='py-4 sticky top-4 max-h-[calc(100vh-32px)] overflow-y-auto hidden lg:block border-r bg-white rounded-lg'>
                    <UserMenu/>
                </div>

                {/**right for content */}
                <div className='bg-white rounded-lg shadow-sm min-h-[calc(100vh-2rem)] p-4 sm:p-6 lg:mt-0 mt-16 overflow-hidden'>
                    <Outlet/>
                </div>
        </div>
    </section>
  )
}

export default Dashboard