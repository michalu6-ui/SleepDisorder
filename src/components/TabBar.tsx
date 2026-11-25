import { NavLink } from 'react-router-dom';

import './TabBar.css';

const TABS = [
  { to: '/today', label: 'Dziś' },
  { to: '/calm', label: 'Wycisz' },
  { to: '/rhythm', label: 'Rytm' },
  { to: '/me', label: 'Ja' },
] as const;

export function TabBar() {
  return (
    <nav className="tab-bar" aria-label="Główna nawigacja">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) => `tab-bar__link ${isActive ? 'tab-bar__link--active' : ''}`}
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}