import React, { useState } from 'react';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';


const Stocks = ({ user, warehouse, onLogout, onNavigate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sidebarExpanded, setSidebarExpanded] = useState(true);


    // Simple toggle function for the sidebar
    const toggleSidebar = () => {
        setSidebarExpanded(prev => !prev);
    };


    // Sample stock data
    const stocksData = []; // Initially empty to simulate first-time use


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
    const filteredStocks = stocksData.filter(stock => {
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
                    inventoryView="stocks"
                    expanded={sidebarExpanded}
                    toggleSidebar={toggleSidebar}
                />
               
                {/* Main content with dynamic margin that adjusts based on sidebar state */}
                <div
                    className="flex-1 overflow-x-auto transition-all duration-300 ease-in-out"
                    style={{
                        marginLeft: sidebarExpanded ? '16rem' : '5rem', // 16rem = 64 (w-64), 5rem = 20 (w-20)
                        paddingTop: '4rem' // Add padding top to account for the header
                    }}
                >
                    <div className="p-6">
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
                       
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
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
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredStocks.length === 0 ? (
                                            <tr>
                                                <td colSpan="21" className="px-6 py-4 text-center text-sm text-gray-500">
                                                    There are no items in stock yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredStocks.map((stock, index) => (
                                                <tr key={index}>
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
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Stocks;
