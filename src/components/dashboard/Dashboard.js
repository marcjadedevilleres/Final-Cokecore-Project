import React, { useState, lazy, Suspense, useEffect, useRef } from 'react';
import Header from '../layout/Header';


// Lazy load WarehouseModal component
const WarehouseModal = lazy(() => import('./WarehouseModal'));


// Section types
const SECTION_TYPES = {
  STOCKS: 'Stocks',
  TRADING: 'Trading',
  REPORTS: 'Reports',
  RECEIVING: 'Receiving',
  PRICELIST: 'Pricelist'
};


// Date range options
const DATE_RANGE_OPTIONS = {
  THIS_WEEK: 'This Week',
  THIS_MONTH: 'This Month',
  THIS_YEAR: 'This Year',
  PREVIOUS_WEEK: 'Previous Week',
  PREVIOUS_MONTH: 'Previous Month',
  PREVIOUS_YEAR: 'Previous Year',
  CUSTOM: 'Custom'
};


// Month names
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];


// Notification component
const NotificationPanel = ({ isOpen, onClose, notifications, activeTab, setActiveTab, showOptionsMenu, toggleOptionsMenu, markAllAsRead, deleteAllNotifications }) => {
  const notificationRef = useRef(null);


  // Close panel when clicking outside
  useEffect(() => {
    if (!isOpen) return;


    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target) && !event.target.closest('.notification-bell')) {
        onClose();
      }
    };


    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);


  if (!isOpen) return null;


  const filteredNotifications = activeTab === 'Unread'
    ? notifications.filter(n => !n.read)
    : notifications;


  return (
    <div ref={notificationRef} className="absolute top-16 right-16 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <div className="relative">
          <button
            onClick={toggleOptionsMenu}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 13a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1zm0-5a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1zm0-4a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V5a1 1 0 0 1 1-1z"></path>
            </svg>
          </button>
         
          {/* Options Menu */}
          {showOptionsMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div className="p-2">
                <button
                  onClick={markAllAsRead}
                  className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded"
                >
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Mark all as read
                </button>
                <button
                  onClick={deleteAllNotifications}
                  className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded text-red-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Delete all Notifications
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
     
      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'All' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('All')}
        >
          All
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'Unread' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('Unread')}
        >
          Unread
        </button>
      </div>
     
      {/* Notification List */}
      <div className="max-h-80 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          <div>
            <div className="flex justify-between items-center px-4 py-2 bg-gray-50">
              <span className="text-xs text-gray-500">Earlier</span>
              <button className="text-xs text-blue-500">See all</button>
            </div>
           
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 border-b hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    {notification.icon}
                  </div>
                  <div>
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700">No Notification Here</h3>
            <p className="text-sm text-gray-500 text-center mt-1">There is no notification to show right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};


// Updated Sidebar Component with lifted state
const SidebarWithLiftedState = ({ onLogout, onNavigate, currentView, inventoryView, expanded, setExpanded }) => {
    const [expandedMenus, setExpandedMenus] = useState({
        inventory: true,
        transactions: true,
        manage: false,
        settings: false
    });


    useEffect(() => {
        if (inventoryView === 'stocks' || inventoryView === 'stocksAdjustment') {
            setExpandedMenus(prev => ({ ...prev, inventory: true }));
        }
    }, [inventoryView]);


    const toggleMenu = (menu, e) => {
        // Stop event propagation to prevent parent handlers from firing
        e.stopPropagation();
       
        setExpandedMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };


    const handleNavigate = (view, e) => {
        // Stop event propagation to prevent parent handlers from firing
        if (e) e.stopPropagation();
       
        if (onNavigate) {
            onNavigate(view);
        }
       
        // Ensure expanded state is preserved when navigating
        // This is critical to keep the hamburger toggle visible
       
        if (view === 'stocks' || view === 'stocksAdjustment') {
            setExpandedMenus(prev => ({ ...prev, inventory: true }));
        }
    };


    return (
        <aside className={`bg-white border-r border-gray-300 transition-all duration-300 h-screen fixed left-0 pt-16 z-40 ${expanded ? 'w-64' : 'w-20'}`}>
            <div className="flex flex-col h-full">
                {/* Fixed Header - Ensuring this always stays visible */}
                <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center sticky top-16 z-10">
                    <button onClick={() => setExpanded(!expanded)} className="text-xl focus:outline-none">
                        ☰
                    </button>
                </div>
               
                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1">
                    <ul className="py-2">
                        <li className="mb-1">
                            <button
                                className={`flex items-center w-full px-6 py-3 ${currentView === 'dashboard' ? 'bg-red-600 text-white' : 'hover:bg-gray-100'}`}
                                onClick={(e) => handleNavigate('dashboard', e)}
                            >
                                <i className="fas fa-chart-line mr-3"></i>
                                {expanded && "Dashboard"}
                            </button>
                        </li>
                        <li className="mb-1">
                            <button
                                className={`flex items-center w-full px-6 py-3 ${inventoryView === 'stocks' || inventoryView === 'stocksAdjustment' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
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
                                            className={`flex items-center w-full px-6 py-2 ${inventoryView === 'stocks' ? 'bg-red-600 text-white' : 'hover:bg-gray-100'}`}
                                            onClick={(e) => handleNavigate('stocks', e)}
                                        >
                                            <i className="fas fa-box mr-3"></i>
                                            Stocks
                                        </button>
                                    </li>
                                    <li className="mb-1">
                                        <button
                                            className={`flex items-center w-full px-6 py-2 ${inventoryView === 'stocksAdjustment' ? 'bg-red-600 text-white' : 'hover:bg-gray-100'}`}
                                            onClick={(e) => handleNavigate('stocksAdjustment', e)}
                                        >
                                            <i className="fas fa-edit mr-3"></i>
                                            Stocks Adjustment
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className="mb-1">
                            <button
                                className="flex items-center w-full px-6 py-3 hover:bg-gray-100"
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
                className="flex items-center w-full px-6 py-2 hover:bg-gray-100"
                onClick={(e) => handleNavigate('receiving', e)}
            >
                <i className="far fa-folder mr-3"></i>
                Receiving
            </button>
        </li>
        <li className="mb-1">
            <button
                className="flex items-center w-full px-6 py-2 hover:bg-gray-100"
                onClick={(e) => handleNavigate('trading', e)}
            >
                <i className="far fa-folder mr-3"></i>
                Trading
            </button>
        </li>
        <li className="mb-1">
            <button
                className="flex items-center w-full px-6 py-2 hover:bg-gray-100"
                onClick={(e) => handleNavigate('invoice', e)}
            >
                <i className="far fa-file-alt mr-3"></i>
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


// Main Dashboard Component
const Dashboard = ({ user, warehouse, onWarehouseChange, onLogout, onNavigate }) => {
  // Get current date information
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();


  const [warehouseModalOpen, setWarehouseModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(warehouse || '');
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
 
  // Sidebar expanded state (lifted from Sidebar component)
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
 
  // Update selected warehouse when prop changes
  useEffect(() => {
    if (warehouse) {
      setSelectedWarehouse(warehouse);
    }
  }, [warehouse]);


  // Notification states
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNotificationOptions, setShowNotificationOptions] = useState(false);
  const [activeNotificationTab, setActiveNotificationTab] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);


  // Toggle notification panel
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showNotificationOptions) {
      setShowNotificationOptions(false);
    }
  };


  // Toggle notification options menu
  const toggleNotificationOptions = () => {
    setShowNotificationOptions(!showNotificationOptions);
  };


  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setNotificationCount(0);
    setShowNotificationOptions(false);
  };


  // Delete all notifications
  const deleteAllNotifications = () => {
    setNotifications([]);
    setNotificationCount(0);
    setShowNotificationOptions(false);
  };


  // Calendar states
  const [tradingMonth, setTradingMonth] = useState(currentMonth);
  const [tradingYear, setTradingYear] = useState(currentYear);
  const [tradingSelectedDate, setTradingSelectedDate] = useState(19);


  // Date range states
  const [selectedDateRange, setSelectedDateRange] = useState(DATE_RANGE_OPTIONS.THIS_MONTH);
  const [showDatePicker, setShowDatePicker] = useState(false);


  // Date range selection states
  const [startDate, setStartDate] = useState(new Date(currentYear, currentMonth, 1));
  const [endDate, setEndDate] = useState(new Date(currentYear, currentMonth, 28));
  const [showStartCalendar, setShowStartCalendar] = useState(true);
  const [showEndCalendar, setShowEndCalendar] = useState(false);


  // Calendar month/year selection states
  const [startMonth, setStartMonth] = useState(currentMonth);
  const [startYear, setStartYear] = useState(currentYear);
  const [endMonth, setEndMonth] = useState(currentMonth);
  const [endYear, setEndYear] = useState(currentYear);


  const [startSelectedDate, setStartSelectedDate] = useState(1);
  const [endSelectedDate, setEndSelectedDate] = useState(24);


  // Format date to string
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  // Initial sections to display
  const [sections, setSections] = useState([
    { id: 1, type: SECTION_TYPES.STOCKS, active: true },
    { id: 2, type: SECTION_TYPES.TRADING, active: true },
    { id: 3, type: SECTION_TYPES.REPORTS, active: true },
  ]);


  // Keep track of the next section ID
  const [nextSectionId, setNextSectionId] = useState(4);


  const toggleWarehouseModal = () => {
    setWarehouseModalOpen(!warehouseModalOpen);
  };


  const selectWarehouse = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setWarehouseModalOpen(false);
    // If there's an onWarehouseChange prop, call it with the new warehouse
    if (typeof onWarehouseChange === 'function') {
      onWarehouseChange(warehouse);
    }
  };


  // Handle date range selection
  const handleDateRangeChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedDateRange(selectedValue);


    if (selectedValue === DATE_RANGE_OPTIONS.CUSTOM) {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);


      // Set date range based on selection
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const currentDate = now.getDate();
      const currentDay = now.getDay(); // Day of week (0-6, 0 is Sunday)


      let newStartDate, newEndDate;


      switch(selectedValue) {
        case DATE_RANGE_OPTIONS.THIS_WEEK:
          // Start of week (Sunday)
          newStartDate = new Date(currentYear, currentMonth, currentDate - currentDay);
          // End of week (Saturday)
          newEndDate = new Date(currentYear, currentMonth, currentDate + (6 - currentDay));
          break;
        case DATE_RANGE_OPTIONS.THIS_MONTH:
          newStartDate = new Date(currentYear, currentMonth, 1);
          newEndDate = new Date(currentYear, currentMonth + 1, 0);
          break;
        case DATE_RANGE_OPTIONS.THIS_YEAR:
          newStartDate = new Date(currentYear, 0, 1);
          newEndDate = new Date(currentYear, 11, 31);
          break;
        case DATE_RANGE_OPTIONS.PREVIOUS_WEEK:
          newStartDate = new Date(currentYear, currentMonth, currentDate - currentDay - 7);
          newEndDate = new Date(currentYear, currentMonth, currentDate - currentDay - 1);
          break;
        case DATE_RANGE_OPTIONS.PREVIOUS_MONTH:
          newStartDate = new Date(currentYear, currentMonth - 1, 1);
          newEndDate = new Date(currentYear, currentMonth, 0);
          break;
        case DATE_RANGE_OPTIONS.PREVIOUS_YEAR:
          newStartDate = new Date(currentYear - 1, 0, 1);
          newEndDate = new Date(currentYear - 1, 11, 31);
          break;
        default:
          newStartDate = new Date(currentYear, currentMonth, 1);
          newEndDate = new Date(currentYear, currentMonth + 1, 0);
      }


      setStartDate(newStartDate);
      setEndDate(newEndDate);
      setStartMonth(newStartDate.getMonth());
      setStartYear(newStartDate.getFullYear());
      setEndMonth(newEndDate.getMonth());
      setEndYear(newEndDate.getFullYear());
    }
  };


  // Navigate to previous month in Trading calendar
  const prevTradingMonth = () => {
    if (tradingMonth === 0) {
      setTradingMonth(11);
      setTradingYear(tradingYear - 1);
    } else {
      setTradingMonth(tradingMonth - 1);
    }
  };


  // Navigate to next month in Trading calendar
  const nextTradingMonth = () => {
    if (tradingMonth === 11) {
      setTradingMonth(0);
      setTradingYear(tradingYear + 1);
    } else {
      setTradingMonth(tradingMonth + 1);
    }
  };


  // Navigate to previous month in custom date picker
  const prevMonth = (isStart) => {
    if (isStart) {
      if (startMonth === 0) {
        setStartMonth(11);
        setStartYear(startYear - 1);
      } else {
        setStartMonth(startMonth - 1);
      }
    } else {
      if (endMonth === 0) {
        setEndMonth(11);
        setEndYear(endYear - 1);
      } else {
        setEndMonth(endMonth - 1);
      }
    }
  };


  // Navigate to next month in custom date picker
  const nextMonth = (isStart) => {
    if (isStart) {
      if (startMonth === 11) {
        setStartMonth(0);
        setStartYear(startYear + 1);
      } else {
        setStartMonth(startMonth + 1);
      }
    } else {
      if (endMonth === 11) {
        setEndMonth(0);
        setEndYear(endYear + 1);
      } else {
        setEndMonth(endMonth + 1);
      }
    }
  };


  // Handle calendar tab selection
  const selectCalendarTab = (isStart) => {
    if (isStart) {
      setShowStartCalendar(true);
      setShowEndCalendar(false);
    } else {
      setShowStartCalendar(false);
      setShowEndCalendar(true);
    }
  };


  // Handle date selection in calendar
  const selectDate = (isStart, day) => {
    if (isStart) {
      setStartSelectedDate(day);
      setStartDate(new Date(startYear, startMonth, day));
    } else {
      setEndSelectedDate(day);
      setEndDate(new Date(endYear, endMonth, day));
    }
  };


  // Handle trading date selection
  const selectTradingDate = (day) => {
    setTradingSelectedDate(day);
  };


  // Select preset date range
  const selectPresetRange = (preset) => {
    setSelectedDateRange(preset);
    handleDateRangeChange({ target: { value: preset } });
  };


  // Apply date range selection
  const applyDateRange = () => {
    // Apply the selected date range (in a real app, this would update the data)
    setShowDatePicker(false);
  };


  // Cancel date range selection
  const cancelDateRange = () => {
    setShowDatePicker(false);
    setSelectedDateRange(DATE_RANGE_OPTIONS.THIS_MONTH);
    handleDateRangeChange({ target: { value: DATE_RANGE_OPTIONS.THIS_MONTH } });
  };


  // Toggle section visibility
  const toggleSection = (id) => {
    setSections(sections.map(section =>
      section.id === id ? { ...section, active: !section.active } : section
    ));
  };


  // Add new section
  const addSection = (type) => {
    const newSection = { id: nextSectionId, type, active: true };
    setSections([...sections, newSection]);
    setNextSectionId(nextSectionId + 1);
    setShowAddSectionModal(false);
  };


  // Generate calendar for a specific month and year
  const generateCalendar = (year, month, selectedDay, onDateSelect) => {
    // Get number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();


    // Get the day of week for the first day (0 = Sunday)
    const firstDayOfMonth = new Date(year, month, 1).getDay();


    // Get the days of the previous month to fill in the first row
    const daysInPrevMonth = month === 0
      ? new Date(year - 1, 12, 0).getDate()
      : new Date(year, month, 0).getDate();


    // Create array for days of previous month (if needed)
    const prevMonthDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      prevMonthDays.push(daysInPrevMonth - firstDayOfMonth + i + 1);
    }


    // Create array for days of current month
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push(i);
    }


    // Create array for days of next month (if needed to fill the last row)
    const nextMonthDays = [];
    const totalCells = 42; // 6 rows of 7 days
    const remainingCells = totalCells - (prevMonthDays.length + currentMonthDays.length);
    for (let i = 1; i <= remainingCells; i++) {
      nextMonthDays.push(i);
    }


    return (
      <div className="calendar">
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          <div className="text-sm font-medium text-gray-500">Sun</div>
          <div className="text-sm font-medium text-gray-500">Mon</div>
          <div className="text-sm font-medium text-gray-500">Tue</div>
          <div className="text-sm font-medium text-gray-500">Wed</div>
          <div className="text-sm font-medium text-gray-500">Thu</div>
          <div className="text-sm font-medium text-gray-500">Fri</div>
          <div className="text-sm font-medium text-gray-500">Sat</div>
        </div>


        <div className="grid grid-cols-7 gap-1 text-center">
          {/* Previous month days */}
          {prevMonthDays.map((day, index) => (
            <div key={`prev-${index}`} className="py-1 text-gray-400">
              {day}
            </div>
          ))}


          {/* Current month days */}
          {currentMonthDays.map((day) => (
            <div
              key={`curr-${day}`}
              className={`py-1 cursor-pointer hover:bg-gray-200 ${day === selectedDay ? 'bg-red-600 text-white rounded-full' : ''}`}
              onClick={() => onDateSelect(day)}
            >
              {day}
            </div>
          ))}


          {/* Next month days */}
          {nextMonthDays.map((day, index) => (
            <div key={`next-${index}`} className="py-1 text-gray-400">
              {day}
            </div>
          ))}
        </div>
      </div>
    );
  };


  // Render a section based on its type
  const renderSection = (section) => {
    switch(section.type) {
      case SECTION_TYPES.STOCKS:
        return (
          <div className="bg-white p-6 rounded shadow relative" key={section.id}>
            <div className="absolute top-2 right-2">
              <button
                className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                onClick={() => toggleSection(section.id)}
              >
                ✕
              </button>
            </div>
            <h2 className="text-lg font-semibold mb-4">Stocks</h2>
            <div className="h-40 bg-gray-50 flex items-center justify-center">
              <p className="text-gray-500">Stocks displayed here</p>
            </div>
          </div>
        );


      case SECTION_TYPES.TRADING:
        return (
          <div className="bg-white p-6 rounded shadow relative" key={section.id}>
            <div className="absolute top-2 right-2">
              <button
                className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                onClick={() => toggleSection(section.id)}
              >
                ✕
              </button>
            </div>
            <h2 className="text-lg font-semibold mb-4">Trading</h2>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={prevTradingMonth}
                >
                  &lt;
                </button>
                <div className="text-center font-semibold text-lg">
                  {MONTHS[tradingMonth]} {tradingYear}
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={nextTradingMonth}
                >
                  &gt;
                </button>
              </div>


              {generateCalendar(tradingYear, tradingMonth, tradingSelectedDate, selectTradingDate)}
            </div>
          </div>
        );


      case SECTION_TYPES.REPORTS:
        return (
          <div className="bg-white p-6 rounded shadow relative" key={section.id}>
            <div className="absolute top-2 right-2">
              <button
                className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                onClick={() => toggleSection(section.id)}
              >
                ✕
              </button>
            </div>
            <h2 className="text-lg font-semibold mb-4">Reports</h2>
            <div className="h-40 bg-gray-50 flex items-center justify-center">
              <p className="text-gray-500">Reports will be displayed here</p>
            </div>
          </div>
        );


      case SECTION_TYPES.RECEIVING:
        return (
          <div className="bg-white p-6 rounded shadow relative" key={section.id}>
            <div className="absolute top-2 right-2">
              <button
                className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                onClick={() => toggleSection(section.id)}
              >
                ✕
              </button>
            </div>
            <h2 className="text-lg font-semibold mb-4">Receiving</h2>
            <div className="h-40 bg-gray-50 flex items-center justify-center">
              <p className="text-gray-500">Receiving will be displayed here</p>
            </div>
          </div>
        );


      case SECTION_TYPES.PRICELIST:
        return (
          <div className="bg-white p-6 rounded shadow relative" key={section.id}>
            <div className="absolute top-2 right-2">
              <button
                className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                onClick={() => toggleSection(section.id)}
              >
                ✕
              </button>
            </div>
            <h2 className="text-lg font-semibold mb-4">Pricelist</h2>
            <div className="h-40 bg-gray-50 flex items-center justify-center">
              <p className="text-gray-500">Pricelist will be displayed here</p>
            </div>
          </div>
        );


      default:
        return null;
    }
  };


  // Add Section Modal
  const AddSectionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Add New Section</h2>
        <div className="space-y-3">
          <button
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-left rounded"
            onClick={() => addSection(SECTION_TYPES.STOCKS)}
          >
            Stocks
          </button>
          <button
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-left rounded"
            onClick={() => addSection(SECTION_TYPES.TRADING)}
          >
            Trading
          </button>
          <button
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-left rounded"
            onClick={() => addSection(SECTION_TYPES.REPORTS)}
          >
            Reports
          </button>
          <button
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-left rounded"
            onClick={() => addSection(SECTION_TYPES.RECEIVING)}
          >
            Receiving
          </button>
          <button
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-left rounded"
            onClick={() => addSection(SECTION_TYPES.PRICELIST)}
          >
            Pricelist
          </button>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            className="py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded"
            onClick={() => setShowAddSectionModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );


  // Date Picker Component
  const DateRangePicker = () => (
    <div className="absolute top-12 right-0 bg-white border border-gray-300 rounded shadow-lg z-10 w-80">
      <div className="p-4">
        <div className="flex space-x-2 mb-4">
          <div className="flex-1">
            <input
              type="text"
              className="w-full border rounded px-2 py-1 text-sm"
              value={formatDate(startDate)}
              readOnly
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              className="w-full border rounded px-2 py-1 text-sm"
              value={formatDate(endDate)}
              readOnly
            />
          </div>
        </div>


        <div className="flex mb-2 border-b">
          <button
            className={`flex-1 py-1 text-sm ${showStartCalendar ? 'font-bold border-b-2 border-black' : ''}`}
            onClick={() => selectCalendarTab(true)}
          >
            <span className="mr-1">←</span> {MONTHS[startMonth].substring(0, 3)} <span className="text-xs">{startYear}</span>
          </button>
          <button
            className={`flex-1 py-1 text-sm ${showEndCalendar ? 'font-bold border-b-2 border-black' : ''}`}
            onClick={() => selectCalendarTab(false)}
          >
            {MONTHS[endMonth].substring(0, 3)} <span className="text-xs">{endYear}</span> <span className="ml-1">→</span>
          </button>
        </div>


        <div className="mb-4">
          {showStartCalendar && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => prevMonth(true)}
                >
                  &lt;
                </button>
                <div className="text-center font-semibold">
                  {MONTHS[startMonth]} {startYear}
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => nextMonth(true)}
                >
                  &gt;
                </button>
              </div>


              {generateCalendar(startYear, startMonth, startSelectedDate, (day) => selectDate(true, day))}
            </div>
          )}


          {showEndCalendar && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => prevMonth(false)}
                >
                  &lt;
                </button>
                <div className="text-center font-semibold">
                  {MONTHS[endMonth]} {endYear}
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => nextMonth(false)}
                >
                  &gt;
                </button>
              </div>


              {generateCalendar(endYear, endMonth, endSelectedDate, (day) => selectDate(false, day))}
            </div>
          )}
        </div>


        <div className="grid grid-cols-2 gap-1 mb-3">
          <button
            className="text-sm py-1 px-2 bg-white border border-gray-300 rounded hover:bg-gray-100 text-left"
            onClick={() => selectPresetRange(DATE_RANGE_OPTIONS.THIS_WEEK)}
          >
            {DATE_RANGE_OPTIONS.THIS_WEEK}
          </button>
          <button
            className="text-sm py-1 px-2 bg-white border border-gray-300 rounded hover:bg-gray-100 text-left"
            onClick={() => selectPresetRange(DATE_RANGE_OPTIONS.THIS_MONTH)}
          >
            {DATE_RANGE_OPTIONS.THIS_MONTH}
          </button>
          <button
            className="text-sm py-1 px-2 bg-white border border-gray-300 rounded hover:bg-gray-100 text-left"
            onClick={() => selectPresetRange(DATE_RANGE_OPTIONS.THIS_YEAR)}
          >
            {DATE_RANGE_OPTIONS.THIS_YEAR}
          </button>
          <button
            className="text-sm py-1 px-2 bg-white border border-gray-300 rounded hover:bg-gray-100 text-left"
            onClick={() => selectPresetRange(DATE_RANGE_OPTIONS.PREVIOUS_WEEK)}
          >
            {DATE_RANGE_OPTIONS.PREVIOUS_WEEK}
          </button>
          <button
            className="text-sm py-1 px-2 bg-white border border-gray-300 rounded hover:bg-gray-100 text-left"
            onClick={() => selectPresetRange(DATE_RANGE_OPTIONS.PREVIOUS_MONTH)}
          >
            {DATE_RANGE_OPTIONS.PREVIOUS_MONTH}
          </button>
          <button
            className="text-sm py-1 px-2 bg-white border border-gray-300 rounded hover:bg-gray-100 text-left"
            onClick={() => selectPresetRange(DATE_RANGE_OPTIONS.PREVIOUS_YEAR)}
          >
            {DATE_RANGE_OPTIONS.PREVIOUS_YEAR}
          </button>
          <button
            className="text-sm py-1 px-2 bg-red-600 text-white rounded hover:bg-red-700 text-left col-span-2"
            onClick={() => selectPresetRange(DATE_RANGE_OPTIONS.CUSTOM)}
          >
            {DATE_RANGE_OPTIONS.CUSTOM}
          </button>
        </div>


        <div className="border-t pt-3 flex justify-end space-x-2">
          <button
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            onClick={cancelDateRange}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={applyDateRange}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );


  // Create array of active sections in pairs for grid layout
  const activeSections = sections.filter(section => section.active);
  const pairs = [];
  for (let i = 0; i < activeSections.length; i += 2) {
    if (i + 1 < activeSections.length) {
      pairs.push([activeSections[i], activeSections[i + 1]]);
    } else {
      pairs.push([activeSections[i]]);
    }
  }


  // Updated return structure with responsive sidebar
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header
        user={user}
        selectedWarehouse={selectedWarehouse}
        toggleWarehouseModal={toggleWarehouseModal}
        notificationCount={notificationCount}
        toggleNotifications={toggleNotifications}
        showNotifications={showNotifications}
        activeNotificationTab={activeNotificationTab}
        setActiveNotificationTab={setActiveNotificationTab}
        notifications={notifications}
        showNotificationOptions={showNotificationOptions}
        toggleNotificationOptions={toggleNotificationOptions}
        markAllAsRead={markAllAsRead}
        deleteAllNotifications={deleteAllNotifications}
        NotificationPanel={NotificationPanel}
        toggleSidebar={() => setSidebarExpanded(!sidebarExpanded)} // Pass toggle function to Header
        sidebarExpanded={sidebarExpanded} // Pass sidebar state to Header
      />
     
      {/* Main content with padding-top to account for fixed header */}
      <div className="pt-[68px]"> {/* Adjust this value based on your actual header height */}
        <div className="flex flex-1">
          {/* Sidebar Component - use the updated SidebarWithLiftedState component */}
          <SidebarWithLiftedState
            onLogout={onLogout}
            onNavigate={onNavigate}
            currentView="dashboard"
            inventoryView={null}
            expanded={sidebarExpanded}
            setExpanded={setSidebarExpanded}
          />
         
          {/* Main content area with transition for smooth adjustment */}
          <div
            className={`flex-1 p-6 bg-gray-100 transition-all duration-300 ease-in-out ${
              sidebarExpanded ? 'ml-64' : 'ml-20'
            }`}
          >
            {/* Warehouse Display Rectangle */}
            <div className="bg-white p-4 rounded shadow mb-6 border-l-4 border-red-600">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Current Warehouse</h2>
                  <h1 className="text-xl font-bold text-gray-800">{selectedWarehouse}</h1>
                </div>
                <button
                  className="ml-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm flex items-center"
                  onClick={toggleWarehouseModal}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                  </svg>
                  Change
                </button>
              </div>
            </div>
           
            {/* Statistics Section */}
            <div className="bg-white p-6 rounded shadow mb-6 relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Statistics</h2>
                <div className="relative">
                  <select
                    className="px-3 py-1 border border-gray-300 rounded text-sm appearance-none pr-8"
                    value={selectedDateRange}
                    onChange={handleDateRangeChange}
                  >
                    {Object.values(DATE_RANGE_OPTIONS).map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                  {showDatePicker && <DateRangePicker />}
                </div>
              </div>
             
              <div className="h-64 bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500">Statistics will be displayed here</p>
                </div>
              </div>
            </div>
           
            {/* Dynamic sections grid */}
            {pairs.map((pair, index) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" key={index}>
                {pair.map(section => renderSection(section))}
                {pair.length === 1 && (
                  <div
                    className="bg-white p-6 rounded shadow flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                    onClick={() => setShowAddSectionModal(true)}
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </div>
                    <p className="text-gray-500">Add new section</p>
                  </div>
                )}
              </div>
            ))}
           
            {/* Add "Add new section" button if all rows are filled */}
            {activeSections.length % 2 === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className="bg-white p-6 rounded shadow flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                  onClick={() => setShowAddSectionModal(true)}
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </div>
                  <p className="text-gray-500">Add new section</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
     
      {/* Modals */}
      {warehouseModalOpen && (
        <Suspense fallback={<div className="flex items-center justify-center">Loading...</div>}>
          <WarehouseModal
            onClose={toggleWarehouseModal}
            onSelect={selectWarehouse}
            currentWarehouse={selectedWarehouse}
          />
        </Suspense>
      )}
     
      {showAddSectionModal && <AddSectionModal />}
    </div>
  );
};


export default Dashboard;
