import React from "react";
import "./Cart.css";

const Cart = ({
  cartItems = [],
  onRemove = () => {},
  onQuantityChange = () => {},
}) => {
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>₹{item.price}</p>
                  <div className="quantity-controls">
                    <button
                      onClick={() => onQuantityChange(item, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => onQuantityChange(item, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button className="remove-btn" onClick={() => onRemove(item)}>
                  ❌
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Total: ₹{getTotalPrice()}</h3>
            <button className="checkout-btn">Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
