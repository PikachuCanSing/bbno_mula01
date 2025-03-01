import React from 'react';

function Character({ selectedItems }) {
  // Define the layering order (from back to front)
  const layerOrder = [
    'base',      // The character's body (always at the bottom)
    'bottoms',   // Pants/shorts
    'shoes',     // Shoes
    'tops',      // Shirts, hoodies, etc.
    'accessories', // Accessories
    'hats',      // Hats
  ];
  
  // Style for positioning clothing items
  const characterStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
  };
  
  const layerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    pointerEvents: 'none', // Prevents items from capturing clicks
  };
  
  // Handle image loading errors
  const handleImageError = (e) => {
    console.log('Image failed to load:', e.target.src);
    e.target.style.display = 'none'; // Hide broken images
    
    // Add a placeholder text where the image would be
    const placeholder = document.createElement('div');
    placeholder.innerText = 'Image not found';
    placeholder.style.backgroundColor = 'rgba(255, 100, 100, 0.3)';
    placeholder.style.padding = '10px';
    placeholder.style.borderRadius = '5px';
    e.target.parentNode.appendChild(placeholder);
  };
  
  return (
    <div style={{ 
      height: '500px', 
      width: '350px', 
      backgroundColor: '#c0c0c0',
      border: '2px solid',
      borderColor: '#ffffff #808080 #808080 #ffffff',
      overflow: 'hidden'
    }}>
      <div style={{
        backgroundColor: '#000080',
        color: 'white',
        padding: '4px 8px',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>Character Preview</span>
        <div>
          <button style={{ 
            width: '16px', 
            height: '16px',
            backgroundColor: '#c0c0c0',
            border: '1px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            margin: '0 2px',
            fontSize: '10px',
            lineHeight: 1
          }}>_</button>
          <button style={{ 
            width: '16px', 
            height: '16px',
            backgroundColor: '#c0c0c0',
            border: '1px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            margin: '0 2px',
            fontSize: '10px',
            lineHeight: 1
          }}>□</button>
          <button style={{ 
            width: '16px', 
            height: '16px',
            backgroundColor: '#c0c0c0',
            border: '1px solid',
            borderColor: '#ffffff #808080 #808080 #ffffff',
            margin: '0 2px',
            fontSize: '10px',
            lineHeight: 1
          }}>×</button>
        </div>
      </div>
      
      <div style={characterStyle}>
        {/* Base character - try different path variations */}
        <img 
          src="/assets/base/bbno-base.svg" 
          alt="bbno$ base character" 
          style={{ ...layerStyle, zIndex: layerOrder.indexOf('base') }}
          onError={handleImageError}
        />
        
        {/* Bottoms */}
        {selectedItems.bottoms && (
          <img 
            src={selectedItems.bottoms.path} 
            alt={selectedItems.bottoms.name} 
            style={{ ...layerStyle, zIndex: layerOrder.indexOf('bottoms') }}
            onError={handleImageError}
          />
        )}
        
        {/* Shoes */}
        {selectedItems.shoes && (
          <img 
            src={selectedItems.shoes.path} 
            alt={selectedItems.shoes.name} 
            style={{ ...layerStyle, zIndex: layerOrder.indexOf('shoes') }}
            onError={handleImageError}
          />
        )}
        
        {/* Tops */}
        {selectedItems.tops && (
          <img 
            src={selectedItems.tops.path} 
            alt={selectedItems.tops.name} 
            style={{ ...layerStyle, zIndex: layerOrder.indexOf('tops') }}
            onError={handleImageError}
          />
        )}
        
        {/* Accessories - multiple possible */}
        {selectedItems.accessories && selectedItems.accessories.map((accessory, index) => (
          <img 
            key={`accessory-${index}`}
            src={accessory.path} 
            alt={accessory.name} 
            style={{ ...layerStyle, zIndex: layerOrder.indexOf('accessories') }}
            onError={handleImageError}
          />
        ))}
        
        {/* Hat */}
        {selectedItems.hats && (
          <img 
            src={selectedItems.hats.path} 
            alt={selectedItems.hats.name} 
            style={{ ...layerStyle, zIndex: layerOrder.indexOf('hats') }}
            onError={handleImageError}
          />
        )}
      </div>
    </div>
  );
}

export default Character;