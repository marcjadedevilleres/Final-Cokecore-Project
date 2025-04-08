import React, { useState, useEffect } from 'react';
import AddItemForm from './AddItemForm';


const ReceiveForm = ({ selectedItem, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    receiveNo: '',
    dateTime: '',
    supplier: '',
    receiveTotalAmount: 0,
    returnTotalAmount: 0,
    netAmount: 0,
    items: [],
    returnItems: [],
    remarks: ''
  });
 
  // Add state for the modal
  const [showAddItemModal, setShowAddItemModal] = useState(false);


  useEffect(() => {
    if (selectedItem) {
      // When editing, populate all fields including items
      setFormData((prevFormData) => ({
        ...prevFormData,
        receiveNo: selectedItem.receiveNo,
        dateTime: selectedItem.dateTime,
        supplier: selectedItem.supplier,
        items: selectedItem.items || [], // Include the items array
        remarks: selectedItem.remarks || '',
      }));
    } else {
      const receiveNo = `R${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      const now = new Date();
      const dateTime = now.toLocaleString(); // Use full date and time format


      setFormData((prevFormData) => ({
        ...prevFormData,
        receiveNo,
        dateTime,
        items: [],
      }));
    }
  }, [selectedItem]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };


  const handleRemarksChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      remarks: e.target.value
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };


  // Modified to open the add item modal
  const handleAddButtonClick = () => {
    setShowAddItemModal(true);
  };


  // New function to handle adding item from the modal
  const handleAddItemFromModal = (newItem) => {
    // Convert data from AddItemForm format to your items format
    const formattedItem = {
      systemCode: newItem.systemCode || '',
      supplierCode: newItem.supplierCode || '',
      itemType: newItem.category || '',
      itemName: newItem.itemName || '',
      supplierPrice: { box: '', case: '', bottle: '', shell: '' },
      quantity: {
        box: '',
        case: '',
        bottle: newItem.bottleQuantity || '',
        shell: newItem.shellQuantity || ''
      },
      amount: '0.00',
      requiresReturn: ['EMPTY SHELL', 'EMPTY BOTTLE'].includes(newItem.category)
    };


    setFormData((prevFormData) => ({
      ...prevFormData,
      items: [...prevFormData.items, formattedItem]
    }));


    // Close the modal
    setShowAddItemModal(false);
  };


  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;


    // If we're updating a price or quantity, recalculate the amount
    if (field === 'supplierPrice' || field === 'quantity') {
      // This will be calculated in calculateItemAmount
      calculateItemAmount(index, updatedItems);
    }


    setFormData((prevFormData) => ({
      ...prevFormData,
      items: updatedItems
    }));
  };


  const handleSupplierPriceChange = (itemIndex, unit, value) => {
    const updatedItems = [...formData.items];
    updatedItems[itemIndex].supplierPrice[unit] = value;
   
    // Calculate amount after price update
    calculateItemAmount(itemIndex, updatedItems);
   
    setFormData((prevFormData) => ({
      ...prevFormData,
      items: updatedItems
    }));
  };


  const handleQuantityChange = (itemIndex, unit, value) => {
    const updatedItems = [...formData.items];
    updatedItems[itemIndex].quantity[unit] = value;
   
    // Calculate amount after quantity update
    calculateItemAmount(itemIndex, updatedItems);
   
    setFormData((prevFormData) => ({
      ...prevFormData,
      items: updatedItems
    }));
  };


  // Calculate item amount based on price and quantity
  const calculateItemAmount = (itemIndex, items) => {
    const item = items[itemIndex];
    let totalAmount = 0;
   
    // Calculate for each unit type
    for (const unit of ['box', 'case', 'bottle', 'shell']) {
      const price = parseFloat(item.supplierPrice[unit]) || 0;
      const quantity = parseFloat(item.quantity[unit]) || 0;
     
      if (price && quantity) {
        totalAmount += price * quantity;
      }
    }
   
    // Update the item amount
    items[itemIndex].amount = totalAmount.toFixed(2);
  };


  const calculateTotals = () => {
    const totalAmount = formData.items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const returnTotal = formData.returnItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const netAmount = totalAmount - returnTotal;


    return {
      totalAmount: totalAmount.toFixed(2),
      returnTotal: returnTotal.toFixed(2),
      netAmount: netAmount.toFixed(2)
    };
  };


  const totals = calculateTotals();


  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Receive No.</label>
            <input
              type="text"
              name="receiveNo"
              value={formData.receiveNo}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
            <input
              type="text"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>


      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter supplier name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Receive Total Amount</label>
            <input
              type="text"
              name="receiveTotalAmount"
              value={totals.totalAmount}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Return Total Amount</label>
            <input
              type="text"
              name="returnTotalAmount"
              value={totals.returnTotal}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
        </div>
      </div>


      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Net Amount</label>
            <input
              type="text"
              name="netAmount"
              value={totals.netAmount}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
        </div>
      </div>


      {/* Items Table */}
      <div className="mb-4">
        {formData.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 border border-dashed border-gray-300 rounded-md">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No items added yet</h3>
            <p className="text-gray-500 max-w-md mb-6 text-center">
              Click the "Add Item" button below to start adding inventory items to this receiving transaction.
            </p>
         
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    System Code
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Supplier Code
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Item Type
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Item Name
                  </th>
                  <th scope="col" colSpan="4" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                    Supplier Price
                  </th>
                  <th scope="col" colSpan="4" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                    Quantity
                  </th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
                <tr>
                  <th colSpan="4"></th>
                  <th className="px-2 py-1 text-xs text-gray-500 text-center">Box</th>
                  <th className="px-2 py-1 text-xs text-gray-500 text-center">Case</th>
                  <th className="px-2 py-1 text-xs text-gray-500 text-center">Bottle</th>
                  <th className="px-2 py-1 text-xs text-gray-500 text-center">Shell</th>
                  <th className="px-2 py-1 text-xs text-gray-500 text-center">Box</th>
                  <th className="px-2 py-1 text-xs text-gray-500 text-center">Case</th>
                  <th className="px-2 py-1 text-xs text-gray-500 text-center">Bottle</th>
                  <th className="px-2 py-1 text-xs text-gray-500 text-center">Shell</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formData.items.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded text-sm"
                          value={item.systemCode || ''}
                          onChange={(e) => handleItemChange(index, 'systemCode', e.target.value)}
                          placeholder="System Code"
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded text-sm"
                          value={item.supplierCode || ''}
                          onChange={(e) => handleItemChange(index, 'supplierCode', e.target.value)}
                          placeholder="Supplier Code"
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded text-sm"
                          value={item.itemType || ''}
                          onChange={(e) => handleItemChange(index, 'itemType', e.target.value)}
                          placeholder="Item Type"
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded text-sm"
                          value={item.itemName || ''}
                          onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                          placeholder="Item Name"
                        />
                      </td>
                     
                      {/* Supplier Price inputs */}
                      <td className="px-1 py-2">
                        <input
                          type="text"
                          className="w-full text-center p-1 border border-gray-300 rounded text-sm"
                          value={item.supplierPrice?.box || ''}
                          onChange={(e) => handleSupplierPriceChange(index, 'box', e.target.value)}
                        />
                      </td>
                      <td className="px-1 py-2">
                        <input
                          type="text"
                          className="w-full text-center p-1 border border-gray-300 rounded text-sm"
                          value={item.supplierPrice?.case || ''}
                          onChange={(e) => handleSupplierPriceChange(index, 'case', e.target.value)}
                        />
                      </td>
                      <td className="px-1 py-2">
                        <input
                          type="text"
                          className="w-full text-center p-1 border border-gray-300 rounded text-sm"
                          value={item.supplierPrice?.bottle || ''}
                          onChange={(e) => handleSupplierPriceChange(index, 'bottle', e.target.value)}
                        />
                      </td>
                      <td className="px-1 py-2">
                        <input
                          type="text"
                          className="w-full text-center p-1 border border-gray-300 rounded text-sm"
                          value={item.supplierPrice?.shell || ''}
                          onChange={(e) => handleSupplierPriceChange(index, 'shell', e.target.value)}
                        />
                      </td>
                     
                      {/* Quantity inputs */}
                      <td className="px-1 py-2">
                        <input
                          type="text"
                          className="w-full text-center p-1 border border-gray-300 rounded text-sm"
                          value={item.quantity?.box || ''}
                          onChange={(e) => handleQuantityChange(index, 'box', e.target.value)}
                        />
                      </td>
                      <td className="px-1 py-2">
                        <input
                          type="text"
                          className="w-full text-center p-1 border border-gray-300 rounded text-sm"
                          value={item.quantity?.case || ''}
                          onChange={(e) => handleQuantityChange(index, 'case', e.target.value)}
                        />
                      </td>
                      <td className="px-1 py-2">
                        <input
                          type="text"
                          className="w-full text-center p-1 border border-gray-300 rounded text-sm"
                          value={item.quantity?.bottle || ''}
                          onChange={(e) => handleQuantityChange(index, 'bottle', e.target.value)}
                        />
                      </td>
                      <td className="px-1 py-2">
                        <input
                          type="text"
                          className="w-full text-center p-1 border border-gray-300 rounded text-sm"
                          value={item.quantity?.shell || ''}
                          onChange={(e) => handleQuantityChange(index, 'shell', e.target.value)}
                        />
                      </td>
                     
                      <td className="px-3 py-2 text-right whitespace-nowrap text-sm text-gray-500">
                        {item.amount}
                      </td>
                     
                      <td className="px-2 py-2 text-center">
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            const updatedItems = [...formData.items];
                            updatedItems.splice(index, 1);
                            setFormData(prev => ({...prev, items: updatedItems}));
                          }}
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                    {/* Add return note row if the item requires return */}
                    {item.requiresReturn && (
                      <tr>
                        <td colSpan="16" className="px-3 py-2 bg-red-50">
                          <div className="text-red-600 text-sm">
                            Note: This product requires bottle and shell return upon purchase.
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {formData.items.length > 0 && (
                  <tr>
                    <td colSpan="14" className="px-3 py-2 text-right font-medium text-gray-700">
                      Total Amount
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-gray-700">
                      {totals.totalAmount}
                    </td>
                    <td></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={handleAddButtonClick}
            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Item
          </button>
        </div>
      </div>


      {/* Remarks */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
        <div className="relative">
          <textarea
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add remarks here..."
            value={formData.remarks}
            onChange={handleRemarksChange}
          />
          <div className="absolute right-2 bottom-2">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>


      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : 'Save'}
        </button>
      </div>


      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Item</h2>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowAddItemModal(false)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
           
            <AddItemForm
              onSave={handleAddItemFromModal}
              onCancel={() => setShowAddItemModal(false)}
            />
          </div>
        </div>
      )}
    </form>
  );
};


export default ReceiveForm;
