import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, BarChart3, ReceiptText, LogOut, User } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout, selectAuth } from '../store/slices/authSlice';

const Layout: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">POS System</span>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="ml-1 text-sm text-gray-700">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <LogOut className="h-4 w-4 mr-1.5" />
                    Logout
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex">
        {/* Sidebar */}
        <nav className="bg-white w-20 md:w-64 shadow-md">
          <div className="h-full px-3 py-6 flex flex-col">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-3 py-3 mb-2 rounded-md ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <ShoppingCart className="h-5 w-5 mr-3" />
              <span className="hidden md:inline">POS</span>
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3 mb-2 rounded-md ${
                      isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <BarChart3 className="h-5 w-5 mr-3" />
                  <span className="hidden md:inline">Dashboard</span>
                </NavLink>

                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3 mb-2 rounded-md ${
                      isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <Package className="h-5 w-5 mr-3" />
                  <span className="hidden md:inline">Products</span>
                </NavLink>

                <NavLink
                  to="/sales"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3 mb-2 rounded-md ${
                      isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <ReceiptText className="h-5 w-5 mr-3" />
                  <span className="hidden md:inline">Sales</span>
                </NavLink>
              </>
            )}
          </div>
        </nav>

        {/* Content */}
        <main className="flex-grow p-4 sm:p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;