const API_BASE = "http://127.0.0.1:8000";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// fetch all products
export async function fetchProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/api/products/?${query}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

// update cart icon no
export async function addToCart(product_id, quantity = 1) {
  const res = await fetch(`${API_BASE}/api/cart/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ product_id, quantity }),
  });

  if (res.status === 401) {
    throw new Error("Unauthorized: Please log in first.");
  }

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || errorData.detail || "Failed to add to cart");
  }

  const data = await res.json();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartUpdated"));
  }

  return data;
}

// Add to Cart logic
export async function fetchCartCount() {
  const res = await fetch(`${API_BASE}/api/sync-cart-wishlist/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (res.ok) {
    const data = await res.json();
    return data.cart.length;
  }
  return 0;
}