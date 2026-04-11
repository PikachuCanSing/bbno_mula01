import React from 'react';
import BaseWindow from './BaseWindow';
import ClothingWindowContent from './ClothingWindowContent';

const ITEMS = [
  { id: 'mkp1', name: 'No Makeup', color: '#ffccbc' },
  { id: 'mkp2', name: 'Natural Glow', color: '#ffab91' },
  { id: 'mkp3', name: 'Smoky Eye', color: '#37474f' },
  { id: 'mkp4', name: 'Glossy Lips', color: '#e91e63' },
  { id: 'mkp5', name: 'Bold Liner', color: '#212121' },
  { id: 'mkp6', name: 'Blush', color: '#f48fb1' },
  { id: 'mkp7', name: 'Full Glam', color: '#c62828' },
  { id: 'mkp8', name: 'Pastel', color: '#b39ddb' },
  { id: 'mkp9', name: 'Graphic Liner', color: '#7c4dff' },
  { id: 'mkp10', name: 'Sun-Kissed', color: '#ff8f00' },
];

function MakeupWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  return (
    <BaseWindow title="Makeup" onClose={onClose} id={id} zIndex={zIndex} isMinimized={isMinimized} onMinimize={onMinimize} onRestore={onRestore} onBringToFront={onBringToFront}>
      <ClothingWindowContent category="makeup" items={ITEMS} />
    </BaseWindow>
  );
}

export default MakeupWindow;