/* ==========================================================================
   Luxignia — Main Client Application & E-Commerce Workflow Manager
   ========================================================================== */

class LuxigniaApp {
  constructor() {
    this.cart = [];
    this.wishlist = new Set();
    this.products = [];
    this.currentUser = null;
    this.currentView = 'home';
    this.activeCategory = 'All';
    this.activeVastu = '';
    this.searchQuery = '';
    this.activeSort = 'featured';
    this.token = localStorage.getItem('lux_token') || null;
  }

  async init() {
    this.loadCart();
    this.loadWishlist();
    await this.checkAuthStatus();
    await this.fetchProducts();
    this.bindNavigation();
    this.bindSearchAndFilter();
    this.bindModals();
    this.bindForms();
    this.renderCatalog();
    this.renderHomeFeatured();
    this.updateCartBadge();
    this.handleInitialRoute();

    // Initialize Hero 3D scene
    if (window.luxEngine) {
      setTimeout(() => {
        window.luxEngine.initHeroCanvas('hero-threejs-container');
      }, 150);
    }
  }

  // --- AUTHENTICATION STATE ---
  async checkAuthStatus() {
    if (!this.token) {
      this.updateAuthUI(null);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      const data = await res.json();
      if (data.success && data.user) {
        this.currentUser = data.user;
        this.updateAuthUI(this.currentUser);
      } else {
        this.logout(false);
      }
    } catch (err) {
      console.warn("Could not verify session:", err);
      this.updateAuthUI(null);
    }
  }

  updateAuthUI(user) {
    const guestBtn = document.getElementById('btn-header-login');
    const userMenu = document.getElementById('user-header-menu');
    const navDashboard = document.getElementById('nav-link-dashboard');
    const navCrm = document.getElementById('nav-link-crm');
    const navAdmin = document.getElementById('nav-link-admin');
    const mobileDashboard = document.getElementById('mobile-link-dashboard');
    const mobileCrm = document.getElementById('mobile-link-crm');
    const mobileAdmin = document.getElementById('mobile-link-admin');
    const staffDropdown = document.getElementById('dropdown-staff-links');
    const adminDropdown = document.getElementById('dropdown-admin-links');

    if (user) {
      if (guestBtn) guestBtn.classList.add('hidden');
      if (userMenu) userMenu.classList.remove('hidden');

      const nameEl = document.getElementById('user-header-name');
      const avatarEl = document.getElementById('user-avatar-initial');
      const fullNameEl = document.getElementById('dropdown-user-fullname');
      const emailEl = document.getElementById('dropdown-user-email');
      const roleEl = document.getElementById('dropdown-user-role');

      if (nameEl) nameEl.textContent = user.name.split(' ')[0];
      if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();
      if (fullNameEl) fullNameEl.textContent = user.name;
      if (emailEl) emailEl.textContent = user.email;
      if (roleEl) {
        roleEl.textContent = user.role.toUpperCase().replace('_', ' ');
        roleEl.className = `role-badge role-${user.role}`;
      }

      // Show patron portal
      if (navDashboard) navDashboard.style.display = 'inline-flex';
      if (mobileDashboard) mobileDashboard.style.display = 'block';

      // Role gates for staff & admin
      const isStaffOrAdmin = ['staff', 'admin', 'super_admin'].includes(user.role);
      const isAdmin = ['admin', 'super_admin'].includes(user.role);

      if (navCrm) navCrm.style.display = isStaffOrAdmin ? 'inline-flex' : 'none';
      if (mobileCrm) mobileCrm.style.display = isStaffOrAdmin ? 'block' : 'none';
      if (staffDropdown) staffDropdown.style.display = isStaffOrAdmin ? 'block' : 'none';

      if (navAdmin) navAdmin.style.display = isAdmin ? 'inline-flex' : 'none';
      if (mobileAdmin) mobileAdmin.style.display = isAdmin ? 'block' : 'none';
      if (adminDropdown) adminDropdown.style.display = isAdmin ? 'block' : 'none';
    } else {
      if (guestBtn) guestBtn.classList.remove('hidden');
      if (userMenu) userMenu.classList.add('hidden');
      if (navDashboard) navDashboard.style.display = 'none';
      if (mobileDashboard) mobileDashboard.style.display = 'none';
      if (navCrm) navCrm.style.display = 'none';
      if (mobileCrm) mobileCrm.style.display = 'none';
      if (navAdmin) navAdmin.style.display = 'none';
      if (mobileAdmin) mobileAdmin.style.display = 'none';
    }
  }

  toggleUserDropdown() {
    const dropdown = document.getElementById('dropdown-user-menu');
    if (dropdown) dropdown.classList.toggle('hidden');
  }

  async login(email, password, bannerEl) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        this.token = data.token;
        localStorage.setItem('lux_token', data.token);
        this.currentUser = data.user;
        this.updateAuthUI(data.user);
        this.closeModal('modal-auth');
        window.showToast(`Welcome back, ${data.user.name}`);

        // Redirect based on role
        if (['admin', 'super_admin'].includes(data.user.role)) {
          this.switchView('admin');
        } else if (data.user.role === 'staff') {
          this.switchView('crm');
        } else {
          this.switchView('dashboard');
        }
      } else {
        if (bannerEl) {
          bannerEl.textContent = data.message || 'Authentication failed.';
          bannerEl.classList.remove('hidden');
        } else {
          window.showToast(data.message || 'Authentication failed.');
        }
      }
    } catch (err) {
      console.error(err);
      if (bannerEl) {
        bannerEl.textContent = 'Server connection error. Please try again.';
        bannerEl.classList.remove('hidden');
      }
    }
  }

  async register(formData, bannerEl) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        this.token = data.token;
        localStorage.setItem('lux_token', data.token);
        this.currentUser = data.user;
        this.updateAuthUI(data.user);
        this.closeModal('modal-auth');
        window.showToast("Welcome to Luxignia Patron Sanctuary.");
        this.switchView('dashboard');
      } else {
        if (bannerEl) {
          bannerEl.textContent = data.message || 'Registration failed.';
          bannerEl.classList.remove('hidden');
        } else {
          window.showToast(data.message || 'Registration failed.');
        }
      }
    } catch (err) {
      console.error(err);
      if (bannerEl) {
        bannerEl.textContent = 'Server connection error. Please try again.';
        bannerEl.classList.remove('hidden');
      }
    }
  }

  async logout(notify = true) {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}

    localStorage.removeItem('lux_token');
    this.token = null;
    this.currentUser = null;
    this.updateAuthUI(null);
    const dropdown = document.getElementById('dropdown-user-menu');
    if (dropdown) dropdown.classList.add('hidden');
    if (notify) window.showToast("Signed out successfully.");
    this.switchView('home');
  }

  // --- ROUTING & VIEW NAVIGATION ---
  handleInitialRoute() {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (hash && ['home', 'about', 'shop', 'gifting', 'vastu', 'salon', 'contact', 'login', 'register', 'forgot-password', 'dashboard', 'crm', 'admin'].includes(hash)) {
      this.switchView(hash);
    } else {
      this.switchView('home');
    }

    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#/', '').replace('#', '');
      if (h) this.switchView(h);
    });
  }

  switchView(viewName) {
    // Route protection
    if (viewName === 'dashboard') {
      if (!this.currentUser) {
        this.openAuthModal('login');
        window.showToast("Please sign in to access your patron dashboard.");
        return;
      }
    } else if (viewName === 'crm') {
      if (!this.currentUser) {
        this.openAuthModal('login');
        window.showToast("Sign in with staff or administrator credentials.");
        return;
      }
      if (!['staff', 'admin', 'super_admin'].includes(this.currentUser.role)) {
        window.showToast("Access Denied: Patron accounts cannot access the Executive CRM.");
        return;
      }
    } else if (viewName === 'admin') {
      if (!this.currentUser) {
        this.openAuthModal('login');
        window.showToast("Sign in with administrator credentials.");
        return;
      }
      if (!['admin', 'super_admin'].includes(this.currentUser.role)) {
        window.showToast("Access Denied: Administrative privileges required.");
        return;
      }
    }

    this.currentView = viewName;

    // Hide all view sections
    document.querySelectorAll('.app-view').forEach(view => {
      view.style.display = 'none';
    });

    const targetEl = document.getElementById(`view-${viewName}`);
    if (targetEl) {
      targetEl.style.display = 'block';
    } else {
      document.getElementById('view-home').style.display = 'block';
    }

    // Update active nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.dataset.path === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update URL Hash without reload
    history.replaceState(null, null, `#/${viewName}`);

    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close mobile drawer if open
    const mobileDrawer = document.getElementById('mobile-menu-drawer');
    if (mobileDrawer) mobileDrawer.classList.remove('active');

    // Close user dropdown if open
    const userDropdown = document.getElementById('dropdown-user-menu');
    if (userDropdown) userDropdown.classList.add('hidden');

    // Refresh custom cursor
    if (window.refreshCustomCursor) window.refreshCustomCursor();

    // Trigger page-specific initializers
    if (viewName === 'dashboard') {
      this.loadDashboard();
    } else if (viewName === 'crm' && window.crmApp) {
      window.crmApp.init();
    } else if (viewName === 'admin' && window.crmApp) {
      window.crmApp.initAdmin();
    }
  }

  bindNavigation() {
    document.querySelectorAll('[data-path]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.dataset.path;
        this.switchView(targetView);
      });
    });
  }

  // --- CATALOG & PRODUCTS ---
  async fetchProducts() {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        this.products = data.products;
      }
    } catch (err) {
      console.error("Error fetching catalog products:", err);
    }
  }

  bindSearchAndFilter() {
    const searchInput = document.getElementById('catalog-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim();
        this.renderCatalog();
      });
    }

    // Category pills
    document.querySelectorAll('[data-category-filter]').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('[data-category-filter]').forEach(p => {
          p.classList.remove('bg-forest-brand', 'text-white');
          p.classList.add('bg-surface-muted', 'text-primary');
        });
        e.target.classList.remove('bg-surface-muted', 'text-primary');
        e.target.classList.add('bg-forest-brand', 'text-white');
        this.activeCategory = e.target.dataset.categoryFilter;
        this.renderCatalog();
      });
    });

    // Vastu pills
    document.querySelectorAll('[data-vastu-filter]').forEach(pill => {
      pill.addEventListener('click', (e) => {
        if (this.activeVastu === e.target.dataset.vastuFilter) {
          this.activeVastu = '';
          e.target.classList.remove('bg-forest-brand', 'text-white');
        } else {
          document.querySelectorAll('[data-vastu-filter]').forEach(p => p.classList.remove('bg-forest-brand', 'text-white'));
          e.target.classList.add('bg-forest-brand', 'text-white');
          this.activeVastu = e.target.dataset.vastuFilter;
        }
        this.renderCatalog();
      });
    });
  }

  handleSortChange(val) {
    this.activeSort = val;
    this.renderCatalog();
  }

  filterByCategory(cat) {
    this.activeCategory = cat;
    document.querySelectorAll('[data-category-filter]').forEach(p => {
      if (p.dataset.categoryFilter.toLowerCase() === cat.toLowerCase()) {
        p.classList.remove('bg-surface-muted', 'text-primary');
        p.classList.add('bg-forest-brand', 'text-white');
      } else {
        p.classList.remove('bg-forest-brand', 'text-white');
        p.classList.add('bg-surface-muted', 'text-primary');
      }
    });
    this.switchView('shop');
    this.renderCatalog();
  }

  filterByVastu(vastu) {
    this.activeVastu = vastu;
    document.querySelectorAll('[data-vastu-filter]').forEach(p => {
      if (p.dataset.vastuFilter.toLowerCase() === vastu.toLowerCase()) {
        p.classList.add('bg-forest-brand', 'text-white');
      } else {
        p.classList.remove('bg-forest-brand', 'text-white');
      }
    });
    this.switchView('shop');
    this.renderCatalog();
  }

  renderCatalog() {
    const catalogContainer = document.getElementById('catalog-grid');
    if (!catalogContainer) return;

    let filtered = [...this.products];

    if (this.activeCategory && this.activeCategory !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === this.activeCategory.toLowerCase());
    }

    if (this.activeVastu) {
      filtered = filtered.filter(p => p.vastu.toLowerCase().includes(this.activeVastu.toLowerCase()));
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || (p.badge && p.badge.toLowerCase().includes(q)));
    }

    // Sort
    switch (this.activeSort) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    if (filtered.length === 0) {
      catalogContainer.innerHTML = `
        <div class="col-span-full text-center py-16 bg-white rounded-2xl border border-subtle">
          <span class="material-symbols-outlined text-gold-antique text-4xl mb-3">auto_awesome</span>
          <h4 class="font-serif text-xl font-bold text-primary mb-2">No Statement Pieces Found</h4>
          <p class="text-xs text-muted">Try clearing your search query or adjusting your Vastu directional filter.</p>
          <button onclick="window.app.filterByCategory('All')" class="btn-outline text-xs mt-4">Reset Filters</button>
        </div>
      `;
      return;
    }

    catalogContainer.innerHTML = filtered.map(product => {
      const isWishlisted = this.wishlist.has(product.id);
      return `
        <div class="luxury-card group flex flex-col justify-between" data-cursor="pointer">
          <!-- Image & 3D Hover Shield -->
          <div class="relative aspect-[4/5] bg-surface-container-low overflow-hidden cursor-pointer" onclick="window.app.open3DStudioModal('${product.id}')">
            <img src="${product.image}" alt="${product.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
            
            <!-- Badges -->
            <div class="absolute top-4 left-4 z-10 flex flex-col gap-2">
              <span class="badge-gold">${product.badge || 'Artisanal'}</span>
            </div>

            <!-- Wishlist Button -->
            <button onclick="event.stopPropagation(); window.app.toggleWishlist('${product.id}')" class="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-primary shadow-sm hover:bg-gold-antique hover:text-white transition-colors" title="Save to Wishlist">
              <span class="material-symbols-outlined text-[20px] ${isWishlisted ? 'text-red-600 fill-current' : ''}">${isWishlisted ? 'favorite' : 'favorite_border'}</span>
            </button>

            <!-- Quick 3D Inspector Pill -->
            <div class="absolute bottom-4 left-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="bg-forest-deep/90 backdrop-blur-md text-gold-bright text-xs uppercase tracking-wider font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg">
                <span class="material-symbols-outlined text-[18px]">view_in_ar</span>
                <span>Inspect in 3D Studio</span>
              </div>
            </div>
          </div>

          <!-- Metadata -->
          <div class="p-6 flex flex-col flex-grow justify-between bg-surface-white">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="vastu-pill">${product.vastu}</span>
                <span class="text-xs text-gold-antique font-semibold">★ ${product.rating} (${product.reviews_count || product.reviewsCount || 1})</span>
              </div>
              <h3 class="font-serif text-lg font-semibold text-primary mb-1 group-hover:text-gold-antique transition-colors cursor-pointer" onclick="window.app.open3DStudioModal('${product.id}')">${product.title}</h3>
              <p class="text-xs text-muted mb-4 line-clamp-2">${product.subtitle}</p>
            </div>

            <div class="pt-4 border-t border-subtle flex items-center justify-between">
              <div>
                <span class="text-[10px] text-muted uppercase tracking-wider block">Acquisition Price</span>
                <span class="font-serif text-xl font-bold text-primary">$${product.price.toLocaleString()}</span>
              </div>
              <div class="flex items-center gap-2">
                <button onclick="window.app.addToCart('${product.id}')" class="btn-primary py-2.5 px-4 text-xs">
                  <span class="material-symbols-outlined text-[16px]">shopping_bag</span>
                  <span>Acquire</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.refreshCustomCursor) window.refreshCustomCursor();
  }

  renderHomeFeatured() {
    const featuredContainer = document.getElementById('home-featured-grid');
    if (!featuredContainer) return;

    const featured = this.products.filter(p => p.featured).slice(0, 3);
    if (featured.length === 0) return;

    featuredContainer.innerHTML = featured.map(p => `
      <div class="luxury-card group flex flex-col justify-between" onclick="window.app.open3DStudioModal('${p.id}')">
        <div class="relative aspect-[4/5] overflow-hidden">
          <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
          <span class="badge-gold absolute top-4 left-4 z-10">${p.badge}</span>
        </div>
        <div class="p-6 bg-surface-white flex flex-col justify-between flex-grow">
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="vastu-pill">${p.vastu}</span>
              <span class="text-xs text-gold-antique font-bold">★ ${p.rating}</span>
            </div>
            <h3 class="font-serif font-bold text-lg text-primary mb-1">${p.title}</h3>
            <p class="text-xs text-muted mb-4 line-clamp-2">${p.subtitle}</p>
          </div>
          <div class="pt-4 border-t border-subtle flex justify-between items-center">
            <span class="font-serif text-xl font-bold text-primary">$${p.price.toLocaleString()}</span>
            <button onclick="event.stopPropagation(); window.app.addToCart('${p.id}')" class="btn-primary py-2 px-3 text-xs">Acquire</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // --- WISHLIST ---
  loadWishlist() {
    try {
      const saved = localStorage.getItem('lux_wishlist');
      if (saved) this.wishlist = new Set(JSON.parse(saved));
    } catch (e) { this.wishlist = new Set(); }
    this.updateWishlistBadge();
  }

  saveWishlist() {
    localStorage.setItem('lux_wishlist', JSON.stringify(Array.from(this.wishlist)));
    this.updateWishlistBadge();
  }

  updateWishlistBadge() {
    const badge = document.getElementById('wishlist-count-badge');
    if (badge) {
      badge.textContent = this.wishlist.size;
      badge.style.display = this.wishlist.size > 0 ? 'flex' : 'none';
    }
  }

  async toggleWishlist(productId) {
    if (this.wishlist.has(productId)) {
      this.wishlist.delete(productId);
      window.showToast("Removed from Curator Wishlist");
    } else {
      this.wishlist.add(productId);
      window.showToast("Saved to Curator Wishlist");
    }
    this.saveWishlist();
    this.renderCatalog();

    // If authenticated, also sync with database
    if (this.currentUser && this.token) {
      try {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ productId })
        });
      } catch (e) {}
    }
  }

  openWishlist() {
    if (this.currentUser) {
      this.switchView('dashboard');
      this.switchDashboardTab('favorites');
    } else {
      this.switchView('shop');
      window.showToast("Showing your curated artifacts.");
    }
  }

  // --- CART & CHECKOUT ---
  loadCart() {
    try {
      const saved = localStorage.getItem('lux_cart');
      if (saved) this.cart = JSON.parse(saved);
    } catch (e) { this.cart = []; }
  }

  saveCart() {
    localStorage.setItem('lux_cart', JSON.stringify(this.cart));
    this.updateCartBadge();
    this.renderCartDrawer();
  }

  addToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const existing = this.cart.find(item => item.productId === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      this.cart.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        model3dId: product.model3d_id || product.model3dId,
        qty: 1
      });
    }

    this.saveCart();
    window.showToast(`Acquisition added: ${product.title}`);
    this.openCartDrawer();
  }

  updateCartBadge() {
    const totalCount = this.cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('.cart-count-badge').forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'flex' : 'none';
    });
  }

  openCartDrawer() {
    this.renderCartDrawer();
    const overlay = document.getElementById('drawer-cart');
    if (overlay) overlay.classList.add('active');
  }

  closeCartDrawer() {
    const overlay = document.getElementById('drawer-cart');
    if (overlay) overlay.classList.remove('active');
  }

  renderCartDrawer() {
    const itemsContainer = document.getElementById('cart-drawer-items');
    const totalEl = document.getElementById('cart-drawer-total');
    if (!itemsContainer || !totalEl) return;

    if (this.cart.length === 0) {
      itemsContainer.innerHTML = `
        <div class="py-16 text-center text-muted">
          <span class="material-symbols-outlined text-4xl text-gold-antique mb-2">shopping_bag</span>
          <p class="font-serif text-lg font-bold text-primary">Your Acquisition Bag is Empty</p>
          <p class="text-xs">Explore our artisanal collection of statement pieces.</p>
        </div>
      `;
      totalEl.textContent = '$0';
      return;
    }

    let subtotal = 0;
    itemsContainer.innerHTML = this.cart.map(item => {
      subtotal += item.price * item.qty;
      return `
        <div class="flex items-center justify-between p-4 bg-white rounded-xl border border-subtle shadow-sm mb-3">
          <div class="flex items-center gap-3">
            <img src="${item.image}" class="w-14 h-14 object-cover rounded-lg border border-gold" alt="${item.title}">
            <div>
              <h5 class="font-serif font-bold text-xs text-primary line-clamp-1">${item.title}</h5>
              <div class="text-xs text-gold-bright font-bold mt-0.5">$${item.price.toLocaleString()}</div>
              <div class="flex items-center gap-2 mt-1">
                <button onclick="window.app.updateCartQty('${item.productId}', -1)" class="w-5 h-5 rounded bg-surface-muted text-xs font-bold">-</button>
                <span class="text-xs font-bold">${item.qty}</span>
                <button onclick="window.app.updateCartQty('${item.productId}', 1)" class="w-5 h-5 rounded bg-surface-muted text-xs font-bold">+</button>
              </div>
            </div>
          </div>
          <button onclick="window.app.removeCartItem('${item.productId}')" class="text-muted hover:text-red-600 p-1">
            <span class="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      `;
    }).join('');

    totalEl.textContent = `$${subtotal.toLocaleString()}`;
  }

  updateCartQty(productId, delta) {
    const item = this.cart.find(i => i.productId === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      this.removeCartItem(productId);
    } else {
      this.saveCart();
    }
  }

  removeCartItem(productId) {
    this.cart = this.cart.filter(i => i.productId !== productId);
    this.saveCart();
    window.showToast("Artifact removed from bag");
  }

  openCheckoutModal() {
    if (this.cart.length === 0) {
      window.showToast("Your acquisition bag is empty!");
      return;
    }
    this.closeCartDrawer();
    const modal = document.getElementById('modal-checkout');
    if (!modal) return;

    // Pre-fill user data if logged in
    if (this.currentUser) {
      const nameInp = document.getElementById('checkout-patron-name');
      const emailInp = document.getElementById('checkout-email');
      const phoneInp = document.getElementById('checkout-phone');
      const addrInp = document.getElementById('checkout-address');

      if (nameInp) nameInp.value = this.currentUser.name;
      if (emailInp) emailInp.value = this.currentUser.email;
      if (phoneInp && this.currentUser.phone) phoneInp.value = this.currentUser.phone;
      if (addrInp && this.currentUser.address) addrInp.value = this.currentUser.address;
    }

    modal.classList.add('active');
  }

  // --- 3D STUDIO MODAL ---
  open3DStudioModal(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('modal-3d-studio');
    if (!modal) return;

    // Populate studio metadata
    document.getElementById('studio-title').textContent = product.title;
    document.getElementById('studio-subtitle').textContent = product.subtitle;
    document.getElementById('studio-price').textContent = `$${product.price.toLocaleString()}`;
    document.getElementById('studio-vastu').textContent = product.vastu;
    document.getElementById('studio-vastu-benefit').textContent = product.vastu_benefit || product.vastuBenefit || 'Spatial Balance & Prosperity';
    document.getElementById('studio-material').textContent = product.material || 'Hand-gilded Brass & Marble';
    document.getElementById('studio-dimensions').textContent = product.dimensions || '38cm × 22cm × 48cm';
    document.getElementById('studio-weight').textContent = product.weight || '14 kg';
    document.getElementById('studio-desc').textContent = product.description;

    const acquireBtn = document.getElementById('studio-acquire-btn');
    if (acquireBtn) {
      acquireBtn.onclick = () => {
        this.addToCart(product.id);
        this.closeModal('modal-3d-studio');
      };
    }

    const enquireBtn = document.getElementById('studio-enquire-btn');
    if (enquireBtn) {
      enquireBtn.onclick = () => {
        this.closeModal('modal-3d-studio');
        this.openProductEnquiry(product);
      };
    }

    modal.classList.add('active');

    // Launch Three.js studio instance
    if (window.luxEngine) {
      setTimeout(() => {
        window.luxEngine.initStudioModal('studio-threejs-container', product.model3d_id || product.model3dId || 'aurelius');
      }, 100);
    }
  }

  openProductEnquiry(product) {
    this.switchView('contact');
    const subjectInp = document.querySelector('#form-contact-page input[name="subject"]');
    const msgInp = document.querySelector('#form-contact-page textarea[name="message"]');
    if (subjectInp) subjectInp.value = `Acquisition Inquiry: ${product.title} ($${product.price.toLocaleString()})`;
    if (msgInp) msgInp.value = `I am interested in acquiring "${product.title}" (${product.vastu}). Please arrange a private consultation regarding custom finishes and Vastu orientation.`;
    window.showToast("Inquiry form pre-filled with artifact details.");
  }

  // --- MODALS & FORMS ---
  openShowroomModal() {
    const modal = document.getElementById('modal-showroom-visit');
    if (modal) modal.classList.add('active');
  }

  openGiftingEnquiryModal() {
    this.switchView('contact');
    const subjectInp = document.querySelector('#form-contact-page input[name="subject"]');
    const msgInp = document.querySelector('#form-contact-page textarea[name="message"]');
    if (subjectInp) subjectInp.value = 'Bespoke Executive Gifting Suite Inquiry';
    if (msgInp) msgInp.value = 'We are requesting the Executive Gifting portfolio with custom mahogany presentation cases and engraved copper certificates for our corporate milestone.';
  }

  openAuthModal(mode = 'login') {
    const modal = document.getElementById('modal-auth');
    if (!modal) return;
    this.switchModalAuthMode(mode);
    modal.classList.add('active');
  }

  switchModalAuthMode(mode) {
    const loginSec = document.getElementById('auth-modal-login-section');
    const regSec = document.getElementById('auth-modal-register-section');
    const title = document.getElementById('modal-auth-title');

    if (mode === 'login') {
      if (loginSec) loginSec.classList.remove('hidden');
      if (regSec) regSec.classList.add('hidden');
      if (title) title.textContent = 'Patron Sign In';
    } else if (mode === 'register') {
      if (loginSec) loginSec.classList.add('hidden');
      if (regSec) regSec.classList.remove('hidden');
      if (title) title.textContent = 'Request Patron Membership';
    } else if (mode === 'forgot') {
      this.closeModal('modal-auth');
      this.switchView('forgot-password');
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  bindModals() {
    // Escape key closes modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
        this.closeCartDrawer();
      }
    });
  }

  bindForms() {
    // 1. Contact Form on Contact Page
    const contactForm = document.getElementById('form-contact-page');
    if (contactForm) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(contactForm).entries());

        try {
          const res = await fetch('/api/enquiries', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {})
            },
            body: JSON.stringify(data)
          });
          const result = await res.json();
          if (result.success) {
            window.showToast("Inquiry successfully dispatched to private curatorial desk.");
            contactForm.reset();
            // If in CRM view or dashboard, refresh
            if (window.crmApp) window.crmApp.fetchLeads();
          } else {
            window.showToast(result.message || 'Error sending inquiry.');
          }
        } catch (err) {
          console.error(err);
          window.showToast('Server error sending inquiry.');
        }
      });
    }

    // 2. Page Login Form
    const pageLoginForm = document.getElementById('form-page-login');
    if (pageLoginForm) {
      pageLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const banner = document.getElementById('login-error-banner');
        const data = Object.fromEntries(new FormData(pageLoginForm).entries());
        await this.login(data.email, data.password, banner);
      });
    }

    // 3. Page Register Form
    const pageRegForm = document.getElementById('form-page-register');
    if (pageRegForm) {
      pageRegForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const banner = document.getElementById('register-error-banner');
        const data = Object.fromEntries(new FormData(pageRegForm).entries());
        await this.register(data, banner);
      });
    }

    // 4. Modal Login Form
    const modalLoginForm = document.getElementById('form-modal-login');
    if (modalLoginForm) {
      modalLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const banner = document.getElementById('modal-login-error');
        const data = Object.fromEntries(new FormData(modalLoginForm).entries());
        await this.login(data.email, data.password, banner);
      });
    }

    // 5. Modal Register Form
    const modalRegForm = document.getElementById('form-modal-register');
    if (modalRegForm) {
      modalRegForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const banner = document.getElementById('modal-register-error');
        const data = Object.fromEntries(new FormData(modalRegForm).entries());
        await this.register(data, banner);
      });
    }

    // 6. Forgot Password Step 1
    const forgotForm = document.getElementById('form-page-forgot-password');
    if (forgotForm) {
      forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const banner = document.getElementById('forgot-status-banner');
        const data = Object.fromEntries(new FormData(forgotForm).entries());

        try {
          const res = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          const result = await res.json();
          if (result.success) {
            banner.textContent = result.message;
            banner.className = 'p-3 rounded-lg bg-green-50 text-green-800 text-xs font-semibold block';
            if (result.resetToken) {
              const step2 = document.getElementById('container-reset-step2');
              const tokenInp = document.getElementById('input-reset-token');
              if (step2) step2.classList.remove('hidden');
              if (tokenInp) tokenInp.value = result.resetToken;
            }
          }
        } catch (err) {
          console.error(err);
        }
      });
    }

    // 7. Reset Password Step 2
    const resetStep2Form = document.getElementById('form-page-reset-token');
    if (resetStep2Form) {
      resetStep2Form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(resetStep2Form).entries());

        try {
          const res = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          const result = await res.json();
          if (result.success) {
            window.showToast("Password updated successfully! Please sign in.");
            this.switchView('login');
          } else {
            window.showToast(result.message || 'Failed to reset password.');
          }
        } catch (err) {
          console.error(err);
        }
      });
    }

    // 8. Checkout Form
    const checkoutForm = document.getElementById('form-checkout');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(checkoutForm);
        const patronData = Object.fromEntries(formData.entries());

        const payload = {
          ...patronData,
          items: this.cart
        };

        try {
          const res = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {})
            },
            body: JSON.stringify(payload)
          });
          const result = await res.json();
          if (result.success) {
            this.cart = [];
            this.saveCart();
            this.closeModal('modal-checkout');
            
            // Show Order Success Modal
            const orderNumEl = document.getElementById('order-success-number');
            if (orderNumEl) orderNumEl.textContent = result.order.orderNumber || result.order.order_number;
            const successModal = document.getElementById('modal-order-success');
            if (successModal) successModal.classList.add('active');
          } else {
            window.showToast(result.message || 'Acquisition processing failed.');
          }
        } catch (err) {
          console.error(err);
          window.showToast('Server connection error during checkout.');
        }
      });
    }

    // 9. Showroom Visit Form
    const visitForm = document.getElementById('form-showroom-visit');
    if (visitForm) {
      visitForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(visitForm).entries());

        try {
          const res = await fetch('/api/showroom-visits', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {})
            },
            body: JSON.stringify(data)
          });
          const result = await res.json();
          if (result.success) {
            window.showToast("Private Salon Visit Confirmed! Curatorial desk will contact you.");
            visitForm.reset();
            this.closeModal('modal-showroom-visit');
            if (window.crmApp) window.crmApp.fetchVisits();
          } else {
            window.showToast(result.message || 'Failed to book visit.');
          }
        } catch (err) {
          console.error(err);
          window.showToast('Error booking salon appointment.');
        }
      });
    }

    // 10. Add Lead Form (CRM)
    const addLeadForm = document.getElementById('form-add-lead');
    if (addLeadForm) {
      addLeadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(addLeadForm).entries());

        try {
          const res = await fetch('/api/leads', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(data)
          });
          const result = await res.json();
          if (result.success) {
            window.showToast("VIP Lead added to CRM pipeline!");
            addLeadForm.reset();
            this.closeModal('modal-add-lead');
            if (window.crmApp) window.crmApp.fetchLeads();
          } else {
            window.showToast(result.message || 'Failed to add lead.');
          }
        } catch (err) {
          console.error(err);
        }
      });
    }

    // 11. Add Product Form (CRM/Admin)
    const addProductForm = document.getElementById('form-add-product');
    if (addProductForm) {
      addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(addProductForm).entries());

        try {
          const res = await fetch('/api/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(data)
          });
          const result = await res.json();
          if (result.success) {
            window.showToast("New Luxury Artifact added to catalog!");
            addProductForm.reset();
            this.closeModal('modal-add-product');
            await this.fetchProducts();
            this.renderCatalog();
            if (window.crmApp) window.crmApp.fetchProducts();
          } else {
            window.showToast(result.message || 'Failed to add product.');
          }
        } catch (err) {
          console.error(err);
        }
      });
    }
  }

  // --- CUSTOMER PORTAL / DASHBOARD ---
  async loadDashboard() {
    if (!this.currentUser) return;

    document.getElementById('dash-patron-name').textContent = this.currentUser.name;
    document.getElementById('dash-patron-tier').textContent = this.currentUser.role.toUpperCase();

    await this.loadDashboardCounters();
    this.switchDashboardTab('overview');
  }

  async loadDashboardCounters() {
    try {
      const [ordersRes, enqRes, favRes] = await Promise.all([
        fetch('/api/orders', { headers: { 'Authorization': `Bearer ${this.token}` } }),
        fetch('/api/enquiries', { headers: { 'Authorization': `Bearer ${this.token}` } }),
        fetch('/api/favorites', { headers: { 'Authorization': `Bearer ${this.token}` } })
      ]);

      const ordersData = await ordersRes.json();
      const enqData = await enqRes.json();
      const favData = await favRes.json();

      document.getElementById('dash-stat-orders').textContent = ordersData.orders?.length || 0;
      document.getElementById('dash-stat-enquiries').textContent = enqData.enquiries?.length || 0;
      document.getElementById('dash-stat-favorites').textContent = favData.favorites?.length || 0;
    } catch (e) {
      console.warn("Could not load dashboard counters", e);
    }
  }

  switchDashboardTab(tabName) {
    document.querySelectorAll('[id^="dash-tab-btn-"]').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`dash-tab-btn-${tabName}`);
    if (activeBtn) activeBtn.classList.add('active');

    const container = document.getElementById('dashboard-tab-content');
    if (!container) return;

    switch (tabName) {
      case 'overview':
        this.renderDashboardOverview(container);
        break;
      case 'orders':
        this.renderDashboardOrders(container);
        break;
      case 'enquiries':
        this.renderDashboardEnquiries(container);
        break;
      case 'favorites':
        this.renderDashboardFavorites(container);
        break;
      case 'profile':
        this.renderDashboardProfile(container);
        break;
      case 'notifications':
        this.renderDashboardNotifications(container);
        break;
    }
  }

  async renderDashboardOverview(container) {
    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-8 space-y-6">
          <div class="bg-white p-6 rounded-2xl border border-subtle">
            <h3 class="font-serif font-bold text-lg text-primary mb-4">Curatorial Recommendations for Your Residence</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${this.products.slice(0, 2).map(p => `
                <div class="p-4 bg-surface-linen rounded-xl border border-gold flex items-center gap-4 cursor-pointer" onclick="window.app.open3DStudioModal('${p.id}')">
                  <img src="${p.image}" class="w-16 h-16 object-cover rounded-lg border border-subtle" alt="${p.title}">
                  <div>
                    <span class="vastu-pill text-[10px]">${p.vastu}</span>
                    <h5 class="font-serif font-bold text-xs text-primary mt-1 line-clamp-1">${p.title}</h5>
                    <div class="text-xs font-bold text-gold-bright mt-0.5">$${p.price.toLocaleString()}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-subtle">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-serif font-bold text-lg text-primary">Recent Orders & White-Glove Deliveries</h3>
              <button onclick="window.app.switchDashboardTab('orders')" class="text-xs text-gold-antique font-semibold hover:underline">View All</button>
            </div>
            <div id="dash-overview-orders-list">
              <div class="text-xs text-muted py-4 text-center">Loading acquisitions...</div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-4 space-y-6">
          <div class="p-6 bg-surface-linen rounded-2xl border border-subtle">
            <h4 class="font-serif font-bold text-base text-primary mb-3">Your Dedicated Curators</h4>
            <div class="flex items-center gap-3 mb-4">
              <span class="w-10 h-10 rounded-full bg-forest-brand text-gold-bright flex items-center justify-center font-serif font-bold">EV</span>
              <div>
                <div class="font-bold text-xs text-primary">Eleanor Vance</div>
                <div class="text-[11px] text-muted">Senior Director, Mayfair Atelier</div>
              </div>
            </div>
            <div class="flex items-center gap-3 mb-4">
              <span class="w-10 h-10 rounded-full bg-forest-brand text-gold-bright flex items-center justify-center font-serif font-bold">VR</span>
              <div>
                <div class="font-bold text-xs text-primary">Vikramaditya Roy</div>
                <div class="text-[11px] text-muted">Vastu Master, Worli Flagship</div>
              </div>
            </div>
            <button onclick="window.app.switchView('contact')" class="btn-primary w-full justify-center py-2 text-xs">
              <span>Initiate Direct Concierge Call</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Fetch and populate overview orders
    try {
      const res = await fetch('/api/orders', { headers: { 'Authorization': `Bearer ${this.token}` } });
      const data = await res.json();
      const listEl = document.getElementById('dash-overview-orders-list');
      if (listEl && data.orders) {
        if (data.orders.length === 0) {
          listEl.innerHTML = '<div class="text-xs text-muted py-4 text-center">No past acquisitions recorded yet.</div>';
        } else {
          listEl.innerHTML = data.orders.slice(0, 3).map(o => `
            <div class="flex items-center justify-between p-3 border-b border-subtle text-xs">
              <div>
                <span class="font-mono font-bold text-primary">${o.orderNumber || o.order_number}</span>
                <span class="text-muted block text-[11px]">${new Date(o.createdAt || o.created_at).toLocaleDateString()} • $${o.total.toLocaleString()}</span>
              </div>
              <span class="status-pill status-delivered">${o.deliveryStatus || o.delivery_status}</span>
            </div>
          `).join('');
        }
      }
    } catch (e) {}
  }

  async renderDashboardOrders(container) {
    container.innerHTML = '<div class="text-center py-12 text-muted">Loading your private acquisitions...</div>';

    try {
      const res = await fetch('/api/orders', { headers: { 'Authorization': `Bearer ${this.token}` } });
      const data = await res.json();

      if (!data.orders || data.orders.length === 0) {
        container.innerHTML = `
          <div class="bg-white p-12 rounded-2xl border border-subtle text-center">
            <span class="material-symbols-outlined text-4xl text-gold-antique mb-2">inventory_2</span>
            <h4 class="font-serif font-bold text-lg text-primary">No Acquisitions Recorded</h4>
            <p class="text-xs text-muted mt-1">Explore our collection to begin your curation.</p>
            <button onclick="window.app.switchView('shop')" class="btn-primary mt-4 text-xs">Explore Catalog</button>
          </div>
        `;
        return;
      }

      container.innerHTML = `
        <div class="bg-white rounded-2xl border border-subtle overflow-hidden">
          <div class="p-6 border-b border-subtle flex justify-between items-center">
            <h3 class="font-serif font-bold text-lg text-primary">Your Private Acquisition Orders</h3>
            <span class="text-xs text-muted">${data.orders.length} total orders</span>
          </div>
          <div class="overflow-x-auto">
            <table class="crm-table">
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Artifacts</th>
                  <th>Total Investment</th>
                  <th>Payment Status</th>
                  <th>White-Glove Courier</th>
                  <th>Tracking</th>
                </tr>
              </thead>
              <tbody>
                ${data.orders.map(o => `
                  <tr>
                    <td class="font-mono font-bold text-primary">${o.orderNumber || o.order_number}</td>
                    <td>
                      <div class="text-xs font-semibold">${o.items?.map(i => `${i.qty}× ${i.title}`).join(', ') || 'Statement Artifact'}</div>
                      <div class="text-[10px] text-muted">${new Date(o.createdAt || o.created_at).toLocaleDateString()}</div>
                    </td>
                    <td class="font-serif font-bold text-primary">$${o.total.toLocaleString()}</td>
                    <td><span class="status-pill status-paid">${o.paymentStatus || o.payment_status}</span></td>
                    <td>
                      <span class="status-pill status-delivered">${o.deliveryStatus || o.delivery_status}</span>
                      <div class="text-[10px] text-muted mt-1">${o.courier || 'Luxignia Courier'}</div>
                    </td>
                    <td class="font-mono text-xs text-gold-bright font-bold">${o.trackingCode || o.tracking_code || 'LX-SECURITY'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = '<div class="text-center py-12 text-red-600">Error loading orders.</div>';
    }
  }

  async renderDashboardEnquiries(container) {
    container.innerHTML = '<div class="text-center py-12 text-muted">Loading concierge dialogues...</div>';

    try {
      const res = await fetch('/api/enquiries', { headers: { 'Authorization': `Bearer ${this.token}` } });
      const data = await res.json();

      container.innerHTML = `
        <div class="space-y-6">
          <div class="flex justify-between items-center bg-white p-6 rounded-2xl border border-subtle">
            <div>
              <h3 class="font-serif font-bold text-lg text-primary">Curatorial Inquiries & Custom Commissions</h3>
              <p class="text-xs text-muted">Dialogue history with master sculptors and Vastu consultants.</p>
            </div>
            <button onclick="window.app.switchView('contact')" class="btn-primary text-xs">
              <span class="material-symbols-outlined text-[16px]">add</span>
              <span>New Inquiry</span>
            </button>
          </div>

          ${(!data.enquiries || data.enquiries.length === 0) ? `
            <div class="bg-white p-12 rounded-2xl border border-subtle text-center text-muted">
              <span class="material-symbols-outlined text-4xl text-gold-antique mb-2">forum</span>
              <p class="font-serif font-bold text-lg text-primary">No Active Inquiries</p>
              <p class="text-xs">Have questions regarding bespoke finishes or room positioning? Initiate an inquiry.</p>
            </div>
          ` : data.enquiries.map(e => `
            <div class="bg-white p-6 rounded-2xl border border-subtle">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-subtle pb-4 mb-4">
                <div>
                  <h4 class="font-serif font-bold text-base text-primary">${e.subject || 'Private Inquiry'}</h4>
                  <div class="text-xs text-muted">${new Date(e.created_at).toLocaleDateString()} • Assigned: ${e.assigned_to}</div>
                </div>
                <span class="status-pill status-${e.status.toLowerCase().replace(' ', '')}">${e.status}</span>
              </div>
              <p class="text-xs text-muted bg-surface-linen p-4 rounded-xl mb-4 leading-relaxed">${e.message}</p>
              
              <!-- Reply box -->
              <div class="pt-2">
                <form onsubmit="window.app.submitEnquiryReply(event, '${e.id}')" class="flex gap-2">
                  <input type="text" name="message" required placeholder="Type a follow-up message to the concierge..." class="input-luxury flex-grow">
                  <button type="submit" class="btn-gold text-xs py-2 px-4 whitespace-nowrap">Reply</button>
                </form>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } catch (err) {
      container.innerHTML = '<div class="text-center py-12 text-red-600">Error loading enquiries.</div>';
    }
  }

  async submitEnquiryReply(e, enquiryId) {
    e.preventDefault();
    const input = e.target.querySelector('input[name="message"]');
    if (!input || !input.value.trim()) return;

    try {
      const res = await fetch(`/api/enquiries/${enquiryId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ message: input.value.trim() })
      });
      const data = await res.json();
      if (data.success) {
        window.showToast("Reply recorded. Curators have been notified.");
        input.value = '';
        this.renderDashboardEnquiries(document.getElementById('dashboard-tab-content'));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async renderDashboardFavorites(container) {
    const favProducts = this.products.filter(p => this.wishlist.has(p.id));

    if (favProducts.length === 0) {
      container.innerHTML = `
        <div class="bg-white p-12 rounded-2xl border border-subtle text-center">
          <span class="material-symbols-outlined text-4xl text-gold-antique mb-2">favorite</span>
          <h4 class="font-serif font-bold text-lg text-primary">No Saved Artifacts</h4>
          <p class="text-xs text-muted mt-1">Click the heart icon on any statement piece in the catalog to save it here.</p>
          <button onclick="window.app.switchView('shop')" class="btn-outline text-xs mt-4">Browse Catalog</button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${favProducts.map(p => `
          <div class="luxury-card p-4 bg-white flex flex-col justify-between">
            <div class="relative aspect-[4/5] rounded-xl overflow-hidden mb-4">
              <img src="${p.image}" class="w-full h-full object-cover" alt="${p.title}">
              <button onclick="window.app.toggleWishlist('${p.id}'); window.app.renderDashboardFavorites(document.getElementById('dashboard-tab-content'));" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-red-600 shadow">
                <span class="material-symbols-outlined text-[18px]">favorite</span>
              </button>
            </div>
            <div>
              <span class="vastu-pill text-[10px] mb-1 inline-block">${p.vastu}</span>
              <h4 class="font-serif font-bold text-sm text-primary mb-1">${p.title}</h4>
              <div class="font-serif text-lg font-bold text-primary mb-4">$${p.price.toLocaleString()}</div>
            </div>
            <button onclick="window.app.addToCart('${p.id}')" class="btn-primary w-full justify-center text-xs py-2.5">
              <span>Add to Acquisition Bag</span>
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderDashboardProfile(container) {
    container.innerHTML = `
      <div class="bg-white p-8 rounded-2xl border border-subtle max-w-xl">
        <h3 class="font-serif font-bold text-xl text-primary mb-2">Patron Vault Profile</h3>
        <p class="text-xs text-muted mb-6">Manage your contact credentials and private estate shipping address.</p>

        <form id="form-edit-profile" onsubmit="window.app.handleUpdateProfile(event)" class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-muted mb-1">Full Name & Title</label>
            <input type="text" name="name" value="${this.currentUser.name}" required class="input-luxury">
          </div>
          <div>
            <label class="block font-bold text-muted mb-1">Email Address</label>
            <input type="email" value="${this.currentUser.email}" disabled class="input-luxury bg-gray-100 cursor-not-allowed text-gray-500">
            <span class="text-[10px] text-muted">Email address cannot be changed directly. Contact concierge.</span>
          </div>
          <div>
            <label class="block font-bold text-muted mb-1">Phone Number</label>
            <input type="tel" name="phone" value="${this.currentUser.phone || ''}" placeholder="+1 (555) 000-0000" class="input-luxury">
          </div>
          <div>
            <label class="block font-bold text-muted mb-1">Default Vault / Residence Address</label>
            <textarea name="address" rows="3" class="input-luxury" placeholder="Full street, estate, suite, postal code...">${this.currentUser.address || ''}</textarea>
          </div>

          <button type="submit" class="btn-primary py-3 px-6 text-xs">
            <span>Save Profile Changes</span>
          </button>
        </form>
      </div>
    `;
  }

  async handleUpdateProfile(e) {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target).entries());

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        this.currentUser = data.user;
        this.updateAuthUI(data.user);
        window.showToast("Profile credentials updated successfully.");
      }
    } catch (err) {
      console.error(err);
      window.showToast("Failed to update profile.");
    }
  }

  async renderDashboardNotifications(container) {
    container.innerHTML = '<div class="text-center py-12 text-muted">Loading notifications...</div>';

    try {
      const res = await fetch('/api/notifications', { headers: { 'Authorization': `Bearer ${this.token}` } });
      const data = await res.json();

      container.innerHTML = `
        <div class="bg-white rounded-2xl border border-subtle overflow-hidden">
          <div class="p-6 border-b border-subtle flex justify-between items-center">
            <h3 class="font-serif font-bold text-lg text-primary">Account Notifications & Updates</h3>
            <button onclick="window.app.markAllNotificationsRead()" class="text-xs text-gold-antique font-semibold hover:underline">Mark All Read</button>
          </div>
          <div class="divide-y divide-subtle">
            ${(!data.notifications || data.notifications.length === 0) ? `
              <div class="p-8 text-center text-xs text-muted">No notifications.</div>
            ` : data.notifications.map(n => `
              <div class="p-4 flex items-start justify-between gap-4 text-xs ${n.is_read ? 'bg-white' : 'bg-surface-linen'}">
                <div class="flex items-start gap-3">
                  <span class="material-symbols-outlined text-gold-bright text-xl mt-0.5">${n.type === 'order' ? 'local_shipping' : n.type === 'enquiry' ? 'forum' : 'notifications'}</span>
                  <div>
                    <h5 class="font-bold text-primary">${n.title}</h5>
                    <p class="text-muted mt-0.5">${n.message}</p>
                    <span class="text-[10px] text-gray-400 block mt-1">${new Date(n.created_at).toLocaleString()}</span>
                  </div>
                </div>
                ${!n.is_read ? `
                  <button onclick="window.app.markNotificationRead('${n.id}')" class="text-[11px] text-gold-antique hover:underline whitespace-nowrap">Mark Read</button>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } catch (e) {
      container.innerHTML = '<div class="text-center py-12 text-red-600">Error loading notifications.</div>';
    }
  }

  async markNotificationRead(id) {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      this.renderDashboardNotifications(document.getElementById('dashboard-tab-content'));
    } catch (e) {}
  }

  async markAllNotificationsRead() {
    try {
      await fetch('/api/notifications/read-all', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      this.renderDashboardNotifications(document.getElementById('dashboard-tab-content'));
      window.showToast("All notifications marked as read.");
    } catch (e) {}
  }
}

// Global Toast Notification Helper
window.showToast = (message) => {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="material-symbols-outlined text-gold-bright text-[20px]">verified</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4000);
};

document.addEventListener('DOMContentLoaded', () => {
  window.app = new LuxigniaApp();
  window.app.init();
});
