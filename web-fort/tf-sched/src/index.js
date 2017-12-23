import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

if (document.getElementById('schedule')) {
  // Determine what fort we are going to render
  const fort = document.getElementById('schedule').getAttribute('fort')
  
  ReactDOM.render(
    <App />,
    document.getElementById('schedule')
    );
}
