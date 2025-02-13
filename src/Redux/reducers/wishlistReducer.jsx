// Redux/reducers/wishlistReducer.js

import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from "../actions/wishlistAction";

const wishlistInitialState = {
    items: []
};

export const wishlistReducer = (state = wishlistInitialState, action) => {
    switch (action.type) {
        case ADD_TO_WISHLIST: {
            const newId = action.payload;
            console.log("Newis",newId)
            // Prevent duplicates by checking both id formats
            const exists = state.items.some(id => 
                id === newId || 
                id === newId._id || 
                id === newId.id
            );
            console.log(exists)
            
            if (exists) return state;

            return {
                ...state,
                items: [...state.items, newId]
            };
        }

        case REMOVE_FROM_WISHLIST: {
            const idToRemove = action.payload;
            return {
                ...state,
                items: state.items.filter(id => 
                    id !== idToRemove && 
                    id !== idToRemove._id && 
                    id !== idToRemove.id
                )
            };
        }

        default:
            return state;
    }
};