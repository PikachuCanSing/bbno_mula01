import React, { useState, useCallback } from 'react';
import BaseWindow from './BaseWindow';

const ROWS = 9, COLS = 9, MINES = 10;

const makeBoard = () => {
  const cells = Array(ROWS).fill(null).map(() =>
    Array(COLS).fill(null).map(() => ({ mine: false, revealed: false, flagged: false, count: 0 }))
  );
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!cells[r][c].mine) { cells[r][c].mine = true; placed++; }
  }
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    if (cells[r][c].mine) continue;
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && cells[nr][nc].mine) count++;
    }
    cells[r][c].count = count;
  }
  return cells;
};

const reveal = (board, r, c) => {
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
  if (board[r][c].revealed || board[r][c].flagged) return;
  board[r][c].revealed = true;
  if (board[r][c].count === 0 && !board[r][c].mine) {
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) reveal(board, r + dr, c + dc);
  }
};

function MinesweeperWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  const [board, setBoard] = useState(() => makeBoard());
  const [status, setStatus] = useState('playing'); // playing | won | lost
  const [flags, setFlags] = useState(0);

  const reset = () => { setBoard(makeBoard()); setStatus('playing'); setFlags(0); };

  const checkWin = (b) => b.every(row => row.every(cell => cell.mine ? true : cell.revealed));

  const handleClick = useCallback((r, c) => {
    if (status !== 'playing') return;
    setBoard(prev => {
      if (prev[r][c].revealed || prev[r][c].flagged) return prev;
      const next = prev.map(row => row.map(cell => ({ ...cell })));
      if (next[r][c].mine) {
        next.forEach(row => row.forEach(cell => { if (cell.mine) cell.revealed = true; }));
        setStatus('lost');
        return next;
      }
      reveal(next, r, c);
      if (checkWin(next)) setStatus('won');
      return next;
    });
  }, [status]);

  const handleRightClick = useCallback((e, r, c) => {
    e.preventDefault();
    if (status !== 'playing') return;
    setBoard(prev => {
      if (prev[r][c].revealed) return prev;
      const next = prev.map(row => row.map(cell => ({ ...cell })));
      next[r][c].flagged = !next[r][c].flagged;
      setFlags(f => next[r][c].flagged ? f + 1 : f - 1);
      return next;
    });
  }, [status]);

  const CELL = 28;
  const cellStyle = (cell) => ({
    width: CELL, height: CELL, boxSizing: 'border-box',
    border: '2px solid',
    borderColor: cell.revealed ? '#2f2a63 #bfbaf5 #bfbaf5 #2f2a63' : '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
    backgroundColor: cell.revealed ? (cell.mine ? '#e85d9a' : '#ffffff') : '#7cd8ef',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: 'bold', cursor: cell.revealed ? 'default' : 'pointer',
    color: ['','#1565c0','#2e7d32','#c62828','#4a148c','#b71c1c','#006064','#212121','#546e7a'][cell.count] || '#2f2a63',
    userSelect: 'none',
    fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
  });

  const smiley = status === 'won' ? '😎' : status === 'lost' ? '😵' : '🙂';

  return (
    <BaseWindow title="Minesweeper" onClose={onClose} id={id} zIndex={zIndex} isMinimized={isMinimized} onMinimize={onMinimize} onRestore={onRestore} onBringToFront={onBringToFront} initialWidth={COLS * CELL + 32} initialHeight={ROWS * CELL + 100}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', backgroundColor: '#7cd8ef', padding: '6px', gap: '6px', boxSizing: 'border-box', fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', border: '2px solid', borderColor: '#2f2a63 #bfbaf5 #bfbaf5 #2f2a63', backgroundColor: '#7cd8ef', padding: '4px 8px', boxSizing: 'border-box', flexShrink: 0 }}>
          <div style={{ backgroundColor: '#ffffff', border: '2px solid', borderColor: '#2f2a63 #bfbaf5 #bfbaf5 #2f2a63', padding: '2px 6px', fontSize: '14px', fontWeight: 'bold', color: '#c62828', minWidth: '36px', textAlign: 'center' }}>
            {String(MINES - flags).padStart(3, '0')}
          </div>
          <button onClick={reset} style={{ fontSize: '18px', border: '2px solid', borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5', backgroundColor: '#7cd8ef', cursor: 'pointer', padding: '2px 6px' }}>{smiley}</button>
          <div style={{ backgroundColor: '#ffffff', border: '2px solid', borderColor: '#2f2a63 #bfbaf5 #bfbaf5 #2f2a63', padding: '2px 6px', fontSize: '14px', fontWeight: 'bold', color: '#c62828', minWidth: '36px', textAlign: 'center' }}>
            000
          </div>
        </div>
        {/* Grid */}
        <div style={{ border: '2px solid', borderColor: '#2f2a63 #bfbaf5 #bfbaf5 #2f2a63', display: 'inline-block', flexShrink: 0 }}>
          {board.map((row, r) => (
            <div key={r} style={{ display: 'flex' }}>
              {row.map((cell, c) => (
                <div key={c} style={cellStyle(cell)} onClick={() => handleClick(r, c)} onContextMenu={e => handleRightClick(e, r, c)}>
                  {cell.flagged && !cell.revealed ? '🚩' : cell.revealed ? (cell.mine ? '💣' : cell.count || '') : ''}
                </div>
              ))}
            </div>
          ))}
        </div>
        {status !== 'playing' && <div style={{ fontSize: '12px', fontWeight: 'bold', color: status === 'won' ? '#2e7d32' : '#c62828' }}>{status === 'won' ? 'You win! 😎' : 'Boom! 😵'}</div>}
      </div>
    </BaseWindow>
  );
}

export default MinesweeperWindow;
