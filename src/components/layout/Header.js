import React, { useState } from "react";
import Logo from "../shared/Logo";
import NotificationPanel from "../dashboard/NotificationPanel";

const Header = ({ user, selectedWarehouse, toggleWarehouseModal }) => {
    // Notification states
    const [showNotifications, setShowNotifications] = useState(false);
    const [showNotificationOptions, setShowNotificationOptions] = useState(false);
    const [activeNotificationTab, setActiveNotificationTab] = useState('All');
    const [notifications, setNotifications] = useState([
        { id: 1, message: "New order received", time: "2 hours ago", read: false },
        { id: 2, message: "Stock level low", time: "5 hours ago", read: false },
    ]);

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
        setShowNotificationOptions(false);
    };

    // Delete all notifications
    const deleteAllNotifications = () => {
        setNotifications([]);
        setShowNotificationOptions(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-[#DED4D0] border-b border-gray-300 p-2 z-50 shadow-md">
            <div className="flex justify-between items-center px-6 py-2">
                {/* Logo */}
                <div className="flex items-center">
                    <Logo small />
                </div>

                {/* Right Section: Warehouse Dropdown, Notification & User Profile */}
                <div className="flex items-center">
                    {/* Warehouse Dropdown (Now beside Notification Bell) */}
                    <button
                        onClick={toggleWarehouseModal}
                        className="ml-1 px-4 py-2 border border-gray-400 rounded shadow-md bg-white flex items-center"
                    >
                        {selectedWarehouse}
                    </button>

                    {/* Notification Bell */}
                    <div className="relative cursor-pointer ml-6">
                        <button
                            className="text-gray-700 hover:text-gray-900 focus:outline-none notification-bell"
                            onClick={toggleNotifications}
                        >
                            <i className="fa fa-bell text-2xl text-gray-700"></i>
                            {notifications.filter(n => !n.read).length > 0 && (
                                <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                    {notifications.filter(n => !n.read).length}
                                </span>
                            )}
                        </button>
                       
                        {/* Notification Panel */}
                        <NotificationPanel
                            isOpen={showNotifications}
                            onClose={() => setShowNotifications(false)}
                            notifications={notifications}
                            activeTab={activeNotificationTab}
                            setActiveTab={setActiveNotificationTab}
                            showOptionsMenu={showNotificationOptions}
                            toggleOptionsMenu={toggleNotificationOptions}
                            markAllAsRead={markAllAsRead}
                            deleteAllNotifications={deleteAllNotifications}
                        />
                    </div>

                    {/* User Profile */}
                    <div className="flex items-center ml-6">
                        <div className="bg-purple-200 rounded-full w-10 h-10 flex items-center justify-center text-purple-800 text-xl mr-2">
                            {user?.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex flex-col items-center" style={{minWidth: "80px"}}>
                            <div className="text-sm font-semibold">{user?.name || "User"}</div>
                            <div className="text-xs text-gray-600">{user?.role || "Guest"}</div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;