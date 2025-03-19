import axios from 'axios';
import { API_URI } from '../../../config';

// Action Types
export const CART_REQUEST = 'CART_REQUEST';
export const CART_SUCCESS = 'CART_SUCCESS';
export const CART_FAILURE = 'CART_FAILURE';
export const UPDATE_CART_ITEM = 'UPDATE_CART_ITEM';
export const REMOVE_CART_ITEM = 'REMOVE_CART_ITEM';
export const CLEAR_CART = 'CLEAR_CART';

// Action Creators
const cartRequest = () => ({
  type: CART_REQUEST
});

const cartSuccess = (cart) => ({
  type: CART_SUCCESS,
  payload: cart
});

const cartFailure = (error) => ({
  type: CART_FAILURE,
  payload: error
});

const updateCartItemAction = (item) => ({
  type: UPDATE_CART_ITEM,
  payload: item
});

const removeCartItemAction = (itemId) => ({
  type: REMOVE_CART_ITEM,
  payload: itemId
});

const clearCartAction = () => ({
  type: CLEAR_CART
});

// Fetch cart items
export const fetchCart = () => async (dispatch) => {
  dispatch(cartRequest());
  try {
    const { data } = await axios.get(`${API_URI}/api/cart`, { withCredentials: true });
    
    if (data.success) {
      dispatch(cartSuccess(data.cart));
    } else {
      dispatch(cartFailure(data.message || 'Failed to fetch cart'));
    }
  } catch (error) {
    // Handle unauthenticated users with an empty cart
    if (error.response?.status === 401) {
      dispatch(cartSuccess({ items: [], totalAmount: 0 }));
    } else {
      dispatch(cartFailure(error.response?.data?.message || 'Network error'));
      console.error('Error fetching cart:', error);
    }
  }
};

// Add item to cart with optimistic update
export const addToCart = (product, quantity = 1) => async (dispatch, getState) => {
  // Create cart item
  const cartItem = {
    productId: product._id,
    name: product.name,
    price: product.price,
    quantity,
    image: product.images?.[0] || '',
    color: product.color || null,
    size: product.size || null
  };
  
  // Optimistic update - add item to local state first
  const currentState = getState().cart;
  const existingItemIndex = currentState.items.findIndex(item => item.productId === product._id);
  
  if (existingItemIndex >= 0) {
    // Item exists, update quantity
    const updatedItem = {
      ...currentState.items[existingItemIndex],
      quantity: currentState.items[existingItemIndex].quantity + quantity
    };
    dispatch(updateCartItemAction(updatedItem));
  } else {
    // New item, add to cart
    dispatch(cartSuccess({
      items: [...currentState.items, cartItem],
      totalAmount: currentState.totalAmount + (product.price * quantity)
    }));
  }
  
  // Then send request to server
  try {
    const { data } = await axios.post(`${API_URI}/api/cart/add`, cartItem, { withCredentials: true });
    
    if (data.success) {
      // Update with server response to ensure consistency
      dispatch(cartSuccess(data.cart));
    } else {
      // Revert on failure
      dispatch(cartFailure(data.message || 'Failed to add item to cart'));
      // Refetch cart to ensure consistent state
      dispatch(fetchCart());
    }
  } catch (error) {
    dispatch(cartFailure(error.response?.data?.message || 'Network error'));
    console.error('Error adding to cart:', error);
    // Refetch cart to ensure consistent state
    dispatch(fetchCart());
  }
};

// Update cart item quantity with optimistic update
export const updateQuantity = (itemId, quantity) => async (dispatch, getState) => {
  // Optimistic update
  const currentState = getState().cart;
  const existingItemIndex = currentState.items.findIndex(item => 
    item._id === itemId || item.productId === itemId
  );
  
  if (existingItemIndex >= 0) {
    const updatedItem = {
      ...currentState.items[existingItemIndex],
      quantity: quantity
    };
    
    // Don't allow quantity less than 1
    if (quantity < 1) {
      return dispatch(removeItem(itemId));
    }
    
    dispatch(updateCartItemAction(updatedItem));
  }
  
  // Then update on server
  try {
    const { data } = await axios.put(`${API_URI}/api/cart/update`, 
      { itemId, quantity }, 
      { withCredentials: true }
    );
    
    if (data.success) {
      dispatch(cartSuccess(data.cart));
    } else {
      dispatch(cartFailure(data.message || 'Failed to update cart'));
      // Refetch cart to ensure consistent state
      dispatch(fetchCart());
    }
  } catch (error) {
    dispatch(cartFailure(error.response?.data?.message || 'Network error'));
    console.error('Error updating cart:', error);
    // Refetch cart to ensure consistent state
    dispatch(fetchCart());
  }
};

// Remove item from cart with optimistic update
export const removeItem = (itemId) => async (dispatch, getState) => {
  // Optimistic update
  dispatch(removeCartItemAction(itemId));
  
  // Then update on server
  try {
    const { data } = await axios.delete(`${API_URI}/api/cart/remove/${itemId}`, { withCredentials: true });
    
    if (data.success) {
      dispatch(cartSuccess(data.cart));
    } else {
      dispatch(cartFailure(data.message || 'Failed to remove item'));
      // Refetch cart to ensure consistent state
      dispatch(fetchCart());
    }
  } catch (error) {
    dispatch(cartFailure(error.response?.data?.message || 'Network error'));
    console.error('Error removing item:', error);
    // Refetch cart to ensure consistent state
    dispatch(fetchCart());
  }
};

// Clear cart
export const clearCart = () => async (dispatch) => {
  // Optimistic update
  dispatch(clearCartAction());
  
  // Then update on server
  try {
    const { data } = await axios.delete(`${API_URI}/api/cart/clear`, { withCredentials: true });
    
    if (data.success) {
      dispatch(cartSuccess(data.cart));
    } else {
      dispatch(cartFailure(data.message || 'Failed to clear cart'));
      // Refetch cart to ensure consistent state
      dispatch(fetchCart());
    }
  } catch (error) {
    dispatch(cartFailure(error.response?.data?.message || 'Network error'));
    console.error('Error clearing cart:', error);
    // Refetch cart to ensure consistent state
    dispatch(fetchCart());
  }
};