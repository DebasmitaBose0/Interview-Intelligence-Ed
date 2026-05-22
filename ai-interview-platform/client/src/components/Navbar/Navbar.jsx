import React from 'react';
import { Shield, Sparkles, Activity, HelpCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="h-16 border-b border-indigo-950/30 bg-[#070b13]/40 backdrop-blur-md flex items-center justify-between px-8 relative z-10">
      <div className="flex items-center space-x-6">
        {/* Core System Status */}
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest font-outfit">
            System Telemetry
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 bg-indigo-950/40 border border-indigo-900/30 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-[10px] font-medium text-slate-400">HOST: LOCALHOST:5000</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Model Identifier Chip */}
        <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-indigo-900/30 rounded-lg">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[10px] font-bold text-indigo-200 tracking-wider font-fira">

          </span>
        </div>

        {/* Latency Meter */}
        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 bg-slate-900/40 border border-slate-800/30 rounded-lg">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-outfit">
            LATENCY: <span className="text-cyan-400">42 ms</span>
          </span>
        </div>

        <button className="p-1.5 rounded-lg hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 transition-colors">
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
