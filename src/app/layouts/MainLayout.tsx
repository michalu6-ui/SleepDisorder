import { Outlet } from 'react-router-dom';
import { TabBar } from '../../components/TabBar';

export function MainLayout() {
  return (
    <>
      <main className="main-layout">
        <Outlet />
      </main>
      <TabBar />
    </>
  );
}