import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const {logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <nav className="bg-[#0F0F0F] border-b border-[#333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-[#CCFF00]">
            FitLog
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/exercises" className="text-gray-300 hover:text-[#CCFF00] transition">
              Exercises
            </Link>
            <Link to="/routines" className="text-gray-300 hover:text-[#CCFF00] transition">
              Routines
            </Link>
            <Link to="/sessions" className="text-gray-300 hover:text-[#CCFF00] transition">
              Sessions
            </Link>
            <Link to="/social" className="text-gray-300 hover:text-[#CCFF00] transition">
              Friends
            </Link>
            <Link to="/profile" className="text-gray-300 hover:text-[#CCFF00] transition">
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          <button
            className="md:hidden text-[#CCFF00]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/exercises"
              className="block px-4 py-2 text-gray-300 hover:text-[#CCFF00] hover:bg-[#1E1E1E] rounded"
            >
              Exercises
            </Link>
            <Link
              to="/routines"
              className="block px-4 py-2 text-gray-300 hover:text-[#CCFF00] hover:bg-[#1E1E1E] rounded"
            >
              Routines
            </Link>
            <Link
              to="/sessions"
              className="block px-4 py-2 text-gray-300 hover:text-[#CCFF00] hover:bg-[#1E1E1E] rounded"
            >
              Sessions
            </Link>
            <Link
              to="/social"
              className="block px-4 py-2 text-gray-300 hover:text-[#CCFF00] hover:bg-[#1E1E1E] rounded"
            >
              Friends
            </Link>
            <Link
              to="/profile"
              className="block px-4 py-2 text-gray-300 hover:text-[#CCFF00] hover:bg-[#1E1E1E] rounded"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-400 hover:bg-[#1E1E1E] rounded flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
