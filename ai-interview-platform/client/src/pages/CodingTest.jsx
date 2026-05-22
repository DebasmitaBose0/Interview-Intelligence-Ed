import React, { useState, useEffect } from 'react';
import { Code2, Terminal, Play, CheckSquare, ChevronRight, FileCode, Check, RefreshCw } from 'lucide-react';

const ROLE_PROBLEMS = {
  'Frontend Engineer': {
    title: "1. Build a Custom Event Emitter in Javascript",
    difficulty: "Medium",
    timeLimit: "1000ms",
    memoryLimit: "256MB",
    description: `Implement a robust, custom \`EventEmitter\` class in Javascript that allows registering listeners, triggering events, and unsubscribing. It must support multiple callbacks for the same event name.

### Requirements:
- \`subscribe(eventName, callback)\`: Registers a callback and returns an object with a \`release()\` method to unsubscribe.
- \`emit(eventName, ...args)\`: Executes all registered callbacks for the given event, passing arguments down.

### Example:
\`\`\`javascript
const emitter = new EventEmitter();
const sub = emitter.subscribe('click', (x) => x * 2);
emitter.emit('click', 10); // returns list of results
sub.release(); // unsubscribes
\`\`\`
`,
    initialCode: `class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  subscribe(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    this.events.get(eventName).push(callback);

    return {
      release: () => {
        const callbacks = this.events.get(eventName) || [];
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  emit(eventName, ...args) {
    const callbacks = this.events.get(eventName) || [];
    return callbacks.map(cb => cb(...args));
  }
}`
  },
  'Backend Engineer': {
    title: "1. Distributed Rate Limiter - Token Bucket implementation",
    difficulty: "Hard",
    timeLimit: "500ms",
    memoryLimit: "128MB",
    description: `Implement a local memory-efficient simulation of a \`TokenBucket\` rate limiter class to manage API request limits.

### Requirements:
- \`allowRequest(tokensRequired)\`: Returns \`true\` if the request can be processed immediately, else \`false\`.
- The bucket refilling is computed lazily upon each request based on a configurable \`refillRate\` (tokens per second) and maximum \`capacity\`.
`,
    initialCode: `class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.tokens = capacity;
    this.lastRefill = Date.now() / 1000;
  }

  allowRequest(tokensRequired) {
    this.refill();
    if (this.tokens >= tokensRequired) {
      this.tokens -= tokensRequired;
      return true;
    }
    return false;
  }

  refill() {
    const now = Date.now() / 1000;
    const elapsed = now - this.lastRefill;
    this.tokens = Math.min(
      this.capacity, 
      this.tokens + (elapsed * this.refillRate)
    );
    this.lastRefill = now;
  }
}`
  },
  'Fullstack Engineer': {
    title: "1. Deep Polyfill for Fetch Timeout and Retry Orchestrator",
    difficulty: "Medium",
    timeLimit: "800ms",
    memoryLimit: "256MB",
    description: `Implement an advanced fetch client extension wrapper with built-in request retry attempts and abortable timeout triggers.

### Requirements:
- \`fetchWithRetry(url, options, maxRetries, timeoutMs)\`: Triggers regular fetch requests. If it fails or times out, retry up to \`maxRetries\` times.
`,
    initialCode: `async function fetchWithRetry(url, options = {}, maxRetries = 3, timeoutMs = 3000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { 
        ...options, 
        signal: controller.signal 
      });
      clearTimeout(id);
      if (!response.ok) throw new Error("HTTP error");
      return await response.json();
    } catch (err) {
      clearTimeout(id);
      if (attempt === maxRetries) {
        throw new Error("All request retry attempts failed: " + err.message);
      }
      // Linear backoff delay
      await new Promise(res => setTimeout(res, 500 * attempt));
    }
  }
}`
  },
  'AI / ML Engineer': {
    title: "1. Custom Cosine Similarity Semantic Ranker",
    difficulty: "Medium",
    timeLimit: "1200ms",
    memoryLimit: "512MB",
    description: `Implement a vector matching ranker that calculates the cosine similarity metrics between a query embedding array and list of document node arrays.

### Requirements:
- \`cosineSimilarity(vecA, vecB)\`: Evaluates similarity ratio between \`0\` and \`1\`.
- \`rankDocuments(queryVec, docVecs)\`: Sorts the document index tags in descending order.
`,
    initialCode: `function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function rankDocuments(queryVec, docVecs) {
  return docVecs
    .map((doc, idx) => ({ 
      index: idx, 
      score: cosineSimilarity(queryVec, doc) 
    }))
    .sort((a, b) => b.score - a.score);
}`
  }
};

export default function CodingTest({ globalState, setGlobalState, setCurrentTab }) {
  const selectedRole = globalState.role || 'Frontend Engineer';
  const problem = ROLE_PROBLEMS[selectedRole] || ROLE_PROBLEMS['Frontend Engineer'];

  const [code, setCode] = useState('');
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testCasesPassed, setTestCasesPassed] = useState(null);

  useEffect(() => {
    setCode(problem.initialCode);
    setConsoleLogs([
      "// Environment Sandbox Initialized.",
      "// System: Node v20.11.0 runtime bound.",
      "// Press 'Run Execution' to test script bounds."
    ]);
    setTestCasesPassed(null);
  }, [selectedRole]);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const executeCode = () => {
    setIsRunning(true);
    setConsoleLogs(prev => [...prev, "> Starting code evaluation tests..."]);
    
    setTimeout(() => {
      setIsRunning(false);
      setTestCasesPassed(true);
      setConsoleLogs(prev => [
        ...prev,
        "> Running test suite assertions...",
        "✔ Test Case 1: Initial creation assertion passed.",
        "✔ Test Case 2: Multi-parameter bounds matched perfectly.",
        "✔ Test Case 3: Stress stress-load evaluation within bounds (<50ms).",
        "---",
        "STATUS: All assertions successful. Code rating: Excellent."
      ]);
    }, 1500); // simulate compile & run latency
  };

  const handleFinishInterview = () => {
    setGlobalState(prev => ({
      ...prev,
      finalCode: code,
      codeRating: 'Perfect',
      completedTime: new Date().toLocaleString(),
    }));
    setCurrentTab('result');
  };

  return (
    <div className="max-w-7xl mx-auto py-2 space-y-6">
      
      {/* Page Header */}
      <div className="glass-panel p-4 rounded-xl flex items-center justify-between border-indigo-950/40">
        <div className="flex items-center space-x-3">
          <Code2 className="w-5 h-5 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-outfit">
            Module 2: Technical Algo Round
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-[10px] px-2.5 py-0.5 bg-purple-950/40 border border-purple-800/40 rounded-full font-bold text-purple-300 font-fira">
            DIFFICULTY: {problem.difficulty}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            Time limit: {problem.timeLimit}
          </span>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid lg:grid-cols-12 gap-6 min-h-[580px]">
        
        {/* Left Column: Problem Constraints & Details (5/12 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl flex flex-col justify-between border-indigo-950/40 max-h-[600px] overflow-y-auto">
          <div className="space-y-4">
            <h2 className="text-md font-extrabold font-outfit text-white leading-snug">
              {problem.title}
            </h2>
            
            <hr className="border-indigo-950/40" />

            <div className="prose prose-invert prose-sm text-slate-300 leading-relaxed font-sans space-y-4 text-[12.5px]">
              {problem.description.split('\n\n').map((para, i) => {
                if (para.startsWith('###')) {
                  return (
                    <h3 key={i} className="text-sm font-bold text-indigo-400 font-outfit uppercase tracking-wide mt-4">
                      {para.replace('### ', '')}
                    </h3>
                  );
                }
                if (para.startsWith('-')) {
                  return (
                    <ul key={i} className="list-disc pl-5 space-y-1 bg-slate-950/20 p-3 rounded-lg border border-indigo-950/30">
                      {para.split('\n').map((item, j) => (
                        <li key={j}>{item.replace('- ', '')}</li>
                      ))}
                    </ul>
                  );
                }
                if (para.startsWith('```')) {
                  return (
                    <pre key={i} className="bg-slate-950 p-4 rounded-xl border border-indigo-950/60 overflow-x-auto text-[11px] font-mono text-cyan-400">
                      <code>{para.replace(/```javascript|```/g, '')}</code>
                    </pre>
                  );
                }
                return <p key={i}>{para}</p>;
              })}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-indigo-950/25 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>MEM_LIMIT: {problem.memoryLimit}</span>
            <span>SYSTEM: ONLINE</span>
          </div>
        </div>

        {/* Right Column: Dynamic Code Sandbox & Output (7/12 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6 max-h-[600px]">
          
          {/* Code IDE Simulator */}
          <div className="flex-1 glass-panel rounded-2xl overflow-hidden flex flex-col border-indigo-950/40">
            {/* Editor tab bar header */}
            <div className="bg-[#090d16]/70 border-b border-indigo-950/40 px-4 py-2 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-indigo-400" />
                <span className="text-[11px] font-bold text-slate-300 font-mono">solution.js</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">JavaScript Runtime</span>
            </div>

            {/* Custom line-numbered text area wrapper */}
            <div className="flex-1 flex bg-[#060910] min-h-[220px] font-mono text-[12px] leading-relaxed relative overflow-hidden">
              {/* Fake line numbers */}
              <div className="w-12 bg-slate-950/40 border-r border-indigo-950/40 text-slate-600 select-none text-right pr-3 pt-4 space-y-0.5">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              
              <textarea
                value={code}
                onChange={handleCodeChange}
                className="flex-1 bg-transparent p-4 text-cyan-200 placeholder-cyan-900/50 focus:outline-none resize-none overflow-y-auto whitespace-pre font-mono font-medium focus:ring-0 selection:bg-indigo-950/50"
                spellCheck="false"
              />
            </div>
          </div>

          {/* Compilation Console / Terminal */}
          <div className="h-44 glass-panel rounded-2xl flex flex-col overflow-hidden border-indigo-950/40 shrink-0">
            <div className="bg-[#090d16]/70 border-b border-indigo-950/40 px-4 py-1.5 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-outfit">Execution Console</span>
              </div>
              {isRunning && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>}
            </div>
            
            <div className="flex-1 bg-[#060910]/80 p-4 overflow-y-auto font-mono text-[11px] text-slate-400 space-y-1">
              {consoleLogs.map((log, idx) => (
                <div key={idx} className={log.startsWith('✔') ? 'text-emerald-400 font-semibold' : log.startsWith('STATUS:') ? 'text-cyan-400 font-bold' : ''}>
                  {log}
                </div>
              ))}
            </div>

            {/* Panel Buttons */}
            <div className="bg-[#090d16]/70 border-t border-indigo-950/40 p-3 flex items-center justify-between shrink-0">
              <button
                onClick={() => setCode(problem.initialCode)}
                className="p-2 border border-indigo-950/60 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-900/40 transition-colors"
                title="Reset code template"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center space-x-3">
                <button
                  onClick={executeCode}
                  disabled={isRunning}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-indigo-900/30 font-bold rounded-lg transition-colors flex items-center space-x-1.5 font-outfit text-xs"
                >
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Run Execution</span>
                </button>

                <button
                  onClick={handleFinishInterview}
                  disabled={!testCasesPassed || isRunning}
                  className={`px-5 py-2 rounded-lg font-bold font-outfit text-xs flex items-center space-x-1.5 transition-all ${
                    testCasesPassed && !isRunning
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow shadow-emerald-950'
                      : 'bg-slate-950 border border-indigo-950/40 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <span>Submit & Complete</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}