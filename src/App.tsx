/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, 
  MapPin, 
  Wallet, 
  Calendar, 
  Compass, 
  Sparkles, 
  Loader2, 
  ChevronRight,
  Palmtree,
  Building2,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { generateTravelPlan } from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<{ text: string; groundingChunks: any[] } | null>(null);
  const [budget, setBudget] = useState<number>(5000);
  const [days, setDays] = useState<number>(3);
  const [preference, setPreference] = useState<number>(50); // 0: Nature, 100: Cultural
  const [destination, setDestination] = useState('');
  const [startCity, setStartCity] = useState('');
  
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPlan(null);
    
    try {
      const prefText = preference < 40 ? "偏向自然风景" : preference > 60 ? "偏向人文体验" : "自然与人文均衡";
      const result = await generateTravelPlan({
        budget,
        days,
        preference: prefText,
        destination: destination.trim() || undefined,
        startCity: startCity.trim() || undefined
      });
      setPlan(result);
      
      // Scroll to result after a short delay to allow rendering
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error("Failed to generate plan:", error);
      alert("生成计划失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] font-sans selection:bg-emerald-100">
      {/* Hero Section */}
      <header className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000" 
            alt="Travel Background" 
            className="w-full h-full object-cover brightness-75"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#f8f9fa]" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium mb-6">
              <Sparkles className="w-3 h-3" />
              <span>AI 驱动的智能旅行规划</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              探索您的下一次 <br />
              <span className="text-emerald-400">完美旅程</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light">
              只需输入您的预算和偏好，让我们的 AI Agent 为您打造独一无二的旅行体验。
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 -mt-24 relative z-20 pb-24">
        {/* Input Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl shadow-black/5 p-8 md:p-12 border border-black/5"
        >
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                起点城市
              </label>
              <input 
                type="text" 
                placeholder="例如：北京、上海..."
                value={startCity}
                onChange={(e) => setStartCity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                目的地 (可选)
              </label>
              <input 
                type="text" 
                placeholder="例如：大理、京都..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                <Wallet className="w-4 h-4" />
                预算 (CNY)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">¥</span>
                <input 
                  type="number" 
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                旅行天数
              </label>
              <select 
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 outline-none transition-all appearance-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 10, 14].map(d => (
                  <option key={d} value={d}>{d} 天</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    规划中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    开始规划
                  </>
                )}
              </button>
            </div>

            <div className="md:col-span-2 lg:col-span-5 space-y-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  旅行偏好
                </label>
                <div className="flex gap-8 text-xs font-bold">
                  <span className={cn(preference < 40 ? "text-emerald-600" : "text-gray-400")}>自然风景</span>
                  <span className={cn(preference >= 40 && preference <= 60 ? "text-emerald-600" : "text-gray-400")}>均衡体验</span>
                  <span className={cn(preference > 60 ? "text-emerald-600" : "text-gray-400")}>人文历史</span>
                </div>
              </div>
              <div className="relative h-12 flex items-center">
                <div className="absolute inset-0 flex items-center pointer-events-none">
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-300" 
                      style={{ width: `${preference}%` }}
                    />
                  </div>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={preference}
                  onChange={(e) => setPreference(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div 
                  className="absolute w-6 h-6 bg-white border-2 border-emerald-500 rounded-full shadow-md pointer-events-none transition-all duration-150"
                  style={{ left: `calc(${preference}% - 12px)` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                <div className="flex items-center gap-1"><Palmtree className="w-3 h-3" /> NATURE</div>
                <div className="flex items-center gap-1">CULTURE <Building2 className="w-3 h-3" /></div>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Results Section */}
        <div ref={resultRef} className="mt-12">
          <AnimatePresence mode="wait">
            {plan ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    您的定制行程
                  </h2>
                  <button 
                    onClick={() => window.print()}
                    className="text-sm font-medium text-gray-500 hover:text-emerald-600 flex items-center gap-1 transition-colors"
                  >
                    保存计划 <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <div className="lg:col-span-2 bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-black/5 prose prose-emerald max-w-none overflow-x-auto">
                    <Markdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ node, ...props }) => (
                          <a 
                            {...props} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-emerald-600 hover:underline inline-flex items-center gap-1"
                          >
                            {props.children}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )
                      }}
                    >
                      {plan.text}
                    </Markdown>
                  </div>

                  {/* Sidebar / Grounding Info */}
                  <div className="space-y-6">
                    <div className="bg-emerald-900 text-white rounded-3xl p-8 shadow-lg shadow-emerald-900/20">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Wallet className="w-5 h-5" />
                        预算概览
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-white/10">
                          <span className="text-white/60 text-sm">总预算</span>
                          <span className="text-2xl font-bold">¥{budget}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white/60">平均每日</span>
                          <span className="font-medium">¥{Math.round(budget / days)}</span>
                        </div>
                        <p className="text-xs text-white/40 italic mt-4">
                          * 价格基于实时搜索结果预估，实际可能有所变动。
                        </p>
                      </div>
                    </div>

                    {plan.groundingChunks && plan.groundingChunks.length > 0 && (
                      <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-emerald-600" />
                          相关地点
                        </h3>
                        <div className="space-y-3">
                          {plan.groundingChunks.map((chunk: any, idx: number) => {
                            const mapUri = chunk.maps?.uri;
                            const title = chunk.maps?.title;
                            if (!mapUri) return null;
                            return (
                              <a 
                                key={idx}
                                href={mapUri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 transition-all group border border-transparent hover:border-emerald-100"
                              >
                                <span className="text-sm font-medium truncate pr-4">{title || '查看地图'}</span>
                                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : loading ? (
              <div className="py-24 text-center space-y-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Plane className="w-8 h-8 text-emerald-500 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-800">正在为您规划旅程...</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    我们正在搜索实时价格、景点信息并结合您的偏好进行深度计算。
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-24 text-center border-2 border-dashed border-gray-200 rounded-3xl">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Compass className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-400">填写上方信息，开启您的 AI 旅行规划</h3>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">V</div>
            <span className="font-bold tracking-tight">VoyageAI</span>
          </div>
          <p className="text-sm text-gray-400">
            © 2026 VoyageAI. 基于 Google Gemini 强力驱动。
          </p>
          <div className="flex gap-6 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-emerald-600 transition-colors">隐私政策</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">服务条款</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
