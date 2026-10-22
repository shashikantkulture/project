// components/crm/modules/WhatsAppModule.jsx
import React, { useState } from 'react';

export default function WhatsAppModule({
  conversations,
  onSendMessage
}) {
  const [selectedConvId, setSelectedConvId] = useState(conversations[0]?.id || '');
  const [messageText, setMessageText] = useState('');

  const activeConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  const templates = [
    { label: 'Order Confirmed', text: 'Namaste. We are delighted to confirm your order #LX-89421. Our foundry has initiated curatorial luster inspection.' },
    { label: 'White-Glove Dispatch', text: 'Your masterpiece is packed in our archival wood vault. Luxignia armored courier is scheduled for delivery.' },
    { label: 'VIP Showroom Invite', text: 'You are cordially invited to our private patron salon previewing new Tuscan bronze castings this Thursday.' },
    { label: 'Cart Concierge', text: 'We noticed you were admiring the Emerald Wave sculpture. Would you like a private video walkthrough with our curator?' }
  ];

  const handleSend = (e) => {
    e.preventDefault();
    if (messageText.trim() && activeConv) {
      onSendMessage(activeConv.id, messageText.trim());
      setMessageText('');
    }
  };

  const handleApplyTemplate = (tmplText) => {
    setMessageText(tmplText);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          WhatsApp & Multi-Channel Communication Desk
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Direct verified WhatsApp Business API, VIP Email folios, and concierge SMS threads.
        </p>
      </div>

      {/* Main Chat Layout */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[680px]">
        {/* Left: Conversations List */}
        <div className="border-r border-slate-100 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
              Patron Threads ({conversations.length})
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              API Live
            </span>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800">
            {conversations.map((conv) => {
              const isSelected = conv.id === selectedConvId;
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 shadow-2xs'
                      : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={conv.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {conv.customerName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          {conv.channel}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {conv.time}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-1">
                    {conv.lastMessage}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Window (2 Cols) */}
        <div className="md:col-span-2 flex flex-col h-full bg-white dark:bg-slate-900">
          {/* Active Chat Header */}
          {activeConv && (
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activeConv.avatar}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-400/20"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {activeConv.customerName}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Verified {activeConv.channel} Client Desk
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  White-Glove Tier
                </span>
              </div>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-slate-50/40 dark:bg-slate-950/20">
            {activeConv?.messages?.map((msg, idx) => {
              const isConcierge = msg.sender === 'concierge';
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isConcierge ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                      isConcierge
                        ? 'bg-blue-600 text-white rounded-br-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.time} {isConcierge && '• Delivered ✓✓'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Templates Bar */}
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto bg-slate-50/50 dark:bg-slate-900/50 scrollbar-none">
            <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">
              Templates:
            </span>
            {templates.map((tmpl, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyTemplate(tmpl.text)}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 whitespace-nowrap transition-colors"
              >
                {tmpl.label}
              </button>
            ))}
          </div>

          {/* Message Composer */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <input
              type="text"
              placeholder={`Send verified ${activeConv?.channel || 'message'} to ${activeConv?.customerName || 'patron'}...`}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800 border-0 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-colors"
            >
              <span className="material-symbols-outlined text-base">send</span>
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
