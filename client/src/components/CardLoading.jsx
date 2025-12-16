import React from 'react'

const CardLoading = () => {
  return (
    <div className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse'>
      {/* Image Skeleton */}
      <div className='aspect-square bg-gray-200'>
      </div>
      
      {/* Content Skeleton */}
      <div className='p-3 space-y-2'>
        {/* Title Skeleton */}
        <div className='h-4 bg-gray-200 rounded w-3/4'>
        </div>
        <div className='h-3 bg-gray-200 rounded w-1/2'>
        </div>
        
        {/* Unit Skeleton */}
        <div className='h-3 bg-gray-200 rounded w-1/3'>
        </div>

        {/* Price and Button Skeleton */}
        <div className='flex items-center justify-between pt-2'>
          <div className='space-y-1'>
            <div className='h-4 bg-gray-200 rounded w-16'>
            </div>
            <div className='h-3 bg-gray-200 rounded w-12'>
            </div>
          </div>
          <div className='h-8 bg-gray-200 rounded w-16'>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardLoading
