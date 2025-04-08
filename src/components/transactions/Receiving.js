import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../layout/Layout';
import ReceivedList from './ReceivedList';
import ReceiveForm from './ReceiveForm';
import { receivingService, authService } from '../../services/api';

const Receiving = ({ user, warehouse, onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('list');
  const [receivedItems, setReceivedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [viewItemsData, setViewItemsData] = useState(null);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const checkAuthStatus = useCallback(() => {
    // Verify authentication with backend
    const verifyAuth = async () => {
      try {
        await authService.getCurrentUser();
        return true;
      } catch (error) {
        console.error("Auth verification failed:", error);
        return false;
      }
    };
    
    // Call the verification function
    return verifyAuth();
  }, []);

  const fetchReceivedItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to fetch from MongoDB
      const items = await receivingService.getReceivedItems();
      setReceivedItems(items);
      setUsingFallback(false);
    } catch (error) {
      console.error("Error fetching received items:", error);
      setError("Could not connect to database. Using local storage fallback.");
      setUsingFallback(true);
      
      // Try to load from localStorage as fallback
      try {
        const storedItems = JSON.parse(localStorage.getItem('receivedItems') || '[]');
        setReceivedItems(storedItems);
      } catch (localError) {
        console.error("Error loading from localStorage:", localError);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check authentication status
    checkAuthStatus();
    
    // Fetch items
    fetchReceivedItems();
  }, [checkAuthStatus, fetchReceivedItems]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'form') {
      setSelectedItem(null);
    }
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setActiveTab('form');
  };

  const handleSaveReceive = async (receiveData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Calculate total amount from items
      const calculatedTotalAmount = receiveData.items.reduce((sum, item) => {
        let itemTotal = 0;
        for (const unit of ['box', 'case', 'bottle', 'shell']) {
          const qty = parseFloat(item.quantity?.[unit] || 0);
          const price = parseFloat(item.supplierPrice?.[unit] || 0);
          if (qty > 0 && price > 0) {
            itemTotal += qty * price;
          }
        }
        return sum + itemTotal;
      }, 0);

      // Format items before sending
      const processedItems = receiveData.items.map(item => {
        let itemAmount = 0;
        for (const unit of ['box', 'case', 'bottle', 'shell']) {
          const qty = parseFloat(item.quantity?.[unit] || 0);
          const price = parseFloat(item.supplierPrice?.[unit] || 0);
          if (qty > 0 && price > 0) {
            itemAmount += qty * price;
          }
        }
        
        return {
          ...item,
          amount: itemAmount.toFixed(2),
          quantity: {
            box: item.quantity?.box || '',
            case: item.quantity?.case || '',
            bottle: item.quantity?.bottle || '',
            shell: item.quantity?.shell || ''
          },
          supplierPrice: {
            box: item.supplierPrice?.box || '',
            case: item.supplierPrice?.case || '',
            bottle: item.supplierPrice?.bottle || '',
            shell: item.supplierPrice?.shell || ''
          }
        };
      });

      const dataToSend = {
        ...receiveData,
        warehouse: warehouse?.id || 1, // Provide default warehouse ID
        user: user?.id || 1, // Provide default user ID
        receiveNo: receiveData.receiveNo,
        supplier: receiveData.supplier || 'Unknown Supplier',
        totalAmount: calculatedTotalAmount.toFixed(2),
        remarks: receiveData.remarks || '',
        items: processedItems
      };

      console.log("Sending data to save:", JSON.stringify(dataToSend, null, 2));

      let savedData;
      try {
        // Try to save to MongoDB
        if (selectedItem) {
          savedData = await receivingService.updateReceiveTransaction(selectedItem.id, dataToSend);
        } else {
          savedData = await receivingService.createReceiveTransaction(dataToSend);
        }
        
        console.log("Saved data response:", JSON.stringify(savedData, null, 2));
        setUsingFallback(false);
      } catch (dbError) {
        console.error("Database save failed:", dbError);
        setError("Could not save to database. Using local storage fallback.");
        setUsingFallback(true);
        
        // Fallback to local storage
        const storedItems = JSON.parse(localStorage.getItem('receivedItems') || '[]');
        
        const localItem = {
          id: selectedItem?.id || Date.now().toString(),
          receiveNo: dataToSend.receiveNo,
          dateTime: new Date().toLocaleString(),
          supplier: dataToSend.supplier,
          receivedBy: user?.name || "Wilfie",
          totalAmount: dataToSend.totalAmount,
          remarks: dataToSend.remarks,
          items: dataToSend.items
        };
        
        if (selectedItem) {
          // Update existing item
          const updatedItems = storedItems.map(item => 
            item.id === selectedItem.id ? localItem : item
          );
          localStorage.setItem('receivedItems', JSON.stringify(updatedItems));
        } else {
          // Add new item
          storedItems.unshift(localItem);
          localStorage.setItem('receivedItems', JSON.stringify(storedItems));
        }
        
        savedData = localItem;
      }

      // Update the UI with saved data
      setReceivedItems(prevItems =>
        selectedItem
          ? prevItems.map(item => item.id === selectedItem.id ? savedData : item)
          : [savedData, ...prevItems]
      );

      // Return to list view
      setActiveTab('list');
      setSelectedItem(null);
    } catch (error) {
      console.error("Save error:", error);
      setError(`Failed to save data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (itemToDelete) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await receivingService.deleteReceiveTransaction(itemToDelete.id);
      console.log("Item deleted successfully:", itemToDelete.id);
      
      // Update UI by removing the deleted item
      setReceivedItems((prevItems) => prevItems.filter(item => item.id !== itemToDelete.id));
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item from database. Please try again.");
      
      // Try to delete from localStorage as fallback
      try {
        const storedItems = JSON.parse(localStorage.getItem('receivedItems') || '[]');
        const filteredItems = storedItems.filter(item => item.id !== itemToDelete.id);
        localStorage.setItem('receivedItems', JSON.stringify(filteredItems));
        
        // Update UI by removing the deleted item
        setReceivedItems((prevItems) => prevItems.filter(item => item.id !== itemToDelete.id));
        
        setError("Item removed from local storage (database connection failed).");
        setUsingFallback(true);
      } catch (localError) {
        console.error("Error deleting from localStorage:", localError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setActiveTab('list');
    setSelectedItem(null);
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const handleViewItems = (item) => {
    setViewItemsData(item);
  };

  const handleCloseViewItems = () => {
    setViewItemsData(null);
  };

  return (
    <Layout
      user={user}
      warehouse={warehouse}
      onLogout={onLogout}
      onNavigate={onNavigate}
      currentView="receiving"
      inventoryView={null}
      sidebarExpanded={sidebarExpanded}
      toggleSidebar={toggleSidebar}
    >
      <div className="h-10"></div>

      {usingFallback && (
        <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Database Connection Issue: </strong>
          <span className="block sm:inline">
            Using localStorage as fallback. Data is saved locally but not synchronized with MongoDB.
          </span>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
            onClick={() => setError(null)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        </div>
      )}

      <div className="mt-8 bg-white rounded-lg shadow-md" style={{ overflow: 'visible' }}>
        <div className="flex border-b border-gray-200" style={{ display: 'flex', minHeight: '48px' }}>
          <button
            type="button"
            className={`flex-1 px-6 py-3 text-center font-medium transition-colors ${
              activeTab === 'list'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => handleTabChange('list')}
          >
            Received List
          </button>
          <button
            type="button"
            className={`flex-1 px-6 py-3 text-center font-medium transition-colors ${
              activeTab === 'form'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => handleTabChange('form')}
          >
            Receive
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'list' ? (
          <ReceivedList
            items={receivedItems}
            isLoading={isLoading}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            onViewItems={handleViewItems}
            viewItemsData={viewItemsData}
            onCloseViewItems={handleCloseViewItems}
            currentUser={user}
          />
          ) : (
            <ReceiveForm
              selectedItem={selectedItem}
              onSave={handleSaveReceive}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Receiving;