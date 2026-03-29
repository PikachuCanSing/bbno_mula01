import React from 'react';
import html2canvas from 'html2canvas';

function SaveButton({ selectedItems }) {
  const saveImage = async () => {
    // Find the character display element
    const characterElement = document.querySelector('.character-display');
    
    if (characterElement) {
      try {
        const canvas = await html2canvas(characterElement, {
          backgroundColor: '#c0c0c0',
          scale: 2, // Higher resolution
        });
        
        // Create download link
        const link = document.createElement('a');
        link.download = 'bbno-dressup-creation.png';
        link.href = canvas.toDataURL();
        link.click();
        
        alert('Your creation has been saved!');
      } catch (error) {
        console.error('Error saving image:', error);
        alert('Sorry, there was an error saving your image. Please try again.');
      }
    } else {
      alert('Character display not found. Please refresh and try again.');
    }
  };
  
  // Only enable the save button if at least one item is selected
  const hasSelectedItems = 
    selectedItems.hats || 
    selectedItems.tops || 
    selectedItems.bottoms || 
    selectedItems.shoes || 
    (selectedItems.accessories && selectedItems.accessories.length > 0);
  
  return (
    <button 
      onClick={saveImage}
      disabled={!hasSelectedItems}
      style={{ 
        marginTop: '10px', 
        width: '100%',
        backgroundColor: '#c0c0c0',
        border: '2px solid',
        borderColor: '#ffffff #808080 #808080 #ffffff',
        padding: '8px',
        cursor: hasSelectedItems ? 'pointer' : 'not-allowed',
        opacity: hasSelectedItems ? 1 : 0.7
      }}
    >
      Save Your Creation
    </button>
  );
}

export default SaveButton;