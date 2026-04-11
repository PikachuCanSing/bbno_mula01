import React, { useEffect, useRef, useState, useCallback } from 'react';
import BaseWindow from './BaseWindow';

const CELL = 16;
const COLS = 18;
const ROWS = 18;
const W = COLS * CELL;
const H = ROWS * CELL;

const randFood = (snake) => {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
};

function SnakeWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const tickRef = useRef(null);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | running | dead

  const initState = () => ({
    snake: [{ x: 9, y: 9 }],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 5, y: 5 },
    score: 0,
  });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !stateRef.current) return;
    const ctx = canvas.getContext('2d');
    const { snake, food } = stateRef.current;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = '#e8f4f8';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, H); ctx.stroke(); }
    for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(W, y * CELL); ctx.stroke(); }

    // Food
    ctx.fillStyle = '#e85d9a';
    ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);

    // Snake
    snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#2f2a63' : '#6a88c2';
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    s.dir = s.nextDir;
    const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || s.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      clearInterval(tickRef.current);
      setStatus('dead');
      return;
    }

    const ate = head.x === s.food.x && head.y === s.food.y;
    const newSnake = [head, ...s.snake];
    if (!ate) newSnake.pop();
    else { s.food = randFood(newSnake); s.score += 1; setScore(s.score); }
    s.snake = newSnake;
    draw();
  }, [draw]);

  const start = () => {
    clearInterval(tickRef.current);
    stateRef.current = initState();
    stateRef.current.food = randFood(stateRef.current.snake);
    setScore(0);
    setStatus('running');
    draw();
    tickRef.current = setInterval(tick, 130);
  };

  useEffect(() => {
    draw();
    return () => clearInterval(tickRef.current);
  }, [draw]);

  useEffect(() => {
    const handleKey = (e) => {
      if (status !== 'running') return;
      const s = stateRef.current;
      if (!s) return;
      const map = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } };
      const d = map[e.key];
      if (!d) return;
      if (d.x === -s.dir.x && d.y === -s.dir.y) return;
      e.preventDefault();
      s.nextDir = d;
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [status]);

  const btnStyle = { backgroundColor: '#7cd8ef', border: '2px solid', borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5', padding: '3px 14px', fontSize: '11px', fontWeight: 'bold', color: '#2f2a63', cursor: 'pointer', fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif' };

  return (
    <BaseWindow title="Snake" onClose={onClose} id={id} zIndex={zIndex} isMinimized={isMinimized} onMinimize={onMinimize} onRestore={onRestore} onBringToFront={onBringToFront} initialWidth={W + 24} initialHeight={H + 80}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', backgroundColor: '#7cd8ef', padding: '6px', gap: '6px', boxSizing: 'border-box', fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2f2a63' }}>Score: {score}</span>
          <button style={btnStyle} onClick={start}>{status === 'idle' ? 'Start' : 'Restart'}</button>
          {status === 'dead' && <span style={{ fontSize: '11px', color: '#c62828', fontWeight: 'bold' }}>Game Over!</span>}
        </div>
        <canvas ref={canvasRef} width={W} height={H} style={{ border: '2px solid', borderColor: '#2f2a63 #bfbaf5 #bfbaf5 #2f2a63', display: 'block', flexShrink: 0 }} />
        {status === 'idle' && <div style={{ fontSize: '10px', color: '#2f2a63' }}>Use arrow keys to move</div>}
      </div>
    </BaseWindow>
  );
}

export default SnakeWindow;
