/**
 * @file src/index.tsx
 * @description Application entry point. Mounts the Chaos OS to the root element.
 * 
 * This file bootstraps the React application and imports necessary global styles.
 */
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './main.css';
import { playDemo } from './demo/demoScript';

// Expose demo runner for E2E
(window as any).playDemo = playDemo;

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
