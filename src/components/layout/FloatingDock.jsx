import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Lightbulb } from 'lucide-react';

const dockItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/insights', label: 'Insights', icon: Lightbulb },
];

export default function FloatingDock() {
  const location = useLocation();

  return (
    <div className="dock-container max-[480px]:left-0 max-[480px]:right-0 max-[480px]:bottom-0 max-[480px]:transform-none max-[480px]:px-3 max-[480px]:pb-3">
      <nav className="dock-pill max-[480px]:w-full max-[480px]:justify-around">
        {dockItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`dock-item ${isActive ? 'active' : ''}`}
              title={item.label}
            >
              <div className="flex flex-col items-center gap-1">
                <Icon size={20} strokeWidth={isActive ? 2.2 : 1.6} />
                {isActive && (
                  <span className="text-[9px] font-bold tracking-wide">{item.label}</span>
                )}
              </div>
              {!isActive && <span className="dock-tooltip">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
