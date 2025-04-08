import React, { useRef, useEffect } from 'react';


/**
 * NotificationPanel component displays a dropdown panel with notifications
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the notification panel is open
 * @param {Function} props.onClose - Function to close the notification panel
 * @param {Array} props.notifications - Array of notification objects
 * @param {string} props.activeTab - Currently active tab ('All' or 'Unread')
 * @param {Function} props.setActiveTab - Function to change the active tab
 * @param {boolean} props.showOptionsMenu - Whether the options menu is open
 * @param {Function} props.toggleOptionsMenu - Function to toggle the options menu
 * @param {Function} props.markAllAsRead - Function to mark all notifications as read
 * @param {Function} props.deleteAllNotifications - Function to delete all notifications
 */
const NotificationPanel = ({
  isOpen,
  onClose,
  notifications,
  activeTab,
  setActiveTab,
  showOptionsMenu,
  toggleOptionsMenu,
  markAllAsRead,
  deleteAllNotifications
}) => {
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


  // Filter notifications based on active tab
  const filteredNotifications = activeTab === 'Unread'
    ? notifications.filter(n => !n.read)
    : notifications;


  return (
    <div ref={notificationRef} className="absolute top-16 right-16 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold dark:text-white">Notifications</h2>
        <div className="relative">
          <button
            onClick={toggleOptionsMenu}
            className="text-gray-500 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:text-gray-300"
            aria-label="Notification options"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 13a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1zm0-5a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1zm0-4a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V5a1 1 0 0 1 1-1z"></path>
            </svg>
          </button>
         
          {/* Options Menu */}
          {showOptionsMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-2">
                <button
                  onClick={markAllAsRead}
                  className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Mark all as read
                </button>
                <button
                  onClick={deleteAllNotifications}
                  className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded text-red-500 dark:hover:bg-gray-700"
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
      <div className="flex border-b dark:border-gray-700">
        <button
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'All'
            ? 'text-red-600 border-b-2 border-red-600 dark:text-red-400'
            : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('All')}
        >
          All
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'Unread'
            ? 'text-red-600 border-b-2 border-red-600 dark:text-red-400'
            : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('Unread')}
        >
          Unread
        </button>
      </div>
     
      {/* Notification List */}
      <div className="max-h-80 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          <div>
            <div className="flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-gray-750">
              <span className="text-xs text-gray-500 dark:text-gray-400">Earlier</span>
              <button className="text-xs text-blue-500 dark:text-blue-400">See all</button>
            </div>
           
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-750
                  ${!notification.read
                    ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20'
                    : 'dark:bg-gray-800'}`}
              >
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    {notification.icon}
                  </div>
                  <div>
                    <p className="text-sm dark:text-gray-200">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 dark:bg-gray-700">
              <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No Notification Here</h3>
            <p className="text-sm text-gray-500 text-center mt-1 dark:text-gray-400">There is no notification to show right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default NotificationPanel;
