// src/components/chat/ChatHeader.tsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon 
} from "@heroicons/react/24/outline";

interface Props {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

const ChatHeader: React.FC<Props> = ({ onMenuClick, sidebarOpen }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex justify-between items-center p-4 md:px-6 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center">
        {user && (
          <button 
            onClick={onMenuClick}
            className="mr-3 p-1.5 rounded-md hover:bg-gray-100 md:hidden"
          >
            {sidebarOpen ? (
              <XMarkIcon className="h-5 w-5 text-gray-600" />
            ) : (
              <Bars3Icon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        )}
        
        <h1 className="text-xl font-bold text-slate-800 flex items-center">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ChatAssistant
          </span>
        </h1>
      </div>

      <div className="flex items-center space-x-2">
        {user ? (
          <>
            <div className="hidden md:flex items-center mr-2 text-sm bg-blue-50 rounded-full py-1 pl-1 pr-3">
              <UserCircleIcon className="h-6 w-6 text-blue-600 mr-1" />
              <span className="text-slate-700">{user.username}</span>
            </div>
            
            {/* <Link
              to="/conversations"
              className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition text-slate-700 hover:text-slate-900 hidden md:block"
            >
              My Conversations
            </Link> */}
            
            <button
              onClick={logout}
              className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-red-50 transition text-red-600 hover:text-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition text-slate-700 hover:text-slate-900"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition text-white shadow-sm"
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