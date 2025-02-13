import { ADD_ITEM, CLEAR_CART, REMOVE_ITEM, UPDATE_QUANTITY } from "../actions/cartActions";

// cartReducer.js
const initialState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0.0,
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ITEM: {
            const newItem = action.payload;
            const itemKey = `${newItem.id}-${newItem.color}`;
            const existingItem = state.items.find(item =>
                `${item.id}-${item.color}` === itemKey
            );

            let updatedItems;
            if (!existingItem) {
                updatedItems = [...state.items, {
                    ...newItem,
                    itemKey, // Add the unique key to the item
                    totalPrice: newItem.price * newItem.quantity
                }];
            } else {
                updatedItems = state.items.map(item =>
                    `${item.id}-${item.color}` === itemKey
                        ? {
                            ...item,
                            quantity: item.quantity + newItem.quantity,
                            totalPrice: (item.quantity + newItem.quantity) * item.price
                        }
                        : item
                );
            }

            const newTotalQuantity = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            const newTotalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

            return {
                ...state,
                items: updatedItems,
                totalQuantity: newTotalQuantity,
                totalAmount: newTotalAmount,
            };
        }

        case REMOVE_ITEM: {
            const itemKey = action.payload;
            const itemToRemove = state.items.find(item => 
                `${item.id}-${item.color}` === itemKey
            );
            
            if (!itemToRemove) return state;
        
            let updatedItems;
            if (itemToRemove.quantity === 1) {
                updatedItems = state.items.filter(item => 
                    `${item.id}-${item.color}` !== itemKey
                );
            } else {
                updatedItems = state.items.map(item =>
                    `${item.id}-${item.color}` === itemKey
                        ? {
                            ...item,
                            quantity: item.quantity - 1,
                            totalPrice: (item.quantity - 1) * item.price
                        }
                        : item
                );
            }

            const newTotalQuantity = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            const newTotalAmount = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

            return {
                ...state,
                items: updatedItems,
                totalQuantity: newTotalQuantity,
                totalAmount: newTotalAmount,
            };
        }

        case UPDATE_QUANTITY: {
            const { itemKey, quantity } = action.payload;
            
            if (quantity < 1) {
                return {
                    ...state,
                    items: state.items.filter(item => 
                        `${item.id}-${item.color}` !== itemKey
                    ),
                    totalQuantity: state.items.reduce((sum, item) => 
                        `${item.id}-${item.color}` !== itemKey ? sum + item.quantity : sum, 0),
                    totalAmount: state.items.reduce((sum, item) => 
                        `${item.id}-${item.color}` !== itemKey ? sum + item.totalPrice : sum, 0)
                };
            }
        
            const updatedItems = state.items.map(item =>
                `${item.id}-${item.color}` === itemKey
                    ? {
                        ...item,
                        quantity: quantity,
                        totalPrice: quantity * item.price
                    }
                    : item
            );

            return {
                ...state,
                items: updatedItems,
                totalQuantity: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
                totalAmount: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0)
            };
        }

        case CLEAR_CART:
            return {
                ...state,
                items: [],
                totalQuantity: 0,
                totalAmount: 0
            };

        default:
            return state;
    }
};

export default cartReducer;