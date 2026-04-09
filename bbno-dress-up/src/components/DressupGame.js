import React, { useState, useEffect, useRef } from 'react';
import ChatWindow from './ChatWindow';
import CalendarWindow from './CalendarWindow';
import InternetExplorerWindow from './InternetExplorerWindow';
import ShirtsWindow from './ShirtsWindow';
import HatsWindow from './HatsWindow';
import JacketsWindow from './JacketsWindow';
import PantsWindow from './PantsWindow';
import ShoesWindow from './ShoesWindow';
import SocksWindow from './SocksWindow';
import HairWindow from './HairWindow';
import MakeupWindow from './MakeupWindow';
import AccessoriesWindow from './AccessoriesWindow';
import CalculatorWindow from './CalculatorWindow';
import BbnoExplorerWindow from './BbnoExplorerWindow';
import ClockWindow from './ClockWindow';
import SnakeWindow from './SnakeWindow';
import MinesweeperWindow from './MinesweeperWindow';
import MatchingWindow from './MatchingWindow';
import MailWindow from './MailWindow';
import NotepadWindow from './NotepadWindow';
import MyComputerWindow from './MyComputerWindow';
import FolderWindow from './FolderWindow';
import RecycleBinWindow from './RecycleBinWindow';
import MusicWindow from './MusicWindow';
import PhotosWindow from './PhotosWindow';
import Window from './Window';
import '../styles/vaporwave.css';
import { useWindowContext } from '../contexts/WindowContext';

function IconAppWindow({ id, app, onClose }) {
  return (
    <Window
      title={app.label}
      id={id}
      onClose={onClose}
      initialWidth={420}
      initialHeight={360}
    >
      <div style={{
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#000'
      }}>
        <img
          src={process.env.PUBLIC_URL + '/assets/art/' + app.icon}
onError={(e) => { e.target.src = process.env.PUBLIC_URL + '/assets/art/folder.new.svg'; }}
          alt={app.label}
          style={{ width: '80px', height: '80px', marginBottom: '12px' }}
        />
        <h2 style={{ margin: 0, marginBottom: '8px', color: '#2b5797', fontSize: '20px' }}>{app.label}</h2>
        <p style={{ margin: 0, textAlign: 'center', fontSize: '14px' }}>
          This is the "{app.label}" window. Features are placeholder for now, as requested.
        </p>
      </div>
    </Window>
  );
}

function DressupGame() {
  // Keep your state setup
  const { openChatWindow, setChatWindowOpen } = useWindowContext();


  const [minimizedWindows, setMinimizedWindows] = useState(new Set());
  const [highestZIndex, setHighestZIndex] = useState(10000);
  const [selectedIcons, setSelectedIcons] = useState(new Set());
  const [selectionBox, setSelectionBox] = useState(null);
  const [dragMode, setDragMode] = useState('none');

  const desktopRef = useRef(null);
  const draggingIconRef = useRef(null);
  const iconDragGroupRef = useRef([]);
  const dragStartPositionsRef = useRef({});
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, iconX: 0, iconY: 0 });
  const dragThresholdRef = useRef(0);
  const draggingPositionRef = useRef({ x: 0, y: 0 });

  const handleIconMouseDown = (e, iconType) => {
    e.preventDefault();
    e.stopPropagation();

    const position = iconPositions[iconType] || { x: 0, y: 0 };
    const group = selectedIcons.has(iconType) ? Array.from(selectedIcons) : [iconType];
    draggingIconRef.current = iconType;
    iconDragGroupRef.current = group;
    dragStartPositionsRef.current = group.reduce((acc, item) => {
      acc[item] = iconPositions[item] || { x: 0, y: 0 };
      return acc;
    }, {});

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      iconX: position.x,
      iconY: position.y
    };
    draggingPositionRef.current = position;
    dragThresholdRef.current = 0;
    setDragMode('icon');
  };

  const handleIconClick = (app) => {
    if (dragThresholdRef.current > 25) {
      return;
    }

    openWindow(app);
  };

  const handleDesktopMouseDown = (e) => {
    if (e.target.closest('.window-titlebar') || e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    if (e.target !== desktopRef.current) return;
    e.preventDefault();


    setSelectedIcons(new Set());
    setSelectionBox({ left: e.clientX, top: e.clientY, width: 0, height: 0 });
    setDragMode('selection');
    dragStartRef.current = { mouseX: e.clientX, mouseY: e.clientY, iconX: 0, iconY: 0 };
  };

  const handleDesktopMouseMove = (e) => {
    if (dragMode === 'selection') {
      const startX = dragStartRef.current.mouseX;
      const startY = dragStartRef.current.mouseY;
      const currentX = e.clientX;
      const currentY = e.clientY;
      const left = Math.min(startX, currentX);
      const top = Math.min(startY, currentY);
      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);
      setSelectionBox({ left, top, width, height });
      return;
    }

    if (dragMode === 'icon') {
      const desktop = desktopRef.current;
      if (!desktop) return;

      const deltaX = e.clientX - dragStartRef.current.mouseX;
      const deltaY = e.clientY - dragStartRef.current.mouseY;
      const distanceSq = deltaX * deltaX + deltaY * deltaY;

      dragThresholdRef.current = distanceSq;
      if (distanceSq < 25) return;

      const desktopRect = desktop.getBoundingClientRect();
      const maxX = Math.max(0, desktopRect.width - GRID_SIZE);
      const maxY = Math.max(0, desktopRect.height - GRID_SIZE);

      const basePositions = dragStartPositionsRef.current;
      const newPositions = { ...iconPositions };
      iconDragGroupRef.current.forEach((iconType) => {
        const original = basePositions[iconType] || { x: 0, y: 0 };
        const rawX = original.x + deltaX;
        const rawY = original.y + deltaY;
        const clampedX = Math.max(0, Math.min(rawX, maxX));
        const clampedY = Math.max(0, Math.min(rawY, maxY));
        newPositions[iconType] = { x: clampedX, y: clampedY };
      });

      draggingPositionRef.current = { x: deltaX, y: deltaY };
      setIconPositions(newPositions);
    }
  };

  const GRID_SIZE = 104;

  const getCellCoordinates = (x, y) => ({
    col: Math.round(x / GRID_SIZE),
    row: Math.round(y / GRID_SIZE)
  });

  const cellKey = (col, row) => `${col},${row}`;

  const findNearestAvailableCell = (targetCol, targetRow, occupiedSet) => {
    if (!occupiedSet.has(cellKey(targetCol, targetRow))) {
      return { col: targetCol, row: targetRow };
    }

    for (let radius = 1; radius <= 50; radius++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const dy = radius - Math.abs(dx);
        const candidates = [targetRow + dy, targetRow - dy];
        for (const candidateRow of candidates) {
          const candidateCol = targetCol + dx;
          const key = cellKey(candidateCol, candidateRow);
          if (!occupiedSet.has(key) && candidateCol >= 0 && candidateRow >= 0) {
            return { col: candidateCol, row: candidateRow };
          }
        }
      }
    }

    return { col: targetCol, row: targetRow };
  };

  const handleDesktopMouseUp = () => {
    if (dragMode === 'selection') {
      if (selectionBox) {
        const desktop = desktopRef.current;
        if (desktop) {
          const rect = desktop.getBoundingClientRect();
          const selLeft = selectionBox.left - rect.left;
          const selTop = selectionBox.top - rect.top;
          const selRight = selLeft + selectionBox.width;
          const selBottom = selTop + selectionBox.height;

          const selected = new Set();
          desktopApps.forEach((app) => {
            const pos = iconPositions[app.type] || { x: 0, y: 0 };
            const iconLeft = pos.x;
            const iconTop = pos.y;
            const iconRight = iconLeft + 90;
            const iconBottom = iconTop + 90;

            const overlaps = !(iconRight < selLeft || iconLeft > selRight || iconBottom < selTop || iconTop > selBottom);
            if (overlaps) {
              selected.add(app.type);
            }
          });
          setSelectedIcons(selected);
        }
      }
      setSelectionBox(null);
      setDragMode('none');
    }

    if (dragMode === 'icon') {
      const wasDragged = dragThresholdRef.current >= 25;
      const dragGroup = [...iconDragGroupRef.current];
      draggingIconRef.current = null;
      iconDragGroupRef.current = [];
      setDragMode('none');

      if (wasDragged) {
        const desktop = desktopRef.current;
        const updated = { ...iconPositions };
        const occupied = new Set();

        Object.keys(iconPositions).forEach((type) => {
          if (!dragGroup.includes(type)) {
            const p = iconPositions[type] || { x: 0, y: 0 };
            const cell = getCellCoordinates(p.x, p.y);
            occupied.add(cellKey(cell.col, cell.row));
          }
        });

        dragGroup.forEach((iconType) => {
          const pos = iconPositions[iconType] || { x: 0, y: 0 };
          const targetCell = getCellCoordinates(pos.x, pos.y);
          const bestCell = findNearestAvailableCell(targetCell.col, targetCell.row, occupied);
          const clampedX = Math.max(0, Math.min(bestCell.col * GRID_SIZE, desktop ? Math.max(0, desktop.getBoundingClientRect().width - GRID_SIZE) : bestCell.col * GRID_SIZE));
          const clampedY = Math.max(0, Math.min(bestCell.row * GRID_SIZE, desktop ? Math.max(0, desktop.getBoundingClientRect().height - GRID_SIZE) : bestCell.row * GRID_SIZE));

          updated[iconType] = { x: clampedX, y: clampedY };
          occupied.add(cellKey(bestCell.col, bestCell.row));
        });

        setIconPositions(updated);
      }
    }
  };

  const bringToFront = (id) => {
    setHighestZIndex((prev) => {
      const next = prev + 1;
      setOpenWindows((prevWindows) =>
        prevWindows.map((w) => (w.id === id ? { ...w, zIndex: next } : w))
      );
      return next;
    });
  };

  const handleWindowMinimize = (id) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  };

  const handleWindowRestore = (id) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: false } : w))
    );
    bringToFront(id);
  };

  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [activeSubSubmenu, setActiveSubSubmenu] = useState(null);

  const closeStartMenu = () => {
    setIsStartMenuOpen(false);
    setActiveSubmenu(null);
    setActiveSubSubmenu(null);
  };

  const getIconSrc = (iconPath) => {
    const rawPath = iconPath.startsWith('/') ? iconPath : `/assets/art/${iconPath}`;
    const prefix = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '';
    return encodeURI(`${prefix}${rawPath}`);
  };

  const getFallbackIcon = () => getIconSrc('/assets/art/chat NEW.svg');

  const desktopApps = [
    { type: 'accessories', label: 'Accessories', icon: 'accessories.new.svg' },
    { type: 'bbnoexplorer', label: 'bbno Explorer', icon: 'bbnoexplorer.new.svg' },
    { type: 'calculator', label: 'Calculator', icon: 'calculator.new.svg' },
    { type: 'calendar', label: 'Calendar', icon: 'calendar.new.svg' },
    { type: 'chat', label: 'Chat', icon: 'chat.new.svg' },
    { type: 'clock', label: 'Clock', icon: 'clock.new.svg' },
    { type: 'folder', label: 'Folder', icon: 'folder.new.svg' },
    { type: 'hair', label: 'Hair', icon: 'hair.new.svg' },
    { type: 'hats', label: 'Hats', icon: 'hats.new.svg' },
    { type: 'jackets', label: 'Jackets', icon: 'jackets.new.svg' },
    { type: 'mail', label: 'Mail', icon: 'mail.new.svg' },
    { type: 'makeup', label: 'Makeup', icon: 'makeupnew.svg' },
    { type: 'matching', label: 'Matching', icon: 'matching.new.svg' },
    { type: 'minesweeper', label: 'Minesweeper', icon: 'minesweeper.new.svg' },
    { type: 'music', label: 'Music', icon: 'music.new.svg' },
    { type: 'mycomputer', label: 'My Computer', icon: 'mycomputer.new.svg' },
    { type: 'notepad', label: 'Notepad', icon: 'notepadnew.svg' },
    { type: 'pants', label: 'Pants', icon: 'pants.new.svg' },
    { type: 'photos', label: 'Photos', icon: 'photos.new.svg' },
    { type: 'recyclebin', label: 'Recycle Bin', icon: 'recylcebin.new.svg' },
    { type: 'shirts', label: 'Shirts', icon: 'shirts.new.svg' },
    { type: 'shoes', label: 'Shoes', icon: 'shoes.new.svg' },
    { type: 'snake', label: 'Snake', icon: 'snake.new.svg' },
    { type: 'socks', label: 'Socks', icon: 'socks.new.svg' }
  ];

  const [openWindows, setOpenWindows] = useState([]);

  const [iconPositions, setIconPositions] = useState(() => {
    const init = {};
    const iconHeight = 104;
    const iconWidth = 104;
    const availableHeight = window.innerHeight - 60;
    const iconsPerColumn = Math.floor(availableHeight / iconHeight);
    
    desktopApps.forEach((app, index) => {
      const col = Math.floor(index / iconsPerColumn);
      const row = index % iconsPerColumn;
      init[app.type] = { x: col * iconWidth + 10, y: row * iconHeight + 10 };
    });
    return init;
  });

  const closeWindow = (id) => {
    const windowToClose = openWindows.find((window) => window.id === id);
    if (windowToClose && windowToClose.type === 'chat') {
      setChatWindowOpen(false);
    }
    setOpenWindows((prev) => prev.filter((window) => window.id !== id));
    setMinimizedWindows((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const openWindow = (app) => {
    if (app.type === 'chat' && !openChatWindow()) {
      return;
    }

    // For singleton windows, bring to front if already open
    const existing = openWindows.find(w => w.type === app.type);
    if (existing) {
      if (existing.isMinimized) {
        handleWindowRestore(existing.id);
      } else {
        bringToFront(existing.id);
      }
      return;
    }

    const newId = `${app.type}_${Date.now()}`;
    setOpenWindows((prev) => {
      const nextZ = highestZIndex + 1;
      setHighestZIndex(nextZ);
      return [...prev, { ...app, id: newId, zIndex: nextZ, isMinimized: false }];
    });

    // ensure context consistency
    if (app.type === 'chat') {
      setChatWindowOpen(true);
    }
  };

  // Start menu style helpers
  const smItem = (active) => ({
    position: 'relative', display: 'flex', alignItems: 'center',
    padding: '3px 6px 3px 2px', cursor: 'default', userSelect: 'none',
    whiteSpace: 'nowrap', fontSize: '11px',
    fontFamily: '"Tahoma", "MS Sans Serif", sans-serif',
    backgroundColor: active ? '#2f2a63' : 'transparent',
    color: active ? '#e0d0ff' : '#ffffff',
  });
  const smIcon = { width: '22px', flexShrink: 0, fontSize: '15px' };
  const smLabel = { flex: 1 };
  const smArrow = { fontSize: '8px', marginLeft: '6px' };
  const smPanel = {
    position: 'absolute', left: '100%', top: 0, minWidth: '180px',
    backgroundColor: '#6a88c2', border: '2px solid',
    borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
    boxShadow: '2px 2px 0px #1a0a2e', zIndex: 1003,
  };

  // Render the component
  return (
   <div className="dressup-game vaporwave-background" style={{ 
  width: '100%', 
  minHeight: '100vh',
  padding: '20px',
  position: 'relative',
  backgroundImage: `url(${process.env.PUBLIC_URL}/assets/art/background.png)`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  cursor: `url(${process.env.PUBLIC_URL}/assets/art/cursor.png) 0 0, auto`
}}>
   {/* Vaporwave elements */}
      <div className="vaporwave-grid"></div>
     <div style={{
  position: 'absolute',
  top: '20%',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '280px',
  height: '280px',
  borderRadius: '50%',
  background: 'linear-gradient(to bottom, #ff66ff 0%, #ff44ee 30%, #ff22cc 70%, #cc00aa 100%)',
  boxShadow: '0 0 60px 20px rgba(255, 100, 255, 0.5), 0 0 120px 40px rgba(200, 0, 200, 0.3), 0 0 200px 80px rgba(180, 0, 220, 0.15)',
  pointerEvents: 'none',
  zIndex: 2,
  animation: 'sunFloat 6s ease-in-out infinite'
}}>
</div>
{/* Twinkling stars */}
{[
  { top: '2%',  left: '8%',  size: 1, duration: '2.1s', delay: '0s'   },
  { top: '5%',  left: '18%', size: 1, duration: '3.4s', delay: '0.5s' },
  { top: '1%',  left: '28%', size: 1, duration: '2.8s', delay: '1.2s' },
  { top: '7%',  left: '38%', size: 1, duration: '1.9s', delay: '0.3s' },
  { top: '3%',  left: '48%', size: 1, duration: '3.1s', delay: '0.8s' },
  { top: '9%',  left: '58%', size: 1, duration: '2.5s', delay: '1.5s' },
  { top: '2%',  left: '67%', size: 1, duration: '3.8s', delay: '0.2s' },
  { top: '6%',  left: '76%', size: 1, duration: '2.3s', delay: '1.8s' },
  { top: '4%',  left: '85%', size: 1, duration: '2.9s', delay: '0.6s' },
  { top: '11%', left: '93%', size: 1, duration: '3.2s', delay: '1.1s' },
  { top: '14%', left: '12%', size: 1, duration: '2.6s', delay: '0.9s' },
  { top: '12%', left: '22%', size: 1, duration: '3.5s', delay: '1.4s' },
  { top: '18%', left: '33%', size: 1, duration: '2.2s', delay: '0.7s' },
  { top: '15%', left: '44%', size: 1, duration: '3.0s', delay: '1.3s' },
  { top: '20%', left: '54%', size: 1, duration: '2.7s', delay: '0.4s' },
  { top: '16%', left: '63%', size: 1, duration: '3.6s', delay: '1.6s' },
  { top: '22%', left: '72%', size: 1, duration: '2.4s', delay: '0.1s' },
  { top: '19%', left: '82%', size: 1, duration: '3.3s', delay: '1.0s' },
  { top: '25%', left: '5%',  size: 1, duration: '2.0s', delay: '1.7s' },
  { top: '28%', left: '16%', size: 1, duration: '3.7s', delay: '0.6s' },
  { top: '24%', left: '42%', size: 1, duration: '2.5s', delay: '1.9s' },
  { top: '30%', left: '60%', size: 1, duration: '3.1s', delay: '0.3s' },
  { top: '27%', left: '78%', size: 1, duration: '2.8s', delay: '1.2s' },
  { top: '32%', left: '90%', size: 1, duration: '3.4s', delay: '0.8s' },
].map((star, i) => (
  <span key={i} className="star" style={{
  top: star.top,
  left: star.left,
  width: `${star.size}px`,
  height: `${star.size}px`,
  animationDuration: star.duration,
  animationDelay: star.delay,
  zIndex: 6,
  backgroundColor: '#fffde7',
  filter: 'drop-shadow(0 0 2px rgba(255,255,220,0.9))',
}} />
))}
```
      
      {/* Desktop icons from art folder */}
      <div
        ref={desktopRef}
        onMouseDown={handleDesktopMouseDown}
        onMouseMove={handleDesktopMouseMove}
        onMouseUp={handleDesktopMouseUp}
        style={{
          position: 'absolute',
          top: '0px',
          left: '0px',
          right: '0px',
          bottom: '0px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 104px)',
          rowGap: '14px',
          columnGap: '14px',
          zIndex: 5,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {desktopApps.map((app) => {
          const pos = iconPositions[app.type] || { x: 0, y: 0 };
          const selected = selectedIcons.has(app.type);
          return (
            <div
              key={app.type}
              onMouseDown={(e) => handleIconMouseDown(e, app.type)}
              onDoubleClick={() => handleIconClick(app)}
              style={{
                position: 'absolute',
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                width: '90px',
                height: '90px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: `url(${process.env.PUBLIC_URL}/assets/art/cursorpointer.png) 0 0, pointer`,
                padding: '4px',
                userSelect: 'none',
                backgroundColor: selected ? 'rgba(100, 140, 194, 0.5)' : 'transparent'
              }}
            >
              <img
                src={getIconSrc(app.icon)}
                alt={app.label}
                style={{
                  width: '64px',
                  height: '64px',
                  objectFit: 'contain',
                  marginBottom: '2px',
                  imageRendering: 'pixelated',
                  filter: 'drop-shadow(1px 0 0 #1a0a2e) drop-shadow(-1px 0 0 #1a0a2e) drop-shadow(0 1px 0 #1a0a2e) drop-shadow(0 -1px 0 #1a0a2e) drop-shadow(3px 3px 0 #1a0a2e)'
                }}
                onError={(e) => { e.target.src = getFallbackIcon(); }}
              />
              <span style={{ fontSize: '11px', textAlign: 'center', lineHeight: '12px', color: 'white' }}>{app.label}</span>
            </div>
          );
        })}
      </div>
      {selectionBox && (
        <div
          style={{
            position: 'fixed',
            left: selectionBox.left,
            top: selectionBox.top,
            width: selectionBox.width,
            height: selectionBox.height,
            backgroundColor: 'rgba(180, 160, 255, 0.25)',
            border: '1px solid #b4a0ff',
            pointerEvents: 'none',
            zIndex: 6
          }}
        />
      )}
      
      
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 9999
      }}>

        {/* Windows */}
        {openWindows.map((window) => {
          if (window.type === 'chat') {
            return (
              <ChatWindow key={window.id} id={window.id} onClose={closeWindow} />
            );
          } else if (window.type === 'calendar') {
            return (
              <CalendarWindow key={window.id} id={window.id} onClose={closeWindow} zIndex={window.zIndex} isMinimized={window.isMinimized} onMinimize={handleWindowMinimize} onRestore={handleWindowRestore} onBringToFront={bringToFront} />
            );
          } else if (window.type === 'bbnoexplorer') {
            return (
              <BbnoExplorerWindow key={window.id} id={window.id} onClose={closeWindow} zIndex={window.zIndex} isMinimized={window.isMinimized} onMinimize={handleWindowMinimize} onRestore={handleWindowRestore} onBringToFront={bringToFront} />
            );
          } else if (window.type === 'shirts') {
            return (
              <ShirtsWindow key={window.id} id={window.id} onClose={closeWindow} zIndex={window.zIndex} isMinimized={window.isMinimized} onMinimize={handleWindowMinimize} onRestore={handleWindowRestore} onBringToFront={bringToFront} />
            );
          } else if (window.type === 'hats') {
            return (
              <HatsWindow key={window.id} id={window.id} onClose={closeWindow} zIndex={window.zIndex} isMinimized={window.isMinimized} onMinimize={handleWindowMinimize} onRestore={handleWindowRestore} onBringToFront={bringToFront} />
            );
          } else if (window.type === 'jackets') {
            return (
              <JacketsWindow key={window.id} id={window.id} onClose={closeWindow} zIndex={window.zIndex} isMinimized={window.isMinimized} onMinimize={handleWindowMinimize} onRestore={handleWindowRestore} onBringToFront={bringToFront} />
            );
          } else if (window.type === 'pants') {
            return (
              <PantsWindow key={window.id} id={window.id} onClose={closeWindow} zIndex={window.zIndex} isMinimized={window.isMinimized} onMinimize={handleWindowMinimize} onRestore={handleWindowRestore} onBringToFront={bringToFront} />
            );
          } else if (window.type === 'shoes') {
            return (
              <ShoesWindow key={window.id} id={window.id} onClose={closeWindow} zIndex={window.zIndex} isMinimized={window.isMinimized} onMinimize={handleWindowMinimize} onRestore={handleWindowRestore} onBringToFront={bringToFront} />
            );
          } else if (window.type === 'socks') {
            return (
              <SocksWindow key={window.id} id={window.id} onClose={closeWindow} zIndex={window.zIndex} isMinimized={window.isMinimized} onMinimize={handleWindowMinimize} onRestore={handleWindowRestore} onBringToFront={bringToFront} />
            );
          } else if (window.type === 'hair') {
            return (
              <HairWindow key={window.id} id={window.id} onClose={closeWindow} zIndex={window.zIndex} isMinimized={window.isMinimized} onMinimize={handleWindowMinimize} onRestore={handleWindowRestore} onBringToFront={bringToFront} />
            );
          } else if (window.type === 'makeup') {
            return (
              <MakeupWindow key={window.id} id={window.id} onClose={closeWindow} zIndex={window.zIndex} isMinimized={window.isMinimized} onMinimize={handleWindowMinimize} onRestore={handleWindowRestore} onBringToFront={bringToFront} />
            );
          } else if (window.type === 'accessories') {
            return (
              <AccessoriesWindow key={window.id} id={window.id} onClose={closeWindow} zIndex={window.zIndex} isMinimized={window.isMinimized} onMinimize={handleWindowMinimize} onRestore={handleWindowRestore} onBringToFront={bringToFront} />
            );
          } else if (window.type === 'calculator') {
            return (
              <CalculatorWindow key={window.id} id={window.id} onClose={closeWindow} zIndex={window.zIndex} isMinimized={window.isMinimized} onMinimize={handleWindowMinimize} onRestore={handleWindowRestore} onBringToFront={bringToFront} />
            );
          } else if (window.type === 'clock') {
            return (
              <ClockWindow key={window.id} id={window.id} onClose={closeWindow} zIndex={window.zIndex} isMinimized={window.isMinimized} onMinimize={handleWindowMinimize} onRestore={handleWindowRestore} onBringToFront={bringToFront} />
            );
          } else if (window.type === 'snake') {
            return (
              <SnakeWindow key={window.id} id={window.id} onClose={closeWindow} zIndex={window.zIndex} isMinimized={window.isMinimized} onMinimize={handleWindowMinimize} onRestore={handleWindowRestore} onBringToFront={bringToFront} />
            );
          } else if (window.type === 'minesweeper') {
            return (
              <MinesweeperWindow key={window.id} id={window.id} onClose={closeWindow} zIndex={window.zIndex} isMinimized={window.isMinimized} onMinimize={handleWindowMinimize} onRestore={handleWindowRestore} onBringToFront={bringToFront} />
            );
          } else if (window.type === 'matching') {
            return (
              <MatchingWindow key={window.id} id={window.id} onClose={closeWindow} zIndex={window.zIndex} isMinimized={window.isMinimized} onMinimize={handleWindowMinimize} onRestore={handleWindowRestore} onBringToFront={bringToFront} />
            );
          } else if (window.type === 'mail') {
            return (
              <MailWindow key={window.id} id={window.id} onClose={closeWindow} zIndex={window.zIndex} isMinimized={window.isMinimized} onMinimize={handleWindowMinimize} onRestore={handleWindowRestore} onBringToFront={bringToFront} />
            );
          } else if (window.type === 'notepad') {
            return (
              <NotepadWindow key={window.id} id={window.id} onClose={closeWindow} zIndex={window.zIndex} isMinimized={window.isMinimized} onMinimize={handleWindowMinimize} onRestore={handleWindowRestore} onBringToFront={bringToFront} />
            );
          } else if (window.type === 'mycomputer') {
            return (
              <MyComputerWindow key={window.id} id={window.id} onClose={closeWindow} zIndex={window.zIndex} isMinimized={window.isMinimized} onMinimize={handleWindowMinimize} onRestore={handleWindowRestore} onBringToFront={bringToFront} />
            );
          } else if (window.type === 'folder') {
            return (
              <FolderWindow key={window.id} id={window.id} onClose={closeWindow} zIndex={window.zIndex} isMinimized={window.isMinimized} onMinimize={handleWindowMinimize} onRestore={handleWindowRestore} onBringToFront={bringToFront} />
            );
          } else if (window.type === 'recyclebin') {
            return (
              <RecycleBinWindow key={window.id} id={window.id} onClose={closeWindow} zIndex={window.zIndex} isMinimized={window.isMinimized} onMinimize={handleWindowMinimize} onRestore={handleWindowRestore} onBringToFront={bringToFront} />
            );
          } else if (window.type === 'music') {
            return (
              <MusicWindow key={window.id} id={window.id} onClose={closeWindow} zIndex={window.zIndex} isMinimized={window.isMinimized} onMinimize={handleWindowMinimize} onRestore={handleWindowRestore} onBringToFront={bringToFront} />
            );
          } else if (window.type === 'photos') {
            return (
              <PhotosWindow key={window.id} id={window.id} onClose={closeWindow} zIndex={window.zIndex} isMinimized={window.isMinimized} onMinimize={handleWindowMinimize} onRestore={handleWindowRestore} onBringToFront={bringToFront} />
            );
          }

          return (
            <IconAppWindow
              key={window.id}
              id={window.id}
              app={window}
              onClose={closeWindow}
            />
          );
        })}
      </div>
      
     

      {/* Start Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40px',
        backgroundColor: '#6a88c2',
        borderTop: '2px solid #8aa8e2',
        borderLeft: '2px solid #8aa8e2',
        borderRight: '2px solid #4a68a2',
        borderBottom: '2px solid #4a68a2',
        display: 'flex',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <button
          onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          style={{
  height: '32px',
  backgroundColor: '#6a88c2',
  border: '2px solid',
  borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
  boxSizing: 'border-box',
  boxShadow: 'inset 1px 1px 0 #ffffff22, inset -1px -1px 0 #2f2a6366',
  display: 'flex',
  alignItems: 'center',
  padding: '0 12px',
  marginLeft: '2px'
}}
        >
          <img
            src={process.env.PUBLIC_URL + '/assets/art/startlogo.svg'}
            alt="Start"
            style={{ width: '26px', height: '26px', marginRight: '6px' }}
          />
          <span style={{
            fontFamily: '"Tahoma", "MS Sans Serif", "Arial", sans-serif',
            fontWeight: 'bold',
            fontSize: '11px',
            color: '#ffffff'
          }}>Start</span>
        </button>
        {openWindows.filter((w) => w.isMinimized).map((window) => (
          <button
            key={window.id}
            onClick={() => handleWindowRestore(window.id)}
            style={{
              backgroundColor: '#6a88c2',
              border: '2px solid',
              borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
              color: '#e0d0ff',
              fontSize: '11px',
              fontWeight: 'bold',
              height: '32px',
              minWidth: '120px',
              padding: '0 12px',
              marginLeft: '4px',
              cursor: 'pointer'
            }}
          >
            {window.label}

          </button>
        ))}
      </div>

      {/* Start Menu */}
      {isStartMenuOpen && (
        <div
          style={{
            position: 'fixed', bottom: '42px', left: '2px',
            backgroundColor: '#6a88c2', border: '2px solid',
            borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
            boxShadow: '2px 2px 0px #1a0a2e', zIndex: 1002,
            display: 'flex',
          }}
          onMouseLeave={() => { setActiveSubmenu(null); setActiveSubSubmenu(null); }}
        >
          {/* Sidebar */}
          <div style={{
            width: '26px', flexShrink: 0,
            background: 'linear-gradient(to top, #1a006a, #3a60c0)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '6px',
          }}>
            <span style={{
              color: 'white', fontWeight: 'bold', fontSize: '13px',
              fontFamily: '"Tahoma", sans-serif', letterSpacing: '2px',
              writingMode: 'vertical-rl', transform: 'rotate(180deg)',
            }}>bbno$</span>
          </div>

          {/* Items */}
          <div style={{ minWidth: '170px' }}>

            {/* Programs */}
            <div style={smItem(activeSubmenu === 'programs')}
              onMouseEnter={() => { setActiveSubmenu('programs'); setActiveSubSubmenu(null); }}>
              <span style={smIcon}>📁</span><span style={smLabel}>Programs</span><span style={smArrow}>▶</span>
              {activeSubmenu === 'programs' && (
                <div style={smPanel}>
                  {/* Utilities */}
                  <div style={smItem(activeSubSubmenu === 'utilities')}
                    onMouseEnter={() => setActiveSubSubmenu('utilities')}>
                    <span style={smIcon}>📂</span><span style={smLabel}>Utilities</span><span style={smArrow}>▶</span>
                    {activeSubSubmenu === 'utilities' && (
                      <div style={smPanel}>
                        {[{type:'notepad',label:'Notepad',icon:'📝'},{type:'calculator',label:'Calculator',icon:'🔢'},{type:'clock',label:'Clock',icon:'🕐'},{type:'mail',label:'Mail',icon:'✉️'},{type:'music',label:'Music Player',icon:'🎵'},{type:'photos',label:'Photos',icon:'🖼️'}].map(app => (
                          <div key={app.type} style={smItem(false)} onClick={() => { openWindow(app); closeStartMenu(); }}>
                            <span style={smIcon}>{app.icon}</span><span style={smLabel}>{app.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Games */}
                  <div style={smItem(activeSubSubmenu === 'games')}
                    onMouseEnter={() => setActiveSubSubmenu('games')}>
                    <span style={smIcon}>🎮</span><span style={smLabel}>Games</span><span style={smArrow}>▶</span>
                    {activeSubSubmenu === 'games' && (
                      <div style={smPanel}>
                        {[{type:'snake',label:'Snake',icon:'🐍'},{type:'minesweeper',label:'Minesweeper',icon:'💣'},{type:'matching',label:'Memory Match',icon:'🃏'}].map(app => (
                          <div key={app.type} style={smItem(false)} onClick={() => { openWindow(app); closeStartMenu(); }}>
                            <span style={smIcon}>{app.icon}</span><span style={smLabel}>{app.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ height: '1px', background: '#2f2a63', borderTop: '1px solid #bfbaf5', margin: '2px 0' }} />
                  <div style={smItem(false)} onMouseEnter={() => setActiveSubSubmenu(null)}
                    onClick={() => { openWindow({type:'bbnoexplorer',label:'bbno$ Explorer'}); closeStartMenu(); }}>
                    <span style={smIcon}>🌐</span><span style={smLabel}>bbno$ Explorer</span>
                  </div>
                  <div style={smItem(false)} onMouseEnter={() => setActiveSubSubmenu(null)}
                    onClick={() => { openWindow({type:'mycomputer',label:'My Computer'}); closeStartMenu(); }}>
                    <span style={smIcon}>💻</span><span style={smLabel}>My Computer</span>
                  </div>
                </div>
              )}
            </div>

            {/* Favorites */}
            <div style={smItem(activeSubmenu === 'favorites')}
              onMouseEnter={() => { setActiveSubmenu('favorites'); setActiveSubSubmenu(null); }}>
              <span style={smIcon}>⭐</span><span style={smLabel}>Favorites</span><span style={smArrow}>▶</span>
              {activeSubmenu === 'favorites' && (
                <div style={smPanel}>
                  <div style={smItem(false)}><span style={smIcon}>🔗</span><span style={smLabel}>(placeholder)</span></div>
                </div>
              )}
            </div>

            {/* Documents */}
            <div style={smItem(activeSubmenu === 'documents')}
              onMouseEnter={() => { setActiveSubmenu('documents'); setActiveSubSubmenu(null); }}>
              <span style={smIcon}>📄</span><span style={smLabel}>Documents</span><span style={smArrow}>▶</span>
              {activeSubmenu === 'documents' && (
                <div style={smPanel}>
                  <div style={smItem(false)}><span style={smIcon}>📄</span><span style={smLabel}>(no recent documents)</span></div>
                </div>
              )}
            </div>

            {/* Settings */}
            <div style={smItem(activeSubmenu === 'settings')}
              onMouseEnter={() => { setActiveSubmenu('settings'); setActiveSubSubmenu(null); }}>
              <span style={smIcon}>⚙️</span><span style={smLabel}>Settings</span><span style={smArrow}>▶</span>
              {activeSubmenu === 'settings' && (
                <div style={smPanel}>
                  {[{label:'Control Panel',icon:'🖥️'},{label:'Printers',icon:'🖨️'},{label:'Taskbar & Start Menu',icon:'📋'}].map(item => (
                    <div key={item.label} style={smItem(false)}>
                      <span style={smIcon}>{item.icon}</span><span style={smLabel}>{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Find */}
            <div style={smItem(activeSubmenu === 'find')}
              onMouseEnter={() => { setActiveSubmenu('find'); setActiveSubSubmenu(null); }}>
              <span style={smIcon}>🔍</span><span style={smLabel}>Find</span><span style={smArrow}>▶</span>
              {activeSubmenu === 'find' && (
                <div style={smPanel}>
                  {[{label:'Files or Folders...',icon:'📁'},{label:'Computer',icon:'💻'},{label:'On the Internet...',icon:'🌐'}].map(item => (
                    <div key={item.label} style={smItem(false)}>
                      <span style={smIcon}>{item.icon}</span><span style={smLabel}>{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Help */}
            <div style={smItem(activeSubmenu === 'help')}
              onMouseEnter={() => { setActiveSubmenu('help'); setActiveSubSubmenu(null); }}
              onClick={() => closeStartMenu()}>
              <span style={smIcon}>❓</span><span style={smLabel}>Help</span>
            </div>

            {/* Run */}
            <div style={smItem(activeSubmenu === 'run')}
              onMouseEnter={() => { setActiveSubmenu('run'); setActiveSubSubmenu(null); }}
              onClick={() => closeStartMenu()}>
              <span style={smIcon}>🏃</span><span style={smLabel}>Run...</span>
            </div>

            <div style={{ height: '1px', background: '#2f2a63', borderTop: '1px solid #bfbaf5', margin: '2px 0' }} />

            {/* Log Off */}
            <div style={smItem(activeSubmenu === 'logoff')}
              onMouseEnter={() => { setActiveSubmenu('logoff'); setActiveSubSubmenu(null); }}
              onClick={() => closeStartMenu()}>
              <span style={smIcon}>👤</span><span style={smLabel}>Log Off bbno$...</span>
            </div>

            {/* Shut Down */}
            <div style={smItem(activeSubmenu === 'shutdown')}
              onMouseEnter={() => { setActiveSubmenu('shutdown'); setActiveSubSubmenu(null); }}
              onClick={() => closeStartMenu()}>
              <span style={smIcon}>⏻</span><span style={smLabel}>Shut Down...</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default DressupGame;