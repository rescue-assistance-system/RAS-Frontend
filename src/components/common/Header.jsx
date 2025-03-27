import React from 'react';
import 'boxicons/css/boxicons.min.css';
import avatar from '../../assets/sos_login.jpg';
const Header = () => {
  return (
    <header>
      <div className="flex items-center p-4 bg-gray-100">
        <div className="md:hidden">
          <i className="bx bx-menu text-2xl cursor-pointer"></i>
        </div>
        
        <div className="flex-grow max-w-xl mx-4 relative hidden md:block">
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
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <ul className="flex items-center space-x-4">
            <li className="md:hidden">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <i className="bx bx-search text-xl"></i>
              </a>
            </li>
            
            <li className="relative group">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <i className="bx bx-category text-xl"></i>
              </a>
              <div className="absolute right-0 mt-2 hidden group-hover:block bg-white shadow-lg rounded-lg p-4 w-72 z-10">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white">
                      <i className="bx bx-group"></i>
                    </div>
                    <div className="mt-2 text-sm">Teams</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white">
                      <i className="bx bx-atom"></i>
                    </div>
                    <div className="mt-2 text-sm">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white">
                      <i className="bx bx-shield"></i>
                    </div>
                    <div className="mt-2 text-sm">Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white">
                      <i className="bx bx-notification"></i>
                    </div>
                    <div className="mt-2 text-sm">Feeds</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white">
                      <i className="bx bx-file"></i>
                    </div>
                    <div className="mt-2 text-sm">Files</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white">
                      <i className="bx bx-filter-alt"></i>
                    </div>
                    <div className="mt-2 text-sm">Alerts</div>
                  </div>
                </div>
              </div>
            </li>

            <li className="relative group">
              <a href="#" className="text-gray-600 hover:text-gray-900 relative">
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">7</span>
                <i className="bx bx-bell text-xl"></i>
              </a>
              <div className="absolute right-0 mt-2 hidden group-hover:block bg-white shadow-lg rounded-lg w-80 z-10 max-h-96 overflow-y-auto">
                <div className="p-3 border-b flex justify-between">
                  <p className="font-semibold">Notifications</p>
                  <p className="text-sm text-blue-500 hover:text-blue-700 cursor-pointer">Mark all as read</p>
                </div>
                <div className="divide-y">
                  <a href="#" className="flex items-center p-3 hover:bg-gray-50">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                      <i className="bx bx-group"></i>
                    </div>
                    <div>
                      <h6 className="font-medium">New Customers</h6>
                      <p className="text-sm text-gray-600">5 new user registered</p>
                      <span className="text-xs text-gray-400">14 Sec ago</span>
                    </div>
                  </a>
                  {/* Thêm các mục thông báo khác nếu cần */}
                </div>
                <div className="p-3 text-center border-t">
                  <a href="#" className="text-blue-500 hover:text-blue-700 text-sm">View All Notifications</a>
                </div>
              </div>
            </li>

            <li className="relative group">
              <a href="#" className="text-gray-600 hover:text-gray-900 relative">
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">8</span>
                <i className="bx bx-comment text-xl"></i>
              </a>
              <div className="absolute right-0 mt-2 hidden group-hover:block bg-white shadow-lg rounded-lg w-80 z-10 max-h-96 overflow-y-auto">
                <div className="p-3 border-b flex justify-between">
                  <p className="font-semibold">Messages</p>
                  <p className="text-sm text-blue-500 hover:text-blue-700 cursor-pointer">Mark all as read</p>
                </div>
                <div className="divide-y">
                  <a href="#" className="flex items-center p-3 hover:bg-gray-50">
                    <img src="assets/images/avatars/avatar-1.png" className="w-10 h-10 rounded-full mr-3" alt="user avatar" />
                    <div>
                      <h6 className="font-medium">Daisy Anderson</h6>
                      <p className="text-sm text-gray-600">The standard chunk of lorem</p>
                      <span className="text-xs text-gray-400">5 sec ago</span>
                    </div>
                  </a>
                  {/* Thêm các mục tin nhắn khác nếu cần */}
                </div>
                <div className="p-3 text-center border-t">
                  <a href="#" className="text-blue-500 hover:text-blue-700 text-sm">View All Messages</a>
                </div>
              </div>
            </li>
          </ul>

          <div className="relative group">
            <a href="#" className="flex items-center">
              <img src={avatar} className="w-10 h-10 rounded-full" alt="user avatar" />
              <div className="ml-3 hidden md:block">
                <p className="font-medium">Pauline Seitz</p>
                <p className="text-sm text-gray-600">Web Designer</p>
              </div>
            </a>
            <ul className="absolute right-0 mt-2 hidden group-hover:block bg-white shadow-lg rounded-lg w-48 z-10">
              <li>
                <a href="#" className="flex items-center p-2 hover:bg-gray-50">
                  <i className="bx bx-user mr-2"></i>
                  <span>Profile</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 hover:bg-gray-50">
                  <i className="bx bx-cog mr-2"></i>
                  <span>Settings</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 hover:bg-gray-50">
                  <i className="bx bx-home-circle mr-2"></i>
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 hover:bg-gray-50">
                  <i className="bx bx-dollar-circle mr-2"></i>
                  <span>Earnings</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 hover:bg-gray-50">
                  <i className="bx bx-download mr-2"></i>
                  <span>Downloads</span>
                </a>
              </li>
              <li className="border-t">
                <a href="#" className="flex items-center p-2 hover:bg-gray-50">
                  <i className="bx bx-log-out-circle mr-2"></i>
                  <span>Logout</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;