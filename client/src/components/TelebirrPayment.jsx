import React, { useState } from 'react';
import { IoClose, IoCheckmarkCircle } from 'react-icons/io5';
import { FaChevronRight } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import telebirrLogo from '../assets/telebirrlogo.png';

const TelebirrPayment = ({ 
    close, 
    cartItemsList, 
    addressId, 
    totalPrice, 
    fetchCartItem, 
    fetchOrder,
    navigate 
}) => {
    const [step, setStep] = useState(1); // 1: Select, 2: Phone Input, 3: Processing
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const handleSelectTelebirr = () => {
        setSelectedPayment('telebirr');
        setStep(2);
    };

    const handleContinue = () => {
        if (step === 2 && selectedPayment) {
            setStep(3);
        }
    };

    const handleTelebirrPayment = async () => {
        if (!phoneNumber) {
            toast.error('Please enter your phone number');
            return;
        }

        // Format phone number to start with +251
        let formattedPhone = phoneNumber;
        if (phoneNumber.startsWith('0')) {
            formattedPhone = '+251' + phoneNumber.substring(1);
        } else if (phoneNumber.startsWith('9')) {
            formattedPhone = '+251' + phoneNumber;
        } else if (!phoneNumber.startsWith('+251')) {
            formattedPhone = '+251' + phoneNumber;
        }

        if (!formattedPhone.match(/^\+251[79]\d{8}$/)) {
            toast.error('Please enter a valid Ethiopian phone number (9xxxxxxxx)');
            return;
        }

        try {
            setLoading(true);
            toast.loading('Processing payment...');

            const response = await Axios({
                ...SummaryApi.telebirrPayment,
                data: {
                    list_items: cartItemsList,
                    addressId: addressId,
                    subTotalAmt: totalPrice,
                    totalAmt: totalPrice,
                    phone_number: formattedPhone
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

    const renderStep1 = () => (
        <div className='mb-6'>
            <div className='flex items-center justify-center mb-6'>
                <img 
                    src={telebirrLogo} 
                    alt='Telebirr' 
                    className='h-16 w-auto'
                />
            </div>
            
            <h3 className='text-lg font-semibold text-center mb-6 text-gray-800'>
                Choose Payment Method
            </h3>
            
            <div className='space-y-3'>
                <div 
                    onClick={handleSelectTelebirr}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-orange-500 ${
                        selectedPayment === 'telebirr' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                    }`}
                >
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <img 
                                src={telebirrLogo} 
                                alt='Telebirr' 
                                className='h-8 w-auto'
                            />
                            <div>
                                <p className='font-medium text-gray-800'>Telebirr</p>
                                <p className='text-sm text-gray-600'>Pay with your Telebirr wallet</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            {selectedPayment === 'telebirr' && (
                                <IoCheckmarkCircle className='text-orange-500' size={20} />
                            )}
                            <FaChevronRight className='text-gray-400' size={16} />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className='bg-gray-50 p-3 rounded-md mt-6'>
                <div className='flex justify-between text-sm'>
                    <span>Total Amount:</span>
                    <span className='font-semibold'>${totalPrice}</span>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className='mb-6'>
            <div className='flex items-center justify-center mb-6'>
                <img 
                    src={telebirrLogo} 
                    alt='Telebirr' 
                    className='h-12 w-auto'
                />
            </div>
            
            <h3 className='text-lg font-semibold text-center mb-6 text-gray-800'>
                Pay with Telebirr
            </h3>
            
            <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Phone Number
                </label>
                <div className='flex'>
                    <span className='inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm'>
                        +251
                    </span>
                    <input
                        type='tel'
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder='9xxxxxxxx'
                        className='flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                        maxLength={9}
                    />
                </div>
                <p className='text-xs text-gray-500 mt-1'>
                    Enter your Telebirr registered phone number (starting with 9)
                </p>
            </div>
            
            <div className='bg-gray-50 p-3 rounded-md mb-4'>
                <div className='flex justify-between text-sm'>
                    <span>Total Amount:</span>
                    <span className='font-semibold'>${totalPrice}</span>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className='mb-6 text-center'>
            <div className='flex items-center justify-center mb-6'>
                <img 
                    src={telebirrLogo} 
                    alt='Telebirr' 
                    className='h-12 w-auto'
                />
            </div>
            
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4'></div>
            <h3 className='text-lg font-semibold mb-2 text-gray-800'>
                Processing Payment...
            </h3>
            <p className='text-gray-600 mb-4'>
                Please wait while we process your payment
            </p>
            <p className='text-sm text-gray-500'>
                Phone: +251{phoneNumber}
            </p>
        </div>
    );

    const getStepButtons = () => {
        if (step === 1) {
            return (
                <div className='flex gap-3'>
                    <button
                        onClick={close}
                        className='flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleContinue}
                        disabled={!selectedPayment}
                        className='flex-1 py-2 px-4 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        Continue
                    </button>
                </div>
            );
        } else if (step === 2) {
            return (
                <div className='flex gap-3'>
                    <button
                        onClick={() => setStep(1)}
                        className='flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                    >
                        Back
                    </button>
                    <button
                        onClick={handleTelebirrPayment}
                        disabled={!phoneNumber || phoneNumber.length < 9}
                        className='flex-1 py-2 px-4 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        Pay Now
                    </button>
                </div>
            );
        } else {
            return null; // No buttons during processing
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4'>
            <div className='bg-white rounded-lg p-6 w-full max-w-md'>
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-xl font-semibold text-gray-800'>
                        Online Payment
                    </h2>
                    {step !== 3 && (
                        <button 
                            onClick={close}
                            className='text-gray-500 hover:text-gray-700'
                        >
                            <IoClose size={24} />
                        </button>
                    )}
                </div>

                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}

                {getStepButtons()}
            </div>
        </div>
    );
};

export default TelebirrPayment;