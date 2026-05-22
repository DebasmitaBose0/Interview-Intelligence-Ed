import React, { useState } from 'react';
import Sidebar from './components/Navbar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import InterviewSetup from './pages/InterviewSetup';
import InterviewSession from './pages/InterviewSession';
import CodingTest from './pages/CodingTest';
import Result from './pages/Result';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [globalState, setGlobalState] = useState({
    role: 'Frontend Engineer',
    experience: 'Mid-level (2-5 yrs)',
    resumeUploaded: false,
    resumeName: '',
    jobDescription: '',
    difficulty: 'Medium',
    userAnswers: [],
    finalCode: '',
    codeRating: '',
    completedTime: '',
  });

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return <Home setCurrentTab={setCurrentTab} />;
      case 'setup':
        return (
          <InterviewSetup
            setGlobalState={setGlobalState}
            setCurrentTab={setCurrentTab}
          />
        );
      case 'session':
        return (
          <InterviewSession
            globalState={globalState}
            setGlobalState={setGlobalState}
            setCurrentTab={setCurrentTab}
          />
        );
      case 'coding':
        return (
          <CodingTest
            globalState={globalState}
            setGlobalState={setGlobalState}
            setCurrentTab={setCurrentTab}
          />
        );
      case 'result':
        return <Result globalState={globalState} setCurrentTab={setCurrentTab} />;
      default:
        return <Home setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#070b13] text-slate-100 font-sans selection:bg-indigo-500/25 selection:text-white">
      {/* Sidebar navigation */}
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main viewport block */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        
        {/* Scrollable page body */}
        <main className="flex-1 overflow-y-auto px-8 py-6 relative z-10">
          <div className="absolute inset-0 bg-[#070b13]/60 -z-10 pointer-events-none"></div>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}