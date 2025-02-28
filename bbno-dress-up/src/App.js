import React from 'react';
import './App.css'; // Make sure this exists
import DressupGame from './components/DressupGame';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>bbno$ Dress Up Game</h1>
      </header>
      <main>
        <DressupGame />
      </main>
      <footer>
        <p>Created by a fan. All bbno$ images are used with fan art permissions.</p>
      </footer>
    </div>
  );
}

export default App;