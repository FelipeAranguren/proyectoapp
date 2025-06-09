import React from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ cart, updateCart, removeFromCart }) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tip = subtotal * 0.1; // Propina del 10%
  const total = subtotal + tip;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Tu Pedido</h2>
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Tu pedido está vacío</p>
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Ver menú
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-4">
                <div className="flex items-center space-x-4">
                  {item.image && (
                    <img
                      src={`${process.env.REACT_APP_API_URL}${item.image}`}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateCart(item.id, item.quantity - 1)}
                    className="bg-gray-200 px-2 py-1 rounded-md"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateCart(item.id, item.quantity + 1)}
                    className="bg-gray-200 px-2 py-1 rounded-md"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 ml-2"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              className="block mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-center hover:bg-indigo-700 transition"
            >
              Confirmar Pedido
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;