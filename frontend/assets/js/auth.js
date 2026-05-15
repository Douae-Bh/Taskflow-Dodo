// ===== UTILITAIRES AFFICHAGE =====

function showError(msg) {
  const el = document.getElementById('errorMsg');
  if (el) {
    el.textContent = msg;
    el.classList.add('show');
    el.style.display = 'block';
  }
}

function clearError() {
  const el = document.getElementById('errorMsg');
  if (el) {
    el.classList.remove('show');
    el.style.display = 'none';
  }
}

function setLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.disabled = true;
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML =
      '<span style="display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite;margin-right:8px;vertical-align:middle"></span> Chargement...';
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.originalText || '<span>Continuer</span>';
  }
}


document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.api === 'undefined') {
    showError('Erreur de chargement. Veuillez rafraîchir la page.');
    return;
  }

  // ── FORMULAIRE CONNEXION ──
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submitBtn');
      clearError();
      setLoading(submitBtn, true);

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      if (!email || !password) {
        showError('Veuillez remplir tous les champs');
        setLoading(submitBtn, false);
        return;
      }

      try {
        const data = await window.api.post('/auth/login', { email, password });

        if (data.token) {
          // Stocker le token dans le LocalStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem(
            'user',
            JSON.stringify({ _id: data._id, fullName: data.fullName, email: data.email })
          );
          showToast('Connexion réussie !', 'success');
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 800);
        } else {
          throw new Error('Token manquant dans la réponse');
        }
      } catch (error) {
        showError(error.message || 'Email ou mot de passe incorrect');
        setLoading(submitBtn, false);
      }
    });
  }

  
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    const passwordInput = document.getElementById('password');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    
    if (passwordInput) {
      passwordInput.addEventListener('input', (e) => {
        const val = e.target.value;
        let strength = 0;
        if (val.length >= 6) strength++;
        if (val.length >= 10) strength++;
        if (/[A-Z]/.test(val)) strength++;
        if (/[0-9]/.test(val)) strength++;
        if (/[^A-Za-z0-9]/.test(val)) strength++;

        const colors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#22c55e'];
        const texts = ['', 'Faible', 'Moyen', 'Bon', 'Fort', 'Très fort'];

        if (strengthBar) {
          strengthBar.style.width = `${(strength / 5) * 100}%`;
          strengthBar.style.backgroundColor = colors[strength];
        }
        if (strengthText) {
          strengthText.textContent = texts[strength];
          strengthText.style.color = colors[strength];
        }
      });
    }

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submitBtn');
      const successMsg = document.getElementById('successMsg');
      clearError();
      setLoading(submitBtn, true);

      const fullName = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      if (!fullName || !email || !password) {
        showError('Veuillez remplir tous les champs');
        setLoading(submitBtn, false);
        return;
      }

      if (password.length < 6) {
        showError('Le mot de passe doit contenir au moins 6 caractères');
        setLoading(submitBtn, false);
        return;
      }

      try {
        await window.api.post('/auth/register', { fullName, email, password });

        if (successMsg) {
          successMsg.textContent = 'Compte créé avec succès ! Redirection vers la connexion...';
          successMsg.classList.add('show');
          successMsg.style.display = 'block';
        }
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
      } catch (error) {
        showError(error.message || "Erreur lors de l'inscription");
        setLoading(submitBtn, false);
      }
    });
  }

  
  const logoutBtns = document.querySelectorAll('[data-action="logout"], #logoutBtn, .logout-btn');
  logoutBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Supprime le token et redirige vers login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/pages/login.html';
    });
  });
});



function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast-notification alert alert-${type}`;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    animation: slideInRight 0.3s ease;
    max-width: 400px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    padding: 1rem 1.5rem;
    border-radius: 8px;
    background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#6366f1'};
    color: white;
    font-weight: 500;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

window.showToast = showToast;


const toastStyles = document.createElement('style');
toastStyles.textContent = `
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(100px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideOutRight {
    from { opacity: 1; transform: translateX(0); }
    to   { opacity: 0; transform: translateX(100px); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(toastStyles);