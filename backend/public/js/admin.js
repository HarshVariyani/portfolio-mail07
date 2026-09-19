/* ==========================================================================
   Harsh Portfolio - Backend Admin Dashboard Client Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const inquiriesContainer = document.getElementById('inquiries-stream-container');
  const servicesContainer = document.getElementById('services-grid-container');
  const searchInput = document.getElementById('inquiry-search-input');
  const serviceFilter = document.getElementById('inquiry-service-filter');
  const refreshBtn = document.getElementById('refresh-dashboard-btn');
  const toast = document.getElementById('adminToast');

  // Stats elements
  const statTotalInquiries = document.getElementById('stat-total-inquiries');
  const statTopService = document.getElementById('stat-top-service');
  const statServicesCount = document.getElementById('stat-services-count');
  const statUptime = document.getElementById('stat-uptime');
  const apiStatusBadge = document.getElementById('api-status-badge');

  let allInquiries = [];

  // ==========================================================================
  // FETCH HEALTH & SERVER UPTIME
  // ==========================================================================
  async function fetchServerHealth() {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      if (data.status === 'ok') {
        const uptimeMinutes = Math.floor(data.uptime / 60);
        const uptimeHours = (data.uptime / 3600).toFixed(1);
        statUptime.textContent = uptimeMinutes > 60 ? `${uptimeHours} hrs` : `${uptimeMinutes} mins`;
        apiStatusBadge.className = 'status-pill status-online';
        apiStatusBadge.innerHTML = '<span class="status-dot"></span> API ONLINE';
      }
    } catch (err) {
      console.warn('Health check failed', err);
      statUptime.textContent = 'OFFLINE';
      apiStatusBadge.className = 'status-pill';
      apiStatusBadge.style.background = 'rgba(239, 68, 68, 0.15)';
      apiStatusBadge.style.color = '#f87171';
      apiStatusBadge.innerHTML = '⚠️ SERVER UNREACHABLE';
    }
  }

  // ==========================================================================
  // FETCH INQUIRIES FROM BACKEND API
  // ==========================================================================
  async function fetchInquiries() {
    try {
      inquiriesContainer.innerHTML = `
        <div class="loading-spinner">
          <i class="fa-solid fa-spinner fa-spin"></i> Fetching client inquiries...
        </div>
      `;

      const res = await fetch('/api/inquiries');
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        allInquiries = data.data;
        statTotalInquiries.textContent = data.count;
        calculateTopService(allInquiries);
        renderInquiries(allInquiries);
      } else {
        renderEmptyState('Failed to load inquiries.');
      }
    } catch (err) {
      console.error('Fetch inquiries error:', err);
      renderEmptyState('Error connecting to Backend API.');
    }
  }

  // ==========================================================================
  // RENDER INQUIRIES STREAM
  // ==========================================================================
  function renderInquiries(inquiriesList) {
    if (!inquiriesList || inquiriesList.length === 0) {
      renderEmptyState('No client inquiries found yet. Submissions from your website contact form will appear here in real-time!');
      return;
    }

    inquiriesContainer.innerHTML = '';

    inquiriesList.forEach(inquiry => {
      const card = document.createElement('div');
      card.className = 'inquiry-card';
      card.setAttribute('data-id', inquiry.id);

      const formattedDate = inquiry.timestamp ? new Date(inquiry.timestamp).toLocaleString() : 'N/A';
      const cleanPhone = inquiry.phone ? inquiry.phone.replace(/[^0-9+]/g, '') : '';
      const whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone.replace('+', '')}` : '#';

      card.innerHTML = `
        <div class="inquiry-header">
          <div class="client-name">
            <i class="fa-solid fa-user-circle" style="color: var(--accent-purple);"></i> ${escapeHtml(inquiry.fullName)}
            ${inquiry.company && inquiry.company !== 'N/A' ? `<span class="company-badge">${escapeHtml(inquiry.company)}</span>` : ''}
          </div>

          <div class="inquiry-meta-badges">
            <span class="badge-service">${escapeHtml(inquiry.projectType)}</span>
            <span class="badge-budget">${escapeHtml(inquiry.budget)}</span>
          </div>
        </div>

        <div class="inquiry-body-grid">
          <div class="inquiry-details-box">
            <strong style="color: var(--text-primary); display: block; margin-bottom: 4px;">Project Description:</strong>
            ${escapeHtml(inquiry.details)}
          </div>

          <div class="client-contact-info">
            <div class="contact-info-line">
              <i class="fa-solid fa-envelope" style="color: var(--accent-blue);"></i>
              <a href="mailto:${escapeHtml(inquiry.email)}">${escapeHtml(inquiry.email)}</a>
            </div>
            <div class="contact-info-line">
              <i class="fa-solid fa-phone" style="color: var(--accent-emerald);"></i>
              <a href="tel:${escapeHtml(inquiry.phone)}">${escapeHtml(inquiry.phone)}</a>
            </div>
          </div>
        </div>

        <div class="inquiry-footer">
          <div class="inquiry-time">
            <i class="fa-solid fa-clock"></i> Received: ${formattedDate}
          </div>

          <div class="inquiry-actions">
            <a href="mailto:${escapeHtml(inquiry.email)}?subject=Re:%20${encodeURIComponent(inquiry.projectType)}%20Inquiry%20-%20Harsh" class="btn btn-outline" style="padding: 0.4rem 0.9rem; font-size: 0.8rem;">
              <i class="fa-solid fa-reply"></i> Email Client
            </a>
            ${cleanPhone ? `<a href="${whatsappUrl}" target="_blank" class="btn btn-outline" style="padding: 0.4rem 0.9rem; font-size: 0.8rem; color: #4ade80;">
              <i class="fa-brands fa-whatsapp"></i> WhatsApp
            </a>` : ''}
            <button class="btn btn-danger delete-inquiry-btn" data-id="${inquiry.id}" style="padding: 0.4rem 0.9rem; font-size: 0.8rem;">
              <i class="fa-solid fa-trash"></i> Delete
            </button>
          </div>
        </div>
      `;

      inquiriesContainer.appendChild(card);
    });

    // Attach delete listeners
    document.querySelectorAll('.delete-inquiry-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        deleteInquiry(id);
      });
    });
  }

  // ==========================================================================
  // DELETE INQUIRY
  // ==========================================================================
  async function deleteInquiry(id) {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        showToast('Inquiry deleted successfully.');
        fetchInquiries();
      } else {
        showToast(data.message || 'Failed to delete inquiry.');
      }
    } catch (err) {
      showToast('Error deleting inquiry.');
    }
  }

  // ==========================================================================
  // FETCH SERVICES
  // ==========================================================================
  async function fetchServices() {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        statServicesCount.textContent = data.count;
        renderServices(data.data);
      }
    } catch (err) {
      console.warn('Error fetching services API', err);
    }
  }

  function renderServices(servicesList) {
    if (!servicesContainer) return;
    servicesContainer.innerHTML = '';

    servicesList.forEach(service => {
      const card = document.createElement('div');
      card.className = 'service-admin-card';

      card.innerHTML = `
        <h3>${escapeHtml(service.title)}</h3>
        <p>${escapeHtml(service.description)}</p>
        <div style="margin-top: 1rem; display: flex; gap: 0.4rem; flex-wrap: wrap;">
          ${service.features.map(f => `<span style="font-size: 0.75rem; background: rgba(255,255,255,0.08); padding: 0.2rem 0.6rem; border-radius: 99px;">${escapeHtml(f)}</span>`).join('')}
        </div>
      `;
      servicesContainer.appendChild(card);
    });
  }

  // ==========================================================================
  // UTILS
  // ==========================================================================
  function calculateTopService(inquiries) {
    if (!inquiries || inquiries.length === 0) {
      statTopService.textContent = 'None Yet';
      return;
    }

    const serviceCounts = {};
    inquiries.forEach(inq => {
      const s = inq.projectType || 'General';
      serviceCounts[s] = (serviceCounts[s] || 0) + 1;
    });

    let topService = 'Video Editing';
    let maxCount = 0;
    for (const [service, count] of Object.entries(serviceCounts)) {
      if (count > maxCount) {
        maxCount = count;
        topService = service;
      }
    }

    statTopService.textContent = topService;
  }

  function renderEmptyState(message) {
    inquiriesContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon"><i class="fa-solid fa-folder-open"></i></div>
        <h3>No Inquiries Found</h3>
        <p style="margin-top: 0.5rem;">${escapeHtml(message)}</p>
      </div>
    `;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  // Search & Filter Listeners
  if (searchInput) {
    searchInput.addEventListener('input', filterInquiries);
  }
  if (serviceFilter) {
    serviceFilter.addEventListener('change', filterInquiries);
  }

  function filterInquiries() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedService = serviceFilter ? serviceFilter.value : 'all';

    const filtered = allInquiries.filter(inq => {
      const matchQuery = !query || 
        inq.fullName.toLowerCase().includes(query) ||
        inq.email.toLowerCase().includes(query) ||
        inq.details.toLowerCase().includes(query) ||
        (inq.company && inq.company.toLowerCase().includes(query));

      const matchService = selectedService === 'all' || inq.projectType === selectedService;

      return matchQuery && matchService;
    });

    renderInquiries(filtered);
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      fetchServerHealth();
      fetchInquiries();
      fetchServices();
      showToast('Dashboard data refreshed.');
    });
  }

  // Initial Load
  fetchServerHealth();
  fetchInquiries();
  fetchServices();
});
