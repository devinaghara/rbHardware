// Redux/reducers/cartReducer.js

import { ADD_ITEM, REMOVE_ITEM, CLEAR_CART } from '../actions/cartActions';

const initialState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ITEM:
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);
            state.totalQuantity++;
            if (!existingItem) {
                state.items.push({
                    id: newItem.id,
                    name: newItem.name,
                    price: newItem.price,
                    quantity: 1,
                    totalPrice: newItem.price,
                });
            } else {
                existingItem.quantity++;
                existingItem.totalPrice += newItem.price;
            }
            state.totalAmount += newItem.price;
            return { ...state };

        case REMOVE_ITEM:
            const id = action.payload;
            const itemToRemove = state.items.find(item => item.id === id);
            state.totalQuantity--;
            state.totalAmount -= itemToRemove.price;
            if (itemToRemove.quantity === 1) {
                state.items = state.items.filter(item => item.id !== id);
            } else {
                itemToRemove.quantity--;
                itemToRemove.totalPrice -= itemToRemove.price;
            }
            return { ...state };

        case CLEAR_CART:
            return {
                items: [],
                totalQuantity: 0,
                totalAmount: 0,
            };

        default:
            return state;
    }
};

export default cartReducer;
