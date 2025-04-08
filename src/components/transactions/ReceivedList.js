import React from 'react';

const ReceivedList = ({
  items,
  isLoading,
  onEdit,
  onDelete,
  onViewItems,
  viewItemsData,
  onCloseViewItems,
  currentUser
}) => {
  // Debug logging to see actual data structure
  console.log("Items data received:", JSON.stringify(items, null, 2));
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No received items yet</h3>
        <p className="text-gray-500 max-w-md mb-6">
          This appears to be the first time you're using the system. Click the "Receive" tab to start adding inventory items.
        </p>
      </div>
    );
  }

  // Helper function to get property value with fallbacks
  const getPropertyValue = (item, propertyNames, defaultValue = '-') => {
    for (const prop of propertyNames) {
      // Handle nested properties like user.name
      if (prop.includes('.')) {
        const [parent, child] = prop.split('.');
        if (item[parent] && item[parent][child]) {
          return item[parent][child];
        }
      } else if (item[prop] !== undefined && item[prop] !== null) {
        return item[prop];
      }
    }
    return defaultValue;
  };

  // Format date function - now includes seconds
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return dateString;
      
      // Format as: MM/DD/YYYY, HH:MM:SS AM/PM
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit', // Added seconds
        hour12: true
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString;
    }
  };

  // Calculate total amount function
  const calculateTotalAmount = (item) => {
    // Try to get the total amount directly from the item
    const directTotal = getPropertyValue(item, ['totalAmount', 'total_amount', 'amount', 'total']);
    if (directTotal && directTotal !== '-' && parseFloat(directTotal) > 0) {
      return parseFloat(directTotal).toFixed(2);
    }
    
    // If no direct total or it's zero, try to calculate from items
    if (item.items && Array.isArray(item.items) && item.items.length > 0) {
      const calculatedTotal = item.items.reduce((sum, i) => {
        const itemAmount = parseFloat(getPropertyValue(i, ['amount', 'total', 'price'], '0'));
        return sum + (isNaN(itemAmount) ? 0 : itemAmount);
      }, 0);
      
      return calculatedTotal.toFixed(2);
    }
    
    return '0.00';
  };

  // Get user name function - improved to handle numeric user IDs
  const getUserName = (item) => {
    // Try to get user name from various properties
    const userValue = getPropertyValue(
      item, 
      ['receivedBy', 'received_by', 'user.name', 'userName', 'user']
    );
    
    // Handle numeric user IDs (like "123")
    if (userValue && !isNaN(userValue) && userValue !== '-') {
      // This is likely a user ID, so return the current user's name instead
      return currentUser?.name || "Wilfie";
    }
    
    // If we found a name that's not the default '-' and not a number, return it
    if (userValue && userValue !== '-' && isNaN(userValue)) {
      return userValue;
    }
    
    // Otherwise, try to extract from email or return current user name
    const email = getPropertyValue(item, ['user.email', 'userEmail', 'email']);
    if (email && email !== '-' && email.includes('@')) {
      return email.split('@')[0]; // Get the part before @ in email
    }
    
    // Default to current user's name or "Wilfie" as fallback
    return currentUser?.name || "Wilfie";
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Received No.
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Received By
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id || item._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getPropertyValue(item, ['receiveNo', 'transaction_id', 'id'])}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(getPropertyValue(item, ['dateTime', 'date_time', 'created_at', 'updatedAt', 'createdAt']))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getPropertyValue(item, ['supplier', 'supplierName'])}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getUserName(item)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {calculateTotalAmount(item)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      className="text-green-600 hover:text-green-900"
                      onClick={() => onViewItems(item)}
                      disabled={!item.items || item.items.length === 0}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => onEdit(item)}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => onDelete(item)}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l1 13a2 2 0 002 2h8a2 2 0 002-2l1-13m-14 0h14m-10 0V4a1 1 0 011-1h2a1 1 0 011 1v2m-4 0h4" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Items Modal with seconds included in timestamps */}
      {viewItemsData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Items for Receipt #{getPropertyValue(viewItemsData, ['receiveNo', 'transaction_id', 'id'])}
              </h2>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={onCloseViewItems}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date & Time:</span> {formatDate(getPropertyValue(viewItemsData, ['dateTime', 'date_time', 'created_at']))}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Supplier:</span> {getPropertyValue(viewItemsData, ['supplier', 'supplierName'])}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Received By:</span> {getUserName(viewItemsData)}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Total Amount:</span> {calculateTotalAmount(viewItemsData)}
                </p>
              </div>
              {(viewItemsData.remarks || viewItemsData.notes) && (
                <div className="col-span-1 md:col-span-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Remarks:</span> {getPropertyValue(viewItemsData, ['remarks', 'notes', 'comment'])}
                  </p>
                </div>
              )}
            </div>
           
            {/* Item details table remains the same */}
            {(viewItemsData.items?.length > 0) ? (
              <div className="overflow-x-auto border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        System Code
                      </th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Item Type
                      </th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Item Name
                      </th>
                      <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                        Quantities
                      </th>
                      <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {viewItemsData.items.map((item, index) => {
                      // Helper function for item property mapping
                      const getItemValue = (propNames, defaultValue = '-') => 
                        getPropertyValue(item, propNames, defaultValue);
                        
                      // Handle different quantity formats
                      const getQuantities = () => {
                        if (item.quantity && typeof item.quantity === 'object') {
                          // Original format
                          return Object.entries(item.quantity)
                            .filter(([unit, qty]) => qty && unit !== 'pack')
                            .map(([unit, qty]) => ({ unit, qty }));
                        } else if (item.unit_type && item.quantity) {
                          // API format might be { unit_type: 'bottle', quantity: 10 }
                          return [{ unit: item.unit_type, qty: item.quantity }];
                        }
                        return [];
                      };
                      
                      return (
                        <tr key={index}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {getItemValue(['systemCode', 'system_code', 'code'])}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {getItemValue(['itemType', 'item_type', 'type'])}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-500">
                            {getItemValue(['itemName', 'item_name', 'name'])}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-500">
                            <div className="flex flex-wrap gap-2 justify-center">
                              {getQuantities().map(({ unit, qty }, i) => (
                                <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {qty} {unit}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-right whitespace-nowrap text-sm text-gray-500">
                            {getItemValue(['amount', 'total', 'price'], '0.00')}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-gray-50">
                      <td colSpan="4" className="px-3 py-2 text-right font-medium text-gray-700">
                        Total Amount
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-gray-700">
                        {calculateTotalAmount(viewItemsData)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-md">
                <p className="text-gray-500">No items found for this transaction.</p>
              </div>
            )}
           
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={onCloseViewItems}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceivedList;