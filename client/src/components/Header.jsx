import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { Link, useLocation,useNavigate } from 'react-router-dom'
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp  } from "react-icons/go";
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';
import isAdmin from '../utils/isAdmin';
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

const Header = () => {
    const [ isMobile ] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const navigate = useNavigate()
    const user = useSelector((state)=> state?.user)
    const [openUserMenu,setOpenUserMenu] = useState(false)
    const [openMobileMenu,setOpenMobileMenu] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const { totalPrice, totalQty} = useGlobalContext()
    const [openCartSection,setOpenCartSection] = useState(false)
    
    const redirectToLoginPage = ()=>{
        navigate("/login")
    }

    const handleCloseUserMenu = ()=>{
        setOpenUserMenu(false)
    }

    const handleMobileUser = ()=>{
        if(!user._id){
            navigate("/login")
            return
        }
        navigate("/dashboard/profile")
    }
    
    // Show minimal header only when admin is on dashboard pages
    if (isAdmin(user?.role) && location.pathname.startsWith('/dashboard')) {
        return null
    }

  return (
    <header className='h-16 lg:h-20 lg:shadow-md sticky top-0 z-40 bg-white border-b border-gray-100'>
        <div className='container mx-auto flex items-center px-4 justify-between h-full'>
            {/**logo */}
            <div className='flex items-center'>
                <Link to={isAdmin(user?.role) ? "/dashboard" : "/"} className='flex justify-center items-center gap-2'>
                    <img src={logo} alt='Fresh Corner Logo' className='h-8 w-8 lg:h-10 lg:w-10' />
                    <h1 className='text-lg lg:text-2xl font-bold'>
                        <span className='text-green-600'>Fresh</span>
                        <span className='text-yellow-500'> Corner</span>
                    </h1>
                </Link>
            </div>

            {/**Search - Desktop */}
            <div className='hidden lg:block flex-1 max-w-2xl mx-8'>
                <Search/>
            </div>

            {/**Desktop Navigation */}
            <div className='hidden lg:flex items-center gap-6'>
                <Link to='/contact' className='text-gray-700 hover:text-green-600 font-medium transition-colors duration-300'>
                    Contact
                </Link>
                {
                    user?._id ? (
                        <div className='relative'>
                            <div onClick={()=>setOpenUserMenu(preve => !preve)} className='flex select-none items-center gap-1 cursor-pointer hover:text-green-600 transition-colors'>
                                <p className='font-medium'>Account</p>
                                {
                                    openUserMenu ? (
                                          <GoTriangleUp size={20}/> 
                                    ) : (
                                        <GoTriangleDown size={20}/>
                                    )
                                }
                            </div>
                            {
                                openUserMenu && (
                                    <div className='absolute right-0 top-12'>
                                        <div className='bg-white rounded-lg p-4 min-w-52 shadow-xl border border-gray-100'>
                                            <UserMenu close={handleCloseUserMenu}/>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    ) : (
                        <button onClick={redirectToLoginPage} className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors'>Login</button>
                    )
                }
                {!isAdmin(user?.role) && (
                    <button onClick={()=>setOpenCartSection(true)} className='flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white transition-colors'>
                        <div className='animate-bounce'>
                            <BsCart4 size={20}/>
                        </div>
                        <div className='font-medium text-sm'>
                            {
                                cartItem[0] ? (
                                    <div>
                                        <p>{totalQty} Items</p>
                                        <p>{DisplayPriceInRupees(totalPrice)}</p>
                                    </div>
                                ) : (
                                    <p>My Cart</p>
                                )
                            }
                        </div>    
                    </button>
                )}
            </div>

            {/**Mobile Navigation */}
            <div className='lg:hidden flex items-center gap-3'>
                {!isAdmin(user?.role) && cartItem[0] && (
                    <button onClick={()=>setOpenCartSection(true)} className='relative p-2'>
                        <BsCart4 size={24} className='text-gray-700'/>
                        <span className='absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium'>
                            {totalQty}
                        </span>
                    </button>
                )}
                
                <button 
                    onClick={()=>setOpenMobileMenu(!openMobileMenu)} 
                    className='p-2 text-gray-700 hover:text-green-600 transition-colors'
                >
                    {openMobileMenu ? <IoClose size={24}/> : <HiOutlineMenuAlt3 size={24}/>}
                </button>
            </div>
        </div>

        {/**Mobile Search Bar */}
        {!isSearchPage && (
            <div className='lg:hidden px-4 pb-3 border-b border-gray-100'>
                <Search/>
            </div>
        )}

        {/**Mobile Menu Overlay */}
        {openMobileMenu && (
            <div className='lg:hidden fixed inset-0 top-16 bg-white z-50 border-t border-gray-100'>
                <div className='p-4 space-y-4'>
                    <Link 
                        to='/contact' 
                        onClick={()=>setOpenMobileMenu(false)}
                        className='block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors'
                    >
                        Contact
                    </Link>
                    
                    {user?._id ? (
                        <div className='space-y-2'>
                            <Link 
                                to='/dashboard/profile' 
                                onClick={()=>setOpenMobileMenu(false)}
                                className='block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors'
                            >
                                My Account
                            </Link>
                            <Link 
                                to='/dashboard/myorders' 
                                onClick={()=>setOpenMobileMenu(false)}
                                className='block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors'
                            >
                                My Orders
                            </Link>
                            <Link 
                                to='/dashboard/address' 
                                onClick={()=>setOpenMobileMenu(false)}
                                className='block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors'
                            >
                                My Addresses
                            </Link>
                        </div>
                    ) : (
                        <button 
                            onClick={()=>{redirectToLoginPage(); setOpenMobileMenu(false)}}
                            className='w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors'
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        )}

        {openCartSection && (
            <DisplayCartItem close={()=>setOpenCartSection(false)}/>
        )}
    </header>
  )
}

export default Header