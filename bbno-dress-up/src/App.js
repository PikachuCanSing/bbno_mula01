import React from 'react';
import './App.css';
import DressupGame from './components/DressupGame';
import { WindowProvider } from './contexts/WindowContext';

function App() {
  return (
    <WindowProvider>
      <div className="App">
        <DressupGame />
      </div>
    </WindowProvider>
  );
}

export default App;