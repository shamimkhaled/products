// import logo from './logo.svg';
// import './App.css';
import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import ProductsPage from './pages/ProductsPage';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
      
          <ProductsPage />
    
      </div>
    </ThemeProvider>
  );
}

export default App;



