import React from 'react';
import { ArrowRight, Bot, Cpu, Code2, LineChart, Sparkles, Terminal, Users } from 'lucide-react';

export default function Home({ setCurrentTab }) {
  const features = [
    {
      icon: Bot,
      title: 'Conversational AI Avatar',
      description: 'Face a realistic synthetic interviewer that reacts in real-time, asks deep follow-up questions, and evaluates speaking clarity.',
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
    },
    {
      icon: Code2,
      title: 'Collaborative Coding Sandbox',
      description: 'Solve complex algorithms inside a simulated IDE while the AI agent dynamically inspects memory leaks, optimizations, and clean code.',
      color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400',
    },
    {
      icon: LineChart,
      title: 'Granular Skill Analytics',
      description: 'Receive multi-dimensional feedback scorecards assessing behavioral style, logic depth, speaking tempo, and exact syntax correctness.',
      color: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30 text-cyan-400',
    },
  ];

  const stats = [
    { value: '98%', label: 'AI Evaluator Accuracy' },
    { value: '14k+', label: 'Mock Sessions Run' },
    { value: '4.9/5', label: 'User Preparation Score' },
    { value: '< 2m', label: 'Report Generation Time' },
  ];

  return (
    <div className="space-y-16 py-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative text-center space-y-6 pt-8">
        {/* Glow behind hero */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/40 border border-indigo-500/25 animate-pulse-fast">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest font-outfit">
            Next-Gen Interview Assessment Engine
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight font-outfit text-white leading-tight">
          Supercharge Your Preparation with <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent text-glow-indigo">
            Futuristic AI mock sessions.
          </span>
        </h1>

        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed font-sans">
          Simulate real job interview settings, perform complex coding tests under live guidance, and instantly unlock comprehensive AI feedback dashboards.
        </p>

        <div className="pt-6 flex justify-center space-x-4">
          <button
            onClick={() => setCurrentTab('setup')}
            className="group px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/40 transition-all duration-300 flex items-center space-x-2 relative overflow-hidden"
          >
            <span className="font-outfit text-sm tracking-wide">Enter Setup Chamber</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          
          <button
            onClick={() => setCurrentTab('result')}
            className="px-8 py-3.5 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white font-bold rounded-xl border border-indigo-950/60 hover:border-indigo-800/40 transition-all duration-300 flex items-center space-x-2"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="font-outfit text-sm tracking-wide">View Analytics Demo</span>
          </button>
        </div>
      </div>

      {/* Stats Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl text-center relative overflow-hidden group hover:border-indigo-500/20 transition-colors duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
            <p className="text-3xl md:text-4xl font-extrabold font-outfit text-white tracking-tight group-hover:scale-105 transition-transform duration-300">
              {stat.value}
            </p>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1.5 font-outfit">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Feature Grid */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold font-outfit text-slate-100">
            Engineered for Comprehensive Readiness
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Our platform does more than ask static questions; it simulates standard hiring loops.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`glass-panel-interactive p-8 rounded-3xl flex flex-col justify-between border-t-2 bg-gradient-to-b ${feature.color.split(' ')[0]} to-transparent`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-slate-900 border border-indigo-950 flex items-center justify-center mb-6`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold font-outfit text-slate-100 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-sans">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-900 flex items-center text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                  <span>System Enabled</span>
                  <span className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA banner block */}
      <div className="glass-panel p-8 md:p-12 rounded-3xl bg-gradient-to-r from-indigo-950/20 via-slate-950/40 to-cyan-950/10 border border-indigo-950/50 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <h3 className="text-xl md:text-2xl font-extrabold font-outfit text-white">
            Ready to test your technical aptitude?
          </h3>
          <p className="text-sm text-slate-400">
            Configure your dream target role (Fullstack, Frontend, AI Engineer) and run a full multi-stage evaluation immediately.
          </p>
        </div>
        <button
          onClick={() => setCurrentTab('setup')}
          className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-xl shadow-lg transition-all duration-300 shrink-0 font-outfit text-sm"
        >
          Initialize Sandbox Session
        </button>
      </div>
    </div>
  );
}