import React, { useState, useEffect } from 'react';
import { Bot, Mic, MicOff, Send, RefreshCw, Volume2, Sparkles, ChevronRight, MessageSquareCode } from 'lucide-react';

const ROLE_QUESTIONS = {
  'Frontend Engineer': [
    "Could you explain how React's reconciliation algorithm (Fiber) differs from the old stack reconciler and how it improves layout responsiveness?",
    "What are your core strategies for optimizing Cumulative Layout Shift (CLS) and Largest Contentful Paint (LCP) in a large-scale single-page application?",
    "How does the CSS containment property (`contain`) impact paint reflow boundaries, and when should you utilize it in compound UI elements?"
  ],
  'Backend Engineer': [
    "How would you design a distributed rate limiter for a multi-tenant API gateway, and what are the trade-offs between Redis Token Bucket and Leaky Bucket?",
    "Can you detail your strategy for handling eventual consistency issues when migrating an monolithic DB transaction to a Saga Pattern orchestrator?",
    "How do you profile and eliminate database lock contention in PostgreSQL under high read-write concurrency scenarios?"
  ],
  'Fullstack Engineer': [
    "Describe the architectural trade-offs between implementing Server-Sent Events (SSE) versus WebSockets for a live system telemetry dashboard.",
    "How do you design a secure token rotation policy for hybrid client applications, and how do you protect cookies against advanced CSS Injection?",
    "Explain how you would optimize a serverless cold-start bottleneck when deploying an API gateway backend backed by a relational database."
  ],
  'AI / ML Engineer': [
    "What are the main performance trade-offs between using FlashAttention-2 vs standard self-attention mechanisms during LLM inference loops?",
    "How do you identify and mitigate semantic drift in production vector embeddings when fine-tuning a retrieval-augmented generation pipeline?",
    "Can you explain the structural differences between LoRA and QLoRA, and how they reduce quantizing overhead during PEFT cycles?"
  ]
};

export default function InterviewSession({ globalState, setGlobalState, setCurrentTab }) {
  const selectedRole = globalState.role || 'Frontend Engineer';
  const questions = ROLE_QUESTIONS[selectedRole] || ROLE_QUESTIONS['Frontend Engineer'];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(true);
  const [userTranscript, setUserTranscript] = useState('');
  const [aiCaptions, setAiCaptions] = useState('');
  const [systemAlert, setSystemAlert] = useState('AI is asking the question...');
  
  const sampleAnswers = {
    'Frontend Engineer': [
      "React Fiber introduces incremental rendering. It splits the reconciliation work into small chunks and spreads them over multiple frames, allowing the main thread to handle user inputs and animations in between, whereas the stack reconciler blocked it completely.",
      "To optimize LCP, I use critical CSS inlining, priority hints for hero images, and CDN edge-routing. For CLS, I ensure explicit aspect-ratios on media, reserve layout slots for dynamic widgets, and avoid inserting dynamic content above existing layouts.",
      "The CSS contain property isolates rendering boundaries. Specifying contain: layout paint tell the engine that child modifications won't affect external geometries, preventing complete document reflow and optimizing scroll and layout performance."
    ],
    'Backend Engineer': [
      "I would use Redis with a Token Bucket algorithm implemented in Lua scripts to maintain atomicity. Token Bucket allows burstiness, while Leaky Bucket smoothens traffic. Lua scripts ensure we avoid concurrent race conditions on keys.",
      "For a Saga Pattern, I prefer orchestrator-based sagas. To handle consistency, we write idempotent transaction handlers and compensation workflows. Outbox pattern ensures event delivery reliability between microservices.",
      "I look for deadlocks via pg_stat_activity, tune lock_timeout parameters, establish strict order indexes for updates, break long transactions into batch operations, and use OPTIMISTIC concurrency where feasible."
    ],
    'Fullstack Engineer': [
      "SSE operates over standard HTTP, making it simpler, auto-reconnecting, and firewall-friendly for unidirectional telemetry. WebSockets are full-duplex over TCP, better suited for interactive chats but requiring custom load balancing.",
      "We use HttpOnly, Secure, and SameSite=Strict cookies to store session refresh tokens. For protection against injection, we sanitize all user input and strictly configure content security policies (CSP) blocking external stylesheet nodes.",
      "I decrease bundle size, use provisioned concurrency for high-traffic nodes, utilize DB connection pooling like Prisma Accelerate or pgBouncer, and pre-warm execution context hooks where possible."
    ],
    'AI / ML Engineer': [
      "FlashAttention-2 eliminates the quadratic latency bottleneck of traditional self-attention by avoiding redundant write/read queries to GPU high-bandwidth memory, utilizing SRAM tiling and online softmax scaling to speed up inference.",
      "We monitor vector spaces using cosine-similarity drift thresholds against baseline datasets. Mitigations include scheduled semantic re-indexing, instruction tuning, and applying adapter weight adjustments.",
      "LoRA injects rank-decomposition matrices into attention layers. QLoRA advances this by quantizing the base model weights to NormalFloat 4-bit (NF4) and introducing double quantization to save valuable model memory footprint."
    ]
  };

  // Simulate AI speaking caption typing
  useEffect(() => {
    setIsAiSpeaking(true);
    setAiCaptions('');
    const fullText = `[AI System]: ${questions[currentIdx]}`;
    let charIdx = 0;
    
    const interval = setInterval(() => {
      if (charIdx < fullText.length) {
        setAiCaptions(prev => prev + fullText.charAt(charIdx));
        charIdx++;
      } else {
        clearInterval(interval);
        setIsAiSpeaking(false);
        setSystemAlert('AI has finished speaking. Please turn on your microphone and respond.');
      }
    }, 15);

    return () => clearInterval(interval);
  }, [currentIdx, selectedRole]);

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setSystemAlert('Listening and transcribing your speech via active voice channel...');
      setUserTranscript('');
      
      // Simulate speech-to-text writing standard answer
      let index = 0;
      const answer = sampleAnswers[selectedRole][currentIdx] || 'Standard candidate evaluation response.';
      const words = answer.split(' ');
      
      const textInterval = setInterval(() => {
        if (index < words.length) {
          setUserTranscript(prev => prev + (prev ? ' ' : '') + words[index]);
          index++;
        } else {
          clearInterval(textInterval);
        }
      }, 250);
      
      // Keep it in session variables so we can destroy if toggled off
      window.speechSim = textInterval;
    } else {
      clearInterval(window.speechSim);
      setIsRecording(false);
      setSystemAlert('Recording paused. Click submit to validate response.');
    }
  };

  const handleAnswerSubmit = () => {
    clearInterval(window.speechSim);
    setIsRecording(false);

    // Save answer into state
    const currentAnswers = [...(globalState.userAnswers || [])];
    currentAnswers[currentIdx] = userTranscript || "The candidate provided an overview of the requested architecture constraints.";
    
    setGlobalState(prev => ({
      ...prev,
      userAnswers: currentAnswers,
    }));

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setUserTranscript('');
    } else {
      // Finished all verbal questions, route to Coding Round!
      setCurrentTab('coding');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-6">
      {/* Session Progress Header */}
      <div className="glass-panel p-4 rounded-xl flex items-center justify-between border-indigo-950/40">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-outfit">
            Assessment Active: <span className="text-indigo-400 font-mono">{selectedRole} Loop</span>
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center space-x-4">
          <span className="text-[11px] font-bold text-slate-400 font-mono">
            {currentIdx + 1} / {questions.length} Questions
          </span>
          <div className="w-32 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-indigo-950/50">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Split Grid Layout */}
      <div className="grid md:grid-cols-5 gap-6">
        
        {/* Left 2 Cols: Futuristic AI Avatar Section */}
        <div className="md:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between items-center relative overflow-hidden min-h-[460px] border-indigo-950/40">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="w-full flex justify-between items-center pb-3 border-b border-indigo-950/20">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest font-outfit">
              Synthetic Agent
            </span>
            <div className="flex items-center space-x-1.5 px-2 py-0.5 bg-indigo-950/30 border border-indigo-900/30 rounded-full">
              <span className={`w-1.5 h-1.5 rounded-full ${isAiSpeaking ? 'bg-cyan-500 animate-pulse' : 'bg-emerald-500'}`}></span>
              <span className="text-[9px] font-bold text-slate-400 font-fira">
                {isAiSpeaking ? 'SPEAKING' : 'LISTENING'}
              </span>
            </div>
          </div>

          {/* Synthetic Avatar Display */}
          <div className="my-auto flex flex-col items-center space-y-6">
            <div className="relative">
              {/* Pulsing visual outline */}
              <div className={`absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-cyan-500/20 rounded-full blur-xl transition-all duration-1000 ${isAiSpeaking ? 'scale-110 opacity-100' : 'scale-95 opacity-60'}`}></div>
              
              <div className={`w-36 h-36 rounded-full bg-slate-950 border-2 ${isAiSpeaking ? 'border-cyan-400 shadow-lg shadow-cyan-500/20' : 'border-indigo-900/60'} flex items-center justify-center relative z-10 transition-all duration-500 overflow-hidden`}>
                {/* Embedded dynamic robotic brain structure representation */}
                <div className={`w-28 h-28 rounded-full bg-slate-900/40 border border-slate-800/40 flex items-center justify-center relative ${isAiSpeaking ? 'animate-pulse' : ''}`}>
                  <Bot className={`w-12 h-12 ${isAiSpeaking ? 'text-cyan-400 scale-105' : 'text-slate-500'} transition-all duration-300`} />
                  
                  {/* Orbiting lights */}
                  <div className={`absolute border border-dashed border-indigo-500/20 w-24 h-24 rounded-full animate-[spin_10s_linear_infinite] ${isAiSpeaking ? 'opacity-100' : 'opacity-20'}`}></div>
                  <div className={`absolute border border-dashed border-cyan-400/30 w-20 h-20 rounded-full animate-[spin_6s_linear_infinite_reverse] ${isAiSpeaking ? 'opacity-100' : 'opacity-20'}`}></div>
                </div>
              </div>
            </div>

            {/* Sound Wave Animation (shown only when AI is speaking or listening) */}
            <div className="h-10 flex items-center justify-center">
              {isRecording ? (
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-red-950/20 border border-red-500/20 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider font-outfit">User voice live</span>
                </div>
              ) : isAiSpeaking ? (
                <div className="flex items-end h-8">
                  <div className="sound-bar"></div>
                  <div className="sound-bar"></div>
                  <div className="sound-bar"></div>
                  <div className="sound-bar"></div>
                  <div className="sound-bar"></div>
                  <div className="sound-bar"></div>
                  <div className="sound-bar"></div>
                </div>
              ) : (
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider font-outfit">Waiting for speech input</span>
              )}
            </div>
          </div>

          {/* Subtitles box */}
          <div className="w-full bg-slate-950/60 border border-indigo-950/40 rounded-xl p-4 min-h-[90px]">
            <p className="text-[11px] leading-relaxed text-slate-400 font-mono">
              {aiCaptions || <span className="text-slate-600 italic">Initializing speech parameters...</span>}
            </p>
          </div>
        </div>

        {/* Right 3 Cols: Active Question and Speech Capture */}
        <div className="md:col-span-3 space-y-6">
          
          {/* Question Display Card */}
          <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-indigo-500 space-y-4">
            <span className="px-2.5 py-0.5 bg-indigo-950/50 border border-indigo-800/40 rounded-md text-[10px] font-bold text-indigo-300 uppercase tracking-widest font-mono">
              Interrogation Point
            </span>
            <h2 className="text-lg font-bold font-outfit text-white leading-relaxed">
              {questions[currentIdx]}
            </h2>
          </div>

          {/* Answer Transcribing Console */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-indigo-950/20">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-outfit">
                Transcript Console
              </h3>
              {userTranscript && (
                <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest font-fira flex items-center space-x-1 animate-pulse">
                  <span>● Live transcribing</span>
                </span>
              )}
            </div>

            <div className="w-full min-h-[140px] bg-slate-950/40 border border-indigo-950/40 rounded-xl p-4 text-xs leading-relaxed text-slate-300 font-sans focus-within:border-indigo-500/40 transition-colors">
              {userTranscript ? (
                userTranscript
              ) : (
                <p className="text-slate-600 italic">
                  No speech signals detected yet. Toggle the audio microphone below and speak your response. Your spoken sentences will dynamically print here.
                </p>
              )}
            </div>

            {/* Status alerts */}
            <div className="text-[10px] text-slate-500 font-medium font-mono text-center">
              STATUS: <span className="text-indigo-400">{systemAlert}</span>
            </div>

            {/* Controls panel */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                onClick={toggleRecording}
                disabled={isAiSpeaking}
                className={`px-5 py-3 rounded-xl font-bold font-outfit text-xs tracking-wider uppercase transition-all duration-300 flex items-center space-x-2 ${
                  isAiSpeaking
                    ? 'bg-slate-900 border border-indigo-950/40 text-slate-600 cursor-not-allowed'
                    : isRecording
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/10'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span>Mute Microphone</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span>Engage Voice Input</span>
                  </>
                )}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setUserTranscript('')}
                  disabled={!userTranscript || isRecording}
                  className={`p-3 rounded-xl border transition-colors ${
                    !userTranscript || isRecording
                      ? 'border-indigo-950/20 text-slate-700 cursor-not-allowed'
                      : 'border-indigo-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleAnswerSubmit}
                  disabled={isAiSpeaking}
                  className={`px-6 py-3 rounded-xl font-bold font-outfit text-xs tracking-wider uppercase transition-all flex items-center space-x-1.5 ${
                    isAiSpeaking
                      ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-indigo-950/40'
                      : 'bg-white hover:bg-slate-100 text-slate-950 shadow-md shadow-white/5'
                  }`}
                >
                  <span>
                    {currentIdx < questions.length - 1 ? 'Next Question' : 'Deploy to Code Round'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}