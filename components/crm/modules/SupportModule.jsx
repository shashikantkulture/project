// components/crm/modules/SupportModule.jsx
import React, { useState } from 'react';

export default function SupportModule({
  tickets,
  onUpdateTicketStatus,
  onReplyTicket
}) {
  const [selectedTicket, setSelectedTicket] = useState(tickets[0] || null);
  const [replyText, setReplyText] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus === 'All') return true;
    return t.status === filterStatus;
  });

  const handleSendReply = (e) => {
    e.preventDefault();
    if (replyText.trim() && selectedTicket) {
      onReplyTicket(selectedTicket.id, replyText.trim());
      setReplyText('');
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'VIP':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 font-extrabold';
      case 'High':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 font-bold';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium';
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Support Desk & Curatorial SLA
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Bespoke restoration inquiries, installation engineering, and private patron service tickets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Open', 'In Progress', 'Waiting', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Ticket List + Thread View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List (1 Col) */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] p-4 space-y-3 h-[640px] overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            Active Tickets ({filteredTickets.length})
          </div>

          {filteredTickets.map((ticket) => {
            const isSelected = selectedTicket?.id === ticket.id;
            return (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 shadow-2xs'
                    : 'bg-slate-50/50 dark:bg-slate-800/40 border-transparent hover:border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    {ticket.ticketNumber}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] ${getPriorityBadge(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {ticket.subject}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  <span>{ticket.customer}</span>
                  <span className="font-medium text-amber-600">{ticket.slaTarget}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ticket Detail / Thread View (2 Cols) */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[640px] overflow-hidden">
          {selectedTicket ? (
            <>
              {/* Thread Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-600 dark:text-blue-400">
                      {selectedTicket.ticketNumber}
                    </span>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      {selectedTicket.subject}
                    </h2>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Patron: <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedTicket.customer}</span> ({selectedTicket.email}) • Assigned to: {selectedTicket.assignedAgent}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => onUpdateTicketStatus(selectedTicket.id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Waiting">Waiting</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/40 dark:bg-slate-950/20">
                {selectedTicket.messages?.map((msg, idx) => {
                  const isAgent = msg.type === 'agent';
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[10px] text-slate-400 mb-1 px-1">
                        {msg.sender} • {msg.time}
                      </div>
                      <div
                        className={`max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                          isAgent
                            ? 'bg-blue-600 text-white rounded-br-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type official curatorial resolution reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800 border-0 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
                >
                  Reply & Update
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-xs">
              Select a ticket to inspect communication timeline
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
