// Redux/actions/wishlistAction.js
export const ADD_TO_WISHLIST = 'ADD_TO_WISHLIST';
export const REMOVE_FROM_WISHLIST = 'REMOVE_FROM_WISHLIST';

export const addToWishlist = (productId) => ({
    type: ADD_TO_WISHLIST,
    payload: productId
});

export const removeFromWishlist = (productId) => ({
    type: REMOVE_FROM_WISHLIST,
    payload: productId
});