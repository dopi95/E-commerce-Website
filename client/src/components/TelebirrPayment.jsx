import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';

const TelebirrPayment = ({ 
    close, 
    cartItemsList, 
    addressId, 
    totalPrice, 
    fetchCartItem, 
    fetchOrder,
    navigate 
}) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTelebirrPayment = async () => {
        if (!phoneNumber) {
            toast.error('Please enter your phone number');
            return;
        }

        if (!phoneNumber.match(/^(\+251|0)?[79]\d{8}$/)) {
            toast.error('Please enter a valid Ethiopian phone number');
            return;
        }

        try {
            setLoading(true);
            toast.loading('Initializing payment...');

            const response = await Axios({
                ...SummaryApi.telebirrPayment,
                data: {
                    list_items: cartItemsList,
                    addressId: addressId,
                    subTotalAmt: totalPrice,
                    totalAmt: totalPrice,
                    phone_number: phoneNumber
                }
            });

            const { data: responseData } = response;

            if (responseData.success) {
                toast.dismiss();
                toast.success('Payment successful!');
                
                // For demo, clear cart immediately
                if (fetchCartItem) {
                    fetchCartItem();
                }
                if (fetchOrder) {
                    fetchOrder();
                }
                
                // Redirect to success page directly for demo
                setTimeout(() => {
                    navigate('/payment/success?tx_ref=' + responseData.data.tx_ref + '&status=success');
                }, 1000);
            }

        } catch (error) {
            toast.dismiss();
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4'>
            <div className='bg-white rounded-lg p-6 w-full max-w-md'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold text-gray-800'>
                        Pay with Telebirr
                    </h2>
                    <button 
                        onClick={close}
                        className='text-gray-500 hover:text-gray-700'
                    >
                        <IoClose size={24} />
                    </button>
                </div>

                <div className='mb-6'>
                    <div className='flex items-center justify-center mb-4'>
                        <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center'>
                            <span className='text-orange-600 font-bold text-xl'>T</span>
                        </div>
                    </div>
                    <p className='text-center text-gray-600 mb-4'>
                        You will be redirected to Telebirr to complete your payment
                    </p>
                    
                    <div className='mb-4'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Phone Number
                        </label>
                        <input
                            type='tel'
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder='09xxxxxxxx or +251xxxxxxxxx'
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                        />
                        <p className='text-xs text-gray-500 mt-1'>
                            Enter your Telebirr registered phone number
                        </p>
                    </div>

                    <div className='bg-gray-50 p-3 rounded-md mb-4'>
                        <div className='flex justify-between text-sm'>
                            <span>Total Amount:</span>
                            <span className='font-semibold'>${totalPrice}</span>
                        </div>
                    </div>
                </div>

                <div className='flex gap-3'>
                    <button
                        onClick={close}
                        className='flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleTelebirrPayment}
                        disabled={loading}
                        className='flex-1 py-2 px-4 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Processing...' : 'Pay Now'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TelebirrPayment;