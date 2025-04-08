import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';


const Layout = ({ children, user, warehouse, onLogout, onNavigate, currentView, inventoryView, sidebarExpanded, toggleSidebar }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header
        user={user}
        selectedWarehouse={warehouse}
        toggleSidebar={toggleSidebar}
      />
     
      <div className="flex flex-1">
        <Sidebar
          onLogout={onLogout}
          onNavigate={onNavigate}
          currentView={currentView}
          inventoryView={inventoryView}
          expanded={sidebarExpanded}
          toggleSidebar={toggleSidebar}
        />
       
        <main className={`flex-1 p-6 overflow-auto transition-all duration-300 ${sidebarExpanded ? 'ml-64' : 'ml-20'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};


export default Layout;
