import React, { useState, useEffect } from 'react';
// Comment out ALL component imports
// import Character from './Character';
// import ClothingMenu from './ClothingMenu';
// import SaveButton from './SaveButton';
import '../styles/vaporwave.css';
import ChatWindow from './Chatwindow';
import { useWindowContext } from '../contexts/WindowContext';

function DressupGame() {
  // Keep your state setup
  const [clothingItems, setClothingItems] = useState({
    hats: [],
    tops: [],
    bottoms: [],
    shoes: [],
    accessories: []
  });
  
  const { openChatWindow, setChatWindowOpen } = useWindowContext();

  const [selectedItems, setSelectedItems] = useState({
    hats: null,
    tops: null,
    bottoms: null,
    shoes: null,
    accessories: []
  });
  
  const [activeCategory, setActiveCategory] = useState('tops');
  
  // Add the openWindows state 
  const [openWindows, setOpenWindows] = useState([
    { id: 'chat1', type: 'chat', visible: true }
  ]);
  
  // Define closeWindow function before it's used
  const closeWindow = (id) => {
  const windowToClose = openWindows.find(window => window.id === id);
  if (windowToClose && windowToClose.type === 'chat') {
    setChatWindowOpen(false); // Update the context when closing chat
  }
  setOpenWindows(prev => prev.filter(window => window.id !== id));
};
  
  // Add the openWindow function
  const openWindow = (type) => {
    // For chat windows, check with context first
    if (type === 'chat') {
      if (!openChatWindow()) {
        // If a chat window is already open, don't create another one
        return;
      }
    }
    
    // Only gets here if it's not a chat window OR if we're allowed to open one
    const newId = `${type}_${Date.now()}`;
    setOpenWindows(prev => [...prev, { id: newId, type, visible: true }]);
  };
  
  // Simplified useEffect
  useEffect(() => {
    setClothingItems({
      hats: [
        { id: 'hat1', name: 'Baseball Cap', path: '' },
        { id: 'hat2', name: 'Beanie', path: '' },
      ],
      tops: [
        { id: 'top1', name: 'T-Shirt', path: '' },
        { id: 'top2', name: 'Hoodie', path: '' },
      ],
      bottoms: [
        { id: 'bottom1', name: 'Jeans', path: '' },
        { id: 'bottom2', name: 'Shorts', path: '' },
      ],
      shoes: [
        { id: 'shoe1', name: 'Sneakers', path: '' },
        { id: 'shoe2', name: 'Boots', path: '' },
      ],
      accessories: [
        { id: 'acc1', name: 'Sunglasses', path: '' },
        { id: 'acc2', name: 'Chain', path: '' },
      ]
    });
  }, []);

  // Tell context about initial chat window
useEffect(() => {
  // If we start with a chat window open, update the context
  if (openWindows.some(window => window.type === 'chat')) {
    setChatWindowOpen(true);
  }
}, []); // Empty dependency array - only runs on component mount
  
  // Keep your handler functions
  const handleSelectItem = (item, category) => {
    // Your existing logic...
  };
  
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };
  
  // Render the component
  return (
    <div className="dressup-game vaporwave-background" style={{ 
      width: '100%', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      {/* Vaporwave elements */}
      <div className="vaporwave-grid"></div>
      <div className="vaporwave-sun"></div>
      <div className="scanlines"></div>
      <div className="floating-triangle" style={{ left: '10%', top: '20%' }}></div>
      <div className="floating-triangle" style={{ right: '15%', bottom: '30%' }}></div>
      <div className="floating-circle" style={{ left: '20%', bottom: '15%' }}></div>
      
      {/* Desktop icon for chat */}
      <div 
        onClick={() => openWindow('chat')}
        style={{
          position: 'absolute',
          top: '100px',
          left: '20px',
          width: '64px',
          height: '64px',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 5
        }}
      >
        <div style={{ fontSize: '32px' }}>💬</div>
        <div style={{ marginTop: '5px', color: 'white', textShadow: '1px 1px #000' }}>Chat</div>
      </div>
      
      <h1 style={{ 
        textAlign: 'center', 
        color: 'white', 
        textShadow: '2px 2px #ff00de, -2px -2px #00ffff', 
        marginBottom: '20px',
        fontFamily: '"Comic Sans MS", cursive',
        fontSize: '2.5rem',
        position: 'relative',
        zIndex: 3
      }}>
        bbno$ Dress Up Game
      </h1>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 3
      }}>
        {/* Debug content */}
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center',
          boxShadow: '0 0 15px rgba(255, 0, 222, 0.5)'
        }}>
          <h2>Dress Up Game (Debug Mode)</h2>
          <p>Components temporarily removed for debugging</p>
          <p>Active category: {activeCategory}</p>
          <p>Item count: {clothingItems[activeCategory].length}</p>
        </div>
        
        {/* Simple category buttons */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center',
          margin: '10px 0'
        }}>
          {Object.keys(clothingItems).map(category => (
            <button 
              key={category}
              style={{ 
                margin: '5px',
                padding: '8px 12px',
                backgroundColor: activeCategory === category ? '#b0b0b0' : '#c0c0c0',
                border: '2px solid',
                borderColor: activeCategory === category ? 
                  '#808080 #ffffff #ffffff #808080' : 
                  '#ffffff #808080 #808080 #ffffff',
                cursor: 'pointer',
                fontWeight: 'bold',
                position: 'relative',
                zIndex: 3,
                boxShadow: activeCategory === category ? '0 0 10px rgba(0, 255, 255, 0.5)' : 'none'
              }}
              onClick={() => handleCategoryChange(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Windows */}
        {openWindows.map(window => {
          if (window.type === 'chat') {
            return <ChatWindow 
              key={window.id} 
              id={window.id} 
              onClose={closeWindow} 
            />;
          }
          return null;
        })}
      </div>
      
      <footer style={{ 
        textAlign: 'center', 
        color: 'white', 
        padding: '20px', 
        marginTop: '20px',
        fontSize: '0.8rem',
        position: 'relative',
        zIndex: 3
      }}>
        Created by a fan. All bbno$ images are used with fan art permissions.
      </footer>
    </div>
  );
}

export default DressupGame;