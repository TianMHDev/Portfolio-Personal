import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Portfolio from './Portfolio';
import Admin from './Admin';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
