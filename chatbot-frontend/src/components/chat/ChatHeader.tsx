// src/components/chat/ChatHeader.tsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";

interface Props {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

const ChatHeader: React.FC<Props> = ({ onMenuClick, sidebarOpen }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex justify-between items-center p-4 md:px-6 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 shadow-lg">
      <div className="flex items-center">
        {user && (
          <button 
            onClick={onMenuClick}
            className="mr-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors md:hidden"
          >
            {sidebarOpen ? (
              <XMarkIcon className="h-5 w-5 text-white" />
            ) : (
              <Bars3Icon className="h-5 w-5 text-white" />
            )}
          </button>
        )}
        
          <div className="flex items-center justify-center rounded-2xl mb-4">
            <img src="/KABTHAILOGO1.png" alt="Logo" className="h-8 w-full object-contain" />
          </div>
      </div>

      <div className="flex items-center space-x-3">
        {user ? (
          <>
            <div className="hidden md:flex items-center text-sm bg-gray-700/50 rounded-full py-1.5 pl-2 pr-4 border border-gray-600">
              <UserCircleIcon className="h-5 w-5 text-purple-400 mr-2" />
              <span className="text-gray-200">{user.username}</span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center px-3 py-1.5 text-sm bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-red-500/20 transition-colors text-red-400 hover:text-red-300 group"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1.5 group-hover:animate-pulse" />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 text-sm bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-sm bg-gradient-to-r from-[#142d38] via-[#203a43] to-[#2c5364] rounded-lg hover:from-[#2c5364] hover:via-[#203a43] hover:to-[#142d38] transition-all text-white shadow-md hover:shadow-[#203a43]"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;