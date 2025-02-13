// Redux/actions/wishlistAction.js
export const ADD_TO_WISHLIST = 'ADD_TO_WISHLIST';
export const REMOVE_FROM_WISHLIST = 'REMOVE_FROM_WISHLIST';

// Redux/actions/wishlistAction.js
export const addToWishlist = (product) => {
    if (!product) return { type: 'NOOP' };
    
    // If it's a variant, use its ID, otherwise use the main product ID
    const productId = typeof product === 'object' 
        ? (product._id || product.id || (product.linkedProducts?.[0]?._id))
        : product;
        
    if (!productId) return { type: 'NOOP' };
    
    return {
        type: ADD_TO_WISHLIST,
        payload: productId
    };
};

export const removeFromWishlist = (productId) => {
    if (!productId) return { type: 'NOOP' };
    
    const normalizedId = typeof productId === 'object' 
        ? (productId._id || productId.id || (productId.linkedProducts?.[0]?._id))
        : productId;
        
    if (!normalizedId) return { type: 'NOOP' };
    
    return {
        type: REMOVE_FROM_WISHLIST,
        payload: normalizedId
    };
};