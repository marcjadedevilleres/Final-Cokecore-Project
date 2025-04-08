import React, { useState } from 'react';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';


const StocksAdjustment = ({ user, warehouse, onLogout, onNavigate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [remarks, setRemarks] = useState('');
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [stocks, setStocks] = useState([]);  // Initialize with empty array
    const [editingStock, setEditingStock] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);
   
    // Simple toggle function for the sidebar
    const toggleSidebar = () => {
        setSidebarExpanded(prev => !prev);
    };


    // Get status badge class
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Out of Stock':
                return 'bg-gray-200 text-gray-800';
            case 'Low':
                return 'bg-red-200 text-red-800';
            case 'Moderate':
                return 'bg-yellow-200 text-yellow-800';
            case 'High':
                return 'bg-green-200 text-green-800';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };


    // Filter stocks based on search term and category
    const filteredStocks = stocks.filter(stock => {
        const matchesSearch = searchTerm === '' ||
            stock.systemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stock.supplierCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stock.itemType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stock.itemName.toLowerCase().includes(searchTerm.toLowerCase());
           
        const matchesCategory = selectedCategory === '' || stock.itemType === selectedCategory;
       
        return matchesSearch && matchesCategory;
    });


    // Toggle category dropdown
    const toggleCategory = () => {
        setCategoryOpen(!categoryOpen);
    };


    // Select category
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setCategoryOpen(false);
    };


    // Handle edit button click
    const handleEdit = (stock) => {
        setEditingStock({...stock});
        setIsEditModalOpen(true);
    };


    // Handle changes to editing stock
    const handleEditChange = (field, value) => {
        setEditingStock(prev => ({
            ...prev,
            [field]: value
        }));
    };


    // Handle changes to nested objects (supplierPrice, retailPrice, quantity)
    const handleNestedChange = (parentField, field, value) => {
        setEditingStock(prev => ({
            ...prev,
            [parentField]: {
                ...prev[parentField],
                [field]: value
            }
        }));
    };


    // Handle save edit
    const handleSaveEdit = () => {
        // Calculate status based on shell quantity
        let status = 'Out of Stock';
        const shellQty = parseInt(editingStock.quantity.shell || 0);
       
        if (shellQty > 0) {
            if (shellQty < 300) {
                status = 'Low';
            } else if (shellQty < 600) {
                status = 'Moderate';
            } else {
                status = 'High';
            }
        }
       
        // Update stock with new status
        const updatedStock = {
            ...editingStock,
            status
        };
       
        // Update the stocks array
        setStocks(prevStocks =>
            prevStocks.map(stock =>
                stock.id === updatedStock.id ? updatedStock : stock
            )
        );
       
        // Close modal and reset editing stock
        setIsEditModalOpen(false);
        setEditingStock(null);
    };


    // Handle delete button click
    const handleDelete = (stockId) => {
        setConfirmDelete(stockId);
    };


    // Confirm deletion
    const confirmDeletion = () => {
        if (confirmDelete) {
            setStocks(prevStocks => prevStocks.filter(stock => stock.id !== confirmDelete));
            setConfirmDelete(null);
        }
    };


    // Cancel deletion
    const cancelDeletion = () => {
        setConfirmDelete(null);
    };


    // Handle save button click
    const handleSave = () => {
        // In a real app, this would send data to an API
        alert('Changes saved successfully!');
        setRemarks('');
    };


    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header
                user={user}
                selectedWarehouse={warehouse}
            />
           
            <div className="flex flex-1">
                {/* Pass sidebar state and toggle function to Sidebar component */}
                <Sidebar
                    onLogout={onLogout}
                    onNavigate={onNavigate}
                    currentView="inventory"
                    inventoryView="stocksAdjustment"
                    expanded={sidebarExpanded}
                    toggleSidebar={toggleSidebar}
                />
               
                {/* Main content with dynamic margin that adjusts based on sidebar state */}
                <div
                    className="flex-1 transition-all duration-300 ease-in-out overflow-x-auto"
                    style={{
                        marginLeft: sidebarExpanded ? '16rem' : '5rem', // 16rem = 64 (w-64), 5rem = 20 (w-20)
                        paddingTop: '4rem' // Add padding top to account for the header
                    }}
                >
                    <div className="p-4 md:p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-base"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                           
                            <div className="relative">
                                <button
                                    onClick={toggleCategory}
                                    className="px-4 py-2 border rounded-md bg-white flex items-center"
                                >
                                    <span>{selectedCategory || 'Category'}</span>
                                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                               
                                {categoryOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-30">
                                        <div className="py-1">
                                            <button
                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                onClick={() => handleCategorySelect('')}
                                            >
                                                All Categories
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                onClick={() => handleCategorySelect('Alcoholic')}
                                            >
                                                Alcoholic
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                onClick={() => handleCategorySelect('Juice')}
                                            >
                                                Juice
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                onClick={() => handleCategorySelect('Softdrinks')}
                                            >
                                                Softdrinks
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                onClick={() => handleCategorySelect('Hydration')}
                                            >
                                                Hydration
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                       
                        <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                System Code
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Supplier Code
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Item Type
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Item Name
                                            </th>
                                            <th scope="col" colSpan="5" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Supplier Price
                                            </th>
                                            <th scope="col" colSpan="5" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Retail Price
                                            </th>
                                            <th scope="col" colSpan="5" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                        <tr>
                                            <th colSpan="4" className="px-6 py-1"></th>
                                            <th className="px-2 py-1 text-xs font-medium text-gray-500 text-center">Box</th>
                                            <th className="px-2 py-1 text-xs font-medium text-gray-500 text-center">Pack</th>
                                            <th className="px-2 py-1 text-xs font-medium text-gray-500 text-center">Case</th>
                                            <th className="px-2 py-1 text-xs font-medium text-gray-500 text-center">Bottle</th>
                                            <th className="px-2 py-1 text-xs font-medium text-gray-500 text-center">Shell</th>
                                            <th className="px-2 py-1 text-xs font-medium text-gray-500 text-center">Box</th>
                                            <th className="px-2 py-1 text-xs font-medium text-gray-500 text-center">Pack</th>
                                            <th className="px-2 py-1 text-xs font-medium text-gray-500 text-center">Case</th>
                                            <th className="px-2 py-1 text-xs font-medium text-gray-500 text-center">Bottle</th>
                                            <th className="px-2 py-1 text-xs font-medium text-gray-500 text-center">Shell</th>
                                            <th className="px-2 py-1 text-xs font-medium text-gray-500 text-center">Box</th>
                                            <th className="px-2 py-1 text-xs font-medium text-gray-500 text-center">Pack</th>
                                            <th className="px-2 py-1 text-xs font-medium text-gray-500 text-center">Case</th>
                                            <th className="px-2 py-1 text-xs font-medium text-gray-500 text-center">Bottle</th>
                                            <th className="px-2 py-1 text-xs font-medium text-gray-500 text-center">Shell</th>
                                            <th className="px-2 py-1"></th>
                                            <th className="px-2 py-1"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredStocks.length === 0 ? (
                                            <tr>
                                                <td colSpan="22" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    There are no items in stock yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredStocks.map((stock) => (
                                                <tr key={stock.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {stock.systemCode}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {stock.supplierCode}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {stock.itemType}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {stock.itemName}
                                                    </td>
                                                   
                                                    {/* Supplier Price columns */}
                                                    <td className="px-2 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                        {stock.supplierPrice.box}
                                                    </td>
                                                    <td className="px-2 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                        {stock.supplierPrice.pack}
                                                    </td>
                                                    <td className="px-2 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                        {stock.supplierPrice.case}
                                                    </td>
                                                    <td className="px-2 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                        {stock.supplierPrice.bottle}
                                                    </td>
                                                    <td className="px-2 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                        {stock.supplierPrice.shell}
                                                    </td>
                                                   
                                                    {/* Retail Price columns */}
                                                    <td className="px-2 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                        {stock.retailPrice.box}
                                                    </td>
                                                    <td className="px-2 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                        {stock.retailPrice.pack}
                                                    </td>
                                                    <td className="px-2 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                        {stock.retailPrice.case}
                                                    </td>
                                                    <td className="px-2 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                        {stock.retailPrice.bottle}
                                                    </td>
                                                    <td className="px-2 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                        {stock.retailPrice.shell}
                                                    </td>
                                                   
                                                    {/* Quantity columns */}
                                                    <td className="px-2 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                        {stock.quantity.box}
                                                    </td>
                                                    <td className="px-2 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                        {stock.quantity.pack}
                                                    </td>
                                                    <td className="px-2 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                        {stock.quantity.case}
                                                    </td>
                                                    <td className="px-2 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                        {stock.quantity.bottle}
                                                    </td>
                                                    <td className="px-2 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                                        {stock.quantity.shell}
                                                    </td>
                                                   
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(stock.status)}`}>
                                                            {stock.status}
                                                        </span>
                                                    </td>
                                                   
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                        <div className="flex space-x-2 justify-center">
                                                            <button
                                                                className="text-blue-600 hover:text-blue-900"
                                                                onClick={() => handleEdit(stock)}
                                                            >
                                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                className="text-red-600 hover:text-red-900"
                                                                onClick={() => handleDelete(stock.id)}
                                                            >
                                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                       
                        {/* Remarks Section */}
                        <div className="mb-6">
                            <textarea
                                rows="3"
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                                placeholder="Add remarks here..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            ></textarea>
                        </div>
                       
                        {/* Save Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={handleSave}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
           
            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="relative bg-white rounded-lg max-w-4xl mx-auto p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Edit Stock Item</h3>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>


                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">System Code</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={editingStock?.systemCode || ''}
                                    onChange={(e) => handleEditChange('systemCode', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Code</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={editingStock?.supplierCode || ''}
                                    onChange={(e) => handleEditChange('supplierCode', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Type</label>
                                <select
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={editingStock?.itemType || ''}
                                    onChange={(e) => handleEditChange('itemType', e.target.value)}
                                >
                                    <option value="">Select Type</option>
                                    <option value="Alcoholic">Alcoholic</option>
                                    <option value="Juice">Juice</option>
                                    <option value="Softdrinks">Softdrinks</option>
                                    <option value="Hydration">Hydration</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={editingStock?.itemName || ''}
                                    onChange={(e) => handleEditChange('itemName', e.target.value)}
                                />
                            </div>
                        </div>


                        <div className="mb-4">
                            <h4 className="text-md font-medium mb-2">Supplier Price</h4>
                            <div className="grid grid-cols-5 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Box</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={editingStock?.supplierPrice.box || ''}
                                        onChange={(e) => handleNestedChange('supplierPrice', 'box', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pack</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={editingStock?.supplierPrice.pack || ''}
                                        onChange={(e) => handleNestedChange('supplierPrice', 'pack', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Case</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={editingStock?.supplierPrice.case || ''}
                                        onChange={(e) => handleNestedChange('supplierPrice', 'case', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bottle</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={editingStock?.supplierPrice.bottle || ''}
                                        onChange={(e) => handleNestedChange('supplierPrice', 'bottle', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Shell</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={editingStock?.supplierPrice.shell || ''}
                                        onChange={(e) => handleNestedChange('supplierPrice', 'shell', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="mb-4">
                            <h4 className="text-md font-medium mb-2">Retail Price</h4>
                            <div className="grid grid-cols-5 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Box</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={editingStock?.retailPrice.box || ''}
                                        onChange={(e) => handleNestedChange('retailPrice', 'box', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pack</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={editingStock?.retailPrice.pack || ''}
                                        onChange={(e) => handleNestedChange('retailPrice', 'pack', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Case</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={editingStock?.retailPrice.case || ''}
                                        onChange={(e) => handleNestedChange('retailPrice', 'case', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bottle</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={editingStock?.retailPrice.bottle || ''}
                                        onChange={(e) => handleNestedChange('retailPrice', 'bottle', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Shell</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={editingStock?.retailPrice.shell || ''}
                                        onChange={(e) => handleNestedChange('retailPrice', 'shell', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="mb-4">
                            <h4 className="text-md font-medium mb-2">Quantity</h4>
                            <div className="grid grid-cols-5 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Box</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={editingStock?.quantity.box || ''}
                                        onChange={(e) => handleNestedChange('quantity', 'box', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pack</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={editingStock?.quantity.pack || ''}
                                        onChange={(e) => handleNestedChange('quantity', 'pack', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Case</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={editingStock?.quantity.case || ''}
                                        onChange={(e) => handleNestedChange('quantity', 'case', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bottle</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={editingStock?.quantity.bottle || ''}
                                        onChange={(e) => handleNestedChange('quantity', 'bottle', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Shell</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        value={editingStock?.quantity.shell || ''}
                                        onChange={(e) => handleNestedChange('quantity', 'shell', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="mr-2 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
           
            {/* Delete Confirmation Dialog */}
            {confirmDelete && (
                <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="relative bg-white rounded-lg max-w-md mx-auto p-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium">Confirm Deletion</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Are you sure you want to delete this item? This action cannot be undone.
                            </p>
                        </div>
                       
                        <div className="flex justify-end">
                            <button
                                onClick={cancelDeletion}
                                className="mr-2 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeletion}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default StocksAdjustment;
