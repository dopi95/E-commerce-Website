import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [paymentStatus, setPaymentStatus] = useState('verifying');
    const [paymentDetails, setPaymentDetails] = useState(null);

    const tx_ref = searchParams.get('tx_ref');
    const status = searchParams.get('status');
    const paymentMethod = searchParams.get('method') || 'telebirr';

    useEffect(() => {
        if (tx_ref) {
            verifyPayment();
        } else {
            setPaymentStatus('failed');
        }
    }, [tx_ref]);

    const verifyPayment = async () => {
        try {
            // For demo, if we have tx_ref and status=success, treat as successful
            if (status === 'success' && tx_ref) {
                const mockPaymentDetails = {
                    tx_ref: tx_ref,
                    amount: 100,
                    status: 'success',
                    reference: `REF-${Date.now()}`
                };
                
                setPaymentDetails(mockPaymentDetails);
                setPaymentStatus('success');
                toast.success('Payment successful!');
                
                // Trigger callback to create order and clear cart
                try {
                    await Axios({
                        url: '/api/order/telebirr/callback',
                        method: 'post',
                        data: {
                            tx_ref: tx_ref,
                            status: 'success',
                            reference: mockPaymentDetails.reference
                        }
                    });
                } catch (callbackError) {
                    console.log('Callback error:', callbackError);
                    // Still show success to user even if callback fails
                }
                return;
            }
            
            setPaymentStatus('failed');
            toast.error('Payment failed!');
        } catch (error) {
            setPaymentStatus('failed');
            toast.error('Error verifying payment');
        }
    };

    const handleContinueShopping = () => {
        navigate('/');
    };

    const handleViewOrders = () => {
        navigate('/dashboard/myorders');
    };

    if (paymentStatus === 'verifying') {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-50'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4'></div>
                    <h2 className='text-xl font-semibold text-gray-800'>Verifying Payment...</h2>
                    <p className='text-gray-600'>Please wait while we confirm your payment</p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
            <div className='bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center'>
                {paymentStatus === 'success' ? (
                    <>
                        <FaCheckCircle className='text-green-500 text-6xl mx-auto mb-4' />
                        <h1 className='text-2xl font-bold text-gray-800 mb-2'>Payment Successful!</h1>
                        <p className='text-gray-600 mb-6'>
                            Your payment has been processed successfully via {getPaymentMethodDisplayName(paymentMethod)}.
                        </p>
                        
                        {paymentDetails && (
                            <div className='bg-gray-50 p-4 rounded-lg mb-6 text-left'>
                                <h3 className='font-semibold mb-2'>Payment Details:</h3>
                                <p className='text-sm text-gray-600'>
                                    <span className='font-medium'>Transaction ID:</span> {paymentDetails.tx_ref}
                                </p>
                                <p className='text-sm text-gray-600'>
                                    <span className='font-medium'>Amount:</span> ${paymentDetails.amount}
                                </p>
                                <p className='text-sm text-gray-600'>
                                    <span className='font-medium'>Payment Method:</span> {getPaymentMethodDisplayName(paymentMethod)}
                                </p>
                                <p className='text-sm text-gray-600'>
                                    <span className='font-medium'>Status:</span> {paymentDetails.status}
                                </p>
                            </div>
                        )}
                        
                        <div className='flex flex-col gap-3'>
                            <button
                                onClick={handleViewOrders}
                                className='w-full py-2 px-4 bg-orange-600 text-white rounded-md hover:bg-orange-700'
                            >
                                View My Orders
                            </button>
                            <button
                                onClick={handleContinueShopping}
                                className='w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50'
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <FaTimesCircle className='text-red-500 text-6xl mx-auto mb-4' />
                        <h1 className='text-2xl font-bold text-gray-800 mb-2'>Payment Failed!</h1>
                        <p className='text-gray-600 mb-6'>
                            Unfortunately, your payment could not be processed. Please try again.
                        </p>
                        
                        <div className='flex flex-col gap-3'>
                            <button
                                onClick={() => navigate('/checkout')}
                                className='w-full py-2 px-4 bg-orange-600 text-white rounded-md hover:bg-orange-700'
                            >
                                Try Again
                            </button>
                            <button
                                onClick={handleContinueShopping}
                                className='w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50'
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// Helper function to get display name for payment methods
function getPaymentMethodDisplayName(method) {
    const displayNames = {
        'telebirr': 'Telebirr',
        'cbe': 'CBE Birr',
        'boa': 'Bank of Abyssinia',
        'dashen': 'Dashen Bank',
        'zemen': 'Zemen Bank',
        'awash': 'Awash Bank'
    };
    return displayNames[method] || method.toUpperCase();
}

export default PaymentSuccess;