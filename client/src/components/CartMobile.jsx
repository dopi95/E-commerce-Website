import React from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { FaCartShopping } from 'react-icons/fa6'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from 'react-redux'

const CartMobileLink = () => {
    const { totalPrice, totalQty } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)

  return (
    <>
        {
            cartItem[0] && (
            <div className='fixed bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-80 z-30'>
                <div className='bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 rounded-2xl text-white shadow-2xl border border-green-500/20 backdrop-blur-sm'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-white/20 rounded-xl backdrop-blur-sm'>
                                <FaCartShopping size={18} className='text-white'/>
                            </div>
                            <div className='text-sm'>
                                <p className='font-semibold'>{totalQty} items</p>
                                <p className='text-green-100 font-medium'>{DisplayPriceInRupees(totalPrice)}</p>
                            </div>
                        </div>

                        <Link to={"/cart"} className='flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all duration-200 backdrop-blur-sm'>
                            <span className='font-semibold text-sm'>View Cart</span>
                            <FaCaretRight size={16}/>
                        </Link>
                    </div>
                </div>
            </div>
            )
        }
    </>
  )
}

export default CartMobileLink