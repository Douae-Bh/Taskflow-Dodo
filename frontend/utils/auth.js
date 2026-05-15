const auth = {
  getToken() {
    return localStorage.getItem('token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setAuth(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  
  async restoreSession() {
    const token = this.getToken();
    if (!token) return false;

    try {
      await window.api.get('/auth/me');
      return true; 
    } catch {
      
      this.clearAuth();
      return false;
    }
  },

  
  logout() {
    this.clearAuth();
    window.location.href = '/pages/login.html';
  },
};

window.auth = auth;