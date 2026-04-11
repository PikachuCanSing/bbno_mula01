import React, { useState, useEffect } from 'react';
import BaseWindow from './BaseWindow';

const SYMBOLS = ['🎵', '🎤', '🎸', '🕶️', '👟', '💜', '⭐', '🎧'];
const makeCards = () => {
  const pairs = [...SYMBOLS, ...SYMBOLS].map((s, i) => ({ id: i, symbol: s, flipped: false, matched: false }));
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs;
};

function MatchingWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  const [cards, setCards] = useState(makeCards);
  const [flipped, setFlipped] = useState([]);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const reset = () => { setCards(makeCards()); setFlipped([]); setLocked(false); setMoves(0); setWon(false); };

  const handleClick = (idx) => {
    if (locked || cards[idx].flipped || cards[idx].matched) return;
    const newCards = cards.map((c, i) => i === idx ? { ...c, flipped: true } : c);
    const newFlipped = [...flipped, idx];
    setCards(newCards);
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = newFlipped;
      if (newCards[a].symbol === newCards[b].symbol) {
        const matched = newCards.map((c, i) => (i === a || i === b) ? { ...c, matched: true } : c);
        setCards(matched);
        setFlipped([]);
        setLocked(false);
        if (matched.every(c => c.matched)) setWon(true);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => (i === a || i === b) ? { ...c, flipped: false } : c));
          setFlipped([]);
          setLocked(false);
        }, 900);
      }
    }
  };

  useEffect(() => { reset(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const btnStyle = { backgroundColor: '#7cd8ef', border: '2px solid', borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5', padding: '3px 14px', fontSize: '11px', fontWeight: 'bold', color: '#2f2a63', cursor: 'pointer', fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif' };

  return (
    <BaseWindow title="Matching" onClose={onClose} id={id} zIndex={zIndex} isMinimized={isMinimized} onMinimize={onMinimize} onRestore={onRestore} onBringToFront={onBringToFront} initialWidth={340} initialHeight={380}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', backgroundColor: '#7cd8ef', padding: '8px', gap: '8px', boxSizing: 'border-box', fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#2f2a63' }}>Moves: {moves}</span>
          <button style={btnStyle} onClick={reset}>New Game</button>
          {won && <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#2e7d32' }}>You win! 🎉</span>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', backgroundColor: '#ffffff', border: '2px solid', borderColor: '#2f2a63 #bfbaf5 #bfbaf5 #2f2a63', padding: '8px', flexShrink: 0 }}>
          {cards.map((card, i) => (
            <div key={card.id} onClick={() => handleClick(i)} style={{
              width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: card.flipped || card.matched ? '28px' : '20px',
              border: '2px solid', borderColor: card.matched ? '#2e7d32 #2e7d32 #2e7d32 #2e7d32' : '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
              backgroundColor: card.matched ? '#e8f5e9' : card.flipped ? '#ffffff' : '#6a88c2',
              cursor: card.matched || card.flipped ? 'default' : 'pointer',
              userSelect: 'none',
              transition: 'background-color 0.15s',
            }}>
              {card.flipped || card.matched ? card.symbol : '?'}
            </div>
          ))}
        </div>
        <div style={{ fontSize: '10px', color: '#2f2a63' }}>Match all pairs to win!</div>
      </div>
    </BaseWindow>
  );
}

export default MatchingWindow;
