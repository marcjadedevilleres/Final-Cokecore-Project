import React, { useState } from 'react';
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';
import VerificationCode from './components/auth/VerificationCode';
import ResetPassword from './components/auth/ResetPassword';
import PasswordResetSuccess from './components/auth/PasswordResetSuccess';
import Dashboard from './components/dashboard/Dashboard';
import WarehouseModal from './components/dashboard/WarehouseModal';
import Stocks from './components/inventory/Stocks';
import StocksAdjustment from './components/inventory/StocksAdjustment';
import Receiving from './components/transactions/Receiving';
import Trading from './components/transactions/Trading';
import Invoice from './components/transactions/Invoice';


function App() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [inventoryView, setInventoryView] = useState(null);
  const [transactionView, setTransactionView] = useState(null);


  // Handle login
  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('warehouseSelection'); // Show warehouse modal after login
  };


  // Handle selecting a warehouse
  const handleSelectWarehouse = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setCurrentView('dashboard');
  };


  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setSelectedWarehouse(null);
    setCurrentView('login');
    setInventoryView(null);
    setTransactionView(null);
  };


  // Handle navigation
  const handleNavigate = (view) => {
    console.log("Navigating to:", view);
   
    // Dashboard navigation
    if (view === 'dashboard') {
      setCurrentView('dashboard');
      setInventoryView(null);
      setTransactionView(null);
    }
   
    // Inventory navigation
    else if (view === 'stocks' || view === 'stocksAdjustment') {
      setCurrentView('inventory');
      setInventoryView(view);
      setTransactionView(null);
    }
   
    // Transaction navigation
    else if (view === 'receiving' || view === 'trading' || view === 'invoice') {
      setCurrentView('transactions');
      setTransactionView(view);
      setInventoryView(null);
    }
  };


  return (
    <>
      {currentView === 'login' && <Login onLogin={handleLogin} onForgotPassword={() => setCurrentView('forgotPassword')} successMessage={success} />}
     
      {currentView === 'forgotPassword' && <ForgotPassword onBack={() => setCurrentView('login')} onSubmit={(email) => { setEmail(email); setCurrentView('verificationCode'); }} />}
     
      {currentView === 'verificationCode' && <VerificationCode onBack={() => setCurrentView('forgotPassword')} onSubmit={() => setCurrentView('resetPassword')} />}
     
      {currentView === 'resetPassword' && <ResetPassword onBack={() => setCurrentView('login')} onSubmit={() => setCurrentView('passwordResetSuccess')} email={email} />}
     
      {currentView === 'passwordResetSuccess' && <PasswordResetSuccess onBackToLogin={() => { setSuccess('Your password has been successfully changed. Please login with your new credentials.'); setCurrentView('login'); }} />}
     
      {currentView === 'warehouseSelection' && <WarehouseModal onClose={() => setCurrentView('login')} onSelect={handleSelectWarehouse} />}
     
      {currentView === 'dashboard' && <Dashboard user={user} warehouse={selectedWarehouse} onWarehouseChange={setSelectedWarehouse} onLogout={handleLogout} onNavigate={handleNavigate} />}
     
      {currentView === 'inventory' && (
        <div className="flex flex-col min-h-screen">
          {inventoryView === 'stocks' && <Stocks user={user} warehouse={selectedWarehouse} onLogout={handleLogout} onNavigate={handleNavigate} />}
          {inventoryView === 'stocksAdjustment' && <StocksAdjustment user={user} warehouse={selectedWarehouse} onLogout={handleLogout} onNavigate={handleNavigate} />}
        </div>
      )}


      {currentView === 'transactions' && (
        <div className="flex flex-col min-h-screen">
          {transactionView === 'receiving' && <Receiving user={user} warehouse={selectedWarehouse} onLogout={handleLogout} onNavigate={handleNavigate} />}
          {transactionView === 'trading' && <Trading user={user} warehouse={selectedWarehouse} onLogout={handleLogout} onNavigate={handleNavigate} />}
          {transactionView === 'invoice' && <Invoice user={user} warehouse={selectedWarehouse} onLogout={handleLogout} onNavigate={handleNavigate} />}
        </div>
      )}
    </>
  );
}


export default App;
