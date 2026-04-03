import React from 'react';
import { TrendingUp, Users, Activity } from 'lucide-react';

export function ThreeDMotionGraphic() {
  return (
    <div className="relative w-full h-[550px] flex items-center justify-center perspective-2000 overflow-visible mt-10">
      {/* Ambient background glow */}
      <div className="absolute w-[500px] h-[500px] bg-primary-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* ── 3D Spinning Root ── */}
      <div className="relative preserve-3d w-[500px] h-[400px] flex items-center justify-center animate-slow-spin">
        
        {/* ── Base Layer: The Main Graph Pane ── */}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-3xl border border-slate-700/50 rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] preserve-3d flex flex-col p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">Growth Trajectory</p>
              <h3 className="text-2xl font-black text-white">Startup MRR</h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-bold">+28.4%</span>
            </div>
          </div>
          
          {/* SVG Animated Line Chart */}
          <div className="flex-1 relative w-full h-full">
            {/* Grid background on the graph plane */}
            <div className="absolute inset-0 border-b border-l border-slate-700/50" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:25%_25%] opacity-20" />
            
            {/* The SVG Line */}
            <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible preserve-3d drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              {/* Smooth startup growth curve */}
              <path 
                d="M0,180 C50,180 80,140 120,130 C160,120 180,150 220,110 C260,70 280,90 320,50 C350,20 380,30 400,10" 
                fill="none" 
                stroke="url(#lineGrad)" 
                strokeWidth="6" 
                strokeLinecap="round" 
                className="animate-draw-line"
                style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
              />
              
              {/* Data Node Points */}
              <circle cx="120" cy="130" r="5" fill="#3b82f6" className="shadow-[0_0_10px_#3b82f6]" />
              <circle cx="220" cy="110" r="5" fill="#3b82f6" className="shadow-[0_0_10px_#3b82f6]" />
              <circle cx="320" cy="50"  r="6" fill="#10b981" className="shadow-[0_0_12px_#10b981]" />
              <circle cx="400" cy="10"  r="8" fill="#10b981" className="shadow-[0_0_20px_#10b981]" />
            </svg>
          </div>
        </div>

        {/* ── Floating Layer 1: Data Connection Lines (Vertical SVG) ── */}
        <div className="absolute inset-0 pointer-events-none preserve-3d">
          {/* Vertical line connecting the graph node to the floating stat card */}
          <div 
            className="absolute bg-gradient-to-t from-primary-500/80 to-transparent w-[2px] h-[100px]"
            style={{ left: '80%', top: '15%', transform: 'translateZ(30px) rotateX(90deg)', transformOrigin: 'bottom' }}
          />
          {/* Vertical line 2 connecting user node */}
          <div 
            className="absolute bg-gradient-to-t from-violet-500/80 to-transparent w-[2px] h-[70px]"
            style={{ left: '30%', top: '65%', transform: 'translateZ(20px) rotateX(90deg)', transformOrigin: 'bottom' }}
          />
        </div>

        {/* ── Floating Layer 2: Metric Card (Active Users) ── */}
        <div 
          className="absolute w-[200px] p-4 bg-slate-800/90 backdrop-blur-xl border border-violet-500/40 rounded-2xl shadow-2xl animate-parallax-float-delayed preserve-3d"
          style={{ transform: 'translateZ(90px)', left: '-10%', top: '50%' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Users</p>
              <p className="text-xl font-black text-white">12,482</p>
            </div>
          </div>
        </div>

        {/* ── Floating Layer 3: Metric Card (MRR Goal Reached) ── */}
        <div 
          className="absolute w-[220px] p-5 bg-slate-900/95 backdrop-blur-2xl border border-emerald-500/40 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] animate-parallax-float preserve-3d"
          style={{ transform: 'translateZ(130px)', right: '-15%', top: '-5%' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-xs font-bold text-slate-200">Milestone Reached</span>
            </div>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-[11px] text-slate-400 font-medium mb-1 uppercase tracking-widest">Current MRR</p>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-primary-400">
              $104K
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
