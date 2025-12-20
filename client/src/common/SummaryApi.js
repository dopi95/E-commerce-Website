export const baseURL = import.meta.env.VITE_API_URL

const SummaryApi = {
    register : {
        url : '/api/user/register',
        method : 'post'
    },
    login : {
        url : '/api/user/login',
        method : 'post'
    },
    forgot_password : {
        url : "/api/user/forgot-password",
        method : 'put'
    },
    forgot_password_otp_verification : {
        url : 'api/user/verify-forgot-password-otp',
        method : 'put'
    },
    resetPassword : {
        url : "/api/user/reset-password",
        method : 'put'
    },
    refreshToken : {
        url : 'api/user/refresh-token',
        method : 'post'
    },
    userDetails : {
        url : '/api/user/user-details',
        method : "get"
    },
    logout : {
        url : "/api/user/logout",
        method : 'get'
    },
    uploadAvatar : {
        url : "/api/user/upload-avatar",
        method : 'put'
    },
    updateUserDetails : {
        url : '/api/user/update-user',
        method : 'put'
    },
    addCategory : {
        url : '/api/category/add-category',
        method : 'post'
    },
    uploadImage : {
        url : '/api/file/upload',
        method : 'post'
    },
    getCategory : {
        url : '/api/category/get',
        method : 'get'
    },
    updateCategory : {
        url : '/api/category/update',
        method : 'put'
    },
    deleteCategory : {
        url : '/api/category/delete',
        method : 'delete'
    },
    createSubCategory : {
        url : '/api/subcategory/create',
        method : 'post'
    },
    getSubCategory : {
        url : '/api/subcategory/get',
        method : 'post'
    },
    updateSubCategory : {
        url : '/api/subcategory/update',
        method : 'put'
    },
    deleteSubCategory : {
        url : '/api/subcategory/delete',
        method : 'delete'
    },
    createProduct : {
        url : '/api/product/create',
        method : 'post'
    },
    getProduct : {
        url : '/api/product/get',
        method : 'post'
    },
    getProductByCategory : {
        url : '/api/product/get-product-by-category',
        method : 'post'
    },
    getProductByCategoryAndSubCategory : {
        url : '/api/product/get-pruduct-by-category-and-subcategory',
        method : 'post'
    },
    getProductDetails : {
        url : '/api/product/get-product-details',
        method : 'post'
    },
    updateProductDetails : {
        url : "/api/product/update-product-details",
        method : 'put'
    },
    deleteProduct : {
        url : "/api/product/delete-product",
        method : 'delete'
    },
    searchProduct : {
        url : '/api/product/search-product',
        method : 'post'
    },
    addTocart : {
        url : "/api/cart/create",
        method : 'post'
    },
    getCartItem : {
        url : '/api/cart/get',
        method : 'get'
    },
    updateCartItemQty : {
        url : '/api/cart/update-qty',
        method : 'put'
    },
    deleteCartItem : {
        url : '/api/cart/delete-cart-item',
        method : 'delete'
    },
    createAddress : {
        url : '/api/address/create',
        method : 'post'
    },
    getAddress : {
        url : '/api/address/get',
        method : 'get'
    },
    updateAddress : {
        url : '/api/address/update',
        method : 'put'
    },
    disableAddress : {
        url : '/api/address/disable',
        method : 'delete'
    },
    CashOnDeliveryOrder : {
        url : "/api/order/cash-on-delivery",
        method : 'post'
    },

    getOrderItems : {
        url : '/api/order/order-list',
        method : 'get'
    },
    getAllOrders : {
        url : '/api/order/all-orders',
        method : 'get'
    },
    getUserCount : {
        url : '/api/user/user-count',
        method : 'get'
    },
    // Multi-Bank Payment APIs
    multiBankPayment : {
        url : '/api/order/payment/initialize',
        method : 'post'
    },
    verifyPayment : {
        url : '/api/order/payment/verify',
        method : 'get'
    },
    getSupportedBanks : {
        url : '/api/order/payment/banks',
        method : 'get'
    },
    paymentCallback : {
        url : '/api/order/payment/callback',
        method : 'post'
    },
    
    // Legacy Telebirr APIs (for backward compatibility)
    telebirrPayment : {
        url : '/api/order/telebirr/payment',
        method : 'post'
    },
    verifyTelebirrPayment : {
        url : '/api/order/telebirr/verify',
        method : 'get'
    },
    
    // Contact APIs
    submitContact : {
        url : '/api/contact/submit',
        method : 'post'
    },
    getAllContacts : {
        url : '/api/contact/get',
        method : 'get'
    },
    updateContactStatus : {
        url : '/api/contact/update-status',
        method : 'put'
    },
    replyToContact : {
        url : '/api/contact/reply',
        method : 'post'
    },
    deleteContact : {
        url : '/api/contact/delete',
        method : 'delete'
    },
    
    // User Management APIs
    getAllUsers : {
        url : '/api/user/all-users',
        method : 'get'
    },
    deleteUser : {
        url : '/api/user/delete',
        method : 'delete'
    }
}

export default SummaryApi