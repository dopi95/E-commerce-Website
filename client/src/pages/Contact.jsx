import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.submitContact,
                data: formData
            });

            if (response.data.success) {
                toast.success('Message sent successfully! We will get back to you soon.');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container mx-auto px-4 py-8'>
            {/* Header */}
            <div className='text-center mb-12'>
                <h1 className='text-4xl font-bold text-gray-800 mb-4'>Contact Us</h1>
                <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
                    Have questions about our fresh groceries or need help with your order? 
                    We're here to help! Get in touch with us.
                </p>
            </div>

            <div className='grid lg:grid-cols-2 gap-12'>
                {/* Contact Information */}
                <div className='space-y-8'>
                    <div>
                        <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Get in Touch</h2>
                        <div className='space-y-6'>
                            <div className='flex items-start gap-4'>
                                <div className='bg-green-100 p-3 rounded-full'>
                                    <FaPhone className='text-green-600' size={20} />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-gray-800'>Phone</h3>
                                    <p className='text-gray-600'>+251 911 123 456</p>
                                    <p className='text-gray-600'>+251 922 654 321</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-4'>
                                <div className='bg-green-100 p-3 rounded-full'>
                                    <FaEnvelope className='text-green-600' size={20} />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-gray-800'>Email</h3>
                                    <p className='text-gray-600'>support@freshcorner.et</p>
                                    <p className='text-gray-600'>info@freshcorner.et</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-4'>
                                <div className='bg-green-100 p-3 rounded-full'>
                                    <FaMapMarkerAlt className='text-green-600' size={20} />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-gray-800'>Address</h3>
                                    <p className='text-gray-600'>
                                        Bole Road, Addis Ababa<br />
                                        Ethiopia, 1000
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-start gap-4'>
                                <div className='bg-green-100 p-3 rounded-full'>
                                    <FaClock className='text-green-600' size={20} />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-gray-800'>Business Hours</h3>
                                    <p className='text-gray-600'>Monday - Sunday: 6:00 AM - 11:00 PM</p>
                                    <p className='text-gray-600'>Customer Support: 24/7</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className='bg-green-50 p-6 rounded-lg'>
                        <h3 className='text-xl font-semibold text-gray-800 mb-4'>Why Choose Fresh Corner?</h3>
                        <ul className='space-y-2 text-gray-600'>
                            <li className='flex items-center gap-2'>
                                <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                                10-minute delivery guarantee
                            </li>
                            <li className='flex items-center gap-2'>
                                <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                                Fresh, quality groceries
                            </li>
                            <li className='flex items-center gap-2'>
                                <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                                Secure payment options
                            </li>
                            <li className='flex items-center gap-2'>
                                <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                                24/7 customer support
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Contact Form */}
                <div className='bg-white p-8 rounded-lg shadow-lg'>
                    <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Send us a Message</h2>
                    
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div className='grid md:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Full Name *
                                </label>
                                <input
                                    type='text'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                                    placeholder='Your full name'
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Email Address *
                                </label>
                                <input
                                    type='email'
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                                    placeholder='your.email@example.com'
                                    required
                                />
                            </div>
                        </div>

                        <div className='grid md:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Phone Number *
                                </label>
                                <input
                                    type='tel'
                                    name='phone'
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                                    placeholder='+251 9XX XXX XXX'
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Subject *
                                </label>
                                <select
                                    name='subject'
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                                    required
                                >
                                    <option value=''>Select a subject</option>
                                    <option value='Order Issue'>Order Issue</option>
                                    <option value='Delivery Problem'>Delivery Problem</option>
                                    <option value='Payment Issue'>Payment Issue</option>
                                    <option value='Product Quality'>Product Quality</option>
                                    <option value='General Inquiry'>General Inquiry</option>
                                    <option value='Feedback'>Feedback</option>
                                    <option value='Other'>Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Message *
                            </label>
                            <textarea
                                name='message'
                                value={formData.message}
                                onChange={handleChange}
                                rows={6}
                                className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none'
                                placeholder='Please describe your inquiry in detail...'
                                required
                            ></textarea>
                        </div>

                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;