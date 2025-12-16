# Chat App Backend

Backend của ứng dụng Chat Real-time được xây dựng với Node.js, Express, MongoDB, Mongoose và WebSocket.

## 📋 Yêu cầu hệ thống

- **Node.js**: v16 trở lên
- **MongoDB**: MongoDB Atlas và Mongo Compass (UI)
- **npm**: v7 trở lên

## 🚀 Cài đặt

1. Di chuyển vào thư mục backend:

```bash
cd backend
```

2. Cài đặt dependencies:

```bash
npm install
```

## ⚙️ Cấu hình

Tạo file `.env` trong thư mục `backend` với nội dung sau:

```env
# MongoDB Atlas:
# DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database-name

# JWT Secret Key (nên sử dụng chuỗi ngẫu nhiên mạnh)
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production

# JWT Expiration (milliseconds, mặc định: 86400000 = 24 giờ)
JWT_EXPIRE=86400000

# Server Port (mặc định: 8000)
PORT=8000

# Frontend URL (cho CORS)
FRONTEND_URL=http://localhost:5173

# Node Environment
NODE_ENV=development
```

### Giải thích các biến môi trường:

- **DATABASE_URL**: Connection string đến MongoDB database
- **JWT_SECRET**: Secret key để ký và xác thực JWT tokens (quan trọng: phải thay đổi trong production)
- **JWT_EXPIRE**: Thời gian hết hạn của JWT token (milliseconds)
- **PORT**: Port mà server sẽ chạy (mặc định: 8000)
- **FRONTEND_URL**: URL của frontend để cấu hình CORS
- **NODE_ENV**: Môi trường chạy (`development` hoặc `production`)

## 🏃 Chạy ứng dụng

### Development mode (với nodemon auto-reload)

```bash
npm run dev
```

### Production mode

```bash
npm start
```

Server sẽ chạy tại `http://localhost:8000` (hoặc port được cấu hình trong `.env`)
WebSocket server sẽ chạy tại `ws://localhost:8000/ws`