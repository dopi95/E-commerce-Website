import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeft } from "react-icons/fa";
import useMobile from '../hooks/useMobile';

const Search = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [isSearchPage,setIsSearchPage] = useState(false)
    const [ isMobile ] = useMobile()
    const params = useLocation()
    const searchText = params.search?.slice(3) || ''

    useEffect(()=>{
        const isSearch = location.pathname === "/search"
        setIsSearchPage(isSearch)
    },[location])

    const redirectToSearchPage = ()=>{
        navigate("/search")
    }

    const handleOnChange = (e)=>{
        const value = e.target.value
        const url = `/search?q=${value}`
        navigate(url)
    }

  return (
    <div className={`w-full h-10 lg:h-12 rounded-xl border border-gray-200 overflow-hidden flex items-center text-gray-500 bg-gray-50 hover:bg-white hover:border-green-300 transition-all duration-200 focus-within:border-green-500 focus-within:bg-white focus-within:shadow-md ${isSearchPage && isMobile ? 'relative z-50' : ''}`}>
        <div className='flex-shrink-0'>
            {
                (isMobile && isSearchPage ) ? (
                    <Link to={"/"} className='flex justify-center items-center h-full p-2 m-1 text-green-600 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow'>
                        <FaArrowLeft size={18}/>
                    </Link>
                ) :(
                    <button className='flex justify-center items-center h-full p-3 text-gray-400 hover:text-green-600 transition-colors'>
                        <IoSearch size={20}/>
                    </button>
                )
            }
        </div>
        <div className='flex-1 h-full'>
            {
                !isSearchPage ? (
                     //not in search page
                     <div onClick={redirectToSearchPage} className='w-full h-full flex items-center cursor-pointer px-2'>
                        <TypeAnimation
                                sequence={[
                                    'Search "milk"',
                                    1000,
                                    'Search "bread"',
                                    1000,
                                    'Search "sugar"',
                                    1000,
                                    'Search "paneer"',
                                    1000,
                                    'Search "chocolate"',
                                    1000,
                                    'Search "curd"',
                                    1000,
                                    'Search "rice"',
                                    1000,
                                    'Search "egg"',
                                    1000,
                                    'Search "chips"',
                                    1000,
                                ]}
                                wrapper="span"
                                speed={50}
                                repeat={Infinity}
                                className='text-gray-400 text-sm lg:text-base'
                            />
                     </div>
                ) : (
                    //when in search page
                    <div className='w-full h-full'>
                        <input
                            type='text'
                            placeholder='Search for fresh groceries...'
                            autoFocus
                            defaultValue={searchText}
                            className='bg-transparent w-full h-full outline-none px-2 text-gray-700 placeholder-gray-400 text-sm lg:text-base'
                            onChange={handleOnChange}
                        />
                    </div>
                )
            }
        </div>
    </div>
  )
}

export default Search