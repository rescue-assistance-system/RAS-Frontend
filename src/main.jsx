import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <>
    <div>
      <p className="block md:hidden">You ..</p>
      <div className="hidden md:block">
        <App />
      </div>
    </div>
  </>,
);
