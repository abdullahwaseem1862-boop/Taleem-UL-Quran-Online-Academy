import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { PublicWebsite } from './components/PublicWebsite';
import { PortalLayout } from './components/PortalLayout';
import { LoginModal } from './components/LoginModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeView, currentUser, notification } = useApp();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-bold border ${
            notification.type === 'success' 
              ? 'bg-emerald-900 text-white border-amber-400/40 shadow-emerald-950/20' 
              : notification.type === 'error'
              ? 'bg-red-800 text-white border-red-500'
              : 'bg-stone-800 text-white border-stone-600'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            ) : notification.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-300 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-blue-300 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main View Switching */}
      {activeView === 'portal' && currentUser ? (
        <PortalLayout />
      ) : (
        <>
          <Navbar />
          <main className="flex-1">
            <PublicWebsite />
          </main>
        </>
      )}

      {/* Login Modal */}
      <LoginModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
