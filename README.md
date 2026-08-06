# 📚 Bookstore Backend API

Node.js + Express + MongoDB backend for the Bookstore application.

## 🚀 Features

- RESTful API
- JWT Authentication
- MongoDB database
- File upload support
- CORS enabled
- Input validation
- Error handling

## 📋 Requirements

- Node.js 18+
- MongoDB (local or Atlas)

## 🔧 Installation

```bash
npm install
```

## ⚙️ Configuration

Create `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your_jwt_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
```

## 🏃 Running

### Development:
```bash
npm run dev
```

### Production:
```bash
npm start
```

### Seed Database:
```bash
npm run seed
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Books
- `GET /api/books` - Get all books (with filters)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (admin only)
- `PUT /api/books/:id` - Update book (admin only)
- `DELETE /api/books/:id` - Delete book (admin only)

### Orders
- `GET /api/orders` - Get all orders (admin) or user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order (protected)
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get single user (admin only)
- `PUT /api/users/:id` - Update user (protected)

## 🔐 Default Credentials

### Admin:
- Email: `admin@bookstore.com`
- Password: `admin123`

### Customer:
- Email: `john@example.com`
- Password: `password123`

## 📦 Dependencies

- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv
- multer
- express-validator

## 🚀 Deployment

See `DEPLOYMENT-GUIDE.md` for detailed deployment instructions.

### Quick Deploy to Render:

1. Push to GitHub
2. Connect to Render
3. Add environment variables
4. Deploy!

## 📝 License

MIT
