import React from 'react'
import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import {Link, useNavigate} from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

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
      <div className='container mx-auto px-4 mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center'>Shop by Category</h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4'>
              {
                loadingCategory ? (
                  new Array(8).fill(null).map((c,index)=>{
                    return(
                      <div key={index+"loadingcategory"} className='bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 animate-pulse'>
                        <div className='bg-gray-200 aspect-square rounded-lg mb-3'></div>
                        <div className='bg-gray-200 h-4 rounded'></div>
                      </div>
                    )
                  })
                ) : (
                  categoryData.map((cat,index)=>{
                    return(
                      <div 
                        key={cat._id+"displayCategory"} 
                        className='bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 group'
                        onClick={()=>handleRedirectProductListpage(cat._id,cat.name)}
                      >
                        <div className='aspect-square mb-3 overflow-hidden rounded-lg bg-white'>
                            <img 
                              src={cat.image}
                              className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                              alt={cat.name}
                            />
                        </div>
                        <h3 className='text-sm font-semibold text-gray-800 text-center truncate'>{cat.name}</h3>
                      </div>
                    )
                  })
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
