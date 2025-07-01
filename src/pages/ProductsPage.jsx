// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, ExternalLink, Star, Check, MessageCircle, 
  Code, Bot, Brain, Globe, Database, Zap, Shield,
  ChevronLeft, ChevronRight, ArrowRight, Download,
  Filter, Search, Grid3X3, List, Send, Copy, X, Users, Eye, TrendingUp
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ProductsFooter from '../components/layout/ProductsFooter';

// Visitor Counter Hook
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

// Visitor Counter Component
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

const ProductsPage = () => {
  const { darkMode } = useTheme();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentProduct, setSelectedPaymentProduct] = useState(null);
  const [copiedText, setCopiedText] = useState('');

  // Set page title for products page
  useEffect(() => {
    document.title = 'Digital Products Store - Shamim Khaled ';
    return () => {
      // Reset to original title when leaving the page
      document.title = 'Shamim Khaled - AI/ML Engineer & Python Developer';
    };
  }, []);

  const categories = [
    { id: 'All', label: 'All Products', icon: <Grid3X3 className="w-4 h-4" /> },
    { id: 'React Templates', label: 'React Templates', icon: <Globe className="w-4 h-4" /> },
    { id: 'Python Scripts', label: 'Python Scripts', icon: <Code className="w-4 h-4" /> },
    { id: 'AI/ML Solutions', label: 'AI/ML Solutions', icon: <Brain className="w-4 h-4" /> },
    { id: 'Automation Bots', label: 'Automation Bots', icon: <Bot className="w-4 h-4" /> },
    { id: 'Databases', label: 'Databases & APIs', icon: <Database className="w-4 h-4" /> }
  ];

  const products = [
    {
      id: 'techkreativ',
      name: 'TechKreativ React Template',
      price: 150,
      originalPrice: 200,
      description: 'Modern hybrid architecture combining traditional web technologies with React components for enhanced interactivity.',
      livePreview: 'https://techkreativ-react-app.vercel.app/',
      image: '/assets/products/techkreativ.png',
      gallery: [
        '/assets/products/techkreativ.png',
        '/assets/products/techkreativ1.png',
        '/assets/products/techkreativ2.png',
        '/assets/products/techkreativ3.png',
        '/assets/products/techkreativ4.png'
      ],
      features: [
        'Modern React Components',
        'Tailwind CSS Styling',
        'Fully Responsive Design',
        'Clean & Professional UI',
        'Easy Customization',
        'Cross-browser Compatible',
        'SEO Optimized',
        'Documentation Included'
      ],
      technologies: ['React', 'Tailwind CSS', 'JavaScript'],
      category: 'React Templates',
      complexity: 'Advanced',
      deliveryTime: '2-3 days',
      downloads: 150,
      rating: 4.9,
      popular: true
    },
    {
      id: 'techxen',
      name: 'TechXen React Template',
      price: 99,
      originalPrice: 130,
      description: 'Professional React app template designed for companies and organizations with modern UI components.',
      livePreview: 'https://techxen-react-app-template.vercel.app/',
      image: '/assets/products/techxen.png',
      gallery: [
        '/assets/products/techxen.png',
        '/assets/products/techxen1.png',
        '/assets/products/techxen2.png'
      ],
      features: [
        'Advanced React Architecture',
        'Bootstrap Integration',
        'Responsive Grid System',
        'Modern UI Components',
        'JavaScript Interactions',
        'Performance Optimized',
        'Clean Code Structure',
        'Lifetime Updates'
      ],
      technologies: ['React', 'Bootstrap', 'JavaScript'],
      category: 'React Templates',
      complexity: 'Intermediate',
      deliveryTime: '1 day',
      downloads: 120,
      rating: 4.8,
      popular: false
    },
    {
      id: 'portfolio',
      name: 'Personal Portfolio Template',
      price: 29,
      originalPrice: 39,
      description: 'Modern personal portfolio template perfect for developers, designers, and freelancers.',
      livePreview: 'https://shamimkhaled.github.io',
      image: '/assets/products/shamim-portfolio.png',
      gallery: [
        '/assets/products/shamim-portfolio-light.png',
        '/assets/products/shamim-portfolio-dark.png'
      ],
      features: [
        'Dark/Light Mode Toggle',
        'Smooth Animations',
        'Project Showcase',
        'Contact Form Integration',
        'Skills & Services Sections',
        'Testimonials Display',
        'Mobile-First Design',
        'Fast Loading'
      ],
      technologies: ['React', 'Tailwind CSS', 'EmailJS'],
      category: 'React Templates',
      complexity: 'Intermediate',
      deliveryTime: '1 day',
      downloads: 200,
      rating: 5.0,
      popular: true
    },
    {
      id: 'telegram-automation-bot',
      name: 'Telegram Scraper, Bulk SMS, Member Adder',
      price: 29,
      originalPrice: 50,
      description: 'The ultimate private Telegram automation tool for scraping hidden members (if not privileged by admin) by scanning the message history sending bulk SMS, forwarding messages, and adding members using multiple rotating accounts.',
      livePreview: 'https://youtu.be/gEth-PSj86E',
      image: '/assets/products/telebot.png',
      gallery: [
        '/assets/products/telebot.png',
        '/assets/projects/bot-dashboard.png',
        '/assets/projects/bot-results.png'
      ],
      features: [
        'Smarter Telegram scraping system',
        'Advanced member adding with parallel processing',
        'Intelligent peer flood error handling & auto-resume (checkpoint system)',
        'Adaptive rate-limiting to bypass Telegram restrictions',
        'Scrape hidden members from private groups/channels (if not privilege by admin)',
        'Rotate between multiple accounts to avoid bans',
        'Set max & min delay for adding members and forwarding messages',
        'Bulk forward messages with controlled delays',
        'Works even when member list is protected by admins'
      ],
      technologies: ['Python', 'Telegram API integration'],
      category: 'Automation Bots',
      complexity: 'Intermediate',
      deliveryTime: '1 day',
      downloads: 50,
      rating: 4.7,
      popular: true
    }
  ];

  const paymentMethods = [
    {
      name: 'Binance TRC20 (USDT) - Recommended',
      wallet: 'TLE1mh5khdeSvzPbtx95wuzBcuu3RPBNTr',
      whatsapp: '+8801903526254',
      instructions: 'Send payment screenshot + product name via WhatsApp for confirmation. Source code will be delivered instantly.',
      icon: '💰',
      recommended: true
    },
    {
      name: 'Fiverr Marketplace',
      link: 'https://www.fiverr.com/users/iamkhaled94/portfolio',
      instructions: 'Secure purchase through Fiverr with buyer protection and instant delivery',
      icon: '🛡️',
      recommended: false
    }
  ];

  const additionalServices = [
    {
      title: 'Free Deployment Support',
      description: 'Need help deploying your purchased product? I provide free deployment guidance.',
      icon: '🚀',
      included: true
    },
    {
      title: 'Server Deployment Service',
      description: 'Professional deployment on your server with configuration and optimization.',
      icon: '⚙️',
      price: '$17/hour',
      included: false
    },
    {
      title: 'Custom Modifications',
      description: 'Customize the product according to your specific requirements.',
      icon: '🔧',
      price: '$20/hour',
      included: false
    },
    {
      title: 'Technical Support',
      description: '24/7 technical support for any issues or questions about your purchase.',
      icon: '💬',
      included: true
    }
  ];

  // Filter products based on category and search
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const nextImage = () => {
    if (selectedProduct) {
      setCurrentImageIndex((prev) => 
        prev === selectedProduct.gallery.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProduct) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProduct.gallery.length - 1 : prev - 1
      );
    }
  };

  const handlePurchase = (product) => {
    setSelectedPaymentProduct(product);
    setShowPaymentModal(true);
  };

  const handleCopyWallet = () => {
    const walletAddress = 'TLE1mh5khdeSvzPbtx95wuzBcuu3RPBNTr';
    navigator.clipboard.writeText(walletAddress);
    setCopiedText('Wallet address copied!');
    setTimeout(() => setCopiedText(''), 3000);
  };

  const handleWhatsAppPayment = (product) => {
    const whatsappMessage = `Hi! I want to purchase "${product.name}" for $${product.price}.

🛒 Product: ${product.name}
💰 Price: $${product.price}
⏱️ Delivery: ${product.deliveryTime}

I'm ready to make the USDT TRC20 payment. Please confirm the wallet address and next steps.

Thank you!`;
    const whatsappUrl = `https://wa.me/8801903526254?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getCategoryIcon = (category) => {
    const categoryMap = {
      'React Templates': <Globe className="w-4 h-4" />,
      'Python Scripts': <Code className="w-4 h-4" />,
      'AI/ML Solutions': <Brain className="w-4 h-4" />,
      'Automation Bots': <Bot className="w-4 h-4" />,
      'Databases': <Database className="w-4 h-4" />
    };

    return categoryMap[category] || <Code className="w-4 h-4" />;
  };

  const getComplexityColor = (complexity) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Intermediate': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Advanced': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'Expert': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[complexity] || colors['Intermediate'];
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      {/* Visitor Counter */}
      <VisitorCounter />
      
      {/* Products Page Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        darkMode 
          ? 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-700' 
          : 'bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                    Digital Products Store
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    by Shamim Khaled
                  </div>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4" />
                <span>100% Secure Purchase</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <a 
                  href="https://wa.me/8801903526254"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
                <a 
                  href="https://t.me/shamimkhaled"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Telegram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className={`pt-20 min-h-screen ${
        darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Secure Payment Highlight Banner */}
          <div className={`mb-8 rounded-2xl p-6 ${
            darkMode 
              ? 'bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-800' 
              : 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200'
          }`}>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Shield className="w-6 h-6 text-green-600" />
                <h2 className={`text-2xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  🔒 100% Secure Purchase Process
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className={`flex items-center justify-center space-x-2 ${
                  darkMode ? 'text-green-300' : 'text-green-700'
                }`}>
                  <Check className="w-4 h-4" />
                  <span>Instant Source Code Delivery</span>
                </div>
                <div className={`flex items-center justify-center space-x-2 ${
                  darkMode ? 'text-blue-300' : 'text-blue-700'
                }`}>
                  <Check className="w-4 h-4" />
                  <span>WhatsApp & Telegram Support</span>
                </div>
                <div className={`flex items-center justify-center space-x-2 ${
                  darkMode ? 'text-purple-300' : 'text-purple-700'
                }`}>
                  <Check className="w-4 h-4" />
                  <span>Free Deployment Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className={`text-5xl font-bold mb-6 bg-gradient-to-r bg-clip-text text-transparent ${
              darkMode 
                ? 'from-white to-gray-300' 
                : 'from-gray-900 to-gray-600'
            }`}>
              Premium Digital Solutions
            </h1>
            <p className={`text-xl max-w-3xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Professional React templates, AI/ML solutions, Python scripts, and automation tools for developers and businesses
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-300 placeholder-gray-500 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                      : darkMode 
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                  }`}
                >
                  {category.icon}
                  <span className="hidden sm:inline">{category.label}</span>
                  <span className="sm:hidden">{category.id}</span>
                </button>
              ))}
            </div>

            {/* Results Counter */}
            <div className="text-center">
              <span className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              </span>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredProducts.map((product) => (
              <div key={product.id} className={`rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden group ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                {/* Product Image */}
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.popular && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                      Popular
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2">
                    <div className="flex items-center space-x-1 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-full">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{product.rating}</span>
                    </div>
                    <div className={`px-2 py-1 text-xs font-medium rounded-full ${getComplexityColor(product.complexity)}`}>
                      {product.complexity}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setCurrentImageIndex(0);
                      }}
                      className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(product.category)}
                      <span className={`text-xs font-medium ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {product.category}
                      </span>
                    </div>
                    <div className={`flex items-center space-x-1 text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <Download className="w-4 h-4" />
                      <span>{product.downloads}</span>
                    </div>
                  </div>

                  <h3 className={`text-xl font-bold mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {product.name}
                  </h3>
                  
                  <p className={`text-sm mb-4 line-clamp-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {product.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.technologies.slice(0, 3).map((tech, index) => (
                      <span 
                        key={index}
                        className={`px-2 py-1 text-xs rounded-md ${
                          darkMode 
                            ? 'bg-blue-900/30 text-blue-300' 
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                    {product.technologies.length > 3 && (
                      <span className={`px-2 py-1 text-xs rounded-md ${
                        darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                      }`}>
                        +{product.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-blue-600">
                        ${product.price}
                      </span>
                      <span className={`text-sm line-through ${
                        darkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        ${product.originalPrice}
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      darkMode 
                        ? 'bg-green-900/30 text-green-300' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>

                  {/* Delivery Time */}
                  <div className={`text-xs mb-4 flex items-center space-x-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <Zap className="w-3 h-3" />
                    <span>Delivery: {product.deliveryTime}</span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      {product.livePreview && (
                        <a 
                          href={product.livePreview}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-1 flex items-center justify-center px-3 py-2 border rounded-lg transition-colors text-sm ${
                            darkMode 
                              ? 'border-blue-600 text-blue-400 hover:bg-blue-900/20' 
                              : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Preview
                        </a>
                      )}
                      <button
                        onClick={() => handlePurchase(product)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all duration-200 text-sm font-medium"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className={`text-6xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                🔍
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                No products found
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}

          {/* Payment Methods */}
          <div className={`rounded-2xl p-8 mb-12 ${
            darkMode 
              ? 'bg-gradient-to-r from-gray-800 to-gray-700' 
              : 'bg-gradient-to-r from-blue-50 to-purple-50'
          }`}>
            <h3 className={`text-3xl font-bold text-center mb-8 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              🔒 Secure Payment Methods
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {paymentMethods.map((method, index) => (
                <div key={index} className={`rounded-xl p-6 border-2 ${
                  method.recommended 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
                }`}>
                  {method.recommended && (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-4 inline-block">
                      ⭐ RECOMMENDED
                    </div>
                  )}
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-3xl">{method.icon}</span>
                    <h4 className={`font-bold text-lg ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{method.name}</h4>
                  </div>
                  {method.wallet && (
                    <div className="mb-4">
                      <label className={`text-sm font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>USDT Wallet Address (TRC20):</label>
                      <div className={`p-3 rounded-lg mt-2 font-mono text-sm break-all border-2 border-dashed ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                      }`}>
                        {method.wallet}
                      </div>
                      <div className="mt-2 flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="w-4 h-4 text-green-500" />
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            WhatsApp: {method.whatsapp}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Send className="w-4 h-4 text-blue-500" />
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Telegram: @shamimkhaled
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  {method.link && (
                    <div className="mb-4">
                      <a 
                        href={method.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-3 font-medium text-lg"
                      >
                        Visit Fiverr Profile
                        <ExternalLink className="w-5 h-5 ml-2" />
                      </a>
                    </div>
                  )}
                  <div className={`p-4 rounded-lg ${
                    method.recommended 
                      ? 'bg-white dark:bg-gray-800' 
                      : darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <p className={`text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {method.instructions}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Purchase Process Steps */}
            <div className={`rounded-xl p-6 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h4 className={`text-xl font-bold mb-6 text-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                📋 Simple Purchase Process
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { step: '1', title: 'Choose Product', desc: 'Select your desired product and click "Buy Now"' },
                  { step: '2', title: 'Make Payment', desc: 'Send USDT to wallet or purchase via Fiverr' },
                  { step: '3', title: 'Send Confirmation', desc: 'WhatsApp/Telegram payment screenshot + product name' },
                  { step: '4', title: 'Get Source Code', desc: 'Receive complete source code instantly' }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                      {item.step}
                    </div>
                    <h5 className={`font-semibold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{item.title}</h5>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Services */}
          <div className={`rounded-2xl p-8 mb-12 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-3xl font-bold text-center mb-8 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              🛠️ Additional Services Available
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {additionalServices.map((service, index) => (
                <div key={index} className={`p-6 rounded-xl border ${
                  service.included 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-start space-x-4">
                    <span className="text-3xl">{service.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className={`font-bold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>{service.title}</h4>
                        {service.included ? (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                            FREE
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                            {service.price}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                💡 Need custom modifications or deployment help? Contact me for hourly-based professional services!
              </p>
            </div>
          </div>

          {/* Support Section */}
          <div className="text-center">
            <h3 className={`text-2xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Need Help or Custom Solutions?
            </h3>
            <p className={`mb-6 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Contact me for custom development, modifications, or any questions about the products.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a 
                href="https://wa.me/8801903526254"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Support
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a 
                href="https://t.me/shamimkhaled"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Send className="w-5 h-5 mr-2" />
                Telegram Support
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedPaymentProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className={`text-2xl font-bold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Complete Your Purchase
                    </h3>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {selectedPaymentProduct.name} - ${selectedPaymentProduct.price}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className={`text-2xl ${
                      darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Payment Options */}
                <div className="space-y-6">
                  {/* USDT TRC20 - Recommended */}
                  <div className={`rounded-xl p-6 border-2 border-green-500 ${
                    darkMode ? 'bg-green-900/20' : 'bg-green-50'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">💰</span>
                        <div>
                          <h4 className={`font-bold text-lg ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            Binance TRC20 (USDT)
                          </h4>
                          <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            ⭐ RECOMMENDED
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Wallet Address */}
                    <div className="mb-4">
                      <label className={`text-sm font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        USDT Wallet Address (TRC20):
                      </label>
                      <div className={`p-3 rounded-lg mt-2 font-mono text-sm break-all border-2 border-dashed relative ${
                        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                      }`}>
                        TLE1mh5khdeSvzPbtx95wuzBcuu3RPBNTr
                        <button
                          onClick={handleCopyWallet}
                          className="absolute top-2 right-2 p-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      {copiedText && (
                        <p className="text-green-600 text-xs mt-1">{copiedText}</p>
                      )}
                    </div>

                    {/* Payment Amount */}
                    <div className={`p-4 rounded-lg mb-4 ${
                      darkMode ? 'bg-gray-700' : 'bg-white'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className={`font-medium ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Amount to Send:
                        </span>
                        <span className="text-2xl font-bold text-green-600">
                          ${selectedPaymentProduct.price} USDT
                        </span>
                      </div>
                      <div className="text-xs text-yellow-600 mt-2">
                        ⚠️ Important: Send exact amount in USDT TRC20 network only
                      </div>
                    </div>

                    {/* WhatsApp Confirmation */}
                    <button
                      onClick={() => handleWhatsAppPayment(selectedPaymentProduct)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Send Payment Confirmation via WhatsApp</span>
                    </button>

                    <div className={`text-xs mt-3 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      After payment, send screenshot + product name via WhatsApp for instant delivery
                    </div>
                  </div>

                  {/* OR Divider */}
                  <div className="flex items-center">
                    <div className={`flex-1 h-px ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-300'
                    }`}></div>
                    <span className={`px-4 text-sm font-medium ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      OR
                    </span>
                    <div className={`flex-1 h-px ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-300'
                    }`}></div>
                  </div>

                  {/* Fiverr Option */}
                  <div className={`rounded-xl p-6 border ${
                    darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
                  }`}>
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-3xl">🛡️</span>
                      <div>
                        <h4 className={`font-bold text-lg ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          Fiverr Marketplace
                        </h4>
                        <span className="text-xs text-blue-600">Secure purchase with buyer protection</span>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg mb-4 ${
                      darkMode ? 'bg-gray-800' : 'bg-gray-50'
                    }`}>
                      <p className={`text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Purchase securely through Fiverr with buyer protection and instant delivery
                      </p>
                    </div>

                    <a 
                      href="https://www.fiverr.com/users/iamkhaled94/portfolio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Visit Fiverr Profile</span>
                    </a>
                  </div>
                </div>

                {/* Contact Support */}
                <div className={`mt-6 p-4 rounded-xl ${
                  darkMode ? 'bg-blue-900/30' : 'bg-blue-50'
                }`}>
                  <h4 className={`font-semibold mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Need Help?
                  </h4>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4 text-green-500" />
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                        WhatsApp: +8801903526254
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Send className="w-4 h-4 text-blue-500" />
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                        Telegram: @shamimkhaled
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className={`text-2xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {selectedProduct.name}
                  </h3>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className={`text-2xl ${
                      darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Image Gallery */}
                  <div>
                    <div className="relative mb-4">
                      <img 
                        src={selectedProduct.gallery[currentImageIndex]}
                        alt={selectedProduct.name}
                        className="w-full h-64 object-cover rounded-xl"
                      />
                      {selectedProduct.gallery.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                    {selectedProduct.gallery.length > 1 && (
                      <div className="flex space-x-2">
                        {selectedProduct.gallery.map((img, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                              currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                            }`}
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                        darkMode 
                          ? 'bg-blue-900/30 text-blue-300' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedProduct.category}
                      </span>
                      <span className={`px-3 py-1 text-sm rounded-full font-medium ${getComplexityColor(selectedProduct.complexity)}`}>
                        {selectedProduct.complexity}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{selectedProduct.rating}</span>
                      </div>
                    </div>

                    <p className={`mb-6 ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {selectedProduct.description}
                    </p>

                    <div className="mb-6">
                      <h4 className={`font-semibold mb-3 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>Features:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedProduct.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className={`text-sm ${
                              darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className={`font-semibold mb-3 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>Technologies:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.technologies.map((tech, index) => (
                          <span 
                            key={index}
                            className={`px-3 py-1 text-sm rounded-full ${
                              darkMode 
                                ? 'bg-blue-900/50 text-blue-200' 
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center space-x-4">
                        <span className="text-3xl font-bold text-blue-600">
                          ${selectedProduct.price}
                        </span>
                        <span className={`text-xl line-through ${
                          darkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          ${selectedProduct.originalPrice}
                        </span>
                        <div className={`flex items-center space-x-1 text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <Zap className="w-4 h-4" />
                          <span>{selectedProduct.deliveryTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedProduct.livePreview && (
                        <a 
                          href={selectedProduct.livePreview}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full flex items-center justify-center px-6 py-3 border rounded-xl transition-colors ${
                            darkMode 
                              ? 'border-blue-600 text-blue-400 hover:bg-blue-900/20' 
                              : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          <ExternalLink className="w-5 h-5 mr-2" />
                          Live Preview
                        </a>
                      )}
                      <button
                        onClick={() => handlePurchase(selectedProduct)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
                      >
                        Purchase Now - ${selectedProduct.price}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <ProductsFooter />
    </div>
  );
};

export default ProductsPage;