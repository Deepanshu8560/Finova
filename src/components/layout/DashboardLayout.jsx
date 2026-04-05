import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';



/**
 * Root layout: sidebar (fixed/sticky) + header + scrollable content area.
 * @returns {JSX.Element}
 */
export const DashboardLayout = () => {
  const [sidebarOpen,  setSidebarOpen]  = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex transition-colors duration-200">

        {/* Sidebar - on lg+ it occupies its natural width in the flex row */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Right column - header + page content */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <Header
            onMenuClick={() => setSidebarOpen(true)}
          />

          {/* Scrollable main content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-screen-2xl mx-auto w-full px-4 sm:px-6 py-6">
              <Outlet />
            </div>
          </main>
        </div>

      </div>
  );
};

export default DashboardLayout;
