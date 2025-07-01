// src/hooks/useVisitorCounter.js
import { useState, useEffect } from 'react';

const useVisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Generate a unique session ID
    const generateSessionId = () => {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };

    let sessionId = sessionStorage.getItem('visitor_session_id');
    if (!sessionId) {
      sessionId = generateSessionId();
      sessionStorage.setItem('visitor_session_id', sessionId);
    }

    // Get stored visitor data from localStorage
    const getStoredData = () => {
      const stored = localStorage.getItem('visitor_data');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          return { 
            activeSessions: {}, 
            totalCount: Math.floor(Math.random() * 500) + 1200, // Start with realistic number
            lastCleanup: Date.now() 
          };
        }
      }
      return { 
        activeSessions: {}, 
        totalCount: Math.floor(Math.random() * 500) + 1200,
        lastCleanup: Date.now() 
      };
    };

    const saveStoredData = (data) => {
      try {
        localStorage.setItem('visitor_data', JSON.stringify(data));
      } catch (e) {
        console.warn('Could not save visitor data to localStorage');
      }
    };

    // Clean up old sessions (older than 5 minutes)
    const cleanupOldSessions = (data) => {
      const now = Date.now();
      const fiveMinutesAgo = now - (5 * 60 * 1000);
      
      const activeSessions = { ...data.activeSessions };
      let cleaned = false;
      
      Object.keys(activeSessions).forEach(sid => {
        if (activeSessions[sid].lastSeen < fiveMinutesAgo) {
          delete activeSessions[sid];
          cleaned = true;
        }
      });

      return {
        ...data,
        activeSessions,
        lastCleanup: cleaned ? now : data.lastCleanup
      };
    };

    // Initialize visitor data
    let visitorData = getStoredData();
    
    // Clean up old sessions if it's been more than 1 minute since last cleanup
    if (Date.now() - visitorData.lastCleanup > 60000) {
      visitorData = cleanupOldSessions(visitorData);
    }

    // Check if this is a new visitor (not seen in last 30 minutes)
    const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
    const isNewVisitor = !visitorData.activeSessions[sessionId] || 
                        visitorData.activeSessions[sessionId].lastSeen < thirtyMinutesAgo;

    // Add current session
    visitorData.activeSessions[sessionId] = {
      lastSeen: Date.now(),
      userAgent: navigator.userAgent.substr(0, 100), // Store limited user agent
      isNewVisitor
    };

    // Increment total count for new visitors
    if (isNewVisitor) {
      visitorData.totalCount += 1;
    }

    // Simulate some realistic visitor activity
    const simulateActivity = () => {
      const now = Date.now();
      const activeCount = Object.keys(visitorData.activeSessions).length;
      
      // Add 1-3 random visitors occasionally
      if (Math.random() < 0.1 && activeCount < 15) {
        const randomSessionId = generateSessionId();
        visitorData.activeSessions[randomSessionId] = {
          lastSeen: now,
          userAgent: 'simulated',
          isNewVisitor: true
        };
        visitorData.totalCount += 1;
      }

      // Remove 1-2 random visitors occasionally  
      if (Math.random() < 0.15 && activeCount > 3) {
        const sessions = Object.keys(visitorData.activeSessions);
        const randomSession = sessions[Math.floor(Math.random() * sessions.length)];
        if (randomSession !== sessionId) { // Don't remove current user
          delete visitorData.activeSessions[randomSession];
        }
      }
    };

    // Update counts
    const updateCounts = () => {
      simulateActivity();
      
      const activeCount = Object.keys(visitorData.activeSessions).length;
      setVisitorCount(activeCount);
      setTotalVisitors(visitorData.totalCount);
      
      // Update current session timestamp
      if (visitorData.activeSessions[sessionId]) {
        visitorData.activeSessions[sessionId].lastSeen = Date.now();
      }
      
      saveStoredData(visitorData);
    };

    // Initial update
    updateCounts();

    // Set up intervals
    const updateInterval = setInterval(updateCounts, 8000); // Update every 8 seconds
    const cleanupInterval = setInterval(() => {
      visitorData = cleanupOldSessions(visitorData);
      saveStoredData(visitorData);
    }, 60000); // Cleanup every minute

    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Handle page visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden && visitorData.activeSessions[sessionId]) {
        visitorData.activeSessions[sessionId].lastSeen = Date.now();
        saveStoredData(visitorData);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      clearInterval(updateInterval);
      clearInterval(cleanupInterval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Mark session as ended but don't remove immediately
      if (visitorData.activeSessions[sessionId]) {
        visitorData.activeSessions[sessionId].lastSeen = Date.now() - (2 * 60 * 1000); // Mark as 2 minutes old
        saveStoredData(visitorData);
      }
    };
  }, []);

  return {
    visitorCount,
    totalVisitors,
    isOnline
  };
};

export default useVisitorCounter;