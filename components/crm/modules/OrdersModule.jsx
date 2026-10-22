// components/crm/modules/OrdersModule.jsx
import React, { useState, useMemo } from 'react';

export default function OrdersModule({
  orders,
  onUpdateOrderStatus,
  onAddOrder,
  onSelectOrder,
  selectedOrder,
  onCloseOrderDetail,
  products
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedRows, setSelectedRows] = useState([]);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  // New Order Form State
  const [newOrderForm, setNewOrderForm] = useState({
    patronName: '',
    email: '',
    phone: '',
    address: '',
    productId: products?.[0]?.id || '',
    paymentMethod: 'Razorpay / UPI Corporate',
    notes: ''
  });

  // Calculate status summary counts matching Screen 2 top row
  const statusCounts = useMemo(() => {
    return {
      new: orders.filter((o) => o.status === 'New').length,
      awaitAccepting: orders.filter((o) => o.status === 'Await accepting').length,
      onWay: orders.filter((o) => o.status === 'On way').length,
      delivered: orders.filter((o) => o.status === 'Delivered').length,
      total: orders.length
    };
  }, [orders]);

  // Filtered and sorted orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        const matchesSearch =
          o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
          o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
          o.customer.email.toLowerCase().includes(search.toLowerCase()) ||
          o.category.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
          selectedCategory === 'All' || o.category === selectedCategory;

        const matchesPayment =
          selectedPayment === 'All' || o.paymentMethod.includes(selectedPayment);

        const matchesStatus =
          selectedStatus === 'All' || o.status === selectedStatus;

        return matchesSearch && matchesCategory && matchesPayment && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'amount-desc') return b.total - a.total;
        if (sortBy === 'amount-asc') return a.total - b.total;
        return 0;
      });
  }, [orders, search, selectedCategory, selectedPayment, selectedStatus, sortBy]);

  const toggleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredOrders.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredOrders.map((o) => o.id));
    }
  };

  const handleExportCSV = () => {
    const headers = 'Order Number,Customer,Category,Amount,Payment,Date,Status\n';
    const rows = filteredOrders
      .map(
        (o) =>
          `"${o.orderNumber}","${o.customer.name}","${o.category}","${o.total}","${o.paymentMethod}","${new Date(o.date).toLocaleDateString()}","${o.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `luxignia_orders_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const handleCreateOrderSubmit = (e) => {
    e.preventDefault();
    const prod = (products || []).find((p) => p.id === newOrderForm.productId) || products?.[0];
    const subtotal = prod?.price || 185000;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `#LX-${Math.floor(89000 + Math.random() * 999)}`,
      customer: {
        id: `cust-${Date.now()}`,
        name: newOrderForm.patronName || 'Noble Patron',
        email: newOrderForm.email || 'patron@luxignia.com',
        phone: newOrderForm.phone || '+91 98000 00000',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        segment: 'VIP',
        tier: 'Platinum',
        address: newOrderForm.address || 'Private Estate, Mumbai, MH'
      },
      category: prod?.category || 'Imperial Sculptures',
      products: [
        {
          id: prod?.id || 'prod-001',
          title: prod?.title || 'Bespoke Curatorial Masterpiece',
          sku: prod?.sku || 'LX-SPEC-01',
          price: subtotal,
          qty: 1,
          image: prod?.image || '/images/products/Emerald and Gold Wave Sculpture.png'
        }
      ],
      subtotal,
      tax,
      shippingFee: 0,
      total,
      date: new Date().toISOString(),
      paymentMethod: newOrderForm.paymentMethod,
      paymentStatus: 'Paid',
      status: 'New',
      courier: 'Luxignia Armored White-Glove Logistics',
      trackingNumber: `LX-SEC-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: newOrderForm.notes || 'White-glove estate delivery.',
      timeline: [
        { status: 'Order Placed', time: 'Just now', done: true },
        { status: 'Payment Verified', time: 'Just now', done: true },
        { status: 'Curatorial Inspection', time: 'Pending', done: false },
        { status: 'Artisan Wood Crate Packing', time: 'Pending', done: false },
        { status: 'White-Glove Courier Dispatch', time: 'Pending', done: false },
        { status: 'Handover & Estate Installation', time: 'Pending', done: false }
      ]
    };

    onAddOrder(newOrder);
    setShowAddOrderModal(false);
    setNewOrderForm({
      patronName: '',
      email: '',
      phone: '',
      address: '',
      productId: products?.[0]?.id || '',
      paymentMethod: 'Razorpay / UPI Corporate',
      notes: ''
    });
  };

  // Status pill badge helper matching reference Screen 2
  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300';
      case 'Await accepting':
        return 'bg-[#FFF4ED] text-[#EA580C] dark:bg-amber-950/70 dark:text-amber-300';
      case 'On way':
        return 'bg-[#FEFCE8] text-[#CA8A04] dark:bg-yellow-950/70 dark:text-yellow-300';
      case 'Delivered':
        return 'bg-[#ECFDF5] text-[#059669] dark:bg-emerald-950/70 dark:text-emerald-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* 1. Header (Matching reference: "Order list") */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Order list
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time fulfillment, white-glove security dispatch, and invoice ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedRows.length > 0 && (
            <div className="flex items-center gap-2 mr-2">
              <span className="text-xs font-semibold text-slate-500">
                {selectedRows.length} selected
              </span>
              <button
                onClick={() => {
                  selectedRows.forEach((id) => onUpdateOrderStatus(id, 'Delivered'));
                  setSelectedRows([]);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
              >
                Mark Delivered
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. TOP 4 STATUS SUMMARY CARDS (Exact match to Reference Screen 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: New orders */}
        <div
          onClick={() => setSelectedStatus(selectedStatus === 'New' ? 'All' : 'New')}
          className={`rounded-3xl p-5 bg-white dark:bg-slate-900 border transition-all cursor-pointer relative overflow-hidden ${
            selectedStatus === 'New'
              ? 'border-blue-500 ring-2 ring-blue-500/20'
              : 'border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]'
          }`}
        >
          {/* Top colored accent header banner in Crisp Blue */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#2563EB]" />

          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            New orders
          </div>

          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {statusCounts.new}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              ↑ 2.6%
            </span>
          </div>

          <div className="mt-1 text-[10px] text-slate-400">Than last week</div>
        </div>

        {/* Card 2: Await accepting orders */}
        <div
          onClick={() => setSelectedStatus(selectedStatus === 'Await accepting' ? 'All' : 'Await accepting')}
          className={`rounded-3xl p-5 bg-white dark:bg-slate-900 border transition-all cursor-pointer relative overflow-hidden ${
            selectedStatus === 'Await accepting'
              ? 'border-orange-500 ring-2 ring-orange-500/20'
              : 'border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#EA580C]" />

          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Await accepting orders
          </div>

          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {statusCounts.awaitAccepting}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF4ED] text-[#EA580C] dark:bg-orange-950/60 dark:text-orange-300">
              ↑ 2.6%
            </span>
          </div>

          <div className="mt-1 text-[10px] text-slate-400">Than last week</div>
        </div>

        {/* Card 3: On way orders */}
        <div
          onClick={() => setSelectedStatus(selectedStatus === 'On way' ? 'All' : 'On way')}
          className={`rounded-3xl p-5 bg-white dark:bg-slate-900 border transition-all cursor-pointer relative overflow-hidden ${
            selectedStatus === 'On way'
              ? 'border-amber-500 ring-2 ring-amber-500/20'
              : 'border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#EAB308]" />

          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            On way orders
          </div>

          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {statusCounts.onWay}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEFCE8] text-[#CA8A04] dark:bg-yellow-950/60 dark:text-yellow-300">
              ↓ 0.6%
            </span>
          </div>

          <div className="mt-1 text-[10px] text-slate-400">Than last week</div>
        </div>

        {/* Card 4: Delivered orders */}
        <div
          onClick={() => setSelectedStatus(selectedStatus === 'Delivered' ? 'All' : 'Delivered')}
          className={`rounded-3xl p-5 bg-white dark:bg-slate-900 border transition-all cursor-pointer relative overflow-hidden ${
            selectedStatus === 'Delivered'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20'
              : 'border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#10B981]" />

          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Delivered orders
          </div>

          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {statusCounts.delivered}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669] dark:bg-emerald-950/60 dark:text-emerald-300">
              ↑ 2.8%
            </span>
          </div>

          <div className="mt-1 text-[10px] text-slate-400">Than last week</div>
        </div>
      </div>

      {/* 3. TOOLBAR: Search, Count Badge, Export, Sort, + Add Order Button (Matching reference toolbar) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Search input + Order Count Pill */}
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          <div className="relative flex-1">
            <span className="material-symbols-outlined text-slate-400 text-lg absolute left-3.5 top-1/2 -translate-y-1/2">
              search
            </span>
            <input
              type="text"
              placeholder="Search by ID, patron, or collection..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Count Badge matching "180 orders" from reference */}
          <div className="px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold shrink-0">
            {filteredOrders.length} orders
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-3">
          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <span className="material-symbols-outlined text-base text-slate-500">file_download</span>
            <span>Export</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none px-4 py-2.5 pr-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer focus:outline-none shadow-2xs"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="amount-desc">Sort: Highest Value</option>
              <option value="amount-asc">Sort: Lowest Value</option>
            </select>
            <span className="material-symbols-outlined text-slate-400 text-sm absolute right-2.5 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* + Add Order Blue Pill Button */}
          <button
            onClick={() => setShowAddOrderModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 hover:scale-[1.02] transition-all"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Add order</span>
          </button>
        </div>
      </div>

      {/* 4. FILTER PILLS ROW */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">filter_alt</span>
            Filters:
          </span>

          {/* Category Filter Pill */}
          {selectedCategory !== 'All' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium border border-slate-200 dark:border-slate-700">
              {selectedCategory}
              <button onClick={() => setSelectedCategory('All')} className="text-slate-400 hover:text-slate-600">✕</button>
            </span>
          ) : (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium text-[11px]"
            >
              <option value="All">All Categories</option>
              <option value="Imperial Sculptures">Imperial Sculptures</option>
              <option value="Vastu Masterpieces">Vastu Masterpieces</option>
              <option value="Toroidal Ceramics">Toroidal Ceramics</option>
              <option value="Heirloom Furniture">Heirloom Furniture</option>
              <option value="Porcelain Masterpieces">Porcelain Masterpieces</option>
            </select>
          )}

          {/* Payment Method Pill */}
          {selectedPayment !== 'All' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium border border-slate-200 dark:border-slate-700">
              {selectedPayment}
              <button onClick={() => setSelectedPayment('All')} className="text-slate-400 hover:text-slate-600">✕</button>
            </span>
          ) : (
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium text-[11px]"
            >
              <option value="All">All Payments</option>
              <option value="Wire Transfer">Wire Transfer</option>
              <option value="Razorpay">Razorpay / UPI</option>
              <option value="Amex">Amex Platinum</option>
            </select>
          )}

          {/* Clear all pill */}
          {(selectedCategory !== 'All' || selectedPayment !== 'All' || selectedStatus !== 'All' || search) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedPayment('All');
                setSelectedStatus('All');
                setSearch('');
              }}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline ml-1"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Pagination indicator matching reference "1 of 18 < >" */}
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <span>1 of {Math.max(1, Math.ceil(filteredOrders.length / 10))}</span>
          <div className="flex items-center gap-1">
            <button className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 transition-colors">
              ‹
            </button>
            <button className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 transition-colors">
              ›
            </button>
          </div>
        </div>
      </div>

      {/* 5. DATA TABLE */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/40 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="py-3.5 px-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">ORDER NUMBER</th>
                <th className="py-3.5 px-4">CUSTOMER</th>
                <th className="py-3.5 px-4">CATEGORY</th>
                <th className="py-3.5 px-4">PRICE</th>
                <th className="py-3.5 px-4">DATE</th>
                <th className="py-3.5 px-4">PAYMENT</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredOrders.map((order) => {
                const isSelected = selectedRows.includes(order.id);
                return (
                  <tr
                    key={order.id}
                    className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(order.id)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>

                    {/* Order Number */}
                    <td
                      className="py-4 px-4 font-mono font-bold text-slate-900 dark:text-white"
                      onClick={() => onSelectOrder(order)}
                    >
                      {order.orderNumber}
                    </td>

                    {/* Customer Info (Avatar, Name, Contact subtext) */}
                    <td className="py-4 px-4" onClick={() => onSelectOrder(order)}>
                      <div className="flex items-center gap-2.5">
                        <img
                          src={order.customer.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-100">
                            {order.customer.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {order.customer.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-medium" onClick={() => onSelectOrder(order)}>
                      {order.category}
                    </td>

                    {/* Price in ₹ INR */}
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white" onClick={() => onSelectOrder(order)}>
                      ₹ {order.total.toLocaleString('en-IN')}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400" onClick={() => onSelectOrder(order)}>
                      {new Date(order.date).toLocaleDateString('en-GB')}
                    </td>

                    {/* Payment Method */}
                    <td className="py-4 px-4 text-slate-700 dark:text-slate-200 font-medium" onClick={() => onSelectOrder(order)}>
                      {order.paymentMethod.split('/')[0]}
                    </td>

                    {/* Status Pill with Dropdown Arrow (Recreation of reference status dropdown pill) */}
                    <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="relative inline-block">
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                          className={`appearance-none px-3 py-1 pr-6 rounded-full text-[10px] font-bold cursor-pointer border-0 outline-none ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          <option value="New">New</option>
                          <option value="Await accepting">Await</option>
                          <option value="On way">On way</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Returned">Returned</option>
                        </select>
                        <span className="material-symbols-outlined text-xs absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60">
                          expand_more
                        </span>
                      </div>
                    </td>

                    {/* Actions Menu */}
                    <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setInvoiceOrder(order);
                            setShowInvoiceModal(true);
                          }}
                          title="Print High-End Invoice"
                          className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">receipt</span>
                        </button>
                        <button
                          onClick={() => onSelectOrder(order)}
                          title="View Order Details"
                          className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">more_horiz</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. ORDER DETAIL DRAWER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-xl h-full bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                      {selectedOrder.orderNumber}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Acquisition registered on {new Date(selectedOrder.date).toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={onCloseOrderDetail}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Patron Card */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Patron Details
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={selectedOrder.customer.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400/30"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {selectedOrder.customer.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {selectedOrder.customer.email} • {selectedOrder.customer.phone}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                  <span className="font-bold">Shipping Address: </span>
                  {selectedOrder.customer.address}
                </div>
              </div>

              {/* Ordered Items */}
              <div className="mt-5">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                  Acquired Works
                </div>
                <div className="space-y-2">
                  {selectedOrder.products.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/30"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {p.title}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            SKU: {p.sku} • Qty: {p.qty}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        ₹{p.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Luxury Tax (GST 18%)</span>
                  <span>₹{selectedOrder.tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>White-Glove Courier Logistics</span>
                  <span className="text-emerald-600 font-bold">Complimentary</span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-extrabold text-sm text-slate-900 dark:text-white">
                  <span>Total Amount</span>
                  <span>₹{selectedOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="mt-5">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-3">
                  Concierge Handover Timeline
                </div>
                <div className="space-y-3 pl-2 border-l-2 border-blue-500/30 ml-2">
                  {selectedOrder.timeline.map((step, idx) => (
                    <div key={idx} className="relative pl-4">
                      <span
                        className={`absolute -left-[11px] top-1 w-3 h-3 rounded-full ${
                          step.done ? 'bg-blue-600 ring-2 ring-blue-200' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      />
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {step.status}
                      </div>
                      <div className="text-[10px] text-slate-400">{step.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <button
                onClick={() => {
                  setInvoiceOrder(selectedOrder);
                  setShowInvoiceModal(true);
                }}
                className="flex-1 py-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 font-bold text-xs hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">receipt</span>
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => {
                  onUpdateOrderStatus(selectedOrder.id, 'Delivered');
                  onCloseOrderDetail();
                }}
                className="flex-1 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-colors"
              >
                Mark as Delivered
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. ADD ORDER MODAL */}
      {showAddOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Create New Patron Acquisition Order
              </h3>
              <button onClick={() => setShowAddOrderModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Patron Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maharaja Yaduveer Wadiyar"
                  value={newOrderForm.patronName}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, patronName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Patron Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="patron@estate.in"
                    value={newOrderForm.email}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98110 00000"
                    value={newOrderForm.phone}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Curated Work / Piece *
                </label>
                <select
                  value={newOrderForm.productId}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, productId: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {(products || []).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} — ₹{p.price.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={newOrderForm.paymentMethod}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, paymentMethod: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Wire Transfer / RTGS">Wire Transfer / RTGS</option>
                  <option value="Razorpay / UPI Corporate">Razorpay / UPI Corporate</option>
                  <option value="Amex Platinum Concierge">Amex Platinum Concierge</option>
                  <option value="Cheque / High-Security Escrow">Cheque / High-Security Escrow</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  White-Glove Delivery Address
                </label>
                <textarea
                  rows={2}
                  placeholder="Private estate address, city, state, postal code"
                  value={newOrderForm.address}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddOrderModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm shadow-blue-500/20"
                >
                  Confirm & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. PRINT INVOICE MODAL */}
      {showInvoiceModal && invoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-3xl p-8 shadow-2xl animate-fadeIn max-h-[92vh] overflow-y-auto">
            {/* Invoice Top Header */}
            <div className="flex items-start justify-between pb-6 border-b border-slate-200">
              <div>
                <div className="font-serif text-2xl font-bold tracking-widest text-slate-900">
                  LUXIGNIA
                </div>
                <div className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold">
                  Artisanal Curatorial Studios & Heirloom Works
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  GSTIN: 27AABCL8921P1Z4 • Lower Parel, Mumbai 400013
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                  INVOICE {invoiceOrder.orderNumber}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Date: {new Date(invoiceOrder.date).toLocaleDateString('en-GB')}
                </div>
                <div className="text-xs text-emerald-600 font-bold">
                  Status: {invoiceOrder.paymentStatus}
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="mt-6 grid grid-cols-2 gap-6 text-xs">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Patron Information:</div>
                <div className="font-bold text-slate-900 mt-1">{invoiceOrder.customer.name}</div>
                <div className="text-slate-500">{invoiceOrder.customer.email}</div>
                <div className="text-slate-500">{invoiceOrder.customer.phone}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Destination:</div>
                <div className="text-slate-700 mt-1">{invoiceOrder.customer.address}</div>
                <div className="text-slate-500 mt-1">Courier: {invoiceOrder.courier}</div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mt-6 border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                  <tr>
                    <th className="py-2.5 px-4">Item & SKU</th>
                    <th className="py-2.5 px-4 text-center">Qty</th>
                    <th className="py-2.5 px-4 text-right">Unit Price</th>
                    <th className="py-2.5 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoiceOrder.products.map((p, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{p.title}</div>
                        <div className="text-[10px] font-mono text-slate-400">{p.sku}</div>
                      </td>
                      <td className="py-3 px-4 text-center">{p.qty}</td>
                      <td className="py-3 px-4 text-right">₹{p.price.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-right font-bold">
                        ₹{(p.price * p.qty).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Summary */}
            <div className="mt-6 flex justify-end">
              <div className="w-64 space-y-1.5 text-xs text-right">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>₹{invoiceOrder.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST (18%):</span>
                  <span>₹{invoiceOrder.tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Armored Transport:</span>
                  <span className="text-emerald-600 font-bold">Complimentary</span>
                </div>
                <div className="border-t border-slate-300 pt-2 flex justify-between font-extrabold text-sm text-slate-900">
                  <span>Grand Total:</span>
                  <span>₹{invoiceOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Print Buttons */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-serif italic">
                Thank you for patronizing Luxignia Artisanal Studios.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  <span>Print Formal Tax Invoice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
