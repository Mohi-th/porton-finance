import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, BarChart2 } from 'lucide-react';

export const MobileDock = () => {
  return (
    <nav className="mobile-dock">
      <NavLink to="/dashboard" className={({ isActive }) => `mobile-dock-item ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </NavLink>
      <NavLink to="/transactions" className={({ isActive }) => `mobile-dock-item ${isActive ? 'active' : ''}`}>
        <Receipt size={20} />
        <span>Transactions</span>
      </NavLink>
      <NavLink to="/budget" className={({ isActive }) => `mobile-dock-item ${isActive ? 'active' : ''}`}>
        <PieChart size={20} />
        <span>Budgets</span>
      </NavLink>
      <NavLink to="/insights" className={({ isActive }) => `mobile-dock-item ${isActive ? 'active' : ''}`}>
        <BarChart2 size={20} />
        <span>Insights</span>
      </NavLink>
    </nav>
  );
};
