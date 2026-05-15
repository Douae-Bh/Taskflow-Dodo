const guards = {
  
  requireAuth() {
    if (!auth.isAuthenticated()) {
      window.location.href = '/pages/login.html';
      return false;
    }
    return true;
  },

  
  requireGuest() {
    if (auth.isAuthenticated()) {
      window.location.href = '/pages/dashboard.html';
      return false;
    }
    return true;
  },

  
  async checkToken() {
    const isValid = await auth.restoreSession();
    if (!isValid && !window.location.pathname.includes('login') &&
        !window.location.pathname.includes('register') &&
        window.location.pathname !== '/' &&
        window.location.pathname !== '/index.html') {
      window.location.href = '/pages/login.html';
    }
  },
};

window.guards = guards;