const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(process.cwd(), 'luxignia.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode & foreign keys for high performance and relational integrity
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Helper wrappers around DatabaseSync
const database = {
  db,
  
  query(sql, params = []) {
    const stmt = db.prepare(sql);
    return stmt.all(...params);
  },

  get(sql, params = []) {
    const stmt = db.prepare(sql);
    return stmt.get(...params);
  },

  run(sql, params = []) {
    const stmt = db.prepare(sql);
    return stmt.run(...params);
  },

  exec(sql) {
    return db.exec(sql);
  }
};

// Initialize Schema
function initializeSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      role TEXT NOT NULL DEFAULT 'customer', -- 'super_admin', 'admin', 'staff', 'customer'
      status TEXT NOT NULL DEFAULT 'active', -- 'active', 'disabled'
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      address TEXT,
      vip_tier TEXT DEFAULT 'Patron',
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT,
      category TEXT NOT NULL,
      category_id TEXT,
      price REAL NOT NULL,
      stock INTEGER NOT NULL DEFAULT 1,
      sku TEXT UNIQUE,
      rating REAL DEFAULT 5.0,
      reviews_count INTEGER DEFAULT 1,
      vastu TEXT,
      vastu_benefit TEXT,
      material TEXT,
      dimensions TEXT,
      weight TEXT,
      model3d_id TEXT DEFAULT 'aurelius',
      image TEXT NOT NULL,
      images_json TEXT,
      featured INTEGER DEFAULT 0,
      badge TEXT,
      description TEXT,
      is_published INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      source TEXT NOT NULL DEFAULT 'Website',
      interest TEXT,
      budget TEXT,
      status TEXT NOT NULL DEFAULT 'New', -- 'New', 'Contacted', 'In Progress', 'Follow-up', 'Qualified', 'Negotiation', 'Won', 'Lost'
      vastu_required INTEGER DEFAULT 0,
      assigned_concierge TEXT DEFAULT 'Unassigned',
      priority TEXT DEFAULT 'Medium', -- 'Low', 'Medium', 'High', 'VIP'
      notes TEXT,
      next_followup TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lead_notes (
      id TEXT PRIMARY KEY,
      lead_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      note TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS lead_followups (
      id TEXT PRIMARY KEY,
      lead_id TEXT NOT NULL,
      title TEXT NOT NULL,
      due_date TEXT NOT NULL,
      status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'rescheduled'
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      product_id TEXT,
      status TEXT NOT NULL DEFAULT 'New', -- 'New', 'Contacted', 'In Progress', 'Follow-up', 'Converted', 'Closed', 'Lost'
      assigned_to TEXT DEFAULT 'Unassigned',
      lead_id TEXT,
      user_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS enquiry_replies (
      id TEXT PRIMARY KEY,
      enquiry_id TEXT NOT NULL,
      sender_name TEXT NOT NULL,
      sender_role TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (enquiry_id) REFERENCES enquiries(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      user_id TEXT,
      patron_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      subtotal REAL NOT NULL,
      shipping_fee REAL DEFAULT 0,
      total REAL NOT NULL,
      payment_method TEXT DEFAULT 'Concierge Wire Transfer',
      payment_status TEXT NOT NULL DEFAULT 'Paid (Wire Transfer)',
      delivery_status TEXT NOT NULL DEFAULT 'Processing White-Glove Dispatch',
      courier TEXT DEFAULT 'Luxignia Security Courier',
      tracking_code TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      qty INTEGER NOT NULL,
      image TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(user_id, product_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS showroom_visits (
      id TEXT PRIMARY KEY,
      patron_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      showroom TEXT NOT NULL,
      visit_date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pending Concierge Call',
      requested_service TEXT,
      lead_id TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      role_target TEXT, -- 'all', 'admin', 'staff', 'customer'
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info', -- 'info', 'order', 'lead', 'enquiry', 'system'
      is_read INTEGER DEFAULT 0,
      link TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      user_name TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details TEXT,
      ip_address TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS content_items (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL, -- 'announcement', 'testimonial', 'faq', 'setting'
      key TEXT UNIQUE NOT NULL,
      title TEXT,
      content TEXT NOT NULL,
      metadata_json TEXT,
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS password_resets (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);
}

// Seed initial data if tables are empty
function seedDatabase() {
  const userCount = database.get('SELECT COUNT(*) as count FROM users').count;
  if (userCount === 0) {
    console.log('🌱 Seeding Luxignia Production Database...');
    const now = new Date().toISOString();

    // 1. Seed Users (Super Admin, Admin, Staff, Customer)
    const salt = bcrypt.genSaltSync(10);
    const adminHash = bcrypt.hashSync('LuxigniaAdmin2026!', salt);
    const staffHash = bcrypt.hashSync('Curator2026!', salt);
    const customerHash = bcrypt.hashSync('Patron2026!', salt);

    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, password_hash, phone, address, role, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertUser.run(
      'usr-admin-1',
      'Eleanor Vance (Curator Director)',
      'admin@luxignia.com',
      adminHash,
      '+44 20 7946 0999',
      'Luxignia Flagship Vault, Mayfair, London',
      'super_admin',
      'active',
      now,
      now
    );

    insertUser.run(
      'usr-staff-1',
      'Vikramaditya Roy',
      'curator@luxignia.com',
      staffHash,
      '+91 98200 88776',
      'Luxignia Gallery, Worli Sea Face, Mumbai',
      'staff',
      'active',
      now,
      now
    );

    insertUser.run(
      'usr-customer-1',
      'High Duchess Sophia von Rose',
      'patron@luxignia.com',
      customerHash,
      '+49 89 2018 332',
      'Königinstr. 44, 80539 München, Germany',
      'customer',
      'active',
      now,
      now
    );

    // 2. Seed Customers Table
    const insertCustomer = db.prepare(`
      INSERT INTO customers (id, user_id, full_name, email, phone, company, address, vip_tier, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertCustomer.run(
      'cust-101',
      'usr-customer-1',
      'High Duchess Sophia von Rose',
      'patron@luxignia.com',
      '+49 89 2018 332',
      'Rose Heritage Foundation',
      'Königinstr. 44, 80539 München, Germany',
      'Royal Patron',
      'Long-standing patron with an affinity for horological art and 24K gilded sculptures.',
      now,
      now
    );

    insertCustomer.run(
      'cust-102',
      null,
      'Lord Alistair Sterling',
      'sterling@estate-patrons.co.uk',
      '+44 20 7946 0912',
      'Sterling Heritage Holdings',
      'Eaton Square, Belgravia, London SW1W 9BD',
      'Imperial Patron',
      'Consultation ongoing for multi-level Kensington estate Vastu alignment.',
      now,
      now
    );

    insertCustomer.run(
      'cust-103',
      null,
      'Dr. Meera Oberoi',
      'meera.oberoi@oberoiliving.in',
      '+91 98200 11223',
      'Oberoi Architectural Studio',
      'Amrita Shergill Marg, New Delhi 110003',
      'Executive Patron',
      'Key corporate gifting partner across ultra-luxury hospitality projects.',
      now,
      now
    );

    // 3. Seed Categories
    const insertCategory = db.prepare(`
      INSERT INTO categories (id, name, slug, description, image, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertCategory.run(
      'cat-1',
      'Monumental Sculptures',
      'sculptures',
      'Hand-cast brass, 24K gold leaf, and honed Italian marble centerpieces.',
      '/images/products/Elegant Horse Sculpture in Warm Interior.png',
      1,
      1
    );

    insertCategory.run(
      'cat-2',
      'Astronomical Clocks',
      'clocks',
      'Mechanical 8-day escapement pendulum movements in burnished brass.',
      '/images/products/Teal Ring with Golden Stag Sculpture.png',
      2,
      1
    );

    insertCategory.run(
      'cat-3',
      'Vastu Masterpieces',
      'vastu',
      'Directional spatial alignments, emerald crystals, and sacred geometry.',
      '/images/products/Emerald and Gold Wave Sculpture.png',
      3,
      1
    );

    insertCategory.run(
      'cat-4',
      'Executive Gifting',
      'gifting',
      'Mahogany-encased artifacts with hand-engraved copper provenance plaques.',
      '/images/products/Golden Eagle Luxe Centerpiece.png',
      4,
      1
    );

    insertCategory.run(
      'cat-5',
      'Curated Vases & Vessels',
      'vases',
      'Organic tactile stoneware, speckled ceramic donuts, and sandstone arches.',
      '/images/products/Speckled Donut Vase on Luxe Table.png',
      5,
      1
    );

    // 4. Seed Products with real images from d:\DOWNLOADS\luxignia (now in /images/products/)
    const insertProduct = db.prepare(`
      INSERT INTO products (
        id, title, subtitle, category, category_id, price, stock, sku, rating, reviews_count,
        vastu, vastu_benefit, material, dimensions, weight, model3d_id, image, images_json,
        featured, badge, description, is_published, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const productsData = [
      {
        id: "prod-1",
        title: "Aurelius — Gilded Stallion Sculpture",
        subtitle: "Artisanal Ascending Horse in 24K Gold Leaf & Marble Plinth",
        category: "Sculptures",
        category_id: "cat-1",
        price: 14800,
        stock: 4,
        sku: "LUX-SC-AUR-01",
        rating: 4.96,
        reviews_count: 24,
        vastu: "North-East (Kubera Zone)",
        vastu_benefit: "Financial Abundance, High Energy & Executive Vitality",
        material: "Hand-gilded 24K Gold Leaf, Italian Carrara Marble Plinth",
        dimensions: "42cm × 18cm × 58cm",
        weight: "14.2 kg",
        model3d_id: "aurelius",
        image: "/images/products/Elegant Horse Sculpture in Warm Interior.png",
        images_json: JSON.stringify([
          "/images/products/Elegant Horse Sculpture in Warm Interior.png",
          "/images/products/Elegant Horse Sculpture on Pedestal.png",
          "/images/products/Equestrian Elegance in a Luxe Living Room.png",
          "/images/products/Luxurious Horse Bust in a Classic Interior.png"
        ]),
        featured: 1,
        badge: "Corner-Office Favourite",
        description: "A monumental equestrian sculpture capturing fluid movement and quiet authority. Hand-cast brass finished in antiqued gold leaf on a honed white Carrara marble base."
      },
      {
        id: "prod-2",
        title: "Odette — Astronomical Pendulum Clock",
        subtitle: "8-Day Mechanical Escapement in Burnished Brass & Obsidian",
        category: "Clocks",
        category_id: "cat-2",
        price: 22500,
        stock: 2,
        sku: "LUX-CK-ODE-02",
        rating: 5.0,
        reviews_count: 14,
        vastu: "North / North-West",
        vastu_benefit: "Precision Timekeeping, Wealth Flow & Spatial Harmony",
        material: "Solid Burnished Brass, Sapphire Crystal, Obsidian Plinth",
        dimensions: "35cm × 35cm × 82cm",
        weight: "18.5 kg",
        model3d_id: "odette",
        image: "/images/products/Teal Ring with Golden Stag Sculpture.png",
        images_json: JSON.stringify([
          "/images/products/Teal Ring with Golden Stag Sculpture.png",
          "/images/products/Golden Deer in Teal Oval Sculpture.png",
          "/images/products/Sunlit Teal and Gold Deer Sculpture.png"
        ]),
        featured: 1,
        badge: "Vastu Certified Masterpiece",
        description: "An architectural pendulum clock inspired by celestial movement and grand Parisian salons. German-engineered 8-day mechanical movement with hand-polished brass ring escapement."
      },
      {
        id: "prod-3",
        title: "Ascend — Celestial Obelisk Sculpture",
        subtitle: "Sacred Geometry Bronze with Emerald Crystal Core",
        category: "Vastu Masterpieces",
        category_id: "cat-3",
        price: 18200,
        stock: 5,
        sku: "LUX-VM-ASC-03",
        rating: 4.92,
        reviews_count: 31,
        vastu: "Center (Brahmasthan) / East",
        vastu_benefit: "Energy Channeling, Focus & Spatial Balance",
        material: "Cast Bronze, Antique Gold Leaf, Emerald Crystal Core",
        dimensions: "28cm × 28cm × 75cm",
        weight: "16.8 kg",
        model3d_id: "ascend",
        image: "/images/products/Emerald and Gold Wave Sculpture.png",
        images_json: JSON.stringify([
          "/images/products/Emerald and Gold Wave Sculpture.png",
          "/images/products/Emerald and Gold Sculpture Collection.png",
          "/images/products/Emerald Dolphin Sculpture in a Luxe Living Room.png"
        ]),
        featured: 1,
        badge: "Showroom Highlight",
        description: "A geometric obelisk rooted in ancient sacred geometry. Features a faceted emerald crystal core suspended within a bronze and gold lattice cage."
      },
      {
        id: "prod-4",
        title: "Aquila — Imperial Gilded Eagle Vignette",
        subtitle: "Monumental Raptor Crest on Sculptural Snow Pedestal",
        category: "Gifting",
        category_id: "cat-4",
        price: 26800,
        stock: 3,
        sku: "LUX-GF-AQU-04",
        rating: 4.98,
        reviews_count: 19,
        vastu: "South / South-West",
        vastu_benefit: "Sovereign Authority, Fearless Vision & Legacy Protection",
        material: "Hand-chiseled Bronze, Rose-Gold & Antique Gold Leaf Plating",
        dimensions: "52cm × 34cm × 68cm",
        weight: "21.4 kg",
        model3d_id: "aurelius",
        image: "/images/products/Golden Eagle Luxe Centerpiece.png",
        images_json: JSON.stringify([
          "/images/products/Golden Eagle Luxe Centerpiece.png",
          "/images/products/Golden Eagle Sculpture in Cozy Luxury Interior.png",
          "/images/products/Rose-Gold Eagle Winter Elegance.png"
        ]),
        featured: 1,
        badge: "Executive Gifting Choice",
        description: "An awe-inspiring eagle sculpture embodying visionary clarity and imperial strength. Presented with bespoke museum certificate and custom mahogany gift box."
      },
      {
        id: "prod-5",
        title: "Celeste — Serene Swan Pair Display",
        subtitle: "Fine Porcelain & 24K Gilded Gold Leaf Harmony Vignette",
        category: "Sculptures",
        category_id: "cat-1",
        price: 15400,
        stock: 6,
        sku: "LUX-SC-CEL-05",
        rating: 4.94,
        reviews_count: 17,
        vastu: "North-West / Bedroom Sanctuary",
        vastu_benefit: "Marital Peace, Aesthetic Tranquility & Graceful Union",
        material: "Artisanal Glazed Porcelain, Brushed Gold Accents",
        dimensions: "36cm × 22cm × 46cm",
        weight: "11.2 kg",
        model3d_id: "odette",
        image: "/images/products/Elegant Ceramic Swan Pair Display.png",
        images_json: JSON.stringify([
          "/images/products/Elegant Ceramic Swan Pair Display.png",
          "/images/products/Elegant Swan Sculpture Display in a Luxe Interior.png",
          "/images/products/Golden Crystal Swan on Marble Display.png"
        ]),
        featured: 0,
        badge: "Artisanal Grace",
        description: "A breathtaking duo of stylized swans curving in poetic symmetry. Represents enduring loyalty, quiet love, and serene sophistication."
      },
      {
        id: "prod-6",
        title: "Kalyan — Golden Antelope Statuary",
        subtitle: "High-Gloss Mirror Chrome & Gilded Brass Gazelle",
        category: "Sculptures",
        category_id: "cat-1",
        price: 13900,
        stock: 5,
        sku: "LUX-SC-KAL-06",
        rating: 4.89,
        reviews_count: 15,
        vastu: "North-West (Air / Speed Zone)",
        vastu_benefit: "Agility in Commerce, Speedy Success & Swift Expansion",
        material: "Mirrored Electroplated Chrome, Polished Wood Stand",
        dimensions: "30cm × 16cm × 52cm",
        weight: "9.6 kg",
        model3d_id: "aurelius",
        image: "/images/products/Golden Antelope Sculpture in Sunlight.png",
        images_json: JSON.stringify([
          "/images/products/Golden Antelope Sculpture in Sunlight.png",
          "/images/products/Golden Antelope on a Polished Wood Stand.png",
          "/images/products/Golden Antelope in Sunlit Elegance.png"
        ]),
        featured: 0,
        badge: "Architectural Statement",
        description: "Capturing the poised tension of an antelope in golden morning light. The aerodynamic curves reflect ambient room illumination with brilliant precision."
      },
      {
        id: "prod-7",
        title: "Nirvana — Meditative Thinker on Books",
        subtitle: "Cast Gilded Bronze Philosopher on Emerald Book Base",
        category: "Vastu Masterpieces",
        category_id: "cat-3",
        price: 16500,
        stock: 4,
        sku: "LUX-VM-NIR-07",
        rating: 4.97,
        reviews_count: 22,
        vastu: "North-East / Library / Study",
        vastu_benefit: "Deep Intellect, Philosophical Grounding & Sharp Cognition",
        material: "Solid Bronze Casting, Hand-finished Patina, Marble Base",
        dimensions: "26cm × 20cm × 44cm",
        weight: "12.8 kg",
        model3d_id: "ascend",
        image: "/images/products/Golden Reader on Emerald Books.png",
        images_json: JSON.stringify([
          "/images/products/Golden Reader on Emerald Books.png",
          "/images/products/Golden Meditating Figurine in a Cozy Nook.png",
          "/images/products/Golden Reader on a Classic Table.png"
        ]),
        featured: 0,
        badge: "Library Sanctuary",
        description: "A reflective, stylized human figure resting in deep contemplative thought upon heavy antique tomes. The signature centerpiece for executive studies."
      },
      {
        id: "prod-8",
        title: "Verona — Speckled Ceramic Donut Vase",
        subtitle: "Textured Sandstone Torus Vessel with Flora Well",
        category: "Curated Vases & Vessels",
        category_id: "cat-5",
        price: 8900,
        stock: 9,
        sku: "LUX-VS-VER-08",
        rating: 4.91,
        reviews_count: 27,
        vastu: "East / Living Room Foyer",
        vastu_benefit: "Gentle Cyclic Harmony, Natural Warmth & Welcoming Energy",
        material: "Hand-thrown Sandstone Ceramic with Natural Mineral Flecks",
        dimensions: "32cm × 10cm × 34cm",
        weight: "6.2 kg",
        model3d_id: "odette",
        image: "/images/products/Speckled Donut Vase on Luxe Table.png",
        images_json: JSON.stringify([
          "/images/products/Speckled Donut Vase on Luxe Table.png",
          "/images/products/Textured Sandstone Donut Vase.png",
          "/images/products/Speckled Ceramic Ring Vase on Glass Table.png"
        ]),
        featured: 0,
        badge: "Organic Minimalism",
        description: "An architectural circular torus vase evoking Scandinavian minimalism and timeless tactile ceramics. Designed for delicate floral stems or standalone sculptural presence."
      },
      {
        id: "prod-9",
        title: "Bactrian — Polished Silver Silk Road Camel",
        subtitle: "Hand-forged Mirror Silver Animalier Sculpture",
        category: "Sculptures",
        category_id: "cat-1",
        price: 19800,
        stock: 3,
        sku: "LUX-SC-BAC-09",
        rating: 4.93,
        reviews_count: 11,
        vastu: "West (Stability & Endurance)",
        vastu_benefit: "Unshakable Resilience, Long-term Wealth Preservation",
        material: "Forged Nickel Silver Alloy, Solid Teak Base",
        dimensions: "44cm × 20cm × 50cm",
        weight: "17.1 kg",
        model3d_id: "aurelius",
        image: "/images/products/Polished Silver Camel Sculpture.png",
        images_json: JSON.stringify([
          "/images/products/Polished Silver Camel Sculpture.png",
          "/images/products/Luxurious Living Room with Silver Camel.png",
          "/images/products/Polished Chrome Camel Sculpture.png"
        ]),
        featured: 0,
        badge: "Silk Road Heritage",
        description: "Symbol of boundless perseverance and desert caravans. The polished silver reflects the surrounding room like liquid mercury, delivering unforgettable drama."
      },
      {
        id: "prod-10",
        title: "Flora — Bougainvillea Vignette Vase Ensemble",
        subtitle: "Textured Terracotta & Gilded Ceramic Double Vessel",
        category: "Curated Vases & Vessels",
        category_id: "cat-5",
        price: 9400,
        stock: 7,
        sku: "LUX-VS-FLO-10",
        rating: 4.88,
        reviews_count: 14,
        vastu: "South-East (Fire & Vitality)",
        vastu_benefit: "Lively Passion, Social Charisma & Dynamic Prosperity",
        material: "Hand-glazed Artisanal Terracotta, Brass Inlay Rim",
        dimensions: "28cm × 18cm × 42cm",
        weight: "7.8 kg",
        model3d_id: "odette",
        image: "/images/products/Bougainvillea Vase Vignette Collage.png",
        images_json: JSON.stringify([
          "/images/products/Bougainvillea Vase Vignette Collage.png",
          "/images/products/Geometric Vase with Magenta Blooms.png",
          "/images/products/Vibrant Bougainvillea Still Life.png"
        ]),
        featured: 0,
        badge: "Botanical Vibrance",
        description: "A rich interplay of tactile earthenware and vivid botanical blossoms. Brings garden poetry and artisanal warmth directly into sunlit salons."
      },
      {
        id: "prod-11",
        title: "Zenith — Serene Emerald Bust Sculpture",
        subtitle: "Teal Patina & Antique Gold Turban Portrait",
        category: "Sculptures",
        category_id: "cat-1",
        price: 21500,
        stock: 3,
        sku: "LUX-SC-ZEN-11",
        rating: 4.99,
        reviews_count: 16,
        vastu: "North-East (Wisdom / Crown)",
        vastu_benefit: "Supreme Peace of Mind, Spiritual Clarity & Dignity",
        material: "Cold-cast Bronze with Deep Emerald Patina, 24K Leaf Trim",
        dimensions: "34cm × 24cm × 56cm",
        weight: "18.3 kg",
        model3d_id: "ascend",
        image: "/images/products/Serene Emerald Bust in a Luxe Interior.png",
        images_json: JSON.stringify([
          "/images/products/Serene Emerald Bust in a Luxe Interior.png",
          "/images/products/Teal and Gold Sculptural Bust Interior.png",
          "/images/products/Teal and Gold Bust on Walnut Table.png"
        ]),
        featured: 1,
        badge: "Curator's Crown",
        description: "A majestic classical bust with serene meditative gaze, draped in deep malachite teal folds and crowned with antique gold leaf flourishes."
      },
      {
        id: "prod-12",
        title: "Reindeer — Jeweled Chrome Stag Pair",
        subtitle: "Luxe Mirror Silver Deer Duo on Fluted Walnut Console",
        category: "Gifting",
        category_id: "cat-4",
        price: 17200,
        stock: 4,
        sku: "LUX-GF-REI-12",
        rating: 4.95,
        reviews_count: 20,
        vastu: "North / Foyer Entry",
        vastu_benefit: "Welcoming Graciousness, Noble Standing & Protection",
        material: "Cast Chrome Steel, Faceted Crystal Antler Accents",
        dimensions: "38cm × 18cm × 48cm",
        weight: "13.5 kg",
        model3d_id: "aurelius",
        image: "/images/products/Jeweled Chrome Deer Pair.png",
        images_json: JSON.stringify([
          "/images/products/Jeweled Chrome Deer Pair.png",
          "/images/products/Chrome Deer Sculpture on a Walnut Table.png",
          "/images/products/Luxe Metallic Deer Living Room Vignette.png"
        ]),
        featured: 0,
        badge: "Festive Heirloom",
        description: "A proud pair of stags crafted from mirror chrome with jewel-faceted details. An aristocratic presentation designed for festive and ceremonial occasions."
      }
    ];

    for (const p of productsData) {
      insertProduct.run(
        p.id, p.title, p.subtitle, p.category, p.category_id, p.price, p.stock, p.sku,
        p.rating, p.reviews_count, p.vastu, p.vastu_benefit, p.material, p.dimensions,
        p.weight, p.model3d_id, p.image, p.images_json, p.featured, p.badge,
        p.description, 1, now, now
      );
    }

    // 5. Seed Leads Pipeline
    const insertLead = db.prepare(`
      INSERT INTO leads (
        id, customer_name, email, phone, company, source, interest, budget,
        status, vastu_required, assigned_concierge, priority, notes, next_followup,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertLead.run(
      'lead-101',
      'Lord Alistair Sterling',
      'sterling@estate-patrons.co.uk',
      '+44 20 7946 0912',
      'Sterling Heritage Holdings',
      'Showroom Private Invitation',
      'Full Penthouse Vastu Curation (Odette + Aurelius Pair)',
      '$75,000+',
      'Negotiation',
      1,
      'Eleanor Vance',
      'VIP',
      'Requires custom 24k gold leaf finishing on Odette clock & Aurelius sculpture pair for London penthouse.',
      '2026-10-14',
      '2026-10-08T14:32:00Z',
      now
    );

    insertLead.run(
      'lead-102',
      'Dr. Meera Oberoi',
      'meera.oberoi@oberoiliving.in',
      '+91 98200 11223',
      'Oberoi Architectural Studio',
      'Website Contact Form',
      'Diwali Executive Corporate Gifting Suite (15 Aquila Units)',
      '$120,000',
      'Qualified',
      1,
      'Vikramaditya Roy',
      'High',
      'Requesting custom mahogany gift boxes with engraved copper certificates of authenticity.',
      '2026-10-13',
      '2026-10-09T09:15:00Z',
      now
    );

    insertLead.run(
      'lead-103',
      'Julian Vance-Moreau',
      'j.vance@vancemoreau.com',
      '+33 1 42 68 55 00',
      'Vance-Moreau Capital',
      '3D Interactive Studio',
      'Aurelius Stallion Sculpture & Custom Base',
      '$25,000',
      'Contacted',
      0,
      'Eleanor Vance',
      'Medium',
      'Interacted with 3D canvas viewer online. Requested white-glove air freight quote to Paris.',
      '2026-10-16',
      '2026-10-10T11:40:00Z',
      now
    );

    insertLead.run(
      'lead-104',
      'Rajeshwar Singhania',
      'rsinghania@singhaniagroup.com',
      '+91 99300 44556',
      'Singhania Estate Trust',
      'Showroom Visit Request',
      'Ascend Celestial Obelisk & Zenith Emerald Bust',
      '$40,000',
      'New',
      1,
      'Vikramaditya Roy',
      'High',
      'Booked Mumbai Flagship private salon appointment for upcoming weekend.',
      '2026-10-12',
      '2026-10-10T16:20:00Z',
      now
    );

    // 6. Seed Orders & Order Items
    const insertOrder = db.prepare(`
      INSERT INTO orders (
        id, order_number, user_id, patron_name, email, phone, address,
        subtotal, shipping_fee, total, payment_method, payment_status,
        delivery_status, courier, tracking_code, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertOrderItem = db.prepare(`
      INSERT INTO order_items (id, order_id, product_id, title, price, qty, image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertOrder.run(
      'ord-8001',
      'LUX-2026-8001',
      'usr-customer-1',
      'High Duchess Sophia von Rose',
      'patron@luxignia.com',
      '+49 89 2018 332',
      'Königinstr. 44, 80539 München, Germany',
      37300,
      0,
      37300,
      'Concierge Wire Transfer',
      'Paid (Wire Transfer)',
      'White-Glove Dispatched',
      'Luxignia Private Security Courier',
      'LX-994821-DE',
      '2026-10-07T18:00:00Z',
      now
    );

    insertOrderItem.run(
      'item-1',
      'ord-8001',
      'prod-2',
      'Odette — Astronomical Pendulum Clock',
      22500,
      1,
      '/images/products/Teal Ring with Golden Stag Sculpture.png'
    );

    insertOrderItem.run(
      'item-2',
      'ord-8001',
      'prod-1',
      'Aurelius — Gilded Stallion Sculpture',
      14800,
      1,
      '/images/products/Elegant Horse Sculpture in Warm Interior.png'
    );

    insertOrder.run(
      'ord-8002',
      'LUX-2026-8002',
      null,
      'Ananya Birla Estate',
      'concierge@birla-living.in',
      '+91 98111 88990',
      'Altamount Road, Cumballa Hill, Mumbai 400026',
      18200,
      0,
      18200,
      'Amex Centurion / Black Card',
      'Paid (Amex Centurion)',
      'Delivered & Vastu Positioned',
      'Mumbai White-Glove Installation Team',
      'LX-440219-IN',
      '2026-10-08T12:30:00Z',
      now
    );

    insertOrderItem.run(
      'item-3',
      'ord-8002',
      'prod-3',
      'Ascend — Celestial Obelisk Sculpture',
      18200,
      1,
      '/images/products/Emerald and Gold Wave Sculpture.png'
    );

    // 7. Seed Enquiries
    const insertEnquiry = db.prepare(`
      INSERT INTO enquiries (
        id, name, email, phone, subject, message, product_id, status, assigned_to, lead_id, user_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertEnquiry.run(
      'enq-501',
      'Lord Alistair Sterling',
      'sterling@estate-patrons.co.uk',
      '+44 20 7946 0912',
      'Custom 24K Leaf Gilding Inquiry',
      'Inquiring regarding custom plinth engraving and 24K gold gilding for the Aurelius & Odette ensemble.',
      'prod-1',
      'In Progress',
      'Eleanor Vance',
      'lead-101',
      null,
      '2026-10-08T14:30:00Z',
      now
    );

    insertEnquiry.run(
      'enq-502',
      'High Duchess Sophia von Rose',
      'patron@luxignia.com',
      '+49 89 2018 332',
      'White-Glove Delivery Confirmation',
      'Confirming secure climate-controlled logistics delivery window for Munich residence.',
      'prod-2',
      'Contacted',
      'Vikramaditya Roy',
      null,
      'usr-customer-1',
      '2026-10-09T16:00:00Z',
      now
    );

    // 8. Seed Showroom Visits
    const insertVisit = db.prepare(`
      INSERT INTO showroom_visits (
        id, patron_name, email, phone, showroom, visit_date, time_slot, status, requested_service, lead_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertVisit.run(
      'visit-301',
      'Rajeshwar Singhania',
      'rsinghania@singhaniagroup.com',
      '+91 99300 44556',
      'Mumbai Flagship Gallery — Worli Sea Face',
      '2026-10-12',
      '15:00 - 16:30',
      'Confirmed',
      'Vastu Directional Mapping & Private Champagne Reception',
      'lead-104',
      now
    );

    // 9. Seed Activities
    const insertActivity = db.prepare(`
      INSERT INTO activities (id, user_id, user_name, action, entity_type, entity_id, details, ip_address, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertActivity.run(
      'act-1',
      'usr-admin-1',
      'Eleanor Vance',
      'SYSTEM_INITIALIZED',
      'system',
      'luxignia-core',
      'Luxignia Executive E-Commerce & CRM System initialized with 12 handcrafted artifacts.',
      '127.0.0.1',
      now
    );

    insertActivity.run(
      'act-2',
      'usr-customer-1',
      'High Duchess Sophia von Rose',
      'ORDER_COMPLETED',
      'orders',
      'ord-8001',
      'Patron acquired Odette Clock & Aurelius Stallion ($37,300).',
      '127.0.0.1',
      now
    );

    // 10. Seed Notifications
    const insertNotification = db.prepare(`
      INSERT INTO notifications (id, user_id, role_target, title, message, type, is_read, link, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertNotification.run(
      'notif-1',
      null,
      'admin',
      'High-Value Acquisition Confirmed',
      'Order LUX-2026-8001 ($37,300) placed by High Duchess Sophia von Rose.',
      'order',
      0,
      '/admin#orders',
      now
    );

    insertNotification.run(
      'notif-2',
      null,
      'staff',
      'New Private Showroom Appointment',
      'Rajeshwar Singhania booked Mumbai Flagship private salon visit.',
      'lead',
      0,
      '/crm#visits',
      now
    );

    insertNotification.run(
      'notif-3',
      'usr-customer-1',
      'customer',
      'White-Glove Dispatch En Route',
      'Your consignment LX-994821-DE is underway under security supervision.',
      'order',
      0,
      '/dashboard#orders',
      now
    );

    // 11. Seed Content (Testimonials, FAQs, Announcements)
    const insertContent = db.prepare(`
      INSERT INTO content_items (id, type, key, title, content, metadata_json, is_active, display_order, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertContent.run(
      'cnt-test-1',
      'testimonial',
      'test-sophia',
      'High Duchess Sophia von Rose',
      'The Aurelius Stallion commands our Munich salon with an aura that photographs can scarcely convey. The craftsmanship and Vastu precision are unmatched.',
      JSON.stringify({ role: 'Patron of the Arts', location: 'Munich, Germany', rating: 5 }),
      1,
      1,
      now
    );

    insertContent.run(
      'cnt-test-2',
      'testimonial',
      'test-alistair',
      'Lord Alistair Sterling',
      'Luxignia creates heirloom pieces that transcend modern trends. Their private concierge service was immaculate from consultation to installation.',
      JSON.stringify({ role: 'Private Collector', location: 'Belgravia, London', rating: 5 }),
      1,
      2,
      now
    );

    insertContent.run(
      'cnt-faq-1',
      'faq',
      'faq-authenticity',
      'How is provenance and authenticity certified?',
      'Every Luxignia master sculpture and horological piece is accompanied by a hand-engraved solid copper certificate of authenticity, signed by master artisans, and stamped with directional Vastu registration.',
      JSON.stringify({ category: 'Provenance' }),
      1,
      1,
      now
    );

    insertContent.run(
      'cnt-faq-2',
      'faq',
      'faq-delivery',
      'What does White-Glove Security Delivery entail?',
      'Our dedicated logistics team transports your pieces in climate-controlled cases, unpacks them on-site, inspects the finishes, and orients them per directional Vastu recommendations.',
      JSON.stringify({ category: 'Logistics' }),
      1,
      2,
      now
    );

    console.log('✅ Luxignia Production Database Seeded Successfully!');
  }
}

// Run schema and seed
initializeSchema();
seedDatabase();

module.exports = database;
