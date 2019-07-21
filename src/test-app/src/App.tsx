import React from 'react';
import logo from './logo.svg';
import { Component1 } from './component1/component';
import { Component2 } from './component2/component';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <Component1 />
      <Component2 />
    </div>
  );
}

export default App;
