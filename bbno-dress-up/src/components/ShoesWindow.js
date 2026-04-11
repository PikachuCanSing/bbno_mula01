import React from 'react';
import BaseWindow from './BaseWindow';
import ClothingWindowContent from './ClothingWindowContent';

const ITEMS = [
  { id: 'sho1', name: 'Sneakers', color: '#ffffff' },
  { id: 'sho2', name: 'Boots', color: '#4e342e' },
  { id: 'sho3', name: 'Loafers', color: '#6d4c41' },
  { id: 'sho4', name: 'High Heels', color: '#e91e63' },
  { id: 'sho5', name: 'Sandals', color: '#ffb74d' },
  { id: 'sho6', name: 'Slides', color: '#42a5f5' },
  { id: 'sho7', name: 'Platform Shoes', color: '#7e57c2' },
  { id: 'sho8', name: 'Oxfords', color: '#212121' },
  { id: 'sho9', name: 'Chunky Boots', color: '#37474f' },
  { id: 'sho10', name: 'Air Forces', color: '#eeeeee' },
];

function ShoesWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  return (
    <BaseWindow title="Shoes" onClose={onClose} id={id} zIndex={zIndex} isMinimized={isMinimized} onMinimize={onMinimize} onRestore={onRestore} onBringToFront={onBringToFront}>
      <ClothingWindowContent category="shoes" items={ITEMS} />
    </BaseWindow>
  );
}

export default ShoesWindow;