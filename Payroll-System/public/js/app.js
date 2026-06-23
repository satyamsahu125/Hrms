document.addEventListener('DOMContentLoaded', function () {
  initTheme();
  initSidebar();
  initToasts();
  loadNotifications();
});

function initTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      const icon = toggle.querySelector('i');
      if (icon) {
        icon.className = next === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
      }
    });
    const icon = toggle.querySelector('i');
    if (icon) icon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
  }
}

function initSidebar() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (toggle && sidebar) {
    toggle.addEventListener('click', function () {
      sidebar.classList.toggle('show');
      if (overlay) overlay.classList.toggle('show');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', function () {
      sidebar.classList.remove('show');
      overlay.classList.remove('show');
    });
  }
}

function initToasts() {
  const toastEl = document.querySelector('.toast-auto');
  if (toastEl) {
    const toast = new bootstrap.Toast(toastEl, { delay: 5000 });
    toast.show();
  }
}

function loadNotifications() {
  const badge = document.getElementById('notifBadge');
  const list = document.getElementById('notifList');
  if (!badge) return;

  fetch('/notifications/api/unread')
    .then((r) => r.json())
    .then((data) => {
      if (data.count > 0) {
        badge.textContent = data.count;
        badge.classList.remove('d-none');
      } else {
        badge.classList.add('d-none');
      }
      if (list && data.notifications) {
        list.innerHTML = data.notifications.length
          ? data.notifications.map((n) => `
            <a href="${n.link || '/notifications'}" class="dropdown-item py-2 ${n.isRead ? '' : 'bg-light'}">
              <div class="fw-semibold small">${n.title}</div>
              <div class="text-muted small">${n.message}</div>
            </a>`).join('')
          : '<div class="dropdown-item text-muted">No notifications</div>';
      }
    })
    .catch(() => {});
}

function confirmDelete(message) {
  return confirm(message || 'Are you sure you want to delete this?');
}

window.formatCurrency = function (amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
};
