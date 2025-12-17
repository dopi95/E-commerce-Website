import React, { useState, useEffect, useRef } from 'react'
import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import {Link, useNavigate} from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import { FaChevronDown } from 'react-icons/fa6'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleRedirectProductListpage = (id,cat)=>{
      console.log(id,cat)
      const subcategory = subCategoryData.find(sub =>{
        const filterData = sub.category.some(c => {
          return c._id == id
        })

        return filterData ? true : null
      })
      const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`

      navigate(url)
      console.log(url)
  }


  return (
   <section className='bg-white min-h-screen'>
      <div className='container mx-auto'>
          <div className={`w-full h-full min-h-48 bg-white rounded ${!banner && "animate-pulse my-2" } `}>
              <img
                src={banner}
                className='w-full h-full hidden lg:block'
                alt='banner' 
              />
              <img
                src={bannerMobile}
                className='w-full h-full lg:hidden'
                alt='banner' 
              />
          </div>
      </div>
      
      {/* Categories Section */}
      <div className='container mx-auto px-4 py-12 mb-8'>
          <div className='text-center mb-10'>
              <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-3'>Shop by Category</h2>
              <p className='text-gray-600 text-lg max-w-2xl mx-auto'>Select a category to explore fresh products</p>
          </div>
          
          <div className='max-w-md mx-auto relative'>
              {
                loadingCategory ? (
                  <div className='bg-white rounded-xl border border-gray-200 p-4 animate-pulse'>
                    <div className='bg-gray-200 h-12 rounded-lg'></div>
                  </div>
                ) : (
                  <div className='relative' ref={dropdownRef}>
                    {/* Dropdown Button */}
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className='w-full bg-white border border-gray-300 rounded-xl px-4 py-4 text-left text-gray-700 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between'
                    >
                      <div className='flex items-center gap-3'>
                        {selectedCategory ? (
                          <>
                            <img 
                              src={selectedCategory.image} 
                              alt={selectedCategory.name}
                              className='w-8 h-8 rounded-full object-cover border-2 border-gray-200'
                            />
                            <span>{selectedCategory.name}</span>
                          </>
                        ) : (
                          <span className='text-gray-500'>Choose a category...</span>
                        )}
                      </div>
                      <FaChevronDown className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className='absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto'>
                        {categoryData.map((cat) => (
                          <button
                            key={cat._id}
                            onClick={() => {
                              setSelectedCategory(cat)
                              setIsDropdownOpen(false)
                              handleRedirectProductListpage(cat._id, cat.name)
                            }}
                            className='w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 border-b border-gray-100 last:border-b-0'
                          >
                            <img 
                              src={cat.image} 
                              alt={cat.name}
                              className='w-8 h-8 rounded-full object-cover border-2 border-gray-200'
                            />
                            <span className='text-gray-700 font-medium'>{cat.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }
          </div>
      </div>

      {/* Products by Category Section */}
      <div className='bg-white'>
          {
            categoryData?.map((c,index)=>{
              return(
                <div key={c?._id+"CategorywiseProduct"} className='py-8'>
                  <CategoryWiseProductDisplay 
                    id={c?._id} 
                    name={c?.name}
                  />
                </div>
              )
            })
          }
      </div>

   </section>
  )
}

export default Home
