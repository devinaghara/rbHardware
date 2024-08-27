import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, removeItem } from '../../Redux/actions/cartActions';
import { products } from '../../Utils/product';

const ProductPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const handleAddToCart = (product) => {
    dispatch(addItem(product));
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeItem(productId));
  };

  return (
    <div className="p-4 mt-36">
      {products.map((product) => (
        <div key={product.id} className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-lg mb-4">${product.price}</p>
          <button
            onClick={() => handleAddToCart(product)}
            className="bg-orange-500 text-white px-4 py-2 rounded-md mr-4"
          >
            Add to Cart
          </button>
          <button
            onClick={() => handleRemoveFromCart(product.id)}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Remove from Cart
          </button>
        </div>
      ))}

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Cart Summary</h2>
        {cart.items.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div>
            {cart.items.map((item) => (
              <div key={item.id} className="mb-4">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Total: ${item.totalPrice.toFixed(2)}</p>
              </div>
            ))}
            <div className="mt-4">
              <h3 className="text-xl font-bold">Overall Summary</h3>
              <p>Total Quantity: {cart.totalQuantity}</p>
              <p>Total Amount: ${cart.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
