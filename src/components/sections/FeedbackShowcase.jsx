import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, Filter, ChevronDown, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api'; // Adjust path if needed

const FeedbackShowcase = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get('/surveys/public/list');
      if (response.data.success) {
        setFeedbacks(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch public feedbacks', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    average: feedbacks.length > 0 
      ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1)
      : 0,
    total: feedbacks.length,
    counts: [5, 4, 3, 2, 1].map(star => ({
      star,
      count: feedbacks.filter(f => f.rating === star).length,
      percentage: feedbacks.length > 0 
        ? (feedbacks.filter(f => f.rating === star).length / feedbacks.length) * 100 
        : 0
    }))
  };

  const filteredList = feedbacks.filter(f => 
    filterRating === null || f.rating === filterRating
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = filteredList.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterRating]);

  if (loading && feedbacks.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container-max px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Left Side: Stats (Play Store Style) */}
          <div className="w-full lg:w-1/3 sticky top-24">
            <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Apa Kata Mereka?</h2>
            
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-6 mb-8">
                <div className="text-6xl font-black text-gray-900">{stats.average}</div>
                <div>
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={16} className={s <= Math.round(stats.average) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                    ))}
                  </div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stats.total} ULASAN</div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-3">
                {stats.counts.map(item => (
                  <div key={item.star} className="flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-500 w-3">{item.star}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-yellow-400 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="mt-8 flex flex-wrap gap-2">
              <button 
                onClick={() => setFilterRating(null)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${filterRating === null ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}`}
              >
                Semua
              </button>
              {[5, 4, 3, 2, 1].map(star => (
                <button 
                  key={star}
                  onClick={() => setFilterRating(star)}
                  className={`px-4 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all ${filterRating === star ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}`}
                >
                  {star} <Star size={14} className={filterRating === star ? 'fill-white' : ''} />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: Feedbacks List */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <div className="space-y-6 min-h-[400px]">
              <AnimatePresence mode="popLayout">
                {paginatedList.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={item.id}
                    className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-black text-lg">
                          {item.user_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{item.user_name}</h4>
                          <div className="flex gap-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} size={12} className={s <= item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-100'} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                        {new Date(item.updated_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-gray-600 leading-relaxed text-sm italic">
                      "{item.comment}"
                    </p>

                    {/* Admin Reply */}
                    {item.admin_reply && (
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mt-6 ml-4 md:ml-8 p-6 bg-indigo-50/50 rounded-2xl border-l-4 border-indigo-400 relative"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <User size={14} className="text-indigo-600" />
                          <span className="text-xs font-black text-indigo-900 uppercase tracking-tighter">Balasan dari Admin</span>
                        </div>
                        <p className="text-sm text-indigo-700 font-medium">
                          {item.admin_reply}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
                
                {filteredList.length === 0 && (
                  <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <MessageCircle size={40} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-400 font-bold italic">Belum ada ulasan untuk rating ini.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 py-4 border-t border-gray-100">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-indigo-600 hover:border-indigo-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronDown size={20} className="rotate-90" />
                </button>
                
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-indigo-600 hover:border-indigo-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronDown size={20} className="-rotate-90" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      <style>{`
        .container-max {
          max-width: 1200px;
          margin: 0 auto;
        }
      `}</style>

    </section>
  );
};

export default FeedbackShowcase;
