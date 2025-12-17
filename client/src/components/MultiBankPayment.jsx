import React, { useState, useEffect } from 'react';
import { IoClose, IoCheckmarkCircle, IoCard, IoPhonePortrait } from 'react-icons/io5';
import { FaChevronRight, FaUniversity, FaMobileAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import telebirrLogo from '../assets/telebirrlogo.png';
import cbeLogo from '../assets/cbe.png';
import boaLogo from '../assets/boa.png';
import dashenLogo from '../assets/dashen.png';
import zemenLogo from '../assets/zemen.png';
import awashLogo from '../assets/awash.png';

const MultiBankPayment = ({ 
    close, 
    cartItemsList, 
    addressId, 
    totalPrice, 
    fetchCartItem, 
    fetchOrder,
    navigate 
}) => {
    const [step, setStep] = useState(1); // 1: Select Method, 2: Input Details, 3: Processing
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [bankAccount, setBankAccount] = useState('');
    const [loading, setLoading] = useState(false);
    const [supportedBanks, setSupportedBanks] = useState({ mobile_money: [], banks: [] });

    // Ethiopian Banks Configuration (Telebirr + 5 Major Banks)
    const ethiopianBanks = [
        {
            id: 'telebirr',
            name: 'Telebirr',
            logo: telebirrLogo,
            description: 'Pay with your Telebirr wallet',
            type: 'mobile_money',
            color: 'orange'
        },
        {
            id: 'cbe',
            name: 'Commercial Bank of Ethiopia',
            shortName: 'CBE',
            logo: cbeLogo,
            description: 'CBE Birr - Digital Banking',
            type: 'bank',
            color: 'blue'
        },
        {
            id: 'boa',
            name: 'Bank of Abyssinia',
            shortName: 'BOA',
            logo: boaLogo,
            description: 'Online Banking Services',
            type: 'bank',
            color: 'indigo'
        },
        {
            id: 'dashen',
            name: 'Dashen Bank',
            shortName: 'Dashen',
            logo: dashenLogo,
            description: 'Digital Banking Solutions',
            type: 'bank',
            color: 'purple'
        },
        {
            id: 'zemen',
            name: 'Zemen Bank',
            shortName: 'Zemen',
            logo: zemenLogo,
            description: 'Investment & Commercial Banking',
            type: 'bank',
            color: 'gray'
        },
        {
            id: 'awash',
            name: 'Awash Bank',
            shortName: 'Awash',
            logo: awashLogo,
            description: 'Online Banking Services',
            type: 'bank',
            color: 'red'
        }
    ];

    const handleSelectPayment = (paymentMethod) => {
        setSelectedPayment(paymentMethod);
        setStep(2);
    };

    const handleContinue = () => {
        if (step === 2 && selectedPayment) {
            setStep(3);
        }
    };

    const handlePayment = async () => {
        if (selectedPayment.type === 'mobile_money' && !phoneNumber) {
            toast.error('Please enter your phone number');
            return;
        }

        if (selectedPayment.type === 'bank' && !bankAccount) {
            toast.error('Please enter your bank account number');
            return;
        }

        // Format phone number for Telebirr
        let formattedPhone = phoneNumber;
        if (selectedPayment.id === 'telebirr') {
            if (phoneNumber.startsWith('0')) {
                formattedPhone = '+251' + phoneNumber.substring(1);
            } else if (phoneNumber.startsWith('9')) {
                formattedPhone = '+251' + phoneNumber;
            } else if (!phoneNumber.startsWith('+251')) {
                formattedPhone = '+251' + phoneNumber;
            }

            if (!formattedPhone.match(/^\\+251[79]\\d{8}$/)) {
                toast.error('Please enter a valid Ethiopian phone number (9xxxxxxxx)');
                return;
            }
        }

        try {
            setLoading(true);
            toast.loading(`Processing ${selectedPayment.name} payment...`);

            const paymentData = {
                list_items: cartItemsList,
                addressId: addressId,
                subTotalAmt: totalPrice,
                totalAmt: totalPrice,
                payment_method: selectedPayment.id,
                phone_number: formattedPhone,
                bank_account: bankAccount
            };

            const response = await Axios({
                ...SummaryApi.multiBankPayment,
                data: paymentData
            });

            const { data: responseData } = response;

            if (responseData.success) {
                toast.dismiss();
                toast.success(`${selectedPayment.name} payment successful!`);
                
                // Clear cart
                if (fetchCartItem) {
                    fetchCartItem();
                }
                if (fetchOrder) {
                    fetchOrder();
                }
                
                // Redirect to success page
                setTimeout(() => {
                    navigate(`/payment/success?tx_ref=${responseData.data.tx_ref}&status=success&method=${selectedPayment.id}`);
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
            <h3 className='text-lg font-semibold text-center mb-6 text-gray-800'>
                Choose Payment Method
            </h3>
            
            {/* Mobile Money Section */}
            <div className='mb-6'>
                <h4 className='text-md font-medium text-gray-700 mb-3 flex items-center gap-2'>
                    <FaMobileAlt className='text-orange-500' />
                    Mobile Money
                </h4>
                <div className='space-y-3'>
                    {ethiopianBanks.filter(bank => bank.type === 'mobile_money').map((payment) => (
                        <div 
                            key={payment.id}
                            onClick={() => handleSelectPayment(payment)}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-orange-500 ${
                                selectedPayment?.id === payment.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                            }`}
                        >
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                    <img 
                                        src={payment.logo} 
                                        alt={payment.name} 
                                        className='h-8 w-auto'
                                    />
                                    <div>
                                        <p className='font-medium text-gray-800'>{payment.name}</p>
                                        <p className='text-sm text-gray-600'>{payment.description}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    {selectedPayment?.id === payment.id && (
                                        <IoCheckmarkCircle className='text-orange-500' size={20} />
                                    )}
                                    <FaChevronRight className='text-gray-400' size={16} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Banks Section */}
            <div className='mb-6'>
                <h4 className='text-md font-medium text-gray-700 mb-3 flex items-center gap-2'>
                    <FaUniversity className='text-blue-500' />
                    Ethiopian Banks
                </h4>
                <div className='space-y-3'>
                    {ethiopianBanks.filter(bank => bank.type === 'bank').map((payment) => (
                        <div 
                            key={payment.id}
                            onClick={() => handleSelectPayment(payment)}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-blue-500 ${
                                selectedPayment?.id === payment.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                            }`}
                        >
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                    <img 
                                        src={payment.logo} 
                                        alt={payment.name} 
                                        className='h-10 w-10 object-contain'
                                    />
                                    <div>
                                        <p className='font-medium text-gray-800'>{payment.name}</p>
                                        <p className='text-sm text-gray-600'>{payment.description}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    {selectedPayment?.id === payment.id && (
                                        <IoCheckmarkCircle className='text-blue-500' size={20} />
                                    )}
                                    <FaChevronRight className='text-gray-400' size={16} />
                                </div>
                            </div>
                        </div>
                    ))}
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
                {selectedPayment.logo ? (
                    <img 
                        src={selectedPayment.logo} 
                        alt={selectedPayment.name} 
                        className='h-12 w-auto'
                    />
                ) : (
                    <div className={`w-12 h-12 rounded-full bg-${selectedPayment.color}-500 flex items-center justify-center text-white font-bold`}>
                        {selectedPayment.shortName}
                    </div>
                )}
            </div>
            
            <h3 className='text-lg font-semibold text-center mb-6 text-gray-800'>
                Pay with {selectedPayment.name}
            </h3>
            
            {selectedPayment.type === 'mobile_money' ? (
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
                        Enter your {selectedPayment.name} registered phone number
                    </p>
                </div>
            ) : (
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Bank Account Number
                    </label>
                    <input
                        type='text'
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        placeholder='Enter your account number'
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                    <p className='text-xs text-gray-500 mt-1'>
                        Enter your {selectedPayment.name} account number
                    </p>
                </div>
            )}
            
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
                {selectedPayment.logo ? (
                    <img 
                        src={selectedPayment.logo} 
                        alt={selectedPayment.name} 
                        className='h-12 w-auto'
                    />
                ) : (
                    <div className={`w-12 h-12 rounded-full bg-${selectedPayment.color}-500 flex items-center justify-center text-white font-bold`}>
                        {selectedPayment.shortName}
                    </div>
                )}
            </div>
            
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
            <h3 className='text-lg font-semibold mb-2 text-gray-800'>
                Processing Payment...
            </h3>
            <p className='text-gray-600 mb-4'>
                Please wait while we process your {selectedPayment.name} payment
            </p>
            {selectedPayment.type === 'mobile_money' ? (
                <p className='text-sm text-gray-500'>
                    Phone: +251{phoneNumber}
                </p>
            ) : (
                <p className='text-sm text-gray-500'>
                    Account: {bankAccount}
                </p>
            )}
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
                        className='flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        Continue
                    </button>
                </div>
            );
        } else if (step === 2) {
            const isFormValid = selectedPayment.type === 'mobile_money' 
                ? phoneNumber && phoneNumber.length >= 9
                : bankAccount && bankAccount.length >= 5;

            return (
                <div className='flex gap-3'>
                    <button
                        onClick={() => setStep(1)}
                        className='flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                    >
                        Back
                    </button>
                    <button
                        onClick={handlePayment}
                        disabled={!isFormValid}
                        className='flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
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
            <div className='bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto'>
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

export default MultiBankPayment;