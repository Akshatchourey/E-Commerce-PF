//functions in this page: getAuthHeader, refreshToken, fetchProducts, authenticatedFetch, addToCart, fetchCartCount,


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


async function authenticatedFetch(url, options = {}) {
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
