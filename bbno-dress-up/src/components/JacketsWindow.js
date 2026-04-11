import React from 'react';
import BaseWindow from './BaseWindow';
import ClothingWindowContent from './ClothingWindowContent';

const ITEMS = [
  { id: 'jkt1', name: 'Denim Jacket', color: '#5b7fa6' },
  { id: 'jkt2', name: 'Leather Jacket', color: '#2c2c2c' },
  { id: 'jkt3', name: 'Windbreaker', color: '#e040fb' },
  { id: 'jkt4', name: 'Puffer Jacket', color: '#e64a19' },
  { id: 'jkt5', name: 'Blazer', color: '#455a64' },
  { id: 'jkt6', name: 'Hoodie', color: '#9c27b0' },
  { id: 'jkt7', name: 'Varsity Jacket', color: '#b71c1c' },
  { id: 'jkt8', name: 'Trench Coat', color: '#795548' },
  { id: 'jkt9', name: 'Bomber Jacket', color: '#558b2f' },
  { id: 'jkt10', name: 'Crop Jacket', color: '#f06292' },
];

function JacketsWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  return (
    <BaseWindow title="Jackets" onClose={onClose} id={id} zIndex={zIndex} isMinimized={isMinimized} onMinimize={onMinimize} onRestore={onRestore} onBringToFront={onBringToFront}>
      <ClothingWindowContent category="jacket" items={ITEMS} />
    </BaseWindow>
  );
}

export default JacketsWindow;