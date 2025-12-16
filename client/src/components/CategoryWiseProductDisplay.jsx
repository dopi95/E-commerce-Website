import React, { useEffect, useRef, useState } from 'react'
import { Link, } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { FaAngleRight } from "react-icons/fa6";
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const CategoryWiseProductDisplay = ({ id, name }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const containerRef = useRef()
    const subCategoryData = useSelector(state => state.product.allSubCategory)
    const loadingCardNumber = new Array(6).fill(null)

    const fetchCategoryWiseProduct = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data: {
                    id: id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                setData(responseData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategoryWiseProduct()
    }, [])

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 200
    }

    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 200
    }

    

  

  const handleRedirectProductListpage = ()=>{
      const subcategory = subCategoryData.find(sub =>{
        const filterData = sub.category.some(c => {
          return c._id == id
        })

        return filterData ? true : null
      })
      const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory?.name)}-${subcategory?._id}`

      return url
  }

  const redirectURL =  handleRedirectProductListpage()
    return (
        <div className='container mx-auto px-4'>
            {/* Section Header */}
            <div className='flex items-center justify-between mb-6'>
                <h3 className='text-2xl md:text-3xl font-bold text-gray-800'>{name}</h3>
                <Link  
                    to={redirectURL} 
                    className='text-green-600 hover:text-green-700 font-semibold text-sm md:text-base transition-colors duration-200 flex items-center gap-1'
                >
                    View All <FaAngleRight className='text-xs' />
                </Link>
            </div>
            
            {/* Products Grid */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6'>
                {loading &&
                    loadingCardNumber.map((_, index) => {
                        return (
                            <CardLoading key={"CategorywiseProductDisplay123" + index} />
                        )
                    })
                }

                {
                    data.map((p, index) => {
                        return (
                            <CardProduct
                                data={p}
                                key={p._id + "CategorywiseProductDisplay" + index}
                            />
                        )
                    })
                }
            </div>
            

        </div>
    )
}

export default CategoryWiseProductDisplay
