// cartActions.js
export const ADD_ITEM = 'ADD_ITEM';
export const REMOVE_ITEM = 'REMOVE_ITEM';
export const CLEAR_CART = 'CLEAR_CART';
export const UPDATE_QUANTITY = 'UPDATE_QUANTITY';

export const addItem = (product) => {
    const normalizedProduct = {
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        color: product.color,
        colorCode: product.colorCode,
        description: product.description,
        category: product.category,
        material: product.material,
        quantity: product.quantity || 1
    };

    return {
        type: ADD_ITEM,
        payload: normalizedProduct,
    };
};

export const removeItem = (itemKey) => ({
    type: REMOVE_ITEM,
    payload: itemKey,
});

export const updateQuantity = (itemKey, quantity) => ({
    type: UPDATE_QUANTITY,
    payload: { itemKey, quantity }
});

export const clearCart = () => ({
    type: CLEAR_CART
});