// Demo/Mock Chapa API for testing without real credentials
const chapaAPI = {
    initialize: async (data) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock successful response
        return {
            status: 'success',
            message: 'Payment initialized successfully',
            data: {
                checkout_url: `${process.env.FRONTEND_URL}/payment/success?tx_ref=${data.tx_ref}&status=success`,
                tx_ref: data.tx_ref
            }
        };
    },
    
    verify: async ({ tx_ref }) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
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
                meta: {
                    userId: tx_ref.split('-')[2], // Extract userId from tx_ref
                    addressId: 'demo-address',
                    items: JSON.stringify([{ productId: 'demo-product', name: 'Demo Product', quantity: 1, price: 100 }])
                }
            }
        };
    }
};

export default chapaAPI;