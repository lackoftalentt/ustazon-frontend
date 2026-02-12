import { createRoot } from 'react-dom/client';
import '@/shared/config/i18n';
import { App } from './index';

const root = document.getElementById('root');

if (!root) {
    throw new Error('Root element not found');
}

createRoot(root).render(<App />);
