import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import useSidebarStore from '../stores/sidebarStore';
const Layout = () => {
  const { isOpen, isLoggedIn } = useSidebarStore();
  return (
    //   <div className="flex">
    //     <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
    //     <Sidebar isOpen={isSidebarOpen} />
    //     <main className={`flex-1 ${isSidebarOpen ? 'ml-50' : 'ml-0'}`}>
    //       <Outlet />
    //     </main>
    //   </div>
    <div className="flex">
      <Sidebar />
      <div
        className={`flex-1 transition-all duration-300 ${
          isOpen ? 'ml-54' : 'ml-22'
        }`}
      >
        <Header />
        <main className="mt-16">
          {' '}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
