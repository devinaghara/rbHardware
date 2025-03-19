import { 
  CART_REQUEST, 
  CART_SUCCESS, 
  CART_FAILURE,
  UPDATE_CART_ITEM,
  REMOVE_CART_ITEM,
  CLEAR_CART 
} from '../actions/cartActions';

const initialState = {
  items: [],
  totalAmount: 0,
  loading: false,
  error: null
};

// Helper function to calculate total amount
const calculateTotalAmount = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case CART_SUCCESS:
      return {
        ...state,
        items: action.payload.items || [],
        totalAmount: action.payload.totalAmount || 
                     calculateTotalAmount(action.payload.items || []),
        loading: false,
        error: null
      };
      
    case CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    case UPDATE_CART_ITEM:
      const updatedItems = state.items.map(item => 
        (item._id === action.payload._id || item.productId === action.payload.productId) 
          ? action.payload 
          : item
      );
      
      return {
        ...state,
        items: updatedItems,
        totalAmount: calculateTotalAmount(updatedItems),
        loading: false
      };
      
    case REMOVE_CART_ITEM:
      const filteredItems = state.items.filter(item => 
        item._id !== action.payload && item.productId !== action.payload
      );
      
      return {
        ...state,
        items: filteredItems,
        totalAmount: calculateTotalAmount(filteredItems),
        loading: false
      };
      
    case CLEAR_CART:
      return {
        ...state,
        items: [],
        totalAmount: 0,
        loading: false
      };
      
    default:
      return state;
  }
};

export default cartReducer;