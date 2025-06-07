import React, { useEffect, useState, useRef } from 'react';
import 'boxicons/css/boxicons.min.css';
import useSidebarStore from '../../stores/sidebarStore';
import useAuthStore from '../../stores/authStore';

const Header = () => {
  const { isOpen } = useSidebarStore();
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notificationRef = useRef();
  const messageRef = useRef();
  const profileRef = useRef();
  useEffect(() => {
    const notiList = JSON.parse(localStorage.getItem('notifications') || '[]');
    setNotifications(notiList);
    const onStorage = () => {
      setNotifications(
        JSON.parse(localStorage.getItem('notifications') || '[]'),
      );
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        messageRef.current &&
        !messageRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
        setIsMessageOpen(false);
        setIsProfileOpen(false);
      }
      // Đóng từng dropdown nếu click ra ngoài vùng của nó
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
      if (messageRef.current && !messageRef.current.contains(event.target)) {
        setIsMessageOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 transition-all duration-300 bg-gray-50 p-3 shadow-lg z-50 ${
        isOpen ? 'left-54 pl-6' : 'left-22 pl-2'
      }`}
    >
      <div className="flex items-center ">
        <div className="md:hidden">
          <i className="bx bx-menu text-2xl cursor-pointer"></i>
        </div>

        {/* <div className="flex-grow max-w-xl relative hidden md:block">
          <input
            type="text"
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type to search..."
          />
          <span className="absolute right-8 top-1/2 -translate-y-1/2">
            <i className="bx bx-search text-gray-400"></i>
          </span>
          <span className="absolute right-2 top-1/2 -translate-y-1/2">
            <i className="bx bx-x text-gray-400 cursor-pointer"></i>
          </span>
        </div> */}

        <div className="ml-auto flex items-center space-x-4">
          <ul className="flex items-center space-x-4">
            <li className="md:hidden">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <i className="bx bx-search text-xl"></i>
              </a>
            </li>

            <li className="relative">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 relative"
                onClick={(e) => {
                  e.preventDefault();
                  setIsNotificationOpen((prev) => !prev);
                  setIsMessageOpen(false);
                  setIsProfileOpen(false);
                }}
              >
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
                <i className="bx bx-bell text-xl"></i>
              </a>
              {isNotificationOpen && (
                <div
                  ref={notificationRef}
                  className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-80 z-10 max-h-96 overflow-y-auto"
                >
                  <div className="p-3 border-b flex justify-between">
                    <p className="font-semibold">Notifications</p>
                    <p
                      className="text-sm text-blue-500 hover:text-blue-700 cursor-pointer"
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </p>
                  </div>
                  <div className="divide-y">
                    {notifications.length === 0 ? (
                      <div className="p-3 text-gray-400 text-center">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((n, idx) => (
                        <div
                          key={idx}
                          className={`p-3 ${!n.read ? 'bg-blue-50' : ''}`}
                        >
                          <div className="font-medium">{n.message}</div>
                          <div className="text-xs text-gray-400">
                            {new Date(n.time).toLocaleString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 text-center border-t">
                    <a
                      href="#"
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      View All Notifications
                    </a>
                  </div>
                </div>
              )}
            </li>

            <li className="relative">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 relative"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMessageOpen((prev) => !prev);
                  setIsNotificationOpen(false);
                  setIsProfileOpen(false);
                }}
              >
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  8
                </span>
                <i className="bx bx-comment text-xl"></i>
              </a>
              {isMessageOpen && (
                <div
                  ref={messageRef}
                  className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-80 z-10 max-h-96 overflow-y-auto"
                >
                  <div className="p-3 border-b flex justify-between">
                    <p className="font-semibold">Messages</p>
                    <p className="text-sm text-blue-500 hover:text-blue-700 cursor-pointer">
                      Mark all as read
                    </p>
                  </div>
                  <div className="divide-y">
                    <a
                      href="#"
                      className="flex items-center p-3 hover:bg-gray-50"
                    >
                      <img
                        src="https://npr.brightspotcdn.com/dims4/default/2333b08/2147483647/strip/true/crop/720x480+0+0/resize/880x587!/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2F7e%2F19%2F5f9a9470497caa7225ffac68a816%2F3595505518-0d014c96c5-c.jpg"
                        className="w-10 h-10 rounded-full mr-3 object-cover object-center"
                        alt="user avatar"
                      />
                      <div>
                        <h6 className="font-medium">Daisy Anderson</h6>
                        <p className="text-sm text-gray-600">
                          The standard chunk of lorem
                        </p>
                        <span className="text-xs text-gray-400">5 sec ago</span>
                      </div>
                    </a>
                  </div>
                  <div className="p-3 text-center border-t">
                    <a
                      href="#"
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      View All Messages
                    </a>
                  </div>
                </div>
              )}
            </li>
          </ul>

          <div className="relative">
            <a
              href="#"
              className="flex items-center"
              onClick={(e) => {
                e.preventDefault();
                setIsProfileOpen((prev) => !prev);
                setIsNotificationOpen(false);
                setIsMessageOpen(false);
              }}
            >
              <img
                src="https://npr.brightspotcdn.com/dims4/default/2333b08/2147483647/strip/true/crop/720x480+0+0/resize/880x587!/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2F7e%2F19%2F5f9a9470497caa7225ffac68a816%2F3595505518-0d014c96c5-c.jpg"
                className="w-10 h-10 rounded-full"
                alt="user avatar"
              />
              <div className="ml-3 hidden md:block">
                <p className="font-medium">
                  {user?.name || user?.username || 'Role'}
                </p>
                <p className="text-sm text-gray-600">
                  {user?.role
                    ? user.role.charAt(0).toUpperCase() +
                      user.role.slice(1).toLowerCase()
                    : 'Role'}
                </p>
              </div>
            </a>
            {isProfileOpen && (
              <ul
                ref={profileRef}
                className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 z-10"
              >
                <li>
                  <a
                    href="#"
                    className="flex items-center p-2 hover:bg-gray-50"
                  >
                    <i className="bx bx-user mr-2"></i>
                    <span>Profile</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center p-2 hover:bg-gray-50"
                  >
                    <i className="bx bx-cog mr-2"></i>
                    <span>Settings</span>
                  </a>
                </li>
                <li className="border-t">
                  <a
                    href="#"
                    className="flex items-center p-2 hover:bg-gray-50"
                    onClick={(e) => {
                      e.preventDefault();
                      if (window.confirm('Are you sure to logout?')) {
                        useAuthStore.getState().logout();
                        window.location.href = '/login';
                      }
                    }}
                  >
                    <i className="bx bx-log-out-circle mr-2"></i>
                    <span>Logout</span>
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
