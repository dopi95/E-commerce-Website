// Enhanced Chapa API with Multi-Bank Support for Ethiopian Banks
const chapaAPI = {
    // Initialize payment with bank selection support
    initialize: async (data) => {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Validate payment method
            const supportedMethods = ['telebirr', 'cbe', 'boa', 'dashen', 'zemen', 'awash'];
            if (data.payment_method && !supportedMethods.includes(data.payment_method)) {
                throw new Error('Unsupported payment method');
            }
            
            // Mock successful response with bank-specific checkout URL
            const baseUrl = process.env.FRONTEND_URL;
            let checkoutUrl;
            
            switch (data.payment_method) {
                case 'telebirr':
                    checkoutUrl = `${baseUrl}/payment/telebirr?tx_ref=${data.tx_ref}`;
                    break;
                case 'cbe':
                    checkoutUrl = `${baseUrl}/payment/cbe-birr?tx_ref=${data.tx_ref}`;
                    break;
                case 'cbe':
                    checkoutUrl = `${baseUrl}/payment/cbe-birr?tx_ref=${data.tx_ref}`;
                    break;
                case 'boa':
                    checkoutUrl = `${baseUrl}/payment/bank-of-abyssinia?tx_ref=${data.tx_ref}`;
                    break;
                case 'dashen':
                    checkoutUrl = `${baseUrl}/payment/dashen-bank?tx_ref=${data.tx_ref}`;
                    break;
                case 'zemen':
                    checkoutUrl = `${baseUrl}/payment/zemen-bank?tx_ref=${data.tx_ref}`;
                    break;
                case 'awash':
                    checkoutUrl = `${baseUrl}/payment/awash-bank?tx_ref=${data.tx_ref}`;
                    break;
                default:
                    checkoutUrl = `${baseUrl}/payment/success?tx_ref=${data.tx_ref}&status=success`;
            }
            
            return {
                status: 'success',
                message: 'Payment initialized successfully',
                data: {
                    checkout_url: checkoutUrl,
                    tx_ref: data.tx_ref,
                    payment_method: data.payment_method || 'telebirr',
                    amount: data.amount,
                    currency: data.currency || 'ETB'
                }
            };
        } catch (error) {
            return {
                status: 'failed',
                message: error.message || 'Payment initialization failed',
                data: null
            };
        }
    },
    
    // Verify payment with enhanced bank support
    verify: async ({ tx_ref }) => {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Extract payment method from tx_ref if available
            const paymentMethod = tx_ref.includes('TXN-') ? 'telebirr' : 'bank_transfer';
            
            // Mock successful verification
            return {
                status: 'success',
                message: 'Payment verified successfully',
                data: {
                    status: 'success',
                    tx_ref: tx_ref,
                    amount: 100,
                    currency: 'ETB',
                    reference: `REF-${Date.now()}`,
                    payment_method: paymentMethod,
                    bank_reference: `BANK-${Date.now()}`,
                    meta: {
                        userId: tx_ref.split('-')[2] || tx_ref.split('-')[1],
                        addressId: 'demo-address',
                        items: JSON.stringify([{ 
                            productId: 'demo-product', 
                            name: 'Demo Product', 
                            quantity: 1, 
                            price: 100 
                        }])
                    }
                }
            };
        } catch (error) {
            return {
                status: 'failed',
                message: error.message || 'Payment verification failed',
                data: null
            };
        }
    },
    
    // Get supported banks list
    getSupportedBanks: () => {
        return {
            status: 'success',
            data: {
                mobile_money: [
                    {
                        id: 'telebirr',
                        name: 'Telebirr',
                        logo: '/assets/telebirr-logo.png',
                        description: 'Pay with your Telebirr wallet',
                        type: 'mobile_money'
                    }
                ],
                banks: [
                    {
                        id: 'cbe',
                        name: 'Commercial Bank of Ethiopia (CBE)',
                        logo: '/assets/cbe-logo.png',
                        description: 'CBE Birr - Digital Banking',
                        type: 'bank'
                    },
                    {
                        id: 'boa',
                        name: 'Bank of Abyssinia',
                        logo: '/assets/boa-logo.png',
                        description: 'Bank of Abyssinia Online',
                        type: 'bank'
                    },
                    {
                        id: 'dashen',
                        name: 'Dashen Bank',
                        logo: '/assets/dashen-logo.png',
                        description: 'Dashen Bank Digital Services',
                        type: 'bank'
                    },
                    {
                        id: 'zemen',
                        name: 'Zemen Bank',
                        logo: '/assets/zemen-logo.png',
                        description: 'Zemen Bank Digital Payment',
                        type: 'bank'
                    },
                    {
                        id: 'awash',
                        name: 'Awash Bank',
                        logo: '/assets/awash-logo.png',
                        description: 'Awash Bank Online Banking',
                        type: 'bank'
                    }
                ]
            }
        };
    }
};

export default chapaAPI;

// Bank configuration for different Ethiopian banks
export const ETHIOPIAN_BANKS = {
    CBE: {
        id: 'cbe',
        name: 'Commercial Bank of Ethiopia',
        shortName: 'CBE',
        type: 'government',
        services: ['CBE Birr', 'Online Banking', 'Mobile Banking'],
        description: 'Ethiopia\'s largest commercial bank'
    },
    BOA: {
        id: 'boa',
        name: 'Bank of Abyssinia',
        shortName: 'BOA',
        type: 'private',
        services: ['Online Banking', 'Mobile Banking'],
        description: 'Customer-focused banking services'
    },
    DASHEN: {
        id: 'dashen',
        name: 'Dashen Bank',
        shortName: 'Dashen',
        type: 'private',
        services: ['Digital Banking', 'Mobile Banking'],
        description: 'Innovative banking solutions'
    },
    ZEMEN: {
        id: 'zemen',
        name: 'Zemen Bank',
        shortName: 'Zemen',
        type: 'private',
        services: ['Digital Banking', 'Investment Banking'],
        description: 'Investment and commercial banking'
    },
    AWASH: {
        id: 'awash',
        name: 'Awash Bank',
        shortName: 'Awash',
        type: 'private',
        services: ['Online Banking', 'Mobile Banking'],
        description: 'Pioneer private bank in Ethiopia'
    }
};