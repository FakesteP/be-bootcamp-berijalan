# UPN Backend Training Project

Backend API menggunakan Node.js, TypeScript, Express, dan Prisma untuk sistem antrian counter.

## 🚀 Features

- **Authentication**: JWT-based auth system
- **Counter Management**: CRUD operations untuk counter
- **Queue System**: Sistem antrian dengan Redis
- **Real-time Updates**: Server-Sent Events (SSE)
- **Validation**: Comprehensive input validation
- **Error Handling**: Centralized error management

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Cache**: Redis
- **Authentication**: JWT
- **Validation**: Joi

## 📦 Installation

```bash
# Clone repository
git clone <https://github.com/FakesteP/be-bootcamp-berijalan.git>
cd upn-backend-training

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

## 🏗️ Project Structure

```
src/
├── controllers/     # Request handlers
├── services/        # Business logic
├── middlewares/     # Express middlewares
├── routes/          # API routes
├── validations/     # Input validation schemas
├── utils/           # Utility functions
├── interfaces/      # TypeScript interfaces
├── config/          # Configuration files
└── errors/          # Error handling
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📄 License

MIT License
