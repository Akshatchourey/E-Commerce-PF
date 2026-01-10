const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const authAPI = {
  register: async (userData) => {
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('Full register URL:', `${API_BASE_URL}/api/register/`);
    console.log('User data being sent:', userData);

    const response = await fetch(`${API_BASE_URL}/api/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
      }),
    });
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    let data;
    try {
      data = await response.json();
    } catch (err) {
      console.warn('Non-JSON register response', err);
      if (!response.ok) throw new Error(response.statusText || 'Registration failed');
      return {};
    }
    console.log('Response data:', data);
    if (!response.ok) {
      const errMsg = data?.detail || (typeof data === 'object' ? Object.values(data).flat().join(', ') : null) || 'Registration failed';
      throw new Error(errMsg);
    }
    return data;
  },
  login: async (credentials) => {
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('Full login URL:', `${API_BASE_URL}/api/login/`);
    console.log('Credentials being sent:', { username: credentials.username });
    const response = await fetch(`${API_BASE_URL}/api/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    let data;
    try {
      data = await response.json();
    } catch (err) {
      console.warn('Non-JSON login response', err);
      if (!response.ok) throw new Error(response.statusText || 'Login failed');
      return {};
    }

    console.log('Response data:', data);
    
    if (!response.ok) {
      const errMsg = data?.detail || (typeof data === 'object' ? Object.values(data).flat().join(', ') : null) || 'Login failed';
      throw new Error(errMsg);
    }
      if (data.access) {
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', data.role);
      try {
        window.dispatchEvent(new CustomEvent('authChanged', { detail: { username: data.username, role: data.role } }));
      } catch (e) {
      }
    }
    
    return data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    try {
      window.dispatchEvent(new CustomEvent('authChanged', { detail: null }));
    } catch (e) {
      /* ignore in non-browser environments */
    }

    if (!response.ok) {
      let data;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error(response.statusText || 'Logout failed');
      }
      throw new Error(data?.detail || (typeof data === 'object' ? Object.values(data).flat().join(', ') : null) || 'Logout failed');
    }

    return await response.json();
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  // Get current user info
  getCurrentUser: () => {
    return {
      username: localStorage.getItem('username'),
      role: localStorage.getItem('role'),
      accessToken: localStorage.getItem('accessToken'),
    };
  },
};