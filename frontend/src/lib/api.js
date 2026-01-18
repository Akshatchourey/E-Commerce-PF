//functions in this page: getAuthHeader, refreshToken, fetchProducts, authenticatedFetch, addToCart, fetchCartCount,


export const API_BASE = " https://craftroots.onrender.com";

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

async function refreshToken() {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return null;

  try {
    const res = await fetch(`${API_BASE}/api/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("access_token", data.access);
      return data.access;
    }
  } catch (err) {
    console.error("Token refresh failed", err);
  }

  // If refresh fails, clear everything and redirect to login
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  if (typeof window !== "undefined") window.location.href = "/sign-in/login";
  return null;
}


export async function authenticatedFetch(url, options = {}) {
  let res = await fetch(url, {
    ...options,
    headers: { ...getAuthHeaders(), ...options.headers },
  });

  // If unauthorized, try to refresh
  if (res.status === 401) {
    const newToken = await refreshToken();
    if (newToken) {
      // Retry the original request with the new token
      res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          Authorization: `Bearer ${newToken}`,
        },
      });
    }
  }

  return res;
}

// Updated Add to Cart using the authenticatedFetch wrapper
export async function addToCart(product_id, quantity = 1) {
  const res = await authenticatedFetch(`${API_BASE}/api/cart/`, {
    method: "POST",
    body: JSON.stringify({ product_id, quantity }),
  });

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

// Update fetchCartCount using authenticationFetch also
export async function fetchCartCount() {
  const res = await authenticatedFetch(`${API_BASE}/api/sync-cart-wishlist/`);
  if (res.ok) {
    const data = await res.json();
    return data.cart.length;
  }
  return 0;
}

export async function fetchWishlistCount() {
  const res = await authenticatedFetch(`${API_BASE}/api/sync-cart-wishlist/`);
  if (res.ok) {
    const data = await res.json();
    return data.wishlist.length;
  }
  return 0;
}

export async function fetchUserOrders() {
  const res = await authenticatedFetch(`${API_BASE}/api/user-orders/`);
  if (!res.ok) return { count: 0, orders: [] };
  return res.json();
}

export async function syncCartWishlist() {
  const res = await authenticatedFetch(`${API_BASE}/api/sync-cart-wishlist/`);
  if (!res.ok) return { cart: [], wishlist: [] };
  return res.json();
}

// Wishlist cache
let wishlistCache = null;
let wishlistCacheTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

// Wishlist APIs
export async function addToWishlist(product_id) {
  const res = await authenticatedFetch(`${API_BASE}/api/wishlist/`, {
    method: "POST",
    body: JSON.stringify({ product_id }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || errorData.detail || "Failed to add to wishlist");
  }

  const data = await res.json();
  
  // Invalidate cache
  wishlistCache = null;
  wishlistCacheTime = 0;
  
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("wishlistUpdated", { detail: { action: "add", productId: product_id } }));
  }

  return data;
}

export async function removeFromWishlist(product_id) {
  const res = await authenticatedFetch(`${API_BASE}/api/wishlist/`, {
    method: "DELETE",
    body: JSON.stringify({ product_id }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || errorData.detail || "Failed to remove from wishlist");
  }

  const data = await res.json();
  
  // Invalidate cache
  wishlistCache = null;
  wishlistCacheTime = 0;
  
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("wishlistUpdated", { detail: { action: "remove", productId: product_id } }));
  }

  return data;
}

export async function fetchWishlist() {
  const now = Date.now();
  
  // Return cached data if available and not expired
  if (wishlistCache && (now - wishlistCacheTime) < CACHE_DURATION) {
    return wishlistCache;
  }
  
  const res = await authenticatedFetch(`${API_BASE}/api/sync-cart-wishlist/`);
  if (res.ok) {
    const data = await res.json();
    wishlistCache = data.wishlist || [];
    wishlistCacheTime = now;
    return wishlistCache;
  }
  return [];
}

export function invalidateWishlistCache() {
  wishlistCache = null;
  wishlistCacheTime = 0;
}

// Seller APIs (assumed endpoints; adjust to backend routes if different)
export async function fetchSellerSummary() {
  try {
    const res = await authenticatedFetch(`${API_BASE}/api/seller/summary/`);
    if (!res.ok) return { products: 0, orders_today: 0, revenue: 0 };
    return res.json();
  } catch {
    return { products: 0, orders_today: 0, revenue: 0 };
  }
}

export async function fetchSellerProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await authenticatedFetch(`${API_BASE}/api/seller/products/${query ? `?${query}` : ""}`);
  if (!res.ok) return { results: [], next: null, previous: null };
  return res.json();
}

export async function createSellerProduct(payload) {
  const res = await authenticatedFetch(`${API_BASE}/api/seller/products/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.detail || err?.error || "Failed to create product");
  }
  return res.json();
}

export async function fetchSellerProduct(id) {
  const res = await authenticatedFetch(`${API_BASE}/api/seller/products/${id}/`);
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export async function updateSellerProduct(id, payload) {
  const res = await authenticatedFetch(`${API_BASE}/api/seller/products/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.detail || err?.error || "Failed to update product");
  }
  return res.json();
}

export async function deleteSellerProduct(id) {
  const res = await authenticatedFetch(`${API_BASE}/api/seller/products/${id}/`, {
    method: "DELETE",
  });
  return res.ok;
}

export async function fetchSellerOrders(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await authenticatedFetch(`${API_BASE}/api/seller/orders/${query ? `?${query}` : ""}`);
  if (!res.ok) return { results: [], next: null, previous: null };
  return res.json();
}

export async function updateOrderStatus(id, status) {
  const res = await authenticatedFetch(`${API_BASE}/api/seller/orders/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await safeJson(res);
    throw new Error(err?.detail || err?.error || "Failed to update order");
  }
  return res.json();
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

