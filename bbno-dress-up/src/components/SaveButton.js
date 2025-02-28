import React from 'react';

function SaveButton({ selectedItems }) {
  const saveImage = () => {
    // This is a placeholder - you'll need to install html2canvas first
    alert('Save button clicked! This will save your creation when implemented.');
    
    // Find the character display element
    const characterElement = document.querySelector('.character-display');
    
    if (characterElement) {
      // In real implementation, use html2canvas to create a screenshot
      console.log('Would save character display as image');
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