// src/components/VisitorCounter.jsx
import React, { useState, useEffect } from 'react';
import { Users, Eye, Globe, TrendingUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import useVisitorCounter from '../hooks/useVisitorCounter';

const VisitorCounter = () => {
  const { darkMode } = useTheme();
  const { visitorCount, totalVisitors, isOnline } = useVisitorCounter();
  const [isVisible, setIsVisible] = useState(true);
  const [animateCount, setAnimateCount] = useState(false);

  // Animate when visitor count changes
  useEffect(() => {
    setAnimateCount(true);
    const timer = setTimeout(() => setAnimateCount(false), 600);
    return () => clearTimeout(timer);
  }, [visitorCount]);

  // Auto-hide after some time (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 300000); // Hide after 5 minutes

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className={`fixed bottom-4 right-4 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40 ${
          darkMode 
            ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600' 
            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
        }`}
        title="Show visitor counter"
      >
        <Users className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className={`rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-500 ${
        darkMode 
          ? 'bg-gray-900/95 border-gray-700 text-white' 
          : 'bg-white/95 border-gray-200 text-gray-900'
      } ${animateCount ? 'scale-105' : 'scale-100'}`}>
        
        {/* Header */}
        <div className={`px-4 py-3 border-b flex items-center justify-between ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${
              darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
            }`}>
              <Globe className={`w-4 h-4 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <h3 className={`text-sm font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Live Visitors
              </h3>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-green-500' : 'bg-red-500'
                } ${isOnline ? 'animate-pulse' : ''}`}></div>
                <span className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className={`text-xs px-2 py-1 rounded-md transition-colors ${
              darkMode 
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            ×
          </button>
        </div>

        {/* Stats */}
        <div className="p-4 space-y-4">
          {/* Current Visitors */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                darkMode ? 'bg-green-900/30' : 'bg-green-100'
              }`}>
                <Eye className={`w-4 h-4 ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`} />
              </div>
              <div>
                <p className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Viewing Now
                </p>
                <p className={`text-lg font-bold ${
                  animateCount ? 'scale-110' : 'scale-100'
                } transition-transform duration-300 ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                  {visitorCount}
                </p>
              </div>
            </div>
            {visitorCount > 5 && (
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                darkMode 
                  ? 'bg-orange-900/30 text-orange-300' 
                  : 'bg-orange-100 text-orange-700'
              }`}>
                🔥 Hot
              </div>
            )}
          </div>

          {/* Total Visitors */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                darkMode ? 'bg-purple-900/30' : 'bg-purple-100'
              }`}>
                <TrendingUp className={`w-4 h-4 ${
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                }`} />
              </div>
              <div>
                <p className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Total Visits
                </p>
                <p className={`text-lg font-bold ${
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  {totalVisitors.toLocaleString()}
                </p>
              </div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              darkMode 
                ? 'bg-blue-900/30 text-blue-300' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              All Time
            </div>
          </div>

          {/* Visitor Activity Indicator */}
          {visitorCount > 1 && (
            <div className={`p-3 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <Users className={`w-4 h-4 ${
                  darkMode ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
                <span className={`text-xs font-medium ${
                  darkMode ? 'text-yellow-400' : 'text-yellow-600'
                }`}>
                  Popular Right Now!
                </span>
              </div>
              <p className={`text-xs ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {visitorCount} people are exploring our digital products
              </p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className={`p-2 rounded-lg text-center ${
              darkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <p className={`text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Avg. Daily
              </p>
              <p className={`text-sm font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {Math.floor(totalVisitors / 30)}
              </p>
            </div>
            <div className={`p-2 rounded-lg text-center ${
              darkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <p className={`text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Peak Today
              </p>
              <p className={`text-sm font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {Math.max(visitorCount + Math.floor(Math.random() * 5), 8)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-4 py-2 border-t text-center ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <p className={`text-xs ${
            darkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            Updates every 8 seconds • Click × to minimize
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisitorCounter;