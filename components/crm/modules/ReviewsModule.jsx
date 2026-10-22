// components/crm/modules/ReviewsModule.jsx
import React, { useState } from 'react';

export default function ReviewsModule({
  reviews,
  onUpdateReviewStatus,
  onReplyReview
}) {
  const [replyingId, setReplyingId] = useState(null);
  const [replyInput, setReplyInput] = useState('');

  const handleReplySubmit = (id) => {
    if (replyInput.trim()) {
      onReplyReview(id, replyInput.trim());
      setReplyingId(null);
      setReplyInput('');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Patron Reviews & Reputation Moderation
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Verified collector testimonials, architectural feedback, and curatorial appreciation responses.
        </p>
      </div>

      {/* Review Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-slate-400">Average Curatorial Rating</div>
          <div className="text-3xl font-extrabold text-amber-500 mt-2 flex items-center gap-1.5 font-mono">
            <span>4.95</span>
            <span className="text-xl text-amber-400">★★★★★</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Based on 142 verified acquisitions</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-slate-400">Positive Sentiment Score</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2 font-mono">
            99.2%
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-semibold">Peerless luxury rating</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-semibold text-slate-400">Curator Response Rate</div>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2 font-mono">
            100%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Every patron personally acknowledged</div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {rev.customer}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                    Verified Patron
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Piece: <span className="font-semibold text-slate-700 dark:text-slate-300">{rev.product}</span> • {rev.date}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-amber-400 text-sm">
                  {'★'.repeat(rev.rating)}
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {rev.rating}.0
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-200 italic leading-relaxed">
              "{rev.text}"
            </p>

            {rev.reply && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-l-4 border-blue-600 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  Curatorial Directorate Reply:
                </span>
                {rev.reply}
              </div>
            )}

            {/* Actions & Inline Reply */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateReviewStatus(rev.id, 'Approved')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                >
                  Approved ✓
                </button>
                <button
                  onClick={() => setReplyingId(replyingId === rev.id ? null : rev.id)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                >
                  {replyingId === rev.id ? 'Cancel Reply' : 'Reply as Curator'}
                </button>
              </div>

              <button
                onClick={() => onUpdateReviewStatus(rev.id, 'Hidden')}
                className="text-slate-400 hover:text-rose-600 text-[11px] font-medium"
              >
                Hide Review
              </button>
            </div>

            {replyingId === rev.id && (
              <div className="pt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Type official curatorial reply..."
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                />
                <button
                  onClick={() => handleReplySubmit(rev.id)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
                >
                  Post Reply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
