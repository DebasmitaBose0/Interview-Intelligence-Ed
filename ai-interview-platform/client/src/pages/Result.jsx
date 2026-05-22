import React, { useState } from 'react';
import { Award, Download, CheckCircle, RefreshCw, ChevronDown, ChevronUp, Star, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';

export default function Result({ globalState, setCurrentTab }) {
  const selectedRole = globalState.role || 'Frontend Engineer';
  const experience = globalState.experience || 'Mid-level (2-5 yrs)';
  
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  // Default parameters
  const scoreBreakdowns = [
    { name: 'Core Syntax Correctness', value: 92, color: 'bg-emerald-500' },
    { name: 'System Scalability', value: 85, color: 'bg-indigo-500' },
    { name: 'Behavioral Communication', value: 88, color: 'bg-cyan-500' },
    { name: 'Complexity Optimization', value: 90, color: 'bg-purple-500' },
  ];

  const overallScore = 89;

  const feedbacks = {
    'Frontend Engineer': [
      "Demonstrated outstanding grasp of React Fiber scheduling. The conceptualization of split render bounds is technically correct.",
      "Clear strategy on CLS/LCP parameters. Mention of critical CSS injection showed strong production familiarity.",
      "The custom event emitter design was complete, handle-allocated memory carefully, and avoided leaks on unsubscribing."
    ],
    'Backend Engineer': [
      "Excellent technical articulation of distributed rate-limiting. Redis Lua-script selection is highly optimal.",
      "Robust outline of Saga Pattern orchestration constraints and idempotent transactions.",
      "Demonstrated sound lock-timeout optimization guidelines under highly concurrent read/write locks."
    ],
    'Fullstack Engineer': [
      "Excellent summary of unidirectional telemetry limitations via SSE compared to bi-directional WebSockets.",
      "Thorough understanding of security models, refresh token cookies, and CSRF/CSS-injection vector shields.",
      "Optimal serverless database execution bottleneck resolution strategies."
    ],
    'AI / ML Engineer': [
      "Deeply articulated FlashAttention-2 memory savings. Showed thorough grasp of deep transformer performance parameters.",
      "Excellent guidelines for vector semantic drift triggers and adaptive instruction tuning.",
      "Perfect differentiation of rank matrices in LoRA vs NF4 quantization algorithms in QLoRA."
    ]
  };

  const currentFeedbacks = feedbacks[selectedRole] || feedbacks['Frontend Engineer'];

  const handleDownload = () => {
    setDownloading(true);
    setDownloaded(false);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      // Simulate real browser download by creating temporary anchor node
      const blob = new Blob([
        `AI INTERVIEW PERFORMANCE SUMMARY\n\n` +
        `Candidate: Soumadeep Dev\n` +
        `Target Role: ${selectedRole}\n` +
        `Experience level: ${experience}\n` +
        `Overall Score: ${overallScore}%\n\n` +
        `Score breakdown:\n` +
        `- Core Syntax Correctness: 92%\n` +
        `- System Scalability: 85%\n` +
        `- Behavioral Communication: 88%\n` +
        `- Complexity Optimization: 90%\n\n` +
        `AI Evaluation Summary:\n` +
        currentFeedbacks.map((f, i) => `${i + 1}. ${f}`).join('\n')
      ], { type: 'text/plain' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `camsense_ai_report_${selectedRole.toLowerCase().replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, 2000); // Simulate high-tech report rendering duration
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-10">
      
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold font-outfit text-white tracking-tight">
          Performance Analytics Chamber
        </h1>
        <p className="text-sm text-slate-400">
          Telemetry insights extracted dynamically from your speech responses and algorithms.
        </p>
      </div>

      {/* Grid: Left - Scorecard, Right - Category Breakdowns */}
      <div className="grid md:grid-cols-5 gap-8">
        
        {/* Overall Score Card (2/5 cols) */}
        <div className="md:col-span-2 glass-panel p-8 rounded-3xl text-center relative overflow-hidden flex flex-col justify-between border-indigo-950/40">
          {/* Neon Top border glowing representation */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500"></div>
          
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-outfit">
              Composite Grading Score
            </span>
            
            <div className="relative inline-flex items-center justify-center">
              {/* Outer pulsing glow */}
              <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-xl animate-pulse"></div>
              
              {/* Dial design representation */}
              <div className="w-40 h-40 rounded-full bg-[#060910] border-4 border-indigo-950 flex flex-col items-center justify-center relative z-10">
                <span className="text-5xl font-extrabold font-outfit text-white leading-none tracking-tighter">
                  {overallScore}%
                </span>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-2 font-mono">
                  Grade A
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <p className="text-sm font-bold text-slate-200 font-outfit">Exceeds Hiring Bar</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal font-sans">
                Your architectural insights qualify you above the standard baseline index for a {selectedRole} role.
              </p>
            </div>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className={`w-full group py-3 rounded-xl font-bold font-outfit text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-2 ${
                downloading
                  ? 'bg-indigo-950/60 border border-indigo-900/30 text-indigo-400'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow shadow-indigo-600/15 hover:shadow-indigo-500/30'
              }`}
            >
              {downloading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Compiling PDF Telemetry...</span>
                </>
              ) : downloaded ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Report Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Export System PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Skill Analytics Matrix (3/5 cols) */}
        <div className="md:col-span-3 glass-panel p-8 rounded-3xl space-y-6 border-indigo-950/40">
          <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400 font-outfit">
            Aptitude Matrix Breakdown
          </h2>

          <div className="space-y-4">
            {scoreBreakdowns.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300 font-outfit">{item.name}</span>
                  <span className="text-slate-400 font-mono font-bold">{item.value}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-indigo-950/50">
                  {/* Sliding animated bars */}
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-indigo-950/20 border border-indigo-900/30 rounded-xl flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-indigo-300 font-outfit uppercase tracking-wider">
                Recommendation Node
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1 font-sans">
                Your memory limits were outstanding, but verbal phrasing could be refined for optimal design team synchronization under pressure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Qualitative Feedback Modules */}
      <div className="glass-panel p-6 rounded-3xl space-y-6 border-indigo-950/40">
        <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400 font-outfit">
          AI Subjective Evaluation Log
        </h2>

        <div className="space-y-4">
          {currentFeedbacks.map((feedback, idx) => (
            <div key={idx} className="flex items-start space-x-3.5 p-4 bg-slate-950/40 border border-slate-900 rounded-2xl">
              <div className="w-7 h-7 bg-indigo-950 border border-indigo-900/50 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-400 font-mono">
                0{idx + 1}
              </div>
              <p className="text-[12.5px] leading-relaxed text-slate-300 font-sans">
                {feedback}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Transcript Toggle */}
      <div className="glass-panel rounded-3xl overflow-hidden border-indigo-950/40">
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-900/20 transition-colors"
        >
          <div className="flex items-center space-x-2.5">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-outfit">
              Verbal Transcript & Evaluation Timeline
            </span>
          </div>
          {showTranscript ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showTranscript && (
          <div className="p-6 bg-[#060910]/40 border-t border-indigo-950/40 space-y-4 font-mono text-[11.5px] leading-relaxed text-slate-400">
            <div className="space-y-1">
              <span className="text-cyan-400 font-bold uppercase">[AI Agent]</span>
              <p className="text-slate-300 font-sans">
                "Could you explain how React's reconciliation algorithm (Fiber) differs from the old stack reconciler?"
              </p>
            </div>
            <div className="space-y-1 pl-4 border-l-2 border-indigo-900/40">
              <span className="text-indigo-400 font-bold uppercase">[Candidate Response]</span>
              <p className="text-slate-300 font-sans">
                "React Fiber introduces incremental rendering. It splits the reconciliation work into small chunks and spreads them over multiple frames..."
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-cyan-400 font-bold uppercase">[AI Agent]</span>
              <p className="text-slate-300 font-sans">
                "How would you design a distributed rate limiter for a multi-tenant API gateway?"
              </p>
            </div>
            <div className="space-y-1 pl-4 border-l-2 border-indigo-900/40">
              <span className="text-indigo-400 font-bold uppercase">[Candidate Response]</span>
              <p className="text-slate-300 font-sans">
                "I would use Redis with a Token Bucket algorithm implemented in Lua scripts to maintain atomicity and avoid race conditions on keys."
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Restart action */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => setCurrentTab('setup')}
          className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold rounded-xl border border-indigo-950 hover:border-indigo-800/40 transition-all duration-300 flex items-center space-x-2 font-outfit text-sm"
        >
          <RefreshCw className="w-4 h-4 text-cyan-400" />
          <span>Launch New Session Chamber</span>
        </button>
      </div>
      
    </div>
  );
}