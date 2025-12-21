import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const user = useSelector(state => state.user)

  return (
    <section className='bg-white'>
        <div className='container mx-auto p-3 grid lg:grid-cols-[250px,1fr]'>
                {/**left for menu */}
                <div className='py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block border-r'>
                    <UserMenu/>
                </div>

                {/**right for content */}
                <div className='bg-white min-h-[75vh] pt-6 lg:pt-0 pb-24 lg:pb-0'>
                    <Outlet/>
                </div>
        </div>
        
        {/**Mobile Menu at bottom */}
        <div className='lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40'>
            <UserMenu/>
        </div>
    </section>
  )
}

export default Dashboard