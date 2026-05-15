const API_URL = 'http://localhost:5000/api';

const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const url = `${API_URL}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    
    Object.assign(headers, options.headers || {});

    const config = {
      method: options.method || 'GET',
      headers,
    };

   
    if (options.body !== undefined) {
      config.body =
        typeof options.body === 'object'
          ? JSON.stringify(options.body)
          : options.body;
    }

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text || 'Erreur serveur' };
      }

      if (!response.ok) {
       
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (!window.location.pathname.includes('login')) {
            window.location.href = '/pages/login.html';
          }
        }
        throw new Error(data.message || `Erreur HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  },

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  },

  patch(endpoint, body) {
    return this.request(endpoint, { method: 'PATCH', body });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },
};

window.api = api;