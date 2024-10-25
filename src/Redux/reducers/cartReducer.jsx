import { ADD_ITEM, REMOVE_ITEM, CLEAR_CART } from '../actions/cartActions';

const initialState = {
    items: [],
    totalQuantity: 0,  // Sum of the quantities
    totalAmount: 0.0,  // Sum of totalPrice for all items
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ITEM:
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);
            let updatedItems;

            if (!existingItem) {
                updatedItems = [...state.items, {
                    id: newItem.id,
                    name: newItem.name,
                    price: newItem.price,
                    quantity: 1,
                    totalPrice: newItem.price,
                    images: newItem.images,
                }];
            } else {
                updatedItems = state.items.map(item =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + 1, totalPrice: item.totalPrice + newItem.price }
                        : item
                );
            }

            return {
                ...state,
                items: updatedItems,
                totalQuantity: state.totalQuantity + 1,
                totalAmount: state.totalAmount + newItem.price,
            };

        case REMOVE_ITEM:
            const id = action.payload;
            const itemToRemove = state.items.find(item => item.id === id);
            let updatedCartItems;

            if (itemToRemove.quantity === 1) {
                updatedCartItems = state.items.filter(item => item.id !== id);
            } else {
                updatedCartItems = state.items.map(item =>
                    item.id === id
                        ? { ...item, quantity: item.quantity - 1, totalPrice: item.totalPrice - item.price }
                        : item
                );
            }

            return {
                ...state,
                items: updatedCartItems,
                totalQuantity: state.totalQuantity - 1,
                totalAmount: state.totalAmount - itemToRemove.price,
            };

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

// const initialState = {
//     items: [],
//     totalAmount: 0
// };

// const cartReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case 'ADD_ITEM': {
//             const newItem = action.payload;
//             const existingItemIndex = state.items.findIndex(item => item.id === newItem.id);
            
//             if (existingItemIndex >= 0) {
//                 // Item exists, update quantity
//                 const updatedItems = state.items.map((item, index) => {
//                     if (index === existingItemIndex) {
//                         return {
//                             ...item,
//                             quantity: item.quantity + 1
//                         };
//                     }
//                     return item;
//                 });

//                 return {
//                     items: updatedItems,
//                     totalAmount: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
//                 };
//             } else {
//                 // New item, add to cart
//                 const updatedItems = [...state.items, { ...newItem, quantity: 1 }];
//                 return {
//                     items: updatedItems,
//                     totalAmount: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
//                 };
//             }
//         }

//         case 'REMOVE_ITEM': {
//             const itemId = action.payload;
//             const existingItemIndex = state.items.findIndex(item => item.id === itemId);
            
//             if (existingItemIndex >= 0) {
//                 const existingItem = state.items[existingItemIndex];
                
//                 if (existingItem.quantity === 1) {
//                     // Remove item if quantity becomes 0
//                     const updatedItems = state.items.filter(item => item.id !== itemId);
//                     return {
//                         items: updatedItems,
//                         totalAmount: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
//                     };
//                 } else {
//                     // Decrease quantity
//                     const updatedItems = state.items.map(item => {
//                         if (item.id === itemId) {
//                             return {
//                                 ...item,
//                                 quantity: item.quantity - 1
//                             };
//                         }
//                         return item;
//                     });
//                     return {
//                         items: updatedItems,
//                         totalAmount: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
//                     };
//                 }
//             }
//             return state;
//         }

//         default:
//             return state;
//     }
// };

// export default cartReducer;