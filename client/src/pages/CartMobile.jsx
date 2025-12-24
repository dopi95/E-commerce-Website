import React from 'react'
import DisplayCartItem from '../components/DisplayCartItem'
import { useNavigate } from 'react-router-dom'

const CartMobile = () => {
  const navigate = useNavigate()
  
  const handleClose = () => {
    navigate(-1) // Go back to previous page
  }
  
  return (
    <DisplayCartItem close={handleClose} isCartPage={true}/>
  )
}

export default CartMobile
