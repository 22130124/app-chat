# Chat App Frontend

Frontend của ứng dụng Chat Real-time được xây dựng với React, Vite, Tailwind CSS, Redux Toolkit, SCSS Modules và WebSocket.

## 📋 Yêu cầu hệ thống

- **Node.js**: v16 trở lên
- **npm**: v7 trở lên
- **Backend**: Backend server phải đang chạy (WebSocket server tại `wss://chat.longapp.site/chat/chat`)

## 🚀 Cài đặt

1. Di chuyển vào thư mục frontend:

```bash
cd frontend
```

2. Cài đặt dependencies:

```bash
npm install
```

## ⚙️ Cấu hình

WebSocket URL được cấu hình trong `src/socket/socket.js`. Mặc định kết nối đến `wss://chat.longapp.site/chat/chat`.

Nếu cần thay đổi WebSocket URL, chỉnh sửa biến `SOCKET_URL` trong file `src/socket/socket.js`.

## 🏃 Chạy ứng dụng

### Development mode

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173` (hoặc port khác nếu 5173 đã được sử dụng).

### Build cho production

```bash
npm run build
```

Build files sẽ được tạo trong thư mục `dist/`.

### Preview production build

```bash
npm run preview
```

Sẽ chạy local server để preview production build.

## 📁 Cấu trúc thư mục

```
frontend/
├── public/                    # Static files
├── src/
│   ├── features/              # Feature-based modules
│   │   ├── auth/              # Authentication feature
│   │   └── home/              # Home/Chat feature
│   │       ├── chat/          # Chat functionality
│   │       ├── conversation-list/ # Conversation list
│   │       ├── icon-sidebar/       # Icon sidebar
│   │       └── pages/              # HomePage
│   ├── routes/                # Routing configuration
│   │   ├── AppRoutes.jsx      # Route definitions
│   │   └── ProtectedRoute.jsx # Protected route wrapper
│   ├── socket/                # WebSocket connection
│   │   └── socket.js          # Socket connection helper
│   ├── store/                 # Redux store
│   │   ├── rootReducer.js     # Root reducer
│   │   └── store.js           # Store configuration
│   ├── App.jsx                # Main App component
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles với Tailwind
├── index.html                 # HTML template
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── package.json               # Dependencies và scripts
```

## 🎨 Pages

### Login (`/login`)

Trang đăng nhập với email và password.

**Features:**

- Form validation
- Error handling và hiển thị lỗi
- Redirect to home sau khi login thành công
- Link đến trang Register
- Auto re-login khi có token trong localStorage

### Register (`/register`)

Trang đăng ký tài khoản mới.

**Features:**

- Form fields: First Name, Last Name, Email, Password
- Form validation
- Error handling
- Link đến trang Login

### Home (`/home`)

Trang chính hiển thị giao diện chat hoàn chỉnh với 3 cột:

**Layout:**

- **Cột 1 - Icon Sidebar**: Sidebar bên trái với logo, navigation icons (Chat, Users, Phone, Settings), toggle switch và user avatar
- **Cột 2 - Conversation List**: Danh sách cuộc trò chuyện với search bar
- **Cột 3 - Chat Window**: Giao diện chat với header, messages và input area

**Features:**

- Hiển thị danh sách conversations
- Tìm kiếm conversations
- Gửi và nhận tin nhắn real-time qua WebSocket
- Modern UI với gradients và animations
- Protected route (yêu cầu authentication)

## 🔄 Routing

Routing được cấu hình trong `src/routes/AppRoutes.jsx` sử dụng React Router v6.

### Routes:

- `/` - Redirect đến `/home` (nếu đã login) hoặc `/login`
- `/login` - Trang đăng nhập (public)
- `/register` - Trang đăng ký (public)
- `/home` - Trang chính với giao diện chat (protected)

### Route Protection:

- Route `/home` yêu cầu authentication (sử dụng `ProtectedRoute`)
- Nếu chưa login, sẽ redirect về `/login`
- Nếu đã login, routes `/login` và `/register` sẽ redirect về `/home`
- Auto re-login được thực hiện trong `App.jsx` khi app khởi động

## 🌐 WebSocket Integration

### WebSocket Connection (`src/socket/socket.js`)

WebSocket helper để kết nối và giao tiếp với server:

**Functions:**

- `connectSocket(onMessageCallback)`: Kết nối đến WebSocket server

  - Tự động tái sử dụng connection nếu đã tồn tại
  - Nhận callback để xử lý messages từ server
  - Trả về Promise

- `sendSocketMessage(payload)`: Gửi message lên server

  - Tự động convert object sang JSON string
  - Kiểm tra connection trước khi gửi

- `disconnectSocket()`: Ngắt kết nối WebSocket

**Configuration:**

- WebSocket URL: `wss://chat.longapp.site/chat/chat`
- Tự động parse JSON messages
- Error handling và logging

**Usage trong App:**

- WebSocket được kết nối khi app khởi động trong `App.jsx`
- Callback `handleAuthResponse` được sử dụng để xử lý auth responses

## 🎨 Styling

### SCSS Modules

Ứng dụng sử dụng SCSS Modules cho component styling:

- Mỗi component có file `.module.scss` riêng
- Scoped styles, tránh conflict
- Modern CSS features (gradients, animations, transitions)

### Tailwind CSS

Ứng dụng cũng sử dụng Tailwind CSS cho:

- Global styles và utilities
- Custom color palette (định nghĩa trong `tailwind.config.js`)
- Responsive design

### Global Styles (`index.css`)

- Tailwind directives (`@tailwind base`, `@tailwind components`, `@tailwind utilities`)
- Global CSS reset và base styles
- Font imports và font smoothing

## 📦 Dependencies chính

### Production Dependencies

- **react** (^18.2.0): React library
- **react-dom** (^18.2.0): React DOM renderer
- **react-router-dom** (^6.20.0): Client-side routing
- **@reduxjs/toolkit** (^2.0.1): Redux Toolkit cho state management
- **react-redux** (^9.0.4): React bindings cho Redux
- **lucide-react** (^0.562.0): Icon library
- **react-spinners** (^0.17.0): Loading spinners
- **react-toastify** (^11.0.5): Toast notifications
- **ws** (^8.14.2): WebSocket client

### Development Dependencies

- **vite** (^5.0.8): Build tool và dev server
- **@vitejs/plugin-react** (^4.2.1): Vite plugin cho React
- **tailwindcss** (^3.3.6): Utility-first CSS framework
- **sass** (^1.97.1): SCSS compiler
- **postcss** (^8.4.32): CSS processor
- **autoprefixer** (^10.4.16): PostCSS plugin
- **@types/react** (^18.2.43): TypeScript types cho React
- **@types/react-dom** (^18.2.17): TypeScript types cho React DOM

## 🔧 Configuration Files

### `vite.config.js`

Vite configuration với:

- React plugin
- Dev server port: 5173 (hoặc port khác nếu 5173 đã được sử dụng)

### `tailwind.config.js`

Tailwind CSS configuration với custom theme và colors.

### `postcss.config.js`

PostCSS configuration với Tailwind và Autoprefixer plugins.

### `src/socket/socket.js`

WebSocket configuration:

- WebSocket URL: `wss://chat.longapp.site/chat/chat`
- Connection management và error handling

## 🐛 Troubleshooting

### WebSocket không kết nối

- Kiểm tra WebSocket URL trong `src/socket/socket.js` đúng format (`wss://` cho secure connection)
- Kiểm tra backend WebSocket server đang chạy tại `wss://chat.longapp.site/chat/chat`
- Kiểm tra network/firewall blocking WebSocket connections
- Kiểm tra browser console có lỗi gì không
- Kiểm tra SSL certificate nếu dùng `wss://`

### Build errors

- Xóa `node_modules` và `package-lock.json`, sau đó chạy lại `npm install`
- Kiểm tra Node.js version (yêu cầu v16+)
- Kiểm tra lỗi trong console để xác định dependency conflict

### Styling không apply

- Kiểm tra Tailwind directives trong `index.css`
- Kiểm tra `tailwind.config.js` có đúng cấu hình
- Kiểm tra SCSS files có được compile đúng không
- Restart dev server sau khi thay đổi Tailwind config hoặc SCSS files

### Authentication không hoạt động

- Kiểm tra localStorage có được enable trong browser
- Kiểm tra code lưu user và code trong `authService.js`
- Kiểm tra auto re-login trong `App.jsx` có hoạt động không
- Kiểm tra browser console có lỗi gì không
- Kiểm tra WebSocket connection có thành công không (cần cho auth)

## 📝 Development Notes

### Feature-Based Architecture

Ứng dụng sử dụng feature-based architecture:

- Mỗi feature có folder riêng trong `src/features/`
- Mỗi feature có: `components/`, `containers/`, `pages/`, `services/`, `slice/`
- Dễ maintain và scale

### WebSocket Communication

- WebSocket được kết nối khi app khởi động
- Tất cả communication với server qua WebSocket, không dùng REST API
- Messages được parse tự động từ JSON

### State Persistence

Authentication state được lưu trong `localStorage`:

- `user`: User object
- `code`: Re-login code

Khi refresh page, app tự động thực hiện re-login nếu có user và code trong localStorage.

### Protected Routes

Protected routes check `isLoggedIn` trong Redux store. Nếu không đăng nhập, redirect về `/login`.

### Auto Re-login

App tự động thực hiện re-login khi khởi động nếu có thông tin trong localStorage. Quá trình này được xử lý trong `App.jsx` với loading state.

## 🚀 Build và Deploy

### Build cho production:

```bash
npm run build
```

Build files sẽ được tạo trong `dist/` folder.

### Deploy:

Có thể deploy `dist/` folder lên bất kỳ static hosting nào như:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Nginx

**Lưu ý**: Đảm bảo cấu hình WebSocket URL đúng trong production environment (trong `src/socket/socket.js`).

## 📄 License

ISC

## 👥 Author

Nhom89_ChatApp
