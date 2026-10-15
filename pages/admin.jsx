import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useApp } from '../lib/AppContext';

export default function AdminPage() {
  const { user } = useApp();
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'users' | 'products'
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uRes, oRes, pRes] = await Promise.all([
        fetch('/api/admin/users').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/products').then((r) => r.json()),
      ]);

      if (uRes.success) setUsers(uRes.users || []);
      if (oRes.success) setOrders(oRes.orders || []);
      if (pRes.success) setProducts(pRes.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateUser = async (userId, newRole, newStatus) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole, status: newStatus } : u))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Head>
        <title>Curatorial Director Admin Console | Luxignia</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#173626]/12">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300">
                Super Admin Console
              </span>
              <span className="text-[10px] text-gray-500 font-mono">ROOT GOVERNANCE</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A1C13] mt-1">
              Luxignia Director Control Center
            </h1>
            <p className="text-xs sm:text-sm text-[#4A574F] mt-1">
              Consignment dispatch tracking, RBAC security roles, and real-time inventory management.
            </p>
          </div>

          <button
            onClick={fetchData}
            className="btn-outline py-2 px-3 text-xs font-bold flex items-center gap-1.5 self-start md:self-auto"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            <span>Refresh State</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#173626]/12 gap-8 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3.5 transition-colors ${
              activeTab === 'orders' ? 'text-[#173626] border-b-2 border-[#C5A059]' : 'text-gray-400 hover:text-black'
            }`}
          >
            Consignments & Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3.5 transition-colors ${
              activeTab === 'users' ? 'text-[#173626] border-b-2 border-[#C5A059]' : 'text-gray-400 hover:text-black'
            }`}
          >
            User Accounts & RBAC ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3.5 transition-colors ${
              activeTab === 'products' ? 'text-[#173626] border-b-2 border-[#C5A059]' : 'text-gray-400 hover:text-black'
            }`}
          >
            Inventory Stock ({products.length})
          </button>
        </div>

        {/* TAB 1: ALL ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-[#173626]/12 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#10261C]">
                <thead className="bg-[#F7F4EE] border-b border-[#173626]/10 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="py-3.5 px-4">Order Ref</th>
                    <th className="py-3.5 px-4">Patron Beneficiary</th>
                    <th className="py-3.5 px-4">Total Amount</th>
                    <th className="py-3.5 px-4">Courier & Escrow</th>
                    <th className="py-3.5 px-4">Delivery Status</th>
                    <th className="py-3.5 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#173626]/8">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-[#8C6A1E]">
                        {ord.order_number || ord.orderNumber}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-serif font-bold text-sm text-[#0A1C13]">{ord.patron_name}</div>
                        <div className="text-[11px] text-gray-500">{ord.email} • {ord.phone}</div>
                        <div className="text-[10px] text-gray-400 truncate max-w-xs">{ord.address}</div>
                      </td>
                      <td className="py-4 px-4 font-serif font-bold text-base text-[#0A1C13]">
                        ${ord.total.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-700">{ord.courier || 'Luxignia Armored Security'}</div>
                        <div className="font-mono text-[10px] text-[#8C6A1E] font-bold">{ord.tracking_code}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="badge-gold">{ord.delivery_status || 'White-Glove Processing'}</span>
                      </td>
                      <td className="py-4 px-4 text-gray-500 text-[11px]">
                        {new Date(ord.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: USER ACCOUNTS & RBAC */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-[#173626]/12 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#10261C]">
                <thead className="bg-[#F7F4EE] border-b border-[#173626]/10 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="py-3.5 px-4">Account Name & Email</th>
                    <th className="py-3.5 px-4">User ID</th>
                    <th className="py-3.5 px-4">Role Permission</th>
                    <th className="py-3.5 px-4">Security Status</th>
                    <th className="py-3.5 px-4 text-right">Quick Role Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#173626]/8">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-serif font-bold text-sm text-[#0A1C13]">{u.name}</div>
                        <div className="text-[11px] text-gray-500">{u.email}</div>
                      </td>
                      <td className="py-4 px-4 font-mono text-[11px] text-gray-500">{u.id}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'super_admin'
                              ? 'bg-purple-100 text-purple-900 border border-purple-300'
                              : u.role === 'staff'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-amber-50 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-bold ${u.status === 'active' ? 'text-emerald-700' : 'text-red-700'}`}>
                          ● {u.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateUser(u.id, e.target.value, u.status)}
                          className="px-2 py-1 rounded bg-[#F7F4EE] border border-[#173626]/20 text-xs font-bold text-[#10261C] focus:outline-none"
                        >
                          <option value="customer">customer</option>
                          <option value="staff">staff (curator)</option>
                          <option value="admin">admin</option>
                          <option value="super_admin">super_admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: INVENTORY STOCK */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-[#173626]/12 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#10261C]">
                <thead className="bg-[#F7F4EE] border-b border-[#173626]/10 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="py-3.5 px-4">Product Artifact</th>
                    <th className="py-3.5 px-4">SKU</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Available Stock</th>
                    <th className="py-3.5 px-4 text-right">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#173626]/8">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-4 px-4 flex items-center gap-3">
                        <img src={p.image} alt={p.title} className="w-12 h-12 rounded-lg object-cover border" />
                        <div>
                          <div className="font-serif font-bold text-sm text-[#0A1C13]">{p.title}</div>
                          <div className="text-[10px] text-gray-500">{p.subtitle}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-[11px] text-[#8C6A1E] font-bold">{p.sku}</td>
                      <td className="py-4 px-4 font-semibold">{p.category}</td>
                      <td className="py-4 px-4 font-serif font-bold text-sm text-[#0A1C13]">
                        ${p.price.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 font-bold text-emerald-700">{p.stock} units</td>
                      <td className="py-4 px-4 text-right">
                        <Link href={`/products/${p.id}`} className="btn-outline py-1 px-3 text-[11px] font-bold">
                          Inspect
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
