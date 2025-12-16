# Chat App Frontend

Frontend của ứng dụng Chat Real-time được xây dựng với React, Vite, Tailwind CSS, Redux Toolkit và WebSocket.

## 📋 Yêu cầu hệ thống

- **Node.js**: v16 trở lên
- **npm**: v7 trở lên
- **Backend**: Backend server phải đang chạy (mặc định: `http://localhost:8000`)

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

Tạo file `.env` trong thư mục `frontend` với nội dung sau (tùy chọn):

```env
# API Base URL (mặc định: http://localhost:8000/api)
VITE_API_URL=http://localhost:8000/api
```

### Giải thích biến môi trường:

- **VITE_API_URL**: Base URL của backend API. Nếu không set, sẽ sử dụng default `http://localhost:8000/api`

**Lưu ý**: Vite chỉ expose các biến môi trường có prefix `VITE_` ra frontend code.

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
├── public/              # Static files
├── src/
│   ├── pages/          # React page components
│   │   ├── Login.jsx       # Trang đăng nhập
│   │   ├── Register.jsx    # Trang đăng ký
│   │   ├── VerifyOTP.jsx   # Trang xác thực OTP
│   │   ├── Dashboard.jsx   # Trang dashboard (danh sách conversations)
│   │   └── Chat.jsx        # Trang chat (giao diện chat)
│   ├── store/          # Redux store và slices
│   │   ├── slices/
│   │   │   ├── authSlice.js      # Authentication state
│   │   │   ├── messageSlice.js   # Messages state
│   │   │   ├── userSlice.js      # Users state
│   │   │   └── websocketSlice.js # WebSocket state
│   │   └── store.js         # Redux store configuration
│   ├── utils/          # Utility functions
│   │   ├── api.js          # Axios instance và interceptors
│   │   └── websocket.js    # WebSocket connection helper
│   ├── App.jsx         # Main App component với routing
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles với Tailwind
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── postcss.config.js   # PostCSS configuration
├── package.json        # Dependencies và scripts
└── README.md           # File này
```

## 🎨 Pages

### Login (`/login`)

Trang đăng nhập với email và password.

**Features:**

- Form validation
- Error handling và hiển thị lỗi
- Redirect to dashboard sau khi login thành công
- Link đến trang Register

### Register (`/register`)

Trang đăng ký tài khoản mới.

**Features:**

- Form fields: First Name, Last Name, Email, Password
- Form validation
- Error handling
- Redirect đến trang Verify OTP sau khi đăng ký thành công
- Link đến trang Login

### Verify OTP (`/verify`)

Trang xác thực OTP sau khi đăng ký.

**Features:**

- OTP input form
- Resend OTP functionality
- Error handling
- Redirect đến Dashboard sau khi verify thành công

### Dashboard (`/dashboard`)

Trang chính hiển thị danh sách conversations và users.

**Features:**

- Hiển thị danh sách conversations
- Tìm kiếm users
- Bắt đầu conversation mới
- Protected route (yêu cầu authentication)

### Chat (`/chat/:conversationId`)

Trang chat hiển thị messages và cho phép gửi tin nhắn.

**Features:**

- Hiển thị messages của conversation
- Gửi tin nhắn mới
- Real-time message updates (qua WebSocket)
- Protected route (yêu cầu authentication)

## 🔄 Routing

Routing được cấu hình trong `App.jsx` sử dụng React Router v6.

### Routes:

- `/` - Redirect đến `/dashboard` (nếu đã login) hoặc `/login`
- `/login` - Trang đăng nhập
- `/register` - Trang đăng ký
- `/verify` - Trang xác thực OTP
- `/dashboard` - Trang dashboard (protected)
- `/chat/:conversationId` - Trang chat (protected)

### Route Protection:

- Routes `/dashboard` và `/chat/:conversationId` yêu cầu authentication token
- Nếu chưa login, sẽ redirect về `/login`
- Nếu đã login, routes `/login`, `/register`, `/verify` sẽ redirect về `/dashboard`

## 🗄️ State Management (Redux)

State management sử dụng Redux Toolkit với các slices sau:

### authSlice

Quản lý authentication state:

- `token`: JWT token
- `user`: User object
- `error`: Error message
- Actions: `setCredentials`, `logout`, `setError`, `clearError`

### messageSlice

Quản lý messages state:

- Messages của các conversations
- Loading và error states
- Actions để fetch, add, update messages

### userSlice

Quản lý users state:

- Danh sách users
- Friends list
- Friend requests
- Actions để fetch users, manage friends

### websocketSlice

Quản lý WebSocket connection state:

- Connection status
- WebSocket instance
- Actions để connect, disconnect, send messages

## 🌐 API Integration

### API Client (`utils/api.js`)

Axios instance được cấu hình với:

- Base URL: `VITE_API_URL` hoặc `http://localhost:8000/api`
- Request interceptor: Tự động thêm JWT token vào header `Authorization`
- Response interceptor: Tự động logout và redirect nếu nhận được 401 Unauthorized

### WebSocket (`utils/websocket.js`)

WebSocket helper để:

- Kết nối đến WebSocket server
- Gửi và nhận messages
- Quản lý connection state

## 🎨 Styling

### Tailwind CSS

Ứng dụng sử dụng Tailwind CSS cho styling với:

- Custom color palette (định nghĩa trong `tailwind.config.js`)
- Utility classes
- Responsive design

### Global Styles (`index.css`)

- Tailwind directives (`@tailwind base`, `@tailwind components`, `@tailwind utilities`)
- Custom CSS classes (nếu có)
- Font imports

## 📦 Dependencies chính

### Production Dependencies

- **react** (^18.2.0): React library
- **react-dom** (^18.2.0): React DOM renderer
- **react-router-dom** (^6.20.0): Client-side routing
- **@reduxjs/toolkit** (^2.0.1): Redux Toolkit cho state management
- **react-redux** (^9.0.4): React bindings cho Redux
- **axios** (^1.6.2): HTTP client
- **ws** (^8.14.2): WebSocket client

### Development Dependencies

- **vite** (^5.0.8): Build tool và dev server
- **@vitejs/plugin-react** (^4.2.1): Vite plugin cho React
- **tailwindcss** (^3.3.6): Utility-first CSS framework
- **postcss** (^8.4.32): CSS processor
- **autoprefixer** (^10.4.16): PostCSS plugin
- **@types/react** (^18.2.43): TypeScript types cho React
- **@types/react-dom** (^18.2.17): TypeScript types cho React DOM

## 🔧 Configuration Files

### `vite.config.js`

Vite configuration với:

- React plugin
- Dev server port: 5173
- Proxy `/api` requests đến `http://localhost:8000`

### `tailwind.config.js`

Tailwind CSS configuration với custom theme và colors.

### `postcss.config.js`

PostCSS configuration với Tailwind và Autoprefixer plugins.

## 🐛 Troubleshooting

### Frontend không kết nối được với backend API

- Kiểm tra backend đang chạy tại `http://localhost:8000`
- Kiểm tra `VITE_API_URL` trong `.env` (nếu có)
- Kiểm tra CORS settings trong backend
- Kiểm tra proxy configuration trong `vite.config.js`

### WebSocket không kết nối

- Kiểm tra WebSocket URL trong code đúng format
- Kiểm tra backend WebSocket server đang chạy
- Kiểm tra network/firewall blocking WebSocket connections
- Kiểm tra token có hợp lệ

### Build errors

- Xóa `node_modules` và `package-lock.json`, sau đó chạy lại `npm install`
- Kiểm tra Node.js version (yêu cầu v16+)
- Kiểm tra lỗi trong console để xác định dependency conflict

### Styling không apply

- Kiểm tra Tailwind directives trong `index.css`
- Kiểm tra `tailwind.config.js` có đúng cấu hình
- Restart dev server sau khi thay đổi Tailwind config

### Authentication token không được lưu

- Kiểm tra localStorage có được enable trong browser
- Kiểm tra code lưu token trong authSlice hoặc Login component
- Kiểm tra browser console có lỗi gì không

## 📝 Development Notes

### Proxy Configuration

Vite dev server được cấu hình để proxy `/api` requests đến backend. Điều này cho phép:

- Tránh CORS issues trong development
- Sử dụng relative paths (`/api/auth/login`) thay vì full URL

### Environment Variables

Chỉ các biến môi trường có prefix `VITE_` mới được expose ra frontend code. Sử dụng `import.meta.env.VITE_API_URL` để truy cập.

### State Persistence

Authentication token được lưu trong `localStorage`. Khi refresh page, token sẽ được load lại từ localStorage.

### Protected Routes

Protected routes check `token` trong Redux store. Nếu không có token, redirect về `/login`.

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

**Lưu ý**: Đảm bảo cấu hình backend API URL đúng trong production environment.

## 📄 License

ISC

## 👥 Author

Nhom89_ChatApp
