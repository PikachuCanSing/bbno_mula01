import React from 'react';
import BaseWindow from './BaseWindow';
import ClothingWindowContent from './ClothingWindowContent';

const ITEMS = [
  { id: 'hat1', name: 'Beanie', color: '#5c6bc0' },
  { id: 'hat2', name: 'Baseball Cap', color: '#e53935' },
  { id: 'hat3', name: 'Bucket Hat', color: '#f9a825' },
  { id: 'hat4', name: 'Snapback', color: '#212121' },
  { id: 'hat5', name: 'Crown', color: '#ffd600' },
  { id: 'hat6', name: 'Cowboy Hat', color: '#8d6e63' },
  { id: 'hat7', name: 'Beret', color: '#c62828' },
  { id: 'hat8', name: 'Fedora', color: '#37474f' },
  { id: 'hat9', name: 'Top Hat', color: '#1a237e' },
  { id: 'hat10', name: 'Backwards Cap', color: '#00897b' },
];

function HatsWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  return (
    <BaseWindow title="Hats" onClose={onClose} id={id} zIndex={zIndex} isMinimized={isMinimized} onMinimize={onMinimize} onRestore={onRestore} onBringToFront={onBringToFront}>
      <ClothingWindowContent category="hat" items={ITEMS} />
    </BaseWindow>
  );
}

export default HatsWindow;