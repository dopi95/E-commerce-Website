import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { HiOutlineExternalLink } from "react-icons/hi";
import isAdmin from '../utils/isAdmin'
import logo from '../assets/logo.png'
import UsersAdmin from '../pages/UsersAdmin';

const UserMenu = ({close}) => {
   const user = useSelector((state)=> state.user)
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const handleLogout = async()=>{
        try {
          const response = await Axios({
             ...SummaryApi.logout
          })
          console.log("logout",response)
          if(response.data.success){
            if(close){
              close()
            }
            dispatch(logout())
            localStorage.clear()
            toast.success(response.data.message)
            navigate("/")
          }
        } catch (error) {
          console.log(error)
          AxiosToastError(error)
        }
   }

   const handleClose = ()=>{
      if(close){
        close()
      }
   }
  return (
    <div>
        {isAdmin(user.role) && (
            <div className='mb-4 pb-4 border-b'>
                <Link to="/dashboard" className='flex items-center gap-2'>
                    <img src={logo} alt='Fresh Corner Logo' className='h-8 w-8' />
                    <h1 className='text-lg font-bold'>
                        <span className='text-green-600'>Fresh</span>
                        <span className='text-yellow-500'> Corner</span>
                    </h1>
                </Link>
            </div>
        )}
        <div className='font-semibold'>My Account</div>
        <div className='text-sm flex items-center gap-2'>
          <span className='max-w-52 text-ellipsis line-clamp-1'>{user.name || user.mobile} <span className='text-medium text-red-600'>{user.role === "ADMIN" ? "(Admin)" : "" }</span></span>
          <Link onClick={handleClose} to={"/dashboard/profile"} className='hover:text-primary-200'>
            <HiOutlineExternalLink size={15}/>
          </Link>
        </div>

        <Divider/>

        <div className='text-sm grid gap-1'>
            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard"} className='px-2 hover:bg-orange-200 py-1 font-semibold text-blue-600'>Admin Dashboard</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/category"} className='px-2 hover:bg-orange-200 py-1'>Category</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/subcategory"} className='px-2 hover:bg-orange-200 py-1'>Sub Category</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/upload-product"} className='px-2 hover:bg-orange-200 py-1'>Upload Product</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/product"} className='px-2 hover:bg-orange-200 py-1'>Product</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/orders"} className='px-2 hover:bg-orange-200 py-1'>All Orders</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/contacts"} className='px-2 hover:bg-orange-200 py-1'>Contact Messages</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/users"} className='px-2 hover:bg-orange-200 py-1'>Users</Link>
              )
            }

            {!isAdmin(user.role) && (
              <>
                <Link onClick={handleClose} to={"/dashboard/myorders"} className='px-2 hover:bg-orange-200 py-1'>My Orders</Link>
                <Link onClick={handleClose} to={"/dashboard/address"} className='px-2 hover:bg-orange-200 py-1'>Save Address</Link>
              </>
            )}

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/"} className='mx-2 mt-4 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 font-medium text-center border border-green-300'>← Back to Website</Link>
              )
            }

            <button onClick={handleLogout} className='mx-2 mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium border border-red-300'>Log Out</button>

        </div>
    </div>
  )
}

export default UserMenu
