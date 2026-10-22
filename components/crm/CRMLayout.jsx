// components/crm/CRMLayout.jsx
import React, { useState, useEffect } from 'react';
import CRMSidebar from './CRMSidebar';
import CRMTopbar from './CRMTopbar';
import CommandPalette from './CommandPalette';
import { ToastProvider, useToast } from './ToastNotification';

function CRMLayoutInner({
  children,
  activeTab,
  onSelectTab,
  dateRange,
  onChangeDateRange,
  notifications,
  onMarkNotificationRead,
  onQuickAdd,
  onSelectSearchResult,
  data
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('lux_crm_theme');
      if (savedTheme === 'dark') {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  }, []);

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('lux_crm_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('lux_crm_theme', 'light');
      }
      return next;
    });
  };

  // Keyboard shortcut CMD/CTRL + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`min-h-screen bg-[#F4F6FC] dark:bg-[#080C14] text-slate-800 dark:text-slate-100 flex flex-col transition-colors selection:bg-blue-600 selection:text-white font-sans antialiased`}>
      {/* Background radial gradient glow soft blue aura */}
      <div className="fixed top-0 left-1/3 w-[800px] h-[500px] bg-gradient-to-b from-blue-200/20 via-sky-100/15 to-transparent dark:from-blue-950/20 dark:via-blue-950/10 dark:to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* Collapsible Left Rail / Sidebar */}
      <CRMSidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Layout Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 relative z-10 ${
          isSidebarCollapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        {/* Sticky Topbar */}
        <CRMTopbar
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          dateRange={dateRange}
          onChangeDateRange={onChangeDateRange}
          notifications={notifications}
          onMarkNotificationRead={onMarkNotificationRead}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onQuickAdd={onQuickAdd}
          onSelectTab={onSelectTab}
        />

        {/* Content Body Container */}
        <main className="flex-1 p-6 sm:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Command Palette Modal (CMD+K / CTRL+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelect={onSelectSearchResult}
        data={data}
      />
    </div>
  );
}

export default function CRMLayout(props) {
  return (
    <ToastProvider>
      <CRMLayoutInner {...props} />
    </ToastProvider>
  );
}
