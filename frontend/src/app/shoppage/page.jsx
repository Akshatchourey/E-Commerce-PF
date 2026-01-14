"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/navbar/navbar";
const products = [
  {
    public_product_id: "prod_1", // Replace with actual IDs from your backend
    name: "Wooden Keychains",
    price: 14.90,
    image: "/keychains.png",
  },
  {
    public_product_id: "prod_2",
    name: "Warli Hand Painted Panels",
    price: 25.00,
    image: "/panels.png",
  },
  {
    public_product_id: "prod_3",
    name: "Leather Handbags",
    price: 45.00,
    image: "/handbags.png",
  },
  {
    public_product_id: "prod_4",
    name: "Jute Bags",
    price: 18.00,
    image: "/bags.png",
  },
  {
    public_product_id: "prod_5",
    name: "Leather Wallets",
    price: 22.00,
    image: "/wallets.JPG",
  },
  {
    public_product_id: "prod_6",
    name: "Bamboo Photo Frame",
    price: 14.90,
    image: "/bamboo-frame.png",
  },
  {
    public_product_id: "prod_7",
    name: "File Holder by Jute",
    price: 12.00,
    image: "/holder.JPG",
  },
  {
    public_product_id: "prod_8",
    name: "Wall Hangings",
    price: 30.00,
    image: "/hangings.JPG",
  },
  {
    public_product_id: "prod_9",
    name: "Clay Pottery",
    price: 28.00,
    image: "/pottery.JPG",
  },
];

export default function Shop() {
  const [loading, setLoading] = useState(false);

  const addToCart = async (product) => {
    setLoading(true);
    try {
      const response = await fetch('/api/cart/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}` // JWT token
        },
        body: JSON.stringify({
          product_id: product.public_product_id,
          quantity: 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert('Added to cart!');
      } else {
        const error = await response.json();
        alert(`Failed to add to cart: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <Navbar/>
      <h2>Shop Handmade Items</h2>
      <div style={{ 
        display: "flex", 
        gap: "20px", 
        flexWrap: "wrap" 
      }}>
        {products.map((item) => (
          <div
            key={item.public_product_id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              width: "200px",
              textAlign: "center",
            }}
          >
            <Image
              src={item.image}
              alt={item.name}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
            <h4>{item.name}</h4>
            <p>${item.price.toFixed(2)}</p>
            <button 
              onClick={() => addToCart(item)}
              disabled={loading}
              style={{
                padding: "8px 16px",
                backgroundColor: loading ? "#ccc" : "#F59E0B",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}