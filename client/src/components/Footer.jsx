import React from 'react'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className='bg-white border-t border-gray-100 py-8'>
        <div className='container mx-auto px-6'>
            <div className='flex flex-col lg:flex-row justify-between items-center gap-6'>
                <div className='text-gray-700 font-medium'>
                    <p>© 2025 Fresh Corner. All Rights Reserved.</p>
                </div>
                
                <div className='flex items-center gap-8'>
                    <a href='#' className='text-gray-600 hover:text-blue-600 transform hover:scale-110 transition-all duration-300'>
                        <FaFacebook size={24}/>
                    </a>
                    <a href='#' className='text-gray-600 hover:text-pink-500 transform hover:scale-110 transition-all duration-300'>
                        <FaInstagram size={24}/>
                    </a>
                    <a href='#' className='text-gray-600 hover:text-blue-700 transform hover:scale-110 transition-all duration-300'>
                        <FaLinkedin size={24}/>
                    </a>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer
