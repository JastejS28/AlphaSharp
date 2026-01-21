import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';
import { Activity } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <nav className="bg-black/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-8 h-8 overflow-hidden bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">AlphaSharp</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/market"
                  className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Market
                </Link>
                <Link
                  to="/agent"
                  className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  AI Agent
                </Link>
                <Link
                  to="/portfolio"
                  className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Portfolio
                </Link>
              </>
            )}

            {!isAuthenticated && (
              <Link
                to="/market"
                className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors"
              >
                Market
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  {user?.name || user?.email}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors font-medium text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/"
                className="px-6 py-2 text-sm font-bold text-black transition-transform transform bg-white rounded-full hover:scale-105 hover:bg-cyan-50"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
