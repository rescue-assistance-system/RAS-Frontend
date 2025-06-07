import React from 'react';
import { Link } from 'react-router-dom';
import useSidebarStore from '../../stores/sidebarStore';

const Sidebar = () => {
  const { isOpen, openMenus, toggleSidebar, toggleMenu } = useSidebarStore();

  return (
    <aside
      className={`h-screen bg-gray-50 text-gray-500 fixed top-0 left-0 transition-all duration-300 ${
        isOpen ? 'w-54' : 'w-22'
      }  overflow-y-auto shadow-lg`}
    >
      <div className="flex items-center p-2 border-b border-gray-300">
        <div className={`flex-shrink-0 ${!isOpen ? ' ml-1' : 'ml-5'} `}>
          <img
            width={isOpen ? '54' : '50'}
            height={isOpen ? '54' : '50'}
            src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-rescue-emergency-service-flaticons-lineal-color-flat-icons.png"
            alt="external-rescue-emergency-service-flaticons-lineal-color-flat-icons"
          />
        </div>
        <div className={`ml-3 ${!isOpen && 'hidden'}`}>
          <h4 className="text-xl font-semibold text-red-500">RAS</h4>
        </div>
        <div className="ml-auto">
          <i
            className={`bx ${
              isOpen ? 'bx-arrow-to-left' : 'bx-arrow-to-right'
            } text-xl cursor-pointer text-red-400`}
            onClick={toggleSidebar}
          ></i>
        </div>
      </div>

      {isOpen && (
        <ul className="p-2 space-y-2">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center p-2 rounded-lg hover:bg-blue-200 hover:text-blue-500 transition-all ml-3.5"
            >
              <i className="bx bx-home-circle text-xl mr-3"></i>
              <span className="text-sm">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/analytics"
              className="flex items-center p-2 rounded-lg hover:bg-blue-200 hover:text-blue-500 transition-all ml-3.5"
            >
              <i className="bx bx-bar-chart-alt text-xl mr-3"></i>
              <span className="text-sm">Analytics</span>
            </Link>
          </li>

          <li>
            <button
              onClick={() => toggleMenu('application')}
              className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <div className="flex items-center  text-gray-800">
                <i className="bx bx-news text-xl mr-4 ml-3"></i>
                <span className="text-sm font-semibold "> News</span>
              </div>
              <i className="bx bx-chevron-down"></i>
            </button>
            {openMenus['application'] && (
              <ul className="pl-8 mt-1 space-y-1">
                <li>
                  <Link
                    to="/news/news-emergency"
                    className="flex items-center p-2 rounded-lg hover:bg-blue-200 text-sm"
                  >
                    <i className="bx bx-right-arrow-alt mr-2"></i>
                    News Emergency
                  </Link>
                </li>
                <li>
                  <Link
                    to="/news/first-aid"
                    className="flex items-center p-2 rounded-lg hover:bg-blue-200 text-sm"
                  >
                    <i className="bx bx-right-arrow-alt mr-2"></i>
                    First Aid
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <button
              onClick={() => toggleMenu('accounts')}
              className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <div className="flex items-center  text-gray-800">
                <i className="bx bx-group text-xl mr-4 ml-3"></i>
                <span className="text-sm font-semibold "> Accounts</span>
              </div>
              <i className="bx bx-chevron-down"></i>
            </button>
            {openMenus['accounts'] && (
              <ul className="pl-8 mt-1 space-y-1">
                <li>
                  <Link
                    to="/rescue-teams"
                    className="flex items-center p-2 rounded-lg hover:bg-blue-200 text-sm"
                  >
                    <i className="bx bx-right-arrow-alt mr-2"></i>
                    Rescue Teams
                  </Link>
                </li>
                <li>
                  <Link
                    to="/coordinators"
                    className="flex items-center p-2 rounded-lg hover:bg-blue-200 text-sm"
                  >
                    <i className="bx bx-right-arrow-alt mr-2"></i>
                    Coordinators
                  </Link>
                </li>
              </ul>
            )}
          </li>

         
          {/* <li>
            <Link
              to="/user-management"
              className="flex items-center p-2 rounded-lg hover:bg-blue-200 hover:text-blue-500 transition-all ml-3.5"
            >
              <i className="bx bx-user text-xl mr-3"></i>
              <span className="text-sm">User Management</span>
            </Link>
          </li> */}

          {/* <li>
            <button
              onClick={() => toggleMenu('ecommerce')}
              className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center  text-gray-800">
                <i className="bx bx-cog text-xl mr-3"></i>
                <span className="text-sm">Setting</span>
              </div>
              <i className="bx bx-chevron-down"></i>
            </button>
            {openMenus['ecommerce'] && (
              <ul className="pl-8 mt-1 space-y-1">
                <li>
                  <Link
                    to="/settings/products"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-600"
                  >
                    <i className="bx bx-right-arrow-alt mr-2"></i>
                    Products
                  </Link>
                </li>
              </ul>
            )}
          </li> */}
        </ul>
      )}

      {!isOpen && (
        <ul className="p-4 space-y-4">
          <li>
            <Link to="/dashboard">
              <i
                className="bx bx-home-circle text-xl cursor-pointer hover:text-gray-600"
                title="Dashboard"
              ></i>
            </Link>
          </li>
          <li>
            <Link to="/news">
              <i
                className="bx bx-category text-xl cursor-pointer hover:text-gray-600"
                title="News"
              ></i>
            </Link>
          </li>
          <li>
            <Link to="/rescue-teams">
              <i
                className="bx bx-group text-xl cursor-pointer hover:text-gray-600"
                title="Rescue Teams"
              ></i>
            </Link>
          </li>
          <li>
            <Link to="/analytics">
              <i
                className="bx bx-bar-chart-alt text-xl cursor-pointer hover:text-gray-600"
                title="Analytics"
              ></i>
            </Link>
          </li>
        </ul>
      )}
    </aside>
  );
};

export default Sidebar;
