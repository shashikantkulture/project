// components/crm/data/crmData.js
// Production-grade realistic mock data & state seeds for Luxignia Luxury CRM

export const initialOrders = [
  {
    id: 'ord-89421',
    orderNumber: '#LX-89421',
    customer: {
      id: 'cust-101',
      name: 'Princess Gayatri Devi',
      email: 'gayatri.devi@jaipurheritage.in',
      phone: '+91 98290 44210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      segment: 'VIP',
      tier: 'Diamond',
      address: 'The Palace Gardens, Rambagh Road, Jaipur, Rajasthan 302005'
    },
    category: 'Imperial Sculptures',
    products: [
      {
        id: 'prod-001',
        title: 'Emerald & Gold Wave Sculpture',
        sku: 'LX-SC-EMW-01',
        price: 285000,
        qty: 1,
        image: '/images/products/Emerald and Gold Wave Sculpture.png'
      },
      {
        id: 'prod-005',
        title: 'Jeweled Chrome Deer Pair',
        sku: 'LX-SC-JCD-05',
        price: 195000,
        qty: 1,
        image: '/images/products/Jeweled Chrome Deer Pair.png'
      }
    ],
    subtotal: 480000,
    tax: 86400, // 18% GST
    shippingFee: 0, // Complimentary white glove
    total: 566400,
    date: '2026-10-18T10:30:00Z',
    paymentMethod: 'Wire Transfer / RTGS',
    paymentStatus: 'Paid',
    status: 'New', // 'New' | 'Await accepting' | 'On way' | 'Delivered' | 'Cancelled' | 'Returned'
    courier: 'Luxignia Armored White-Glove Logistics',
    trackingNumber: 'LX-SEC-894210-IND',
    estimatedDelivery: '2026-10-21T16:00:00Z',
    notes: 'Private estate delivery requested. Coordinate arrival with Palace Security Desk.',
    timeline: [
      { status: 'Order Placed', time: '18 Oct 2026, 10:30 AM', done: true },
      { status: 'Payment Verified', time: '18 Oct 2026, 10:45 AM', done: true },
      { status: 'Curatorial Inspection', time: '18 Oct 2026, 11:15 AM', done: true },
      { status: 'Artisan Wood Crate Packing', time: 'Pending', done: false },
      { status: 'White-Glove Courier Dispatch', time: 'Pending', done: false },
      { status: 'Handover & Estate Installation', time: 'Pending', done: false }
    ]
  },
  {
    id: 'ord-89420',
    orderNumber: '#LX-89420',
    customer: {
      id: 'cust-102',
      name: 'Dr. Vikramaditya Oberoi',
      email: 'oberoi.v@oberoi-capital.com',
      phone: '+91 98110 52391',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      segment: 'High Value',
      tier: 'Platinum',
      address: 'Penthouse 42, The Imperial Towers, Altamount Road, Mumbai, MH 400026'
    },
    category: 'Vastu Masterpieces',
    products: [
      {
        id: 'prod-003',
        title: 'Golden Antelope in Sunlit Elegance',
        sku: 'LX-SC-GA-03',
        price: 185000,
        qty: 1,
        image: '/images/products/Golden Antelope in Sunlit Elegance.png'
      }
    ],
    subtotal: 185000,
    tax: 33300,
    shippingFee: 0,
    total: 218300,
    date: '2026-10-18T09:15:00Z',
    paymentMethod: 'Razorpay / UPI Corporate',
    paymentStatus: 'Paid',
    status: 'Await accepting',
    courier: 'Luxignia Armored White-Glove Logistics',
    trackingNumber: 'LX-SEC-894201-BOM',
    estimatedDelivery: '2026-10-20T14:00:00Z',
    notes: 'Vastu orientation certificate signed by Pt. Sharma to be included inside the archival folio.',
    timeline: [
      { status: 'Order Placed', time: '18 Oct 2026, 09:15 AM', done: true },
      { status: 'Payment Verified', time: '18 Oct 2026, 09:16 AM', done: true },
      { status: 'Curatorial Inspection', time: '18 Oct 2026, 10:00 AM', done: true },
      { status: 'Artisan Wood Crate Packing', time: 'Pending', done: false },
      { status: 'White-Glove Courier Dispatch', time: 'Pending', done: false },
      { status: 'Handover & Estate Installation', time: 'Pending', done: false }
    ]
  },
  {
    id: 'ord-89419',
    orderNumber: '#LX-89419',
    customer: {
      id: 'cust-103',
      name: 'Kavita & Sanjiv Goenka',
      email: 'sanjiv.goenka@rpsg-estates.com',
      phone: '+91 98300 78219',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      segment: 'VIP',
      tier: 'Diamond',
      address: 'Belvedere Mansion, 12 Queen Park, Kolkata, WB 700019'
    },
    category: 'Toroidal Ceramics',
    products: [
      {
        id: 'prod-004',
        title: 'Textured Sandstone Donut Vase',
        sku: 'LX-CR-TSD-04',
        price: 95000,
        qty: 2,
        image: '/images/products/Textured Sandstone Donut Vase.png'
      },
      {
        id: 'prod-006',
        title: 'Vibrant Bougainvillea Ceramic Vase',
        sku: 'LX-CR-VBC-06',
        price: 115000,
        qty: 1,
        image: '/images/products/Vibrant Bougainvillea in Textured Vase.png'
      }
    ],
    subtotal: 305000,
    tax: 54900,
    shippingFee: 0,
    total: 359900,
    date: '2026-10-17T17:40:00Z',
    paymentMethod: 'Amex Platinum Concierge',
    paymentStatus: 'Paid',
    status: 'On way',
    courier: 'Blue Dart Apex Armored',
    trackingNumber: 'BD-LX-9912048',
    estimatedDelivery: '2026-10-19T11:00:00Z',
    notes: 'Fragile terracotta & sandstone glaze. Dual-vault crating deployed.',
    timeline: [
      { status: 'Order Placed', time: '17 Oct 2026, 05:40 PM', done: true },
      { status: 'Payment Verified', time: '17 Oct 2026, 05:45 PM', done: true },
      { status: 'Curatorial Inspection', time: '17 Oct 2026, 06:30 PM', done: true },
      { status: 'Artisan Wood Crate Packing', time: '18 Oct 2026, 08:00 AM', done: true },
      { status: 'White-Glove Courier Dispatch', time: '18 Oct 2026, 09:30 AM', done: true },
      { status: 'Handover & Estate Installation', time: 'Estimated 19 Oct', done: false }
    ]
  },
  {
    id: 'ord-89418',
    orderNumber: '#LX-89418',
    customer: {
      id: 'cust-104',
      name: 'Aditya Singhania',
      email: 'aditya@singhania-holdings.in',
      phone: '+91 99201 19283',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      segment: 'Loyal',
      tier: 'Gold',
      address: 'Villa 14, Golf Links, New Delhi, DL 110003'
    },
    category: 'Heirloom Furniture',
    products: [
      {
        id: 'prod-007',
        title: 'Aurelia Lounge Chair & Ottoman',
        sku: 'LX-FN-ALC-07',
        price: 345000,
        qty: 1,
        image: '/images/products/Chrome Deer Sculpture on a Walnut Table.png'
      }
    ],
    subtotal: 345000,
    tax: 62100,
    shippingFee: 0,
    total: 407100,
    date: '2026-10-17T14:10:00Z',
    paymentMethod: 'Razorpay / Net Banking',
    paymentStatus: 'Paid',
    status: 'On way',
    courier: 'Luxignia Armored White-Glove Logistics',
    trackingNumber: 'LX-SEC-894188-DEL',
    estimatedDelivery: '2026-10-19T17:00:00Z',
    notes: 'Italian full-grain aniline cognac leather with bronze sabots.',
    timeline: [
      { status: 'Order Placed', time: '17 Oct 2026, 02:10 PM', done: true },
      { status: 'Payment Verified', time: '17 Oct 2026, 02:12 PM', done: true },
      { status: 'Curatorial Inspection', time: '17 Oct 2026, 03:00 PM', done: true },
      { status: 'Artisan Wood Crate Packing', time: '17 Oct 2026, 05:00 PM', done: true },
      { status: 'White-Glove Courier Dispatch', time: '18 Oct 2026, 08:30 AM', done: true },
      { status: 'Handover & Estate Installation', time: 'Estimated 19 Oct', done: false }
    ]
  },
  {
    id: 'ord-89417',
    orderNumber: '#LX-89417',
    customer: {
      id: 'cust-105',
      name: 'Rhea Pillai & Cyrus Poonawalla',
      email: 'rhea.office@serene-villas.com',
      phone: '+91 98220 91823',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      segment: 'VIP',
      tier: 'Diamond',
      address: 'Coonoor Stud Farms, Nilgiris, Tamil Nadu 643101'
    },
    category: 'Imperial Sculptures',
    products: [
      {
        id: 'prod-008',
        title: 'Rose-Gold Eagle Winter Elegance',
        sku: 'LX-SC-RGE-08',
        price: 320000,
        qty: 1,
        image: '/images/products/Rose-Gold Eagle Winter Elegance.png'
      }
    ],
    subtotal: 320000,
    tax: 57600,
    shippingFee: 0,
    total: 377600,
    date: '2026-10-16T11:20:00Z',
    paymentMethod: 'Wire Transfer / RTGS',
    paymentStatus: 'Paid',
    status: 'Delivered',
    courier: 'Luxignia Armored White-Glove Logistics',
    trackingNumber: 'LX-SEC-894170-MAA',
    estimatedDelivery: '2026-10-18T10:00:00Z',
    notes: 'Delivered in high-security temperature controlled container. Signed by Estate Manager Mr. Nair.',
    timeline: [
      { status: 'Order Placed', time: '16 Oct 2026, 11:20 AM', done: true },
      { status: 'Payment Verified', time: '16 Oct 2026, 11:30 AM', done: true },
      { status: 'Curatorial Inspection', time: '16 Oct 2026, 01:00 PM', done: true },
      { status: 'Artisan Wood Crate Packing', time: '16 Oct 2026, 04:00 PM', done: true },
      { status: 'White-Glove Courier Dispatch', time: '17 Oct 2026, 09:00 AM', done: true },
      { status: 'Handover & Estate Installation', time: '18 Oct 2026, 10:15 AM', done: true }
    ]
  },
  {
    id: 'ord-89416',
    orderNumber: '#LX-89416',
    customer: {
      id: 'cust-106',
      name: 'Nikhil & Natasha Kamath',
      email: 'nk@zerodha-founders.in',
      phone: '+91 99001 99882',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      segment: 'VIP',
      tier: 'Diamond',
      address: 'Penthouse East, Kingfisher Towers, Lavelle Road, Bangalore, KA 560001'
    },
    category: 'Artisanal Sculptures',
    products: [
      {
        id: 'prod-009',
        title: 'Serene Emerald & Gold Bust Sculpture',
        sku: 'LX-SC-SEB-09',
        price: 240000,
        qty: 1,
        image: '/images/products/Serene Emerald Bust in a Luxe Interior.png'
      },
      {
        id: 'prod-010',
        title: 'Polished Silver Camel Luxury Vignette',
        sku: 'LX-SC-PSC-10',
        price: 260000,
        qty: 1,
        image: '/images/products/Polished Silver Camel Sculpture.png'
      }
    ],
    subtotal: 500000,
    tax: 90000,
    shippingFee: 0,
    total: 590000,
    date: '2026-10-15T16:00:00Z',
    paymentMethod: 'Wire Transfer / RTGS',
    paymentStatus: 'Paid',
    status: 'Delivered',
    courier: 'Luxignia Armored White-Glove Logistics',
    trackingNumber: 'LX-SEC-894162-BLR',
    estimatedDelivery: '2026-10-17T15:00:00Z',
    notes: 'Installed on 32nd floor marble terrace console.',
    timeline: [
      { status: 'Order Placed', time: '15 Oct 2026, 04:00 PM', done: true },
      { status: 'Payment Verified', time: '15 Oct 2026, 04:10 PM', done: true },
      { status: 'Curatorial Inspection', time: '15 Oct 2026, 05:30 PM', done: true },
      { status: 'Artisan Wood Crate Packing', time: '16 Oct 2026, 10:00 AM', done: true },
      { status: 'White-Glove Courier Dispatch', time: '16 Oct 2026, 02:00 PM', done: true },
      { status: 'Handover & Estate Installation', time: '17 Oct 2026, 03:45 PM', done: true }
    ]
  },
  {
    id: 'ord-89415',
    orderNumber: '#LX-89415',
    customer: {
      id: 'cust-107',
      name: 'Meera & Sameer Kotak',
      email: 'meera.kotak@kotak-family.org',
      phone: '+91 98200 12099',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      segment: 'High Value',
      tier: 'Platinum',
      address: 'Sea-Face Haven, Worli Sea Face, Mumbai, MH 400030'
    },
    category: 'Porcelain Masterpieces',
    products: [
      {
        id: 'prod-011',
        title: 'Elegant Ceramic Swan Pair Display',
        sku: 'LX-CR-ECS-11',
        price: 165000,
        qty: 1,
        image: '/images/products/Elegant Ceramic Swan Pair Display.png'
      }
    ],
    subtotal: 165000,
    tax: 29700,
    shippingFee: 0,
    total: 194700,
    date: '2026-10-15T09:40:00Z',
    paymentMethod: 'Razorpay / UPI',
    paymentStatus: 'Paid',
    status: 'Delivered',
    courier: 'Luxignia Armored White-Glove Logistics',
    trackingNumber: 'LX-SEC-894151-BOM',
    estimatedDelivery: '2026-10-16T18:00:00Z',
    notes: 'Gift wrapping in embossed champagne silk box with wax-sealed curatorial card.',
    timeline: [
      { status: 'Order Placed', time: '15 Oct 2026, 09:40 AM', done: true },
      { status: 'Payment Verified', time: '15 Oct 2026, 09:42 AM', done: true },
      { status: 'Curatorial Inspection', time: '15 Oct 2026, 11:00 AM', done: true },
      { status: 'Artisan Wood Crate Packing', time: '15 Oct 2026, 02:00 PM', done: true },
      { status: 'White-Glove Courier Dispatch', time: '16 Oct 2026, 10:00 AM', done: true },
      { status: 'Handover & Estate Installation', time: '16 Oct 2026, 05:30 PM', done: true }
    ]
  }
];

export const initialCustomers = [
  {
    id: 'cust-101',
    name: 'Princess Gayatri Devi',
    email: 'gayatri.devi@jaipurheritage.in',
    phone: '+91 98290 44210',
    location: 'Jaipur, Rajasthan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    ordersCount: 9,
    lifetimeValue: 3420000,
    averageOrderValue: 380000,
    lastPurchase: '2026-10-18',
    segment: 'VIP',
    tier: 'Diamond',
    status: 'Active',
    joinedDate: '2024-03-12',
    preferredCategory: 'Imperial Sculptures',
    conciergeNotes: 'Prefers brass alloy and hand-burnished 24k gold leaf finishing. Requires white glove installation team with non-marking footwear on heritage Italian marble flooring.'
  },
  {
    id: 'cust-102',
    name: 'Dr. Vikramaditya Oberoi',
    email: 'oberoi.v@oberoi-capital.com',
    phone: '+91 98110 52391',
    location: 'Mumbai, Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    ordersCount: 6,
    lifetimeValue: 1840000,
    averageOrderValue: 306666,
    lastPurchase: '2026-10-18',
    segment: 'High Value',
    tier: 'Platinum',
    status: 'Active',
    joinedDate: '2024-08-04',
    preferredCategory: 'Vastu Masterpieces',
    conciergeNotes: 'Passionate about North-East corner energy balance. Always request Vastu compliance certificate signed by Pt. Sharma.'
  },
  {
    id: 'cust-103',
    name: 'Kavita & Sanjiv Goenka',
    email: 'sanjiv.goenka@rpsg-estates.com',
    phone: '+91 98300 78219',
    location: 'Kolkata, West Bengal',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    ordersCount: 11,
    lifetimeValue: 4680000,
    averageOrderValue: 425454,
    lastPurchase: '2026-10-17',
    segment: 'VIP',
    tier: 'Diamond',
    status: 'Active',
    joinedDate: '2023-11-20',
    preferredCategory: 'Toroidal Ceramics',
    conciergeNotes: 'Art patrons. Invited to exclusive annual foundry preview in Milan. Directly serviced by Curatorial Director.'
  },
  {
    id: 'cust-104',
    name: 'Aditya Singhania',
    email: 'aditya@singhania-holdings.in',
    phone: '+91 99201 19283',
    location: 'New Delhi, Delhi NCR',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    ordersCount: 4,
    lifetimeValue: 1120000,
    averageOrderValue: 280000,
    lastPurchase: '2026-10-17',
    segment: 'Loyal',
    tier: 'Gold',
    status: 'Active',
    joinedDate: '2025-01-15',
    preferredCategory: 'Heirloom Furniture',
    conciergeNotes: 'Currently furnishing 15,000 sq ft Lutyens estate. High potential lead for custom dining suites.'
  },
  {
    id: 'cust-105',
    name: 'Rhea Pillai & Cyrus Poonawalla',
    email: 'rhea.office@serene-villas.com',
    phone: '+91 98220 91823',
    location: 'Nilgiris, Tamil Nadu',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    ordersCount: 8,
    lifetimeValue: 2950000,
    averageOrderValue: 368750,
    lastPurchase: '2026-10-16',
    segment: 'VIP',
    tier: 'Diamond',
    status: 'Active',
    joinedDate: '2024-05-10',
    preferredCategory: 'Imperial Sculptures',
    conciergeNotes: 'Equestrian and avian luxury motifs. Enjoys customized packaging with private family heraldry wax seals.'
  },
  {
    id: 'cust-106',
    name: 'Nikhil & Natasha Kamath',
    email: 'nk@zerodha-founders.in',
    phone: '+91 99001 99882',
    location: 'Bangalore, Karnataka',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    ordersCount: 7,
    lifetimeValue: 3100000,
    averageOrderValue: 442857,
    lastPurchase: '2026-10-15',
    segment: 'VIP',
    tier: 'Diamond',
    status: 'Active',
    joinedDate: '2024-02-18',
    preferredCategory: 'Artisanal Sculptures',
    conciergeNotes: 'Minimalist contemporary architectural aesthetics. Prefers raw chrome, brushed brass, and polished titanium.'
  },
  {
    id: 'cust-107',
    name: 'Meera & Sameer Kotak',
    email: 'meera.kotak@kotak-family.org',
    phone: '+91 98200 12099',
    location: 'Mumbai, Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    ordersCount: 5,
    lifetimeValue: 1450000,
    averageOrderValue: 290000,
    lastPurchase: '2026-10-15',
    segment: 'High Value',
    tier: 'Platinum',
    status: 'Active',
    joinedDate: '2024-09-02',
    preferredCategory: 'Porcelain Masterpieces',
    conciergeNotes: 'Regular collector of bespoke swan sculptures and gold accent floral vases.'
  },
  {
    id: 'cust-108',
    name: 'Ananya Birla',
    email: 'ananya@surokkha-holdings.com',
    phone: '+91 98199 44321',
    location: 'Mumbai, Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    ordersCount: 3,
    lifetimeValue: 920000,
    averageOrderValue: 306666,
    lastPurchase: '2026-09-28',
    segment: 'Influencer',
    tier: 'Gold',
    status: 'Active',
    joinedDate: '2025-04-11',
    preferredCategory: 'Imperial Sculptures',
    conciergeNotes: 'Music and arts studio decor. Frequently tags Luxignia on verified Instagram account.'
  }
];

export const initialProducts = [
  {
    id: 'prod-001',
    title: 'Emerald & Gold Wave Sculpture',
    subtitle: 'Hand-cast artisanal bronze with malachite green patina & 24k goldleaf crest',
    sku: 'LX-SC-EMW-01',
    category: 'Imperial Sculptures',
    price: 285000,
    salePrice: 265000,
    stock: 7,
    status: 'Active',
    sales: 18,
    revenue: 4770000,
    rating: 5.0,
    reviewsCount: 14,
    image: '/images/products/Emerald and Gold Wave Sculpture.png',
    dimensions: '48 x 26 x 64 cm',
    weight: '14.2 kg',
    material: 'Forged Bell Metal, Malachite Patina, 24k Gold Leaf',
    vastuZone: 'North / North-East (Water Element - Abundance)',
    description: 'An iconic curvilinear sculptural manifestation inspired by the primal flow of sacred river deltas. Sculpted by our master foundry in Tuscany with proprietary emerald lacquer.'
  },
  {
    id: 'prod-002',
    title: 'Chrome Deer Sculpture on Walnut Stand',
    subtitle: 'High-mirror chrome polished stainless steel with hand-oiled Italian walnut plinth',
    sku: 'LX-SC-CDS-02',
    category: 'Artisanal Sculptures',
    price: 215000,
    salePrice: null,
    stock: 4,
    status: 'Low Stock',
    sales: 22,
    revenue: 4730000,
    rating: 4.9,
    reviewsCount: 19,
    image: '/images/products/Chrome Deer Sculpture on a Walnut Table.png',
    dimensions: '52 x 22 x 58 cm',
    weight: '11.8 kg',
    material: 'Mirror-Polished 316L Stainless Steel & Canaletto Walnut',
    vastuZone: 'West / North-West (Grace, Agility, High Status)',
    description: 'A contemporary tribute to forest majesty. Features museum-grade seamless hand-buffing that reflects ambient interior light with cinematic brilliance.'
  },
  {
    id: 'prod-003',
    title: 'Golden Antelope in Sunlit Elegance',
    subtitle: 'Auspicious prancing stag with sun-gilded horns on obsidian stand',
    sku: 'LX-SC-GA-03',
    category: 'Vastu Masterpieces',
    price: 185000,
    salePrice: null,
    stock: 9,
    status: 'Active',
    sales: 29,
    revenue: 5365000,
    rating: 5.0,
    reviewsCount: 26,
    image: '/images/products/Golden Antelope in Sunlit Elegance.png',
    dimensions: '38 x 18 x 50 cm',
    weight: '8.4 kg',
    material: 'Hand-Cast Brass with Champagne Gold PVD Finish',
    vastuZone: 'North-West (Speed, Momentum & Business Expansion)',
    description: 'Revered in ancient Vedic architecture as the harbinger of unstoppable professional momentum and swift deal closure for estate founders.'
  },
  {
    id: 'prod-004',
    title: 'Textured Sandstone Donut Vase',
    subtitle: 'Hand-turned artisanal torus vessel with volcanic mineral texture',
    sku: 'LX-CR-TSD-04',
    category: 'Toroidal Ceramics',
    price: 95000,
    salePrice: 88000,
    stock: 12,
    status: 'Active',
    sales: 41,
    revenue: 3608000,
    rating: 4.8,
    reviewsCount: 32,
    image: '/images/products/Textured Sandstone Donut Vase.png',
    dimensions: '35 x 12 x 35 cm',
    weight: '6.2 kg',
    material: 'Natural Sandstone Mineral Clay & Matte Bisque',
    vastuZone: 'South-West (Earth Stability & Grounding)',
    description: 'The mathematical eternity of the torus ring translated into tactile pottery. Provides sculptural presence whether styled with dried botanicals or displayed bare.'
  },
  {
    id: 'prod-005',
    title: 'Jeweled Chrome Deer Pair',
    subtitle: 'Twin companion sculptures in faceted chrome with jewel-cut crystal accents',
    sku: 'LX-SC-JCD-05',
    category: 'Imperial Sculptures',
    price: 195000,
    salePrice: null,
    stock: 3,
    status: 'Low Stock',
    sales: 15,
    revenue: 2925000,
    rating: 4.9,
    reviewsCount: 12,
    image: '/images/products/Jeweled Chrome Deer Pair.png',
    dimensions: '44 x 20 x 48 cm (Pair)',
    weight: '12.5 kg',
    material: 'Chrome Cast Alloy & Flawless Swarovski Crystal Elements',
    vastuZone: 'South-West / Master Bedroom (Harmonious Union & Balance)',
    description: 'Conceived as an heirloom wedding or milestone gift, embodying romantic fidelity and serene composure in refined modern residences.'
  },
  {
    id: 'prod-006',
    title: 'Vibrant Bougainvillea Ceramic Vase',
    subtitle: 'Fluted ceramic statement vase hand-painted in rich Mediterranean magenta',
    sku: 'LX-CR-VBC-06',
    category: 'Toroidal Ceramics',
    price: 115000,
    salePrice: null,
    stock: 8,
    status: 'Active',
    sales: 27,
    revenue: 3105000,
    rating: 5.0,
    reviewsCount: 22,
    image: '/images/products/Vibrant Bougainvillea in Textured Vase.png',
    dimensions: '30 x 30 x 42 cm',
    weight: '5.5 kg',
    material: 'Glazed Tuscan Earthenware & Mineral Enamel',
    vastuZone: 'South-East (Fire Energy & Passionate Vitality)',
    description: 'Evoking the sun-drenched coastal estates of Capri and Udaipur, this vase injects lively botanical grandeur into formal reception foyers.'
  },
  {
    id: 'prod-007',
    title: 'Aurelia Lounge Chair & Ottoman',
    subtitle: 'Hand-tailored cognac aniline leather with burnished bronze cradle',
    sku: 'LX-FN-ALC-07',
    category: 'Heirloom Furniture',
    price: 345000,
    salePrice: null,
    stock: 2,
    status: 'Low Stock',
    sales: 9,
    revenue: 3105000,
    rating: 5.0,
    reviewsCount: 8,
    image: '/images/products/Sunlit Sculptures on a Modern Coffee Table.png',
    dimensions: '92 x 88 x 84 cm',
    weight: '34 kg',
    material: 'Full-Grain Italian Aniline Leather & Cast Bronze',
    vastuZone: 'South-West (Executive Authority & Restorative Calm)',
    description: 'The pinnacle of private study seating. Engineered with zero-gravity ergonomic pitch and triple-density goose-down cushions.'
  },
  {
    id: 'prod-008',
    title: 'Rose-Gold Eagle Winter Elegance',
    subtitle: 'Soaring imperial eagle sculpture in brushed rose gold on ice-quartz base',
    sku: 'LX-SC-RGE-08',
    category: 'Imperial Sculptures',
    price: 320000,
    salePrice: null,
    stock: 5,
    status: 'Active',
    sales: 11,
    revenue: 3520000,
    rating: 5.0,
    reviewsCount: 11,
    image: '/images/products/Rose-Gold Eagle Winter Elegance.png',
    dimensions: '56 x 34 x 62 cm',
    weight: '16.4 kg',
    material: 'Brushed Rose-Gold Bronze & Hand-Hewn Himalayan Quartz',
    vastuZone: 'East / North (Visionary Leadership & Far-Sighted Intellect)',
    description: 'Designed for boardroom centerpieces and high-level diplomatic suites, embodying eagle-eyed discernment and sovereign authority.'
  }
];

export const initialLeads = [
  {
    id: 'lead-001',
    leadName: 'Nawabzada Zafar Ali Khan',
    company: 'Rampur Heritage Trusts',
    email: 'zafar.ali@rampur-estates.in',
    phone: '+91 98100 29384',
    source: 'Website',
    dealValue: 750000,
    stage: 'New Lead', // 'New Lead' | 'Contacted' | 'Qualified' | 'Interested' | 'Negotiation' | 'Payment Pending' | 'Won' | 'Lost'
    score: 'Hot', // 'Hot' | 'Warm' | 'Cold'
    priority: 'VIP',
    assignedName: 'Rajesh Varma',
    lastInteraction: 'Today, 11:30 AM',
    nextFollowup: 'Tomorrow, 10:00 AM',
    notes: 'Inquired regarding commissioning 4 custom bronze stallions for family polo pavilion.'
  },
  {
    id: 'lead-002',
    leadName: 'Mrs. Rohini Nandan Nilekani',
    company: 'Ekam Architecture & Arts',
    email: 'rohini.n@ekam-studios.com',
    phone: '+91 99002 81720',
    source: 'Referral',
    dealValue: 1250000,
    stage: 'Contacted',
    score: 'Hot',
    priority: 'VIP',
    assignedName: 'Ananya Deshmukh',
    lastInteraction: 'Yesterday, 04:00 PM',
    nextFollowup: '20 Oct, 02:00 PM',
    notes: 'Showroom private viewing scheduled in Bangalore galleria for next Tuesday.'
  },
  {
    id: 'lead-003',
    leadName: 'Kunal & Priya Shah',
    company: 'CRED Family Office',
    email: 'kunal@cred-founders.in',
    phone: '+91 98201 92837',
    source: 'Instagram',
    dealValue: 480000,
    stage: 'Qualified',
    score: 'Hot',
    priority: 'High',
    assignedName: 'Rajesh Varma',
    lastInteraction: '17 Oct, 03:15 PM',
    nextFollowup: '19 Oct, 11:00 AM',
    notes: 'Interested in Emerald Wave & Rose-Gold Eagle for Alibaug seaside sanctuary.'
  },
  {
    id: 'lead-004',
    leadName: 'Vikram Soni',
    company: 'Soni Jewels & Diamonds',
    email: 'v.soni@soni-jewels.com',
    phone: '+91 98290 11928',
    source: 'WhatsApp',
    dealValue: 380000,
    stage: 'Interested',
    score: 'Warm',
    priority: 'Medium',
    assignedName: 'Sameer Sen',
    lastInteraction: '16 Oct, 01:20 PM',
    nextFollowup: '21 Oct, 03:00 PM',
    notes: 'Requested customized diamond-encrusted plinth for Golden Antelope.'
  },
  {
    id: 'lead-005',
    leadName: 'Harsh Goenka',
    company: 'RPG Art Foundation',
    email: 'h.goenka@rpg-art.org',
    phone: '+91 98200 99182',
    source: 'Campaign',
    dealValue: 1800000,
    stage: 'Negotiation',
    score: 'Hot',
    priority: 'VIP',
    assignedName: 'Rajesh Varma',
    lastInteraction: '18 Oct, 09:30 AM',
    nextFollowup: '19 Oct, 04:00 PM',
    notes: 'Reviewing proposal for 5-piece bespoke curatorial collection for Mumbai HQ.'
  },
  {
    id: 'lead-006',
    leadName: 'Aarti & Deepinder Goyal',
    company: 'Eternal Capital',
    email: 'deepinder.office@zomato-founders.com',
    phone: '+91 98111 20983',
    source: 'Influencer',
    dealValue: 620000,
    stage: 'Payment Pending',
    score: 'Hot',
    priority: 'High',
    assignedName: 'Ananya Deshmukh',
    lastInteraction: 'Today, 12:45 PM',
    nextFollowup: 'Today, 06:00 PM',
    notes: 'Pro-forma invoice sent for Aurelia Lounge Chair & Torus Ceramics.'
  },
  {
    id: 'lead-007',
    leadName: 'Tarun Tahiliani Atelier',
    company: 'Tahiliani Haute Couture',
    email: 'tarun.couture@tahiliani.com',
    phone: '+91 98101 88291',
    source: 'Offline Showroom',
    dealValue: 920000,
    stage: 'Won',
    score: 'Hot',
    priority: 'VIP',
    assignedName: 'Rajesh Varma',
    lastInteraction: '15 Oct, 05:00 PM',
    nextFollowup: 'Complete',
    notes: 'Acquired 3 Vastu Masterpieces for flagship Mehrauli Haveli bridal boutique.'
  },
  {
    id: 'lead-008',
    leadName: 'Rajiv Bajaj',
    company: 'Bajaj Auto Leadership Office',
    email: 'rajiv.b@bajaj-estates.com',
    phone: '+91 98220 18273',
    source: 'Website',
    dealValue: 550000,
    stage: 'Won',
    score: 'Hot',
    priority: 'High',
    assignedName: 'Sameer Sen',
    lastInteraction: '14 Oct, 02:00 PM',
    nextFollowup: 'Complete',
    notes: 'Delivered Chrome Deer & Rose-Gold Eagle for Akurdi boardroom.'
  }
];

export const initialAbandonedCarts = [
  {
    id: 'cart-001',
    customer: {
      name: 'Sunita Munjal',
      email: 'sunita.munjal@hero-family.org',
      phone: '+91 98100 44920',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
    },
    products: [
      {
        title: 'Emerald & Gold Wave Sculpture',
        image: '/images/products/Emerald and Gold Wave Sculpture.png',
        price: 285000,
        qty: 1
      }
    ],
    cartValue: 285000,
    timeAbandoned: '2 hours ago',
    recoveryStatus: 'Unrecovered' // 'Unrecovered' | 'Email Sent' | 'WhatsApp Sent' | 'Coupon Sent' | 'Recovered'
  },
  {
    id: 'cart-002',
    customer: {
      name: 'Vivek Chand Burman',
      email: 'vivek.burman@dabur-trust.in',
      phone: '+91 98112 39012',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    products: [
      {
        title: 'Golden Antelope in Sunlit Elegance',
        image: '/images/products/Golden Antelope in Sunlit Elegance.png',
        price: 185000,
        qty: 1
      },
      {
        title: 'Textured Sandstone Donut Vase',
        image: '/images/products/Textured Sandstone Donut Vase.png',
        price: 95000,
        qty: 1
      }
    ],
    cartValue: 280000,
    timeAbandoned: '5 hours ago',
    recoveryStatus: 'Email Sent'
  },
  {
    id: 'cart-003',
    customer: {
      name: 'Radhika Piramal',
      email: 'radhika@vip-industries.com',
      phone: '+91 98200 44102',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    },
    products: [
      {
        title: 'Rose-Gold Eagle Winter Elegance',
        image: '/images/products/Rose-Gold Eagle Winter Elegance.png',
        price: 320000,
        qty: 1
      }
    ],
    cartValue: 320000,
    timeAbandoned: '1 day ago',
    recoveryStatus: 'WhatsApp Sent'
  }
];

export const initialCampaigns = [
  {
    id: 'camp-001',
    name: 'Diwali Royal Patronage Private Preview',
    type: 'WhatsApp',
    status: 'Active',
    reach: 1250,
    clicks: 840,
    conversions: 32,
    spend: 45000,
    revenue: 4850000,
    roas: 107.7,
    ctr: 67.2,
    date: '10 Oct - 25 Oct 2026'
  },
  {
    id: 'camp-002',
    name: 'Curated Architectural Estates 2026',
    type: 'Email',
    status: 'Active',
    reach: 4800,
    clicks: 1920,
    conversions: 18,
    spend: 25000,
    revenue: 3120000,
    roas: 124.8,
    ctr: 40.0,
    date: '01 Oct - 31 Oct 2026'
  },
  {
    id: 'camp-003',
    name: 'Instagram High-Net-Worth Retargeting',
    type: 'Meta Ads',
    status: 'Active',
    reach: 65000,
    clicks: 4200,
    conversions: 14,
    spend: 180000,
    revenue: 2680000,
    roas: 14.8,
    ctr: 6.4,
    date: '15 Sep - 20 Oct 2026'
  },
  {
    id: 'camp-004',
    name: 'VIP Private Atelier Invitation Series',
    type: 'SMS',
    status: 'Completed',
    reach: 450,
    clicks: 390,
    conversions: 24,
    spend: 12000,
    revenue: 3900000,
    roas: 325.0,
    ctr: 86.6,
    date: '01 Sep - 30 Sep 2026'
  }
];

export const initialCoupons = [
  {
    id: 'coup-001',
    code: 'LUXVIP10',
    type: 'percentage',
    value: 10,
    minOrder: 200000,
    maxDiscount: 50000,
    uses: 28,
    limit: 100,
    status: 'Active',
    expiry: '2026-12-31'
  },
  {
    id: 'coup-002',
    code: 'ESTATEFOUNDER',
    type: 'fixed',
    value: 40000,
    minOrder: 400000,
    maxDiscount: 40000,
    uses: 12,
    limit: 50,
    status: 'Active',
    expiry: '2026-11-15'
  },
  {
    id: 'coup-003',
    code: 'CURATORIAL5',
    type: 'percentage',
    value: 5,
    minOrder: 100000,
    maxDiscount: 25000,
    uses: 45,
    limit: 200,
    status: 'Active',
    expiry: '2026-12-31'
  }
];

export const initialSupportTickets = [
  {
    id: 'tkt-1082',
    ticketNumber: '#TKT-1082',
    customer: 'Princess Gayatri Devi',
    email: 'gayatri.devi@jaipurheritage.in',
    subject: 'Request bespoke archival brass wall mount for Emerald Wave',
    priority: 'VIP', // 'Low' | 'Medium' | 'High' | 'VIP'
    status: 'In Progress', // 'Open' | 'In Progress' | 'Waiting' | 'Resolved' | 'Closed'
    assignedAgent: 'Rajesh Varma',
    slaTarget: '2 hours remaining',
    lastUpdated: '10 mins ago',
    messages: [
      {
        sender: 'Princess Gayatri Devi',
        type: 'customer',
        time: '18 Oct 2026, 11:00 AM',
        text: 'Greetings Rajesh. We are installing the Emerald Wave in the east wing salon and require our foundry engineering drawings for the wall bracket.'
      },
      {
        sender: 'Rajesh Varma (Curatorial Director)',
        type: 'agent',
        time: '18 Oct 2026, 11:25 AM',
        text: 'Your Highness, our master draftsman is generating the structural load blueprint. We will dispatch the custom bracket in matching gilded bronze with our install team.'
      }
    ]
  },
  {
    id: 'tkt-1081',
    ticketNumber: '#TKT-1081',
    customer: 'Dr. Vikramaditya Oberoi',
    email: 'oberoi.v@oberoi-capital.com',
    subject: 'Annual protective beeswax burnishing request for Golden Antelope',
    priority: 'High',
    status: 'Open',
    assignedAgent: 'Sameer Sen',
    slaTarget: '4 hours remaining',
    lastUpdated: '45 mins ago',
    messages: [
      {
        sender: 'Dr. Vikramaditya Oberoi',
        type: 'customer',
        time: '18 Oct 2026, 09:30 AM',
        text: 'Can your restoration team visit our Altamount residence next Friday for the annual 24k luster inspection?'
      }
    ]
  },
  {
    id: 'tkt-1080',
    ticketNumber: '#TKT-1080',
    customer: 'Kavita Goenka',
    email: 'sanjiv.goenka@rpsg-estates.com',
    subject: 'Specialized shipping crate certification for overseas yacht delivery',
    priority: 'VIP',
    status: 'Waiting',
    assignedAgent: 'Rajesh Varma',
    slaTarget: 'On track',
    lastUpdated: 'Yesterday, 05:00 PM',
    messages: [
      {
        sender: 'Kavita Goenka',
        type: 'customer',
        time: '17 Oct 2026, 04:30 PM',
        text: 'Please confirm marine-grade moisture vapor barrier wrapping for the shipment to Monaco.'
      }
    ]
  }
];

export const initialReviews = [
  {
    id: 'rev-001',
    customer: 'Princess Gayatri Devi',
    product: 'Emerald & Gold Wave Sculpture',
    rating: 5,
    date: '14 Oct 2026',
    verified: true,
    status: 'Approved',
    text: 'A profound testament to Indian artistic heritage elevated through modern European precision. The malachite gradient captivates everyone who enters the grand salon.',
    reply: 'Deeply honoured by your patron praise, Your Highness. May its fluid grace bring lasting prosperity.'
  },
  {
    id: 'rev-002',
    customer: 'Dr. Vikramaditya Oberoi',
    product: 'Golden Antelope in Sunlit Elegance',
    rating: 5,
    date: '10 Oct 2026',
    verified: true,
    status: 'Approved',
    text: 'The geometric balance and pristine weight of the casting is peerless. Pt. Sharma verified its Vastu alignment immediately upon white-glove uncrating.',
    reply: 'Thank you Dr. Oberoi. We are thrilled to curate pieces that resonate with sacred spatial energies.'
  },
  {
    id: 'rev-003',
    customer: 'Nikhil Kamath',
    product: 'Chrome Deer Sculpture on Walnut Stand',
    rating: 5,
    date: '02 Oct 2026',
    verified: true,
    status: 'Approved',
    text: 'Pure architectural brilliance. The juxtaposition of cold mirror-finish steel against the rich warmth of aged Canaletto walnut is sublime.',
    reply: 'Our gratitude, Nikhil. Tailored for discerning contemporary visionaries.'
  }
];

export const initialWarehouses = [
  {
    id: 'wh-001',
    name: 'Central Mumbai High-Security Vault',
    code: 'BOM-VAULT-01',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Unit 4A, Peninsula Spire, Lower Parel, Mumbai 400013',
    manager: 'Farhan Dastoor',
    stockCount: 42,
    valuation: 9840000,
    isPrimary: true
  },
  {
    id: 'wh-002',
    name: 'Delhi NCR Lutyens Curatorial Depot',
    code: 'DEL-DEPOT-02',
    city: 'Gurugram',
    state: 'Haryana',
    address: 'DLF Cyber City Horizon Tower 8, DLF Phase 2, Gurugram 122002',
    manager: 'Siddharth Mehra',
    stockCount: 28,
    valuation: 6250000,
    isPrimary: false
  },
  {
    id: 'wh-003',
    name: 'Bangalore Tech-Estate Galleria Depot',
    code: 'BLR-VAULT-03',
    city: 'Bangalore',
    state: 'Karnataka',
    address: 'UB City Vittal Mallya Road, Lavelle, Bangalore 560001',
    manager: 'Preeti Hegde',
    stockCount: 19,
    valuation: 4320000,
    isPrimary: false
  }
];

export const initialAuditLogs = [
  {
    id: 'log-001',
    user: 'Rajesh Varma (Admin)',
    action: 'Status Updated',
    module: 'Orders',
    entityId: '#LX-89421',
    description: 'Updated order status from "Pending Inspection" to "New / Confirmed"',
    timestamp: '18 Oct 2026, 10:45 AM',
    ip: '103.21.144.12'
  },
  {
    id: 'log-002',
    user: 'Ananya Deshmukh (Concierge)',
    action: 'Stage Moved',
    module: 'Leads Pipeline',
    entityId: 'Mrs. Rohini Nilekani',
    description: 'Advanced lead from "Contacted" to "Qualified (VIP Showroom)"',
    timestamp: '18 Oct 2026, 09:30 AM',
    ip: '103.21.144.18'
  },
  {
    id: 'log-003',
    user: 'Sameer Sen (Warehouse Lead)',
    action: 'Inventory Adjusted',
    module: 'Inventory',
    entityId: 'LX-SC-EMW-01',
    description: 'Received 3 units from Tuscan Foundry at Central Mumbai Vault',
    timestamp: '17 Oct 2026, 06:15 PM',
    ip: '103.21.144.14'
  },
  {
    id: 'log-004',
    user: 'Rajesh Varma (Admin)',
    action: 'Campaign Launched',
    module: 'Marketing',
    entityId: 'Diwali Royal Patronage',
    description: 'Activated VIP WhatsApp broadcast to 1,250 Diamond tier patrons',
    timestamp: '17 Oct 2026, 11:00 AM',
    ip: '103.21.144.12'
  }
];

export const initialTeam = [
  {
    id: 'team-001',
    name: 'Rajesh Varma',
    email: 'rajesh.varma@luxignia.com',
    role: 'Super Admin',
    department: 'Executive Curatorial Directorate',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    status: 'Active',
    lastActive: 'Just now'
  },
  {
    id: 'team-002',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@luxignia.com',
    role: 'Sales Concierge',
    department: 'Private Client Advisory',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    status: 'Active',
    lastActive: '5m ago'
  },
  {
    id: 'team-003',
    name: 'Sameer Sen',
    email: 'sameer.sen@luxignia.com',
    role: 'Warehouse Lead',
    department: 'Foundry & Security Logistics',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    status: 'Active',
    lastActive: '12m ago'
  },
  {
    id: 'team-004',
    name: 'Pooja Kashyap',
    email: 'pooja.k@luxignia.com',
    role: 'Customer Support',
    department: 'Concierge Desk & SLA',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    status: 'Active',
    lastActive: '1h ago'
  },
  {
    id: 'team-005',
    name: 'Devendra Singhal',
    email: 'devendra@luxignia.com',
    role: 'Finance Controller',
    department: 'Treasury & Taxation',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    status: 'Active',
    lastActive: '2h ago'
  }
];

export const initialIntegrations = [
  {
    id: 'int-shopify',
    name: 'Shopify Plus Private Storefront',
    category: 'E-Commerce Platform',
    icon: 'storefront',
    status: 'Connected',
    lastSync: '4 minutes ago',
    description: 'Real-time synchronization for luxury inventory, web orders, and catalog variants.'
  },
  {
    id: 'int-razorpay',
    name: 'Razorpay Enterprise Payment Gateway',
    category: 'Payments',
    icon: 'credit_card',
    status: 'Connected',
    lastSync: 'Real-time Webhook Active',
    description: 'Accepts High-Value UPI, Amex Platinum, Corporate Net Banking, and International Forex.'
  },
  {
    id: 'int-shiprocket',
    name: 'Shiprocket White-Glove Security Courier',
    category: 'Logistics',
    icon: 'local_shipping',
    status: 'Connected',
    lastSync: '12 minutes ago',
    description: 'Armored transit insurance, GPS tracking, and temperature-controlled white glove delivery.'
  },
  {
    id: 'int-whatsapp',
    name: 'WhatsApp Business Cloud API (Meta)',
    category: 'Communications',
    icon: 'chat',
    status: 'Connected',
    lastSync: 'Real-time Active',
    description: 'Official verified green-tick messaging for VIP dispatch alerts and curatorial concierge.'
  },
  {
    id: 'int-stripe',
    name: 'Stripe International Concierge Gateway',
    category: 'Payments',
    icon: 'payments',
    status: 'Connected',
    lastSync: 'Real-time Active',
    description: 'USD/EUR/GBP multi-currency checkout for overseas patron residences.'
  },
  {
    id: 'int-meta-ads',
    name: 'Meta Ads Manager (Instagram/FB)',
    category: 'Marketing',
    icon: 'campaign',
    status: 'Connected',
    lastSync: '1 hour ago',
    description: 'Targeting ultra-high-net-worth real estate and luxury interior design audiences.'
  },
  {
    id: 'int-google-analytics',
    name: 'Google Analytics 4 & BigQuery',
    category: 'Analytics',
    icon: 'analytics',
    status: 'Connected',
    lastSync: '30 minutes ago',
    description: 'Attribution modeling, boutique conversion funnels, and patron lifetime value.'
  },
  {
    id: 'int-mailchimp',
    name: 'Mailchimp / Mandrill Transactional',
    category: 'Marketing',
    icon: 'mail',
    status: 'Ready to Connect',
    lastSync: 'Not configured',
    description: 'High-deliverability branded HTML curatorial journals and archival certificates.'
  }
];

export const initialConversations = [
  {
    id: 'conv-001',
    channel: 'WhatsApp',
    customerName: 'Princess Gayatri Devi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    lastMessage: 'The custom bracket details look impeccable. Thank you Rajesh.',
    unread: 0,
    time: '11:45 AM',
    messages: [
      { sender: 'customer', text: 'Good morning Rajesh. Order #LX-89421 placed.', time: '10:32 AM' },
      { sender: 'concierge', text: 'Namaste Your Highness. We have reserved the Emerald Wave and Jeweled Deer pair for you immediately.', time: '10:35 AM' },
      { sender: 'customer', text: 'Please ensure non-marking boots for the install team.', time: '10:40 AM' },
      { sender: 'concierge', text: 'Our armored team is instructed. Archival white gloves and suede overshoes provided.', time: '10:42 AM' },
      { sender: 'customer', text: 'The custom bracket details look impeccable. Thank you Rajesh.', time: '11:45 AM' }
    ]
  },
  {
    id: 'conv-002',
    channel: 'WhatsApp',
    customerName: 'Dr. Vikramaditya Oberoi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    lastMessage: 'Can you ensure dispatch by 10 AM tomorrow?',
    unread: 1,
    time: '09:20 AM',
    messages: [
      { sender: 'customer', text: 'Hello Luxignia team. Order #LX-89420 confirmed.', time: '09:16 AM' },
      { sender: 'concierge', text: 'Greetings Dr. Oberoi. Your Golden Antelope is passing final quality luster review.', time: '09:18 AM' },
      { sender: 'customer', text: 'Can you ensure dispatch by 10 AM tomorrow?', time: '09:20 AM' }
    ]
  },
  {
    id: 'conv-003',
    channel: 'Email',
    customerName: 'Kunal & Priya Shah',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    lastMessage: 'Reviewing the Alibaug villa curatorial deck today.',
    unread: 0,
    time: 'Yesterday',
    messages: [
      { sender: 'concierge', text: 'Dear Kunal & Priya, attached is your customized curatorial curation folio.', time: 'Yesterday, 02:00 PM' },
      { sender: 'customer', text: 'Reviewing the Alibaug villa curatorial deck today.', time: 'Yesterday, 03:45 PM' }
    ]
  }
];
