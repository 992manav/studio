import React from "react";
// import "./ImageCard.css"; // Import your CSS file for styling
function ImageCard({ name, price, description, image, onAddToCart }) {
  return (
    <div className="product-card">
      <img src={image} alt={name} className="product-image" />
      <h3 className="product-name">{name}</h3>
      <p className="product-description">{description}</p>
      <p className="product-price">₹{price.toFixed(2)}</p>
      <button
        className="add-to-cart-btn"
        onClick={() => onAddToCart({ name, price, image })}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ImageCard;
