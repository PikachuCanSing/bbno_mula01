import React, { useState, useEffect } from 'react';
import Character from './Character';
import ClothingMenu from './ClothingMenu';
import SaveButton from './SaveButton';

function DressupGame() {
  // State to store all available clothing items
  const [clothingItems, setClothingItems] = useState({
    hats: [],
    tops: [],
    bottoms: [],
    shoes: [],
    accessories: []
  });
  
  // State to track currently selected items (what the character is wearing)
  const [selectedItems, setSelectedItems] = useState({
    hats: null,
    tops: null,
    bottoms: null,
    shoes: null,
    accessories: []
  });
  
  // State to track which category is currently active in the menu
  const [activeCategory, setActiveCategory] = useState('tops');
  
  // Load clothing items when component mounts
  useEffect(() => {
    // In a real app, you'd fetch these from your assets folder
    // For now, we'll simulate loading with placeholder data
    setClothingItems({
      hats: [
       // { id: 'hat1', name: 'Baseball Cap', path: '/assets/hats/hat1.svg' },
       // { id: 'hat2', name: 'Beanie', path: '/assets/hats/hat2.svg' },
      ],
      tops: [
       // { id: 'top1', name: 'T-Shirt', path: '/assets/tops/top1.svg' },
       // { id: 'top2', name: 'Hoodie', path: '/assets/tops/top2.svg' },
      ],
      bottoms: [
       // { id: 'bottom1', name: 'Jeans', path: '/assets/bottoms/bottom1.svg' },
       // { id: 'bottom2', name: 'Shorts', path: '/assets/bottoms/bottom2.svg' },
      ],
      shoes: [
       // { id: 'shoe1', name: 'Sneakers', path: '/assets/shoes/shoe1.svg' },
        //{ id: 'shoe2', name: 'Boots', path: '/assets/shoes/shoe2.svg' },
      ],
      accessories: [
        //{ id: 'acc1', name: 'Sunglasses', path: '/assets/accessories/accessory1.svg' },
        //{ id: 'acc2', name: 'Chain', path: '/assets/accessories/accessory2.svg' },
      ]
    });
  }, []);
  
  // Handle selecting a clothing item
  const handleSelectItem = (item, category) => {
    if (category === 'accessories') {
      // For accessories, toggle selection (add/remove from array)
      setSelectedItems(prev => {
        const accessoryIndex = prev.accessories.findIndex(acc => acc.id === item.id);
        
        if (accessoryIndex > -1) {
          // Remove if already selected
          const newAccessories = [...prev.accessories];
          newAccessories.splice(accessoryIndex, 1);
          return { ...prev, accessories: newAccessories };
        } else {
          // Add if not selected
          return { ...prev, accessories: [...prev.accessories, item] };
        }
      });
    } else {
      // For other categories, just replace the current selection
      setSelectedItems(prev => ({
        ...prev,
        [category === 'hats' ? 'hats' : 
         category === 'tops' ? 'tops' : 
         category === 'bottoms' ? 'bottoms' : 
         category === 'shoes' ? 'shoes' : category]: item
      }));
    }
  };
  
  // Handle changing the active category
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };
  
  return (
    <div className="dressup-game" style={{ 
      width: '100%', 
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #5f2c82, #49a09d)',
      padding: '20px'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: 'white', 
        textShadow: '2px 2px #ff00de', 
        marginBottom: '20px',
        fontFamily: '"Comic Sans MS", cursive',
        fontSize: '2.5rem'
      }}>
        bbno$ Dress Up Game
      </h1>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <Character selectedItems={selectedItems} />
        
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
                fontWeight: 'bold'
              }}
              onClick={() => handleCategoryChange(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        <ClothingMenu 
          items={clothingItems[activeCategory]} 
          selectedItems={selectedItems}
          activeCategory={activeCategory}
          onSelectItem={handleSelectItem} 
        />
        
        <SaveButton selectedItems={selectedItems} />
      </div>
      
      <footer style={{ 
        textAlign: 'center', 
        color: 'white', 
        padding: '20px', 
        marginTop: '20px',
        fontSize: '0.8rem'
      }}>
        Created by a fan. All bbno$ images are used with fan art permissions.
      </footer>
    </div>
  );
}

export default DressupGame;