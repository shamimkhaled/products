import React from 'react';
import { ShoppingCart, MessageCircle, Send, Code, Globe, Shield } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext'; // Make sure this path is correct

const ProductsFooter = () => {
  const { darkMode } = useTheme();

  return (
    <footer className={`py-16 ${
      darkMode 
        ? 'bg-gray-900 border-t border-gray-800' 
        : 'bg-gray-50 border-t border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Digital Products Store
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  by Shamim Khaled
                </div>
              </div>
            </div>
            <p className={`mb-6 max-w-md ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Premium digital solutions including React templates, AI/ML tools, Python scripts, and automation bots for developers and businesses.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://wa.me/8801903526254" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-110 ${
                  darkMode 
                    ? 'bg-gray-800 text-gray-300 hover:text-green-400' 
                    : 'bg-gray-100 text-gray-600 hover:text-green-600'
                }`}
                title="WhatsApp Support"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a 
                href="https://t.me/shamimkhaled" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-110 ${
                  darkMode 
                    ? 'bg-gray-800 text-gray-300 hover:text-blue-400' 
                    : 'bg-gray-100 text-gray-600 hover:text-blue-600'
                }`}
                title="Telegram Support"
              >
                <Send className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com/shamimkhaled" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-110 ${
                  darkMode 
                    ? 'bg-gray-800 text-gray-300 hover:text-purple-400' 
                    : 'bg-gray-100 text-gray-600 hover:text-purple-600'
                }`}
                title="GitHub Portfolio"
              >
                <Code className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className={`text-lg font-semibold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>Product Categories</h4>
            <div className="space-y-3">
              {[
                'React Templates',
                'Python Scripts', 
                'AI/ML Solutions',
                'Automation Bots',
                'Custom Development'
              ].map((category) => (
                <div key={category} className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer`}>
                  {category}
                </div>
              ))}
            </div>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className={`text-lg font-semibold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>Support & Contact</h4>
            <div className="space-y-3">
              {/* WhatsApp Support */}
              <a 
                href="https://wa.me/8801903526254" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                  darkMode 
                    ? 'bg-gray-800 hover:bg-green-900/20 border border-gray-700 hover:border-green-500' 
                    : 'bg-white hover:bg-green-50 border border-gray-200 hover:border-green-500 shadow-sm'
                }`}
              >
                <div className="p-2 bg-green-500 text-white rounded-lg">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    WhatsApp Support
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    +880 1903526254
                  </div>
                </div>
              </a>

              {/* Telegram Support */}
              <a 
                href="https://t.me/shamimkhaled" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                  darkMode 
                    ? 'bg-gray-800 hover:bg-blue-900/20 border border-gray-700 hover:border-blue-500' 
                    : 'bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-500 shadow-sm'
                }`}
              >
                <div className="p-2 bg-blue-500 text-white rounded-lg">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Telegram Support
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    @shamimkhaled
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`mt-8 pt-8 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              © 2025 Shamim Khaled Digital Products Store. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className={`text-xs ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Binance TRC20 (USDT) • Fiverr • Instant Delivery
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};


export default ProductsFooter;