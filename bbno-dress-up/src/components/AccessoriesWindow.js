import React from 'react';
import BaseWindow from './BaseWindow';
import ClothingWindowContent from './ClothingWindowContent';

const ITEMS = [
  { id: 'acc1', name: 'Chain', color: '#bdbdbd' },
  { id: 'acc2', name: 'Sunglasses', color: '#212121' },
  { id: 'acc3', name: 'Watch', color: '#ffd600' },
  { id: 'acc4', name: 'Earrings', color: '#e040fb' },
  { id: 'acc5', name: 'Bracelet', color: '#ffb74d' },
  { id: 'acc6', name: 'Ring', color: '#c0ca33' },
  { id: 'acc7', name: 'Bag', color: '#6d4c41' },
  { id: 'acc8', name: 'Belt', color: '#3e2723' },
  { id: 'acc9', name: 'Bandana', color: '#e53935' },
  { id: 'acc10', name: 'Headphones', color: '#1565c0' },
];

function AccessoriesWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  return (
    <BaseWindow title="Accessories" onClose={onClose} id={id} zIndex={zIndex} isMinimized={isMinimized} onMinimize={onMinimize} onRestore={onRestore} onBringToFront={onBringToFront}>
      <ClothingWindowContent category="accessories" items={ITEMS} />
    </BaseWindow>
  );
}

export default AccessoriesWindow;