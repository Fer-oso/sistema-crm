import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeMockData } from './lib/initialize';

// Initialize mock data before rendering
initializeMockData();

createRoot(document.getElementById('root')!).render(<App />);
