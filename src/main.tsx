import { registerShellWorker } from './arcana/infrastructure/pwa/register';
import { createRoot } from 'react-dom/client';
import { App } from './arcana/presentation/App';
import './arcana/presentation/styles.css';
import './arcana/presentation/game-stage.css';
import './arcana/presentation/game-experience.css';
import './arcana/presentation/welcome-menu.css';
createRoot(document.getElementById('root')!).render(<App />);

if (import.meta.env.PROD) void registerShellWorker();
