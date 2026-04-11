import React from 'react';
import { useDressupContext } from '../contexts/DressupContext';

// Shared content for all clothing category windows.
// Each item: { id, name, color }
// When real clothing art is added, give items an `image` path and the img will render.
function ClothingWindowContent({ category, items }) {
  const { outfit, setOutfitItem } = useDressupContext();

  const isEquipped = (item) => {
    if (category === 'accessories') return outfit.accessories.some(a => a.id === item.id);
    return outfit[category]?.id === item.id;
  };

  const equippedItem = category === 'accessories' ? outfit.accessories : outfit[category];
  const equippedLabel = category === 'accessories'
    ? (equippedItem.length > 0 ? equippedItem.map(a => a.name).join(', ') : 'None')
    : (equippedItem ? equippedItem.name : 'None');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#7cd8ef',
      fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
      fontSize: '11px',
    }}>
      {/* Status strip */}
      <div style={{
        padding: '3px 8px',
        borderBottom: '2px solid',
        borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
        backgroundColor: '#7cd8ef',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexShrink: 0,
        color: '#e0d0ff',
        fontWeight: 'bold',
      }}>
        <span>Wearing:</span>
        <span style={{ fontWeight: 'normal', color: '#ffffff' }}>{equippedLabel}</span>
      </div>

      {/* Items grid — white content area like a file explorer */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        backgroundColor: '#ffffff',
        padding: '8px',
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
        gap: '8px',
      }}>
        {items.map(item => {
          const equipped = isEquipped(item);
          return (
            <div
              key={item.id}
              onClick={() => setOutfitItem(category, item)}
              title={item.name}
              style={{
                width: '72px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                padding: '4px',
                cursor: 'pointer',
                border: '2px solid',
                borderColor: equipped
                  ? '#e0d0ff #2f2a63 #2f2a63 #e0d0ff'
                  : '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
                backgroundColor: equipped ? '#4a68a2' : '#7cd8ef',
                userSelect: 'none',
                boxShadow: equipped ? 'inset 1px 1px 0 #ffffff22, inset -1px -1px 0 #2f2a6366' : '',
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: item.image ? 'transparent' : item.color,
                border: '1px solid #2f2a6333',
                borderRadius: '2px',
                flexShrink: 0,
                overflow: 'hidden',
              }}>
                {item.image && (
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                )}
              </div>
              <span style={{
                fontSize: '10px',
                textAlign: 'center',
                lineHeight: '1.2',
                color: equipped ? '#e0d0ff' : '#2f2a63',
                fontWeight: equipped ? 'bold' : 'normal',
                wordBreak: 'break-word',
                maxWidth: '100%',
              }}>{item.name}</span>
            </div>
          );
        })}
      </div>

      {/* Status bar */}
      <div style={{
        padding: '3px 8px',
        borderTop: '2px solid',
        borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
        backgroundColor: '#7cd8ef',
        color: '#e0d0ff',
        fontSize: '10px',
        flexShrink: 0,
      }}>
        {items.length} items — click to equip, click again to remove
      </div>
    </div>
  );
}

export default ClothingWindowContent;
