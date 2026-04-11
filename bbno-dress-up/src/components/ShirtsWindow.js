import React from 'react';
import BaseWindow from './BaseWindow';
import ClothingWindowContent from './ClothingWindowContent';

const ITEMS = [
  { id: 'shirt1', name: 'Band Tee', color: '#e85d9a' },
  { id: 'shirt2', name: 'Oversized Hoodie', color: '#9b59b6' },
  { id: 'shirt3', name: 'Crop Top', color: '#3498db' },
  { id: 'shirt4', name: 'Polo', color: '#27ae60' },
  { id: 'shirt5', name: 'Jersey', color: '#e74c3c' },
  { id: 'shirt6', name: 'Tank Top', color: '#f39c12' },
  { id: 'shirt7', name: 'Button-Up', color: '#1abc9c' },
  { id: 'shirt8', name: 'Graphic Tee', color: '#e91e63' },
  { id: 'shirt9', name: 'Turtleneck', color: '#455a64' },
  { id: 'shirt10', name: 'Cardigan', color: '#8d6e63' },
];

function ShirtsWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  return (
    <BaseWindow title="Shirts" onClose={onClose} id={id} zIndex={zIndex} isMinimized={isMinimized} onMinimize={onMinimize} onRestore={onRestore} onBringToFront={onBringToFront}>
      <ClothingWindowContent category="shirt" items={ITEMS} />
    </BaseWindow>
  );
}

export default ShirtsWindow;
