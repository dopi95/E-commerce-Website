import React, { useState, useEffect, useRef } from 'react'
import banner from '../assets/banner.jpg'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import { useNavigate} from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import { FaChevronDown } from 'react-icons/fa6'
import { FaTruck, FaLeaf } from 'react-icons/fa'
import { BsCart4 } from 'react-icons/bs'

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
      const subcategory = subCategoryData.find(sub =>{
        const filterData = sub.category.some(c => {
          return c._id == id
        })
        return filterData ? true : null
      })
      
      if(subcategory) {
        const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`
        navigate(url)
      }
  }

  return (
   <section className='bg-white min-h-screen'>
      {/* Modern Hero Section */}
      <div className='relative overflow-hidden'>
          <div className='container mx-auto px-4 py-4 lg:py-6'>
              <div className='max-w-4xl mx-auto text-center'>
                  {/* Hero Content */}
                  <div className='space-y-3 lg:space-y-4 animate-fade-in-up'>
                      <div className='inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium'>
                          <FaLeaf className='mr-2' />
                          100% Fresh & Organic
                      </div>
                      
                      <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight whitespace-nowrap'>
                          <span className='text-green-600 typewriter-simple'>
                            <span className='letter'>F</span>
                            <span className='letter'>r</span>
                            <span className='letter'>e</span>
                            <span className='letter'>s</span>
                            <span className='letter'>h</span>
                          </span><span className='text-yellow-500 typewriter-simple'>
                            <span className='letter'> </span>
                            <span className='letter'>C</span>
                            <span className='letter'>o</span>
                            <span className='letter'>r</span>
                            <span className='letter'>n</span>
                            <span className='letter'>e</span>
                            <span className='letter'>r</span>
                          </span>
                      </h1>
                      
                      <p className='text-sm lg:text-base text-gray-600 max-w-2xl mx-auto'>
                          Discover fresh, high-quality groceries delivered to your door. From farm-fresh produce to everyday essentials.
                      </p>
                      
                      <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                          <button 
                              onClick={() => navigate('/search')}
                              className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2'
                          >
                              <BsCart4 />
                              Shop Now
                          </button>
                          <button 
                              onClick={() => navigate('/register')}
                              className='border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300'
                          >
                              Get Started
                          </button>
                      </div>
                      
                      {/* Features */}
                      <div className='grid grid-cols-3 sm:grid-cols-3 gap-4 pt-4 max-w-3xl mx-auto'>
                          <div className='flex flex-col items-center gap-2 text-gray-600'>
                              <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
                                  <FaTruck className='text-green-600' />
                              </div>
                              <div className='text-center'>
                                  <p className='font-semibold text-sm'>Fast Delivery</p>
                                  <p className='text-xs'>Within 30 minutes</p>
                              </div>
                          </div>
                          <div className='flex flex-col items-center gap-2 text-gray-600'>
                              <div className='w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center'>
                                  <FaLeaf className='text-yellow-600' />
                              </div>
                              <div className='text-center'>
                                  <p className='font-semibold text-sm'>Fresh Quality</p>
                                  <p className='text-xs'>Farm to table</p>
                              </div>
                          </div>
                          <div className='flex flex-col items-center gap-2 text-gray-600'>
                              <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                                  <div className='text-blue-600'>💰</div>
                              </div>
                              <div className='text-center'>
                                  <p className='font-semibold text-sm'>Best Prices</p>
                                  <p className='text-xs'>Everyday low prices</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      
      {/* Categories Section */}
      <div className='container mx-auto px-4 py-8 lg:py-12'>
          <div className='text-center mb-8 lg:mb-10'>
              <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 lg:mb-3'>Shop by Category</h2>
              <p className='text-gray-600 text-base lg:text-lg max-w-2xl mx-auto'>Select a category to explore fresh products</p>
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
                      className='w-full bg-white border border-gray-300 rounded-xl px-4 py-4 text-left text-gray-700 text-base lg:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between'
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
                      <div className='absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto'>
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
      <div className='bg-gray-50'>
          {
            categoryData?.map((c,index)=>{
              return(
                <div key={c?._id+"CategorywiseProduct"} className='py-6 lg:py-8'>
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