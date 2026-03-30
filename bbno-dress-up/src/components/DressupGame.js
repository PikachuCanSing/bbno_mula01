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
  const skipClickRef = useRef(false);
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
    skipClickRef.current = false;
    setDragMode('icon');
  };

  const handleIconClick = (app) => {
    if (skipClickRef.current) {
      skipClickRef.current = false;
      return;
    }

    openWindow(app);
  };

  const handleDesktopMouseDown = (e) => {
    if (e.target !== desktopRef.current) return;
    e.preventDefault();
    e.stopPropagation();

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

      if (distanceSq > 25) {
        skipClickRef.current = true;
      }

      const desktopRect = desktop.getBoundingClientRect();
      const maxX = Math.max(0, desktopRect.width - 90);
      const maxY = Math.max(0, desktopRect.height - 90);

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
      if (skipClickRef.current) {
        const desktop = desktopRef.current;
        if (desktop) {
          const desktopRect = desktop.getBoundingClientRect();
          const maxX = Math.max(0, desktopRect.width - 90);
          const maxY = Math.max(0, desktopRect.height - 90);
          const updated = { ...iconPositions };

          iconDragGroupRef.current.forEach((iconType) => {
            const pos = iconPositions[iconType] || { x: 0, y: 0 };
            const snappedX = Math.round(pos.x / 90) * 90;
            const snappedY = Math.round(pos.y / 90) * 90;
            updated[iconType] = {
              x: Math.max(0, Math.min(snappedX, maxX)),
              y: Math.max(0, Math.min(snappedY, maxY))
            };
          });

          setIconPositions(updated);
        }
      }

      draggingIconRef.current = null;
      iconDragGroupRef.current = [];
      skipClickRef.current = false;
      setDragMode('none');
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
      init[app.type] = { x: col * iconWidth, y: row * iconHeight };
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

  // Render the component
  return (
   <div className="dressup-game vaporwave-background" style={{ 
  width: '100%', 
  minHeight: '100vh',
  padding: '20px',
  paddingBottom: '40px',
  position: 'relative',
  cursor: `url(${process.env.PUBLIC_URL}/assets/art/cursor.png) 0 0, auto`
}}>
      {/* Vaporwave elements */}
      <div className="vaporwave-grid"></div>
      <div className="vaporwave-sun"></div>
      <div className="scanlines"></div>
      <div className="floating-triangle" style={{ left: '10%', top: '20%' }}></div>
      <div className="floating-triangle" style={{ right: '15%', bottom: '30%' }}></div>
      <div className="floating-circle" style={{ left: '20%', bottom: '15%' }}></div>
      
      {/* Desktop icons from art folder */}
      <div
        ref={desktopRef}
        onMouseDown={handleDesktopMouseDown}
        onMouseMove={handleDesktopMouseMove}
        onMouseUp={handleDesktopMouseUp}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          bottom: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 90px)',
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
              onClick={() => handleIconClick(app)}
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
                  marginBottom: '2px',
                  filter: 'drop-shadow(1px 1px 0px #1a0a2e) drop-shadow(-1px -1px 0px #1a0a2e)'
                }}
                onError={(e) => {
                  e.target.src = getFallbackIcon();
                }}
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
      
      <h1 style={{
        textAlign: 'center', 
        color: 'white', 
        textShadow: '2px 2px #ff00de, -2px -2px #00ffff', 
        marginBottom: '20px',
        fontFamily: '"Comic Sans MS", cursive',
        fontSize: '2.5rem',
        position: 'relative',
        zIndex: 3
      }}>
        bbno$ Dress Up Game
      </h1>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 3
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
      
      <footer style={{ 
        textAlign: 'center', 
        color: 'white', 
        padding: '20px', 
        marginTop: '20px',
        fontSize: '0.8rem',
        position: 'relative',
        zIndex: 1
      }}>
        Created by a fan. All bbno$ images are used with fan art permissions.
      </footer>

      {/* Start Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '28px',
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
  height: '22px',
  backgroundColor: '#6a88c2',
  border: '2px solid',
  borderColor: '#bfbaf5 #2f2a63 #2f2a63 #bfbaf5',
  boxSizing: 'border-box',
  boxShadow: 'inset 1px 1px 0 #ffffff22, inset -1px -1px 0 #2f2a6366',
  display: 'flex',
  alignItems: 'center',
  padding: '0 4px',
  marginLeft: '2px'
}}
        >
          <img
            src={process.env.PUBLIC_URL + '/assets/art/startlogo.svg'}
            alt="Start"
            style={{ width: '16px', height: '16px', marginRight: '4px' }}
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
              height: '22px',
              padding: '0 8px',
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
        <div style={{
          position: 'fixed',
          bottom: '30px',
          left: '2px',
          width: '200px',
          backgroundColor: '#7cd8ef',
          border: '2px solid #000000',
          zIndex: 1001
        }}>
          <div style={{
            height: '25px',
            backgroundColor: '#6a88c2',
            borderBottom: '2px solid #4a68a2',
            borderRight: '2px solid #4a68a2',
            borderTop: '2px solid #8aa8e2',
            borderLeft: '2px solid #8aa8e2',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            padding: '0 5px'
          }}>
            <span style={{
              fontFamily: '"Tahoma", "MS Sans Serif", "Arial", sans-serif',
              fontWeight: 'bold',
              fontSize: '16px',
              color: '#e0d0ff'
            }}>bbno$</span>
          </div>
          <div style={{ padding: '10px' }}>
            <p style={{ margin: 0, color: '#000', fontSize: '12px' }}>Start menu placeholder</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DressupGame;