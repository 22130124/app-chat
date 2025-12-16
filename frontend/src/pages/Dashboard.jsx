import NavigationSidebar from "../components/NavigationSidebar";
import ChatsList from "../components/ChatsList";

function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Navigation Sidebar */}
      <NavigationSidebar />

      {/* Chats List */}
      <ChatsList />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="text-xl mb-2">Welcome to Chat App!</p>
          <p>Select a conversation or start a new chat</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
