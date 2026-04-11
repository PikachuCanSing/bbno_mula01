import React from 'react';
import BaseWindow from './BaseWindow';
import ClothingWindowContent from './ClothingWindowContent';

const ITEMS = [
  { id: 'pnt1', name: 'Jeans', color: '#1565c0' },
  { id: 'pnt2', name: 'Shorts', color: '#f57f17' },
  { id: 'pnt3', name: 'Sweatpants', color: '#757575' },
  { id: 'pnt4', name: 'Cargo Pants', color: '#6d8b3a' },
  { id: 'pnt5', name: 'Leggings', color: '#2c2c2c' },
  { id: 'pnt6', name: 'Joggers', color: '#7b1fa2' },
  { id: 'pnt7', name: 'Dress Pants', color: '#263238' },
  { id: 'pnt8', name: 'Skirt', color: '#e91e63' },
  { id: 'pnt9', name: 'Bike Shorts', color: '#00acc1' },
  { id: 'pnt10', name: 'Flare Pants', color: '#d84315' },
];

function PantsWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  return (
    <BaseWindow title="Pants" onClose={onClose} id={id} zIndex={zIndex} isMinimized={isMinimized} onMinimize={onMinimize} onRestore={onRestore} onBringToFront={onBringToFront}>
      <ClothingWindowContent category="pants" items={ITEMS} />
    </BaseWindow>
  );
}

export default PantsWindow;