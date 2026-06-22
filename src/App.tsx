/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from "react";
import { Search, Loader2, Target, Brain, Lightbulb, Zap, TrendingUp, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NeedIdea {
  title: string;
  audience: string;
  problem: string;
  solution: string;
  whyItWorks: string;
  difficulty: "آسان" | "متوسط";
}

export default function App() {
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<NeedIdea[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || "مشکلی در دریافت پاسخ رخ داد.");
      }

      const data = await response.json();
      if (data.needs && Array.isArray(data.needs)) {
        setResults(data.needs);
      } else {
        throw new Error("فرمت اطلاعات دریافتی صحیح نیست.");
      }
    } catch (err: any) {
      setError(err.message || "خطای ناشناخته‌ای رخ داد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#1A1A1A] pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shrink-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
            N
          </div>
          <h1 className="text-lg font-semibold tracking-tight">NEXUS INSIGHT</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
            کشف نیازهای روزمره و پنهان
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            به دنبال یک ایده نرم‌افزاری ساده هستید که مشکلی واقعی را حل کند؟
            حوزه علاقه‌مندی خود را وارد کنید یا فقط دکمه جستجو را بزنید تا هوش مصنوعی به عنوان مشاور رفتاری شما، نیازهای کف بازار را برایتان پیدا کند.
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-12 relative flex">
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="مثال: رستوران‌دارها، تولیدکنندگان محتوا، کارهای منزل..."
              className="w-full h-16 bg-white border border-gray-200 rounded-2xl pr-14 pl-32 text-lg focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 shadow-sm disabled:opacity-70"
              disabled={loading}
            />
            <Search className="absolute right-5 top-5 w-6 h-6 text-gray-400" />
            <button
              type="submit"
              disabled={loading}
              className="absolute left-3 top-3 bg-blue-600 text-white px-6 h-10 rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <span>تحلیل</span>
              )}
            </button>
          </form>
        </div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-3"
            >
              <AlertCircle size={20} />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-5 bg-gray-100 rounded"></div>
                  <div className="w-20 h-4 bg-gray-50 rounded"></div>
                </div>
                <div className="h-6 bg-gray-100 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-gray-50 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-50 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-50 rounded w-5/6 mb-6"></div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {!loading && results && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid lg:grid-cols-2 gap-6 items-start"
            >
              {results.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                      سختی: {item.difficulty}
                    </span>
                    <span className="text-xs font-mono text-gray-400">
                      مخاطب: {item.audience}
                    </span>
                  </div>

                  <h4 className="text-xl font-semibold mb-3 text-[#1A1A1A]">
                    {item.title}
                  </h4>

                  <div className="space-y-4 flex-1">
                    <div>
                      <h5 className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">مشکل کجاست؟</h5>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {item.problem}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">راهکار ساده</h5>
                      <p className="text-sm text-[#1A1A1A] font-medium leading-relaxed">
                        {item.solution}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">چرا جواب می‌دهد؟</h5>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {item.whyItWorks}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Empty State placeholder if not loading and no results */}
        {!loading && !results && !error && (
          <div className="text-center py-20 opacity-50 flex flex-col items-center justify-center">
            <Zap size={48} className="text-slate-300 mb-4" />
            <p className="text-slate-500">برای شروع کشف نیازها، جستجو کنید.</p>
          </div>
        )}
      </main>
    </div>
  );
}
