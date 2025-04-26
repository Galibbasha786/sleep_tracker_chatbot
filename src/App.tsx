import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SleepProvider } from './context/SleepContext';
import { ChatProvider } from './context/ChatContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SleepLogPage from './pages/SleepLogPage';
import AnalysisPage from './pages/AnalysisPage';
import TipsPage from './pages/TipsPage';

function App() {
  return (
    <SleepProvider>
      <ChatProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/sleep-log" element={<SleepLogPage />} />
                <Route path="/analysis" element={<AnalysisPage />} />
                <Route path="/tips" element={<TipsPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </ChatProvider>
    </SleepProvider>
  );
}

export default App;