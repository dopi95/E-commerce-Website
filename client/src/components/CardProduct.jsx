import React from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import AddToCartButton from './AddToCartButton'

const CardProduct = ({data}) => {
    const url = `/product/${valideURLConvert(data.name)}-${data._id}`
    const [loading,setLoading] = useState(false)
  
  return (
    <Link to={url} className='group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 transform hover:scale-105' >
      {/* Product Image */}
      <div className='relative aspect-square bg-gray-50 overflow-hidden'>
            <img 
                src={data.image[0]}
                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                alt={data.name}
            />
            {/* Discount Badge */}
            {
              Boolean(data.discount) && (
                <div className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
                  {data.discount}% OFF
                </div>
              )
            }
            {/* Delivery Badge */}
            <div className='absolute top-2 right-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full'>
              10 min
            </div>
      </div>
      
      {/* Product Details */}
      <div className='p-3 space-y-2'>
        {/* Product Name */}
        <h3 className='font-semibold text-gray-800 text-sm line-clamp-2 group-hover:text-green-600 transition-colors duration-200'>
          {data.name}
        </h3>
        
        {/* Unit */}
        <p className='text-gray-500 text-xs'>
          {data.unit}
        </p>

        {/* Price and Add to Cart */}
        <div className='flex items-center justify-between pt-2'>
          <div className='flex flex-col'>
            <div className='font-bold text-gray-900 text-sm'>
                {DisplayPriceInRupees(pricewithDiscount(data.price,data.discount))}
            </div>
            {Boolean(data.discount) && (
              <div className='text-gray-400 text-xs line-through'>
                {DisplayPriceInRupees(data.price)}
              </div>
            )}
          </div>
          
          <div className='flex-shrink-0'>
            {
              data.stock == 0 ? (
                <div className='bg-red-100 text-red-600 text-xs font-medium px-3 py-1 rounded-full'>
                  Out of Stock
                </div>
              ) : (
                <AddToCartButton data={data} />
              )
            }
          </div>
        </div>
      </div>

    </Link>
  )
}

export default CardProduct
