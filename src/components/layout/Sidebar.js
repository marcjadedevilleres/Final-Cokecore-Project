import React, { useEffect, useState } from 'react';


const Sidebar = ({ onLogout, onNavigate, currentView, inventoryView, expanded: externalExpanded, toggleSidebar: externalToggleSidebar }) => {
    // Internal expanded state (used if no external state is provided)
    const [internalExpanded, setInternalExpanded] = useState(true);
   
    // Use external expanded state if provided, otherwise use internal state
    const expanded = externalExpanded !== undefined ? externalExpanded : internalExpanded;
   
    // Toggle function - use external if provided, otherwise use internal
    const toggleSidebar = (e) => {
        if (e) e.stopPropagation();
        if (externalToggleSidebar) {
            externalToggleSidebar(e);
        } else {
            setInternalExpanded(!internalExpanded);
        }
    };
   
    // Menu expansion state (separate from sidebar expansion)
    const [expandedMenus, setExpandedMenus] = useState({
        inventory: true,
        transactions: true,
        manage: false,
        settings: false
    });


    // Define style variables
    const linkStyles = "flex items-center w-full px-6 py-3";
    const hoverLinkStyles = "hover:bg-gray-100";
    const activeLinkStyles = "bg-red-600 text-white";


    useEffect(() => {
        // Expand inventory menu when inventory view is active
        if (inventoryView === 'stocks' || inventoryView === 'stocksAdjustment') {
            setExpandedMenus(prev => ({ ...prev, inventory: true }));
        }
       
        // Expand transactions menu when a transaction view is active
        if (currentView === 'receiving' || currentView === 'trading' || currentView === 'invoice') {
            setExpandedMenus(prev => ({ ...prev, transactions: true }));
        }
    }, [inventoryView, currentView]);


    const toggleMenu = (menu, e) => {
        e.stopPropagation();
        setExpandedMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };


    const handleNavigate = (view, e) => {
        if (e) e.stopPropagation();
        if (onNavigate) {
            onNavigate(view);
        }
       
        // Ensure appropriate menus stay expanded when navigating
        if (view === 'stocks' || view === 'stocksAdjustment') {
            setExpandedMenus(prev => ({ ...prev, inventory: true }));
        }
       
        if (view === 'receiving' || view === 'trading' || view === 'invoice') {
            setExpandedMenus(prev => ({ ...prev, transactions: true }));
        }
    };


    return (
        <aside className={`bg-white border-r border-gray-300 transition-all duration-300 h-screen fixed left-0 pt-16 z-40 ${expanded ? 'w-64' : 'w-20'}`}>
            <div className="flex flex-col h-full">
                {/* Fixed Header - Ensuring this always stays visible */}
                <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center sticky top-16 z-10">
                    <button onClick={toggleSidebar} className="text-xl focus:outline-none">
                        ☰
                    </button>
                </div>
               
                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1">
                    <ul className="py-2">
                        <li className="mb-1">
                            <button
                                className={`${linkStyles} ${currentView === 'dashboard' ? activeLinkStyles : hoverLinkStyles}`}
                                onClick={(e) => handleNavigate('dashboard', e)}
                            >
                                <i className="fas fa-chart-line mr-3"></i>
                                {expanded && "Dashboard"}
                            </button>
                        </li>
                        <li className="mb-1">
                            <button
                                className={`${linkStyles} ${inventoryView === 'stocks' || inventoryView === 'stocksAdjustment' ? 'bg-gray-100' : hoverLinkStyles}`}
                                onClick={(e) => toggleMenu('inventory', e)}
                            >
                                <i className="fas fa-boxes mr-3"></i>
                                {expanded && (
                                    <>
                                        Inventory
                                        <i className={`fas fa-chevron-${expandedMenus.inventory ? 'down' : 'right'} ml-auto`}></i>
                                    </>
                                )}
                            </button>
                            {expandedMenus.inventory && expanded && (
                                <ul className="ml-6">
                                    <li className="mb-1">
                                        <button
                                            className={`${linkStyles} ${inventoryView === 'stocks' ? activeLinkStyles : hoverLinkStyles}`}
                                            onClick={(e) => handleNavigate('stocks', e)}
                                        >
                                            <i className="fas fa-box mr-3"></i>
                                            Stocks
                                        </button>
                                    </li>
                                    <li className="mb-1">
                                        <button
                                            className={`${linkStyles} ${inventoryView === 'stocksAdjustment' ? activeLinkStyles : hoverLinkStyles}`}
                                            onClick={(e) => handleNavigate('stocksAdjustment', e)}
                                        >
                                            <i className="fas fa-edit mr-3"></i>
                                            Stocks Adjustment
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </li>
                        {/* Transactions Section */}
                        <li className="mb-1">
                            <button
                                className={`${linkStyles} ${currentView === 'receiving' || currentView === 'trading' || currentView === 'invoice' ? 'bg-gray-100' : hoverLinkStyles}`}
                                onClick={(e) => toggleMenu('transactions', e)}
                            >
                                <i className="fas fa-exchange-alt mr-3"></i>
                                {expanded && (
                                    <>
                                        Transactions
                                        <i className={`fas fa-chevron-${expandedMenus.transactions ? 'down' : 'right'} ml-auto`}></i>
                                    </>
                                )}
                            </button>
                            {expandedMenus.transactions && expanded && (
                                <ul className="ml-6">
                                    <li className="mb-1">
                                        <button
                                            className={`${linkStyles} ${currentView === 'receiving' ? activeLinkStyles : hoverLinkStyles}`}
                                            onClick={(e) => handleNavigate('receiving', e)}
                                        >
                                            <i className="fas fa-truck-loading mr-3"></i>
                                            Receiving
                                        </button>
                                    </li>
                                    <li className="mb-1">
                                        <button
                                            className={`${linkStyles} ${currentView === 'trading' ? activeLinkStyles : hoverLinkStyles}`}
                                            onClick={(e) => handleNavigate('trading', e)}
                                        >
                                            <i className="fas fa-exchange-alt mr-3"></i>
                                            Trading
                                        </button>
                                    </li>
                                    <li className="mb-1">
                                        <button
                                            className={`${linkStyles} ${currentView === 'invoice' ? activeLinkStyles : hoverLinkStyles}`}
                                            onClick={(e) => handleNavigate('invoice', e)}
                                        >
                                            <i className="fas fa-file-invoice mr-3"></i>
                                            Invoice
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className="mb-1">
                            <button
                                className="flex items-center w-full px-6 py-3 hover:bg-gray-100"
                                onClick={(e) => toggleMenu('manage', e)}
                            >
                                <i className="fas fa-users mr-3"></i>
                                {expanded && (
                                    <>
                                        Manage
                                        <i className={`fas fa-chevron-${expandedMenus.manage ? 'down' : 'right'} ml-auto`}></i>
                                    </>
                                )}
                            </button>
                            {expandedMenus.manage && expanded && (
                                <ul className="ml-6">
                                    <li className="mb-1">
                                        <button
                                            className="flex items-center w-full px-6 py-2 hover:bg-gray-100"
                                            onClick={(e) => handleNavigate('users', e)}
                                        >
                                            <i className="fas fa-user-friends mr-3"></i>
                                            Users
                                        </button>
                                    </li>
                                    <li className="mb-1">
                                        <button
                                            className="flex items-center w-full px-6 py-2 hover:bg-gray-100"
                                            onClick={(e) => handleNavigate('suppliers', e)}
                                        >
                                            <i className="fas fa-building mr-3"></i>
                                            Suppliers
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className="mb-1">
                            <button
                                className="flex items-center w-full px-6 py-3 hover:bg-gray-100"
                                onClick={(e) => toggleMenu('settings', e)}
                            >
                                <i className="fas fa-cog mr-3"></i>
                                {expanded && (
                                    <>
                                        Settings
                                        <i className={`fas fa-chevron-${expandedMenus.settings ? 'down' : 'right'} ml-auto`}></i>
                                    </>
                                )}
                            </button>
                            {expandedMenus.settings && expanded && (
                                <ul className="ml-6">
                                    <li className="mb-1">
                                        <button
                                            className="flex items-center w-full px-6 py-2 hover:bg-gray-100"
                                            onClick={(e) => handleNavigate('preferences', e)}
                                        >
                                            <i className="fas fa-sliders-h mr-3"></i>
                                            Preferences
                                        </button>
                                    </li>
                                    <li className="mb-1">
                                        <button
                                            className="flex items-center w-full px-6 py-2 hover:bg-gray-100"
                                            onClick={(e) => handleNavigate('company', e)}
                                        >
                                            <i className="fas fa-building mr-3"></i>
                                            Company
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className="mb-1">
                            <button
                                className="flex items-center w-full px-6 py-3 hover:bg-gray-100 text-left"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onLogout();
                                }}
                            >
                                <i className="fas fa-sign-out-alt mr-3"></i>
                                {expanded && "Log out"}
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </aside>
    );
};


export default Sidebar;
