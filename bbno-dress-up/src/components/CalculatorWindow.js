import React, { useState } from 'react';
import BaseWindow from './BaseWindow';

const btn = (accent) => ({
  fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
  fontSize: '13px',
  fontWeight: 'bold',
  color: accent ? '#e0d0ff' : '#2f2a63',
  backgroundColor: accent ? '#6a88c2' : '#7cd8ef',
  border: '2px solid',
  borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
  cursor: 'pointer',
  userSelect: 'none',
  padding: 0,
});

function CalculatorWindow({ onClose, id, zIndex, isMinimized, onMinimize, onRestore, onBringToFront }) {
  const [display, setDisplay] = useState('0');
  const [pending, setPending] = useState(null); // { value, op }
  const [fresh, setFresh] = useState(true);    // next digit starts new number

  const inputDigit = (d) => {
    if (fresh) {
      setDisplay(d === '.' ? '0.' : d);
      setFresh(false);
    } else {
      if (d === '.' && display.includes('.')) return;
      setDisplay(display === '0' && d !== '.' ? d : display + d);
    }
  };

  const compute = (a, op, b) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 'Error';
      default: return b;
    }
  };

  const handleOp = (op) => {
    const cur = parseFloat(display);
    if (pending && !fresh) {
      const result = compute(pending.value, pending.op, cur);
      const str = typeof result === 'number' ? parseFloat(result.toPrecision(12)).toString() : result;
      setDisplay(str);
      setPending(op === '=' ? null : { value: parseFloat(str), op });
    } else {
      setPending(op === '=' ? null : { value: cur, op });
    }
    setFresh(true);
  };

  const clear = () => { setDisplay('0'); setPending(null); setFresh(true); };
  const clearEntry = () => { setDisplay('0'); setFresh(true); };
  const backspace = () => {
    if (fresh || display.length === 1) { setDisplay('0'); setFresh(true); return; }
    const next = display.slice(0, -1);
    setDisplay(next === '' || next === '-' ? '0' : next);
  };
  const plusMinus = () => setDisplay((parseFloat(display) * -1).toString());
  const percent = () => {
    const cur = parseFloat(display);
    setDisplay(pending ? (pending.value * cur / 100).toString() : (cur / 100).toString());
    setFresh(true);
  };

  const ROWS = [
    [{ l: 'CE', a: false }, { l: 'C', a: false }, { l: '⌫', a: false }, { l: '÷', a: true }],
    [{ l: '7' }, { l: '8' }, { l: '9' }, { l: '×', a: true }],
    [{ l: '4' }, { l: '5' }, { l: '6' }, { l: '-', a: true }],
    [{ l: '1' }, { l: '2' }, { l: '3' }, { l: '+', a: true }],
    [{ l: '±', a: false }, { l: '0' }, { l: '.' }, { l: '=', a: true }],
  ];

  const handleBtn = (l) => {
    if ('0123456789'.includes(l)) return inputDigit(l);
    if (l === '.') return inputDigit('.');
    if (l === 'C') return clear();
    if (l === 'CE') return clearEntry();
    if (l === '⌫') return backspace();
    if (l === '±') return plusMinus();
    if (l === '%') return percent();
    handleOp(l); // +, -, ×, ÷, =
  };

  return (
    <BaseWindow title="Calculator" onClose={onClose} id={id} zIndex={zIndex} isMinimized={isMinimized} onMinimize={onMinimize} onRestore={onRestore} onBringToFront={onBringToFront} initialWidth={240} initialHeight={280}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#7cd8ef', padding: '6px', gap: '4px', boxSizing: 'border-box' }}>
        {/* Display */}
        <div style={{
          backgroundColor: '#ffffff', border: '2px solid', borderColor: '#2f2a63 #bfbaf5 #bfbaf5 #2f2a63',
          padding: '4px 8px', textAlign: 'right',
          fontFamily: '"Tahoma", "MS Sans Serif", Arial, sans-serif',
          fontSize: '20px', fontWeight: 'bold', color: '#2f2a63',
          minHeight: '34px', wordBreak: 'break-all', flexShrink: 0,
        }}>
          {display}
        </div>
        {/* Buttons */}
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'repeat(5, 1fr)', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3px' }}>
          {ROWS.map((row, ri) => row.map(({ l, a }) => (
            <button key={`${ri}-${l}`} style={btn(a)} onClick={() => handleBtn(l)}>{l}</button>
          )))}
        </div>
      </div>
    </BaseWindow>
  );
}

export default CalculatorWindow;
