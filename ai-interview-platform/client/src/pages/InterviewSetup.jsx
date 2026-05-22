import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, ChevronRight, Briefcase, FileText, Compass, Sparkles, Code } from 'lucide-react';

export default function InterviewSetup({ setGlobalState, setCurrentTab }) {
  const [role, setRole] = useState('Frontend Engineer');
  const [experience, setExperience] = useState('Mid-level (2-5 yrs)');
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [resumeName, setResumeName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [isUploading, setIsUploading] = useState(false);

  const roles = [
    { name: 'Frontend Engineer', icon: Code, desc: 'React, Tailwind, System Architecture, UI performance' },
    { name: 'Backend Engineer', icon: Briefcase, desc: 'APIs, Node.js, SQL databases, System scalability' },
    { name: 'Fullstack Engineer', icon: Compass, desc: 'Full development lifecycle, serverless, client integrations' },
    { name: 'AI / ML Engineer', icon: Sparkles, desc: 'LLMs, Prompt Engineering, Vector dbs, neural architecture' },
  ];

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        setResumeUploaded(true);
        setResumeName(file.name);
        setIsUploading(false);
      }, 1500); // Simulate upload latency
    }
  };

  const handleStartInterview = () => {
    setGlobalState(prev => ({
      ...prev,
      role,
      experience,
      resumeUploaded,
      resumeName,
      jobDescription: jobDescription || 'Standard modern fullstack developer profile',
      difficulty,
    }));
    setCurrentTab('session');
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold font-outfit text-white tracking-tight">
          Configure Your Evaluation Environment
        </h1>
        <p className="text-sm text-slate-400">
          Upload details to calibrate the AI model for hyper-personalized interview prompts.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Side: Setup Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Role Selection */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400 font-outfit">
              1. Target Role Category
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {roles.map((item) => {
                const Icon = item.icon;
                const isSelected = role === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => setRole(item.name)}
                    className={`p-4 rounded-xl text-left border transition-all duration-300 relative overflow-hidden group ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-950/50'
                        : 'bg-slate-900/40 border-indigo-950/40 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'} transition-colors`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-[13px] font-bold text-slate-200 tracking-wide font-outfit">
                        {item.name}
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal font-sans">
                      {item.desc}
                    </p>
                    {isSelected && (
                      <div className="absolute right-2 top-2 w-2 h-2 rounded-full bg-cyan-400"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Job Description */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400 font-outfit">
                2. Job Description context
              </h2>
              <span className="text-[10px] text-slate-500 font-bold uppercase">Optional</span>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste targeted job posting requirements here to dynamically shape active mock scenarios..."
              rows={4}
              className="w-full bg-[#0a0d16]/60 border border-indigo-950/60 focus:border-indigo-500/50 rounded-xl p-4 text-xs font-sans text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
            />
          </div>
        </div>

        {/* Right Side: Resume Uploader & Action Parameters */}
        <div className="space-y-6">
          {/* Resume Upload Module */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400 font-outfit">
              3. Resume Uploader
            </h2>

            <div className="relative border-2 border-dashed border-indigo-950/60 hover:border-indigo-800/40 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-950/30">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {isUploading ? (
                <div className="space-y-3 py-4">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto"></div>
                  <p className="text-[11px] text-slate-400 font-medium">Extracting profile semantics...</p>
                </div>
              ) : resumeUploaded ? (
                <div className="space-y-3 py-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <div>
                    <p className="text-[11px] font-bold text-slate-200 truncate max-w-[200px] mx-auto">
                      {resumeName}
                    </p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                      Successfully Parsed
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 py-2">
                  <UploadCloud className="w-10 h-10 text-indigo-500 mx-auto animate-float" />
                  <div>
                    <p className="text-[12px] font-bold text-slate-300">Drag or Click file</p>
                    <p className="text-[9px] text-slate-500 mt-1 uppercase font-bold tracking-wide">
                      PDF, DOCX up to 5MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Difficulty and Parameters */}
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 font-outfit block">
                Difficulty Calibrator
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`py-1.5 text-[11px] font-bold font-outfit rounded-lg border transition-all ${
                      difficulty === diff
                        ? 'bg-indigo-950/60 border-indigo-500 text-white shadow shadow-indigo-950'
                        : 'bg-slate-900/30 border-slate-900/60 text-slate-500 hover:text-slate-400'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 font-outfit block">
                Experience Level
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-[#0a0d16]/60 border border-indigo-950/60 focus:border-indigo-500/50 rounded-lg py-2 px-3 text-xs font-sans text-slate-300 focus:outline-none"
              >
                <option>Junior-level (0-2 yrs)</option>
                <option>Mid-level (2-5 yrs)</option>
                <option>Senior-level (5-8 yrs)</option>
                <option>Principal/Lead (8+ yrs)</option>
              </select>
            </div>
          </div>

          {/* Start CTA */}
          <button
            onClick={handleStartInterview}
            className="w-full group py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-500/35 transition-all duration-300 flex items-center justify-center space-x-2 relative overflow-hidden"
          >
            <span className="font-outfit text-sm tracking-wider uppercase">Engage System Loop</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}