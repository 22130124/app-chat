import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

function NavigationSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const isActive = (path) => {
    if (path === "/dashboard") {
      return (
        location.pathname === "/dashboard" ||
        location.pathname.startsWith("/chat")
      );
    }
    return location.pathname === path;
  };

  return (
    <div className="w-20 bg-gray-900 flex flex-col items-center py-4">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer shadow-lg overflow-hidden">
          <img
            src="/images/logonn.jpg"
            alt="Chat App Logo"
            className="w-full h-full object-cover rounded-xl"
            // onError={(e) => {
            //   // Fallback nếu không tìm thấy ảnh, hiển thị SVG mặc định
            //   e.target.style.display = "none";
            //   e.target.nextElementSibling.style.display = "block";
            // }}
          />
        </div>
      </div>

      {/* Navigation Icons */}
      <div className="flex-1 flex flex-col space-y-4">
        {/* Chats */}
        <button
          onClick={() => navigate("/dashboard")}
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
            isActive("/dashboard")
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
          title="Chats"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>

        {/* Contacts/Friends */}
        <button
          onClick={() => {
            const currentPath = location.pathname;
            if (currentPath.startsWith("/chat")) {
              navigate(`/dashboard?tab=friends`);
            } else {
              navigate("/dashboard?tab=friends");
            }
          }}
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
            location.search === "?tab=friends"
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
          title="Contacts"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </button>

        {/* Calls */}
        <button
          className="w-12 h-12 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          title="Calls"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </button>

        {/* Settings */}
        <button
          className="w-12 h-12 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          title="Settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center space-y-4">
        {/* Toggle Switch */}
        <div className="flex items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Profile Picture */}
        <button
          onClick={() => navigate("/dashboard?tab=profile")}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold hover:ring-2 hover:ring-blue-400 transition-all"
          title={user?.firstName || "Profile"}
        >
          {user?.firstName?.[0]}
          {user?.lastName?.[0]}
        </button>
      </div>
    </div>
  );
}

export default NavigationSidebar;
