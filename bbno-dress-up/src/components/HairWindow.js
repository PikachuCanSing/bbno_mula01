import React from 'react';
import BaseWindow from './BaseWindow';
import ClothingWindowContent from './ClothingWindowContent';

const ITEMS = [
  { id: 'hr1', name: 'Mullet', color: '#795548' },
  { id: 'hr2', name: 'Cornrows', color: '#3e2723' },
  { id: 'hr3', name: 'Afro', color: '#212121' },
  { id: 'hr4', name: 'Bun', color: '#6d4c41' },
  { id: 'hr5', name: 'Ponytail', color: '#8d6e63' },
  { id: 'hr6', name: 'Braids', color: '#4e342e' },
  { id: 'hr7', name: 'Short Bob', color: '#ffd54f' },
  { id: 'hr8', name: 'Long Waves', color: '#ff8f00' },
  { id: 'hr9', name: 'Buzz Cut', color: '#5d4037' },
  { id: 'hr10', name: 'Mohawk', color: '#e040fb' },
];

function HairWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  return (
    <BaseWindow title="Hair" onClose={onClose} id={id} zIndex={zIndex} isMinimized={isMinimized} onMinimize={onMinimize} onRestore={onRestore} onBringToFront={onBringToFront}>
      <ClothingWindowContent category="hair" items={ITEMS} />
    </BaseWindow>
  );
}

export default HairWindow;