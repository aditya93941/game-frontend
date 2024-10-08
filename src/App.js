import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainScreen from './MainScreen';
import PlayerComponent from './PlayerComponent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/player" element={<PlayerComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
