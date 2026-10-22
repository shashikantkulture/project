// components/crm/modules/TeamModule.jsx
import React, { useState } from 'react';

export default function TeamModule({ team, onInviteMember }) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'Sales Concierge',
    department: 'Private Client Advisory'
  });

  const modulesList = [
    'Dashboard & Executive KPIs',
    'Orders & Dispatch Ledger',
    'Customer CRM & Patron 360°',
    'Sales Pipeline & Kanban',
    'Masterpiece Catalog',
    'Multi-Vault Inventory',
    'Marketing Campaigns',
    'Finance & GST P&L',
    'System Settings & RBAC'
  ];

  const handleInvite = (e) => {
    e.preventDefault();
    onInviteMember({
      id: `team-${Date.now()}`,
      name: inviteForm.name,
      email: inviteForm.email,
      role: inviteForm.role,
      department: inviteForm.department,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      status: 'Active',
      lastActive: 'Just invited'
    });
    setShowInviteModal(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Curatorial Team & Granular RBAC
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Role-based permissions matrix, security authorization, and staff roster.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">person_add</span>
          <span>Invite Member</span>
        </button>
      </div>

      {/* Staff Roster Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Curatorial Staff</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/40 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="py-3 px-4">NAME & CONTACT</th>
                <th className="py-3 px-4">ASSIGNED ROLE</th>
                <th className="py-3 px-4">DEPARTMENT</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">LAST ACTIVE</th>
                <th className="py-3 px-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {team.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} alt="" className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{member.name}</div>
                        <div className="text-[10px] text-slate-400">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-blue-600 dark:text-blue-400">
                    {member.role}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {member.department}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
                      {member.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {member.lastActive}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button className="text-xs font-semibold text-slate-500 hover:text-blue-600">
                      Edit Permissions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Granular Permissions Matrix */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Role Permission Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Module privileges granted to Curatorial Managers & Sales Concierges
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="py-2.5 px-4">MODULE</th>
                <th className="py-2.5 px-4 text-center">VIEW</th>
                <th className="py-2.5 px-4 text-center">CREATE</th>
                <th className="py-2.5 px-4 text-center">EDIT</th>
                <th className="py-2.5 px-4 text-center">DELETE</th>
                <th className="py-2.5 px-4 text-center">EXPORT</th>
                <th className="py-2.5 px-4 text-center">APPROVE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {modulesList.map((mod, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{mod}</td>
                  <td className="py-3 px-4 text-center"><input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" /></td>
                  <td className="py-3 px-4 text-center"><input type="checkbox" defaultChecked={idx !== 7 && idx !== 8} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" /></td>
                  <td className="py-3 px-4 text-center"><input type="checkbox" defaultChecked={idx < 5} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" /></td>
                  <td className="py-3 px-4 text-center"><input type="checkbox" defaultChecked={idx === 1} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" /></td>
                  <td className="py-3 px-4 text-center"><input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" /></td>
                  <td className="py-3 px-4 text-center"><input type="checkbox" defaultChecked={idx === 1 || idx === 3} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Staff Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Invite Team Member</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleInvite} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Siddharth Mehra"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Official Email *</label>
                <input
                  type="email"
                  required
                  placeholder="name@luxignia.com"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Role</label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                >
                  <option value="Curatorial Manager">Curatorial Manager</option>
                  <option value="Sales Concierge">Sales Concierge</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="Warehouse Lead">Warehouse Lead</option>
                  <option value="Finance Controller">Finance Controller</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowInviteModal(false)} className="px-4 py-2 rounded-xl text-slate-600 font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all">Send Invitation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
