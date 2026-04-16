import { Outlet } from 'react-router-dom';
import FloatingDock from './FloatingDock';

export default function AppLayout() {
  return (
    <div className="min-h-screen relative">
      {/* Aurora Background */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
      </div>

      {/* Content */}
      <main className="relative z-10 min-h-screen pb-[100px]">
        <Outlet />
      </main>

      {/* Floating Dock */}
      <FloatingDock />
    </div>
  );
}
