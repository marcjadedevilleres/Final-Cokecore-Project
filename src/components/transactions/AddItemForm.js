import React, { useState, useEffect, useRef } from 'react';


const AddItemForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    supplier: '',
    category: '',
    systemCode: '',
    supplierCode: '',
    itemName: '',
    quantity: '',
    shellQuantity: '',
    bottleQuantity: '',
  });


  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const categoryRef = useRef(null);
  const supplierRef = useRef(null);


  // Sample supplier list - replace with actual data from your database
  const suppliers = ['Coca-Cola', 'Pepsi', 'Nestlé', 'Royal', 'Others'];


  // Sample category list - replace with actual data from your database
  const categories = ['CONTENT', 'ONE WAY', 'EMPTY SHELL', 'EMPTY BOTTLE', 'BAD ORDER'];


  // Determine if item requires bottle/shell return
  const requiresReturn = ['EMPTY SHELL', 'EMPTY BOTTLE', 'CONTENT'].includes(formData.category);


  // Generate system code based on category
  const generateSystemCode = (category) => {
    if (!category) return '';
   
    // Get the first letter of the category
    const firstLetter = category.charAt(0);
   
    // Generate a random number between 10000-99999 to make the code unique
    const randomNum = Math.floor(10000 + Math.random() * 90000);
   
    // Format: First letter of category + hyphen + 5-digit number
    return `${firstLetter}-${randomNum}`;
  };


  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  // Handle supplier selection
  const handleSupplierSelect = (supplier) => {
    setFormData({
      ...formData,
      supplier,
    });
    setShowSupplierDropdown(false);
  };


  // Handle category selection
  const handleCategorySelect = (category) => {
    // Generate system code based on the selected category
    const systemCode = generateSystemCode(category);
   
    setFormData({
      ...formData,
      category,
      systemCode,
    });
    setShowCategoryDropdown(false);
  };


  // Handle number input with up/down buttons
  const handleQuantityChange = (field, value) => {
    // Ensure value is a number and not negative
    const numValue = Math.max(0, parseInt(value) || 0);
   
    setFormData({
      ...formData,
      [field]: numValue.toString(),
    });
  };


  // Handle click outside of dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      if (supplierRef.current && !supplierRef.current.contains(event.target)) {
        setShowSupplierDropdown(false);
      }
    };


    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!formData.supplier || !formData.category || !formData.itemName) {
      alert('Please fill in required fields: Supplier, Category, and Item Name');
      return;
    }


    onSave(formData);
  };


  return (
    <div className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Supplier Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
          <div className="relative" ref={supplierRef}>
            <div
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white flex items-center justify-between cursor-pointer"
              onClick={() => setShowSupplierDropdown(!showSupplierDropdown)}
            >
              <span className={`${formData.supplier ? 'text-gray-900' : 'text-gray-400'}`}>
                {formData.supplier || 'Select supplier'}
              </span>
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
           
            {showSupplierDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 max-h-60 overflow-auto">
                {suppliers.map((supplier, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSupplierSelect(supplier)}
                  >
                    {supplier}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>


        {/* Category Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <div className="relative" ref={categoryRef}>
            <div
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white flex items-center justify-between cursor-pointer"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <span className={`${formData.category ? 'text-gray-900' : 'text-gray-400'}`}>
                {formData.category || 'Select category'}
              </span>
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
           
            {showCategoryDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 max-h-60 overflow-auto">
                <div className="px-3 py-2 bg-gray-200 font-medium text-gray-700"></div>
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* System Code Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">System Code</label>
          <div className="relative">
            <input
              type="text"
              name="systemCode"
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
              value={formData.systemCode}
              onChange={handleInputChange}
              readOnly
            />
            {formData.systemCode && (
              <div className="absolute right-3 top-2.5 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                Auto-generated
              </div>
            )}
          </div>
          {formData.category && !formData.systemCode && (
            <p className="text-xs text-gray-500 mt-1">
              System code will be generated when a category is selected
            </p>
          )}
        </div>


        {/* Supplier Code Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Code</label>
          <input
            type="text"
            name="supplierCode"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={formData.supplierCode}
            onChange={handleInputChange}
          />
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Item Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
          <input
            type="text"
            name="itemName"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={formData.itemName}
            onChange={handleInputChange}
          />
        </div>


        {/* Quantity Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <div className="relative">
            <input
              type="text"
              name="quantity"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.quantity}
              onChange={(e) => handleQuantityChange('quantity', e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex flex-col border-l">
              <button
                type="button"
                className="h-1/2 px-2 bg-gray-100 hover:bg-gray-200 border-b border-gray-300"
                onClick={() => handleQuantityChange('quantity', (parseInt(formData.quantity) || 0) + 1)}
              >
                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                type="button"
                className="h-1/2 px-2 bg-gray-100 hover:bg-gray-200"
                onClick={() => handleQuantityChange('quantity', (parseInt(formData.quantity) || 0) - 1)}
              >
                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Shell Quantity Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shell Quantity</label>
          <div className="relative">
            <input
              type="text"
              name="shellQuantity"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.shellQuantity}
              onChange={(e) => handleQuantityChange('shellQuantity', e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex flex-col border-l">
              <button
                type="button"
                className="h-1/2 px-2 bg-gray-100 hover:bg-gray-200 border-b border-gray-300"
                onClick={() => handleQuantityChange('shellQuantity', (parseInt(formData.shellQuantity) || 0) + 1)}
              >
                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                type="button"
                className="h-1/2 px-2 bg-gray-100 hover:bg-gray-200"
                onClick={() => handleQuantityChange('shellQuantity', (parseInt(formData.shellQuantity) || 0) - 1)}
              >
                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>


        {/* Bottle Quantity Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bottle Quantity</label>
          <div className="relative">
            <input
              type="text"
              name="bottleQuantity"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={formData.bottleQuantity}
              onChange={(e) => handleQuantityChange('bottleQuantity', e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex flex-col border-l">
              <button
                type="button"
                className="h-1/2 px-2 bg-gray-100 hover:bg-gray-200 border-b border-gray-300"
                onClick={() => handleQuantityChange('bottleQuantity', (parseInt(formData.bottleQuantity) || 0) + 1)}
              >
                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                type="button"
                className="h-1/2 px-2 bg-gray-100 hover:bg-gray-200"
                onClick={() => handleQuantityChange('bottleQuantity', (parseInt(formData.bottleQuantity) || 0) - 1)}
              >
                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Conditional Note */}
      {requiresReturn && (
        <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-md mb-6">
          Note: This product requires bottle and shell return upon purchase.
        </div>
      )}


      <div className="flex justify-end">
        <button
          type="button"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Done
        </button>
      </div>
    </div>
  );
};


export default AddItemForm;
