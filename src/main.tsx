import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import { DataProvider } from './lib/DataProvider';
import { ToastProvider } from './lib/ToastContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DataProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </DataProvider>
  </StrictMode>,
);
