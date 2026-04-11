import React from 'react';
import BaseWindow from './BaseWindow';
import ClothingWindowContent from './ClothingWindowContent';

const ITEMS = [
  { id: 'sck1', name: 'Ankle Socks', color: '#ffffff' },
  { id: 'sck2', name: 'Knee Highs', color: '#e91e63' },
  { id: 'sck3', name: 'No-Show', color: '#bdbdbd' },
  { id: 'sck4', name: 'Striped', color: '#1565c0' },
  { id: 'sck5', name: 'Fuzzy Socks', color: '#f48fb1' },
  { id: 'sck6', name: 'Tube Socks', color: '#e0e0e0' },
  { id: 'sck7', name: 'Thigh Highs', color: '#2c2c2c' },
  { id: 'sck8', name: 'Fishnet', color: '#212121' },
];

function SocksWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  return (
    <BaseWindow title="Socks" onClose={onClose} id={id} zIndex={zIndex} isMinimized={isMinimized} onMinimize={onMinimize} onRestore={onRestore} onBringToFront={onBringToFront}>
      <ClothingWindowContent category="socks" items={ITEMS} />
    </BaseWindow>
  );
}

export default SocksWindow;