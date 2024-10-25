// Redux/reducers/wishlistReducer.js

import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from "../actions/wishlistAction";

const initialState = {
    items: []
};

export const wishlistReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_WISHLIST:
            return {
                ...state,
                items: [...new Set([...state.items, action.payload])]
            };
        case REMOVE_FROM_WISHLIST:
            return {
                ...state,
                items: state.items.filter(id => id !== action.payload)
            };
        default:
            return state;
    }
};