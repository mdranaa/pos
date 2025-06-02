# 🧾 Full-Stack POS System

A complete full-stack Point of Sale (POS) system built with:

- ⚛️ **Client**: React.js + Vite
- 🚀 **Server**: NestJS (Node.js)
- 🍃 **Database**: MongoDB + Prisma ORM
- 📦 **Package Manager**: pnpm
- 🔌 **API**: REST API

---

## 🌐 URLs

- **Client**: [http://localhost:5173](http://localhost:5173)
- **Server API**: [http://localhost:8000](http://localhost:8000)

---

## 📁 Project Structure

```
project-root/
│
├── client/     → React + Vite Client
├── server/      → NestJS Server (REST API)
└── screenshots     → Screenshots of this project
└── README.md     → Project instructions and docs
```

---

## ⚙️ Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (v8+)
- [MongoDB](https://www.mongodb.com/try/download/community) or MongoDB Atlas
- [Postman](https://www.postman.com/) or similar tool for API testing (optional)

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/mdranaa/pos
cd pos
```

---

### 2. Install Dependencies

Using pnpm:

```bash
# Client
cd client
pnpm install

# Server
cd server
pnpm install
```

---

### 3. Environment Variables

Create a `.env` file inside the `Server/` folder:

```env
PORT=8000
DATABASE_URL=mongodb://localhost:27017/pos_db
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN='1d'
PORT=8000
CLIENT_URL=http://localhost:5173
```

> ✅ Replace values as needed. For MongoDB Atlas, use your connection string.

---

### 4. Run Development Servers

#### Server (NestJS)

```bash
cd server
npx prisma generate
npx prisma db push
pnpm run start:dev
```

> Server runs on: `http://localhost:8000`

### 3. Environment Variables

Create a `.env` file inside the `client/` folder:

```env
VITE_SERVER_URL=http://localhost:8000
```

---

#### Client (React + Vite)

```bash
cd client
pnpm run dev
```

> App runs on: `http://localhost:5173`

---

## 📡 API Documentation

### 🔐 Authentication

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| POST   | `/auth/register` | Register a new user   |
| POST   | `/auth/login`    | Login and get a token |

### 📦 Products

| Method | Endpoint        | Description          |
| ------ | --------------- | -------------------- |
| GET    | `/products`     | Get all products     |
| GET    | `/products/:id` | Get product by ID    |
| POST   | `/products`     | Create a new product |

### 🧾 Sales

| Method | Endpoint | Description       |
| ------ | -------- | ----------------- |
| GET    | `/sales` | Get all sales     |
| POST   | `/sales` | Create a new sale |

> ⚠️ **Secure Routes** require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

---

### 🧪 Sample API Request (with cURL)

```bash
curl -X POST http://localhost:8000/auth/login   -H "Content-Type: application/json"   -d '{"email":"admin@example.com","password":"password123"}'
```

---

## 🖼️ Screenshots

Add screenshots to the `screenshots/` folder and display them here.

| 🔐 Login Page                | 📊 Dashboard                     | 🧾 Sales Page                |
| ---------------------------- | -------------------------------- | ---------------------------- |
| ![](./screenshots/login.png) | ![](./screenshots/dashboard.png) | ![](./screenshots/sales.png) |

---

## 📦 Build for Production

### Client

```bash
cd client
pnpm run build
```

> Output in `client/dist/`

### Server

```bash
cd server
pnpm run build
```

> Compiled files in `server/dist/`

---

## 🐳 Docker Setup (Optional)

Want containerized deployment?

Ask to add:

- `Dockerfile` for Client & Server
- `docker-compose.yml` for the full stack

---

## 🧪 Testing

Use Postman, Insomnia, or browser DevTools to test your REST API at:

- `http://localhost:8000/auth`
- `http://localhost:8000/products`
- `http://localhost:8000/sales`

---

## 📄 License

MIT License © [Rana Ahammed]

---

## 🙋‍♂️ Author

- GitHub: [@mdranaa](https://github.com/mdranaa)
- Email: rana.ahammed.012@gmail.com

---
