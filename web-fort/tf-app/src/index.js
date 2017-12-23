import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

if (document.getElementById('root')) {
  // Determine what fort we are going to render
  const fort = document.getElementById('root').getAttribute('fort')
  
  ReactDOM.render(
    <App fort={fort} />,
    document.getElementById('root')
    );
}
else {
  console.log('Treefort Rules! No tf-app on this page')
}
