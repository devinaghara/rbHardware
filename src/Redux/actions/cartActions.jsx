// Redux/actions/cartActions.js

export const ADD_ITEM = 'ADD_ITEM';
export const REMOVE_ITEM = 'REMOVE_ITEM';
export const CLEAR_CART = 'CLEAR_CART';

export const addItem = (product) => {
    return {
        type: ADD_ITEM,
        payload: product,
    };
};

export const removeItem = (id) => {
    return {
        type: REMOVE_ITEM,
        payload: id,
    };
};

export const clearCart = () => {
    return {
        type: CLEAR_CART,
    };
};


