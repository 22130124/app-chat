import { MessageCircle, Users, Cloud, Settings, Send } from "lucide-react";


export default function ChatLayout() {
    return (
        <div className="flex h-screen bg-gray-100">

            {/* Thanh icon bên trái */}
            <aside className="w-16 bg-blue-600 flex flex-col items-center py-4 text-white">

                {/* Logo cho ứng dụng */}
                <img
                    src="/images/logonn.jpg"
                    alt="Logo ứng dụng"
                    className="w-10 h-10 rounded-full object-cover mb-6 border-2 border-white"
                />

                {/* Các icon chức năng */}
                <div className="space-y-6">
                    <MessageCircle className="w-6 h-6 cursor-pointer hover:text-blue-200" />
                    <Users className="w-6 h-6 cursor-pointer hover:text-blue-200" />
                    <Cloud className="w-6 h-6 cursor-pointer hover:text-blue-200" />
                </div>

                {/* Icon cài đặt */}
                <div className="mt-auto">
                    <Settings className="w-6 h-6 cursor-pointer hover:text-blue-200" />
                </div>
            </aside>

            {/* Sidebar danh sách cuộc trò chuyện */}
            <aside className="w-80 bg-white border-r flex flex-col">

                {/* Ô tìm kiếm */}
                <div className="p-3 border-b">
                    <input
                        placeholder="Tìm kiếm"
                        className="w-full px-3 py-2 rounded bg-gray-100 outline-none"
                    />
                </div>

                {/* Danh sách chat */}
                <div className="flex-1 overflow-y-auto">
                    {[1, 2, 3, 4, 5, 6].map((u) => (
                        <div
                            key={u}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-300" />
                            <div className="flex-1">
                                <div className="font-medium">Cuộc trò chuyện {u}</div>
                                <div className="text-sm text-gray-500 truncate">
                                    Tin nhắn gần nhất...
                                </div>
                            </div>
                            <div className="text-xs text-gray-400">2h</div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Nội dung chat */}
            <main className="flex-1 flex flex-col">

                {/* Header chat */}
                <header className="h-14 bg-white border-b flex items-center px-4 font-semibold">
                    Cuộc trò chuyện
                </header>

                {/* Danh sách tin nhắn */}
                <section className="flex-1 overflow-y-auto p-4 space-y-3">
                    <div className="flex">
                        <div className="bg-white px-4 py-2 rounded-2xl shadow max-w-xs">
                            Xin chào!
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <div className="bg-blue-500 text-white px-4 py-2 rounded-2xl max-w-xs">
                            Chào bạn
                        </div>
                    </div>
                </section>

                {/* Ô nhập tin nhắn */}
                <footer className="h-16 bg-white border-t flex items-center px-4 gap-2">
                    <input
                        placeholder="Nhập tin nhắn"
                        className="flex-1 border rounded-full px-4 py-2 outline-none"
                    />
                    <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full">
                        <Send size={18} />
                    </button>
                </footer>
            </main>
        </div>
    );
}
