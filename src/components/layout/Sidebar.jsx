import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Building, 
  LayoutDashboard, 
  Landmark, 
  Receipt, 
  PieChart, 
  BarChart2, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';
import './Sidebar.css';

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo-container">
        <Building className="text-primary" size={24} />
        <div>
          <div className="logo-text">Proton Finance</div>
          <div className="logo-sub">Wealth Curator</div>
        </div>
      </div>

      <nav className="nav-menu">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Receipt size={18} />
          <span>Transactions</span>
        </NavLink>
        <NavLink to="/budget" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <PieChart size={18} />
          <span>Budgets</span>
        </NavLink>
        <NavLink to="/insights" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BarChart2 size={18} />
          <span>Insights</span>
        </NavLink>
      </nav>

      <div className="pro-card">
        <div style={{ fontSize: '0.65rem', marginBottom: '4px', opacity: 0.8, fontWeight: 600, letterSpacing: '0.05em' }}>PRO ACCESS</div>
        <div style={{ fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.3 }}>Unlock AI Strategy Insights</div>
        <button className="btn-pro">Upgrade to Premium</button>
      </div>

      <div className="sidebar-footer">
        <a href="#" className="footer-link">
          <HelpCircle size={18} />
          <span>Help Center</span>
        </a>
        <a href="#" className="footer-link">
          <LogOut size={18} />
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
};
