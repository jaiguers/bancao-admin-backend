# Banco Admin Backend

A NestJS application with TypeScript that implements Clean Code principles and SOLID design patterns for bank administration.

## Features

- **User Management**: Create, read, update, and delete users
- **Authentication**: JWT-based authentication with guards
- **Transactions**: Manage financial transactions
- **Wallet**: Handle wallet deposits and withdrawals

## Tech Stack

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- JWT Authentication
- Passport.js
- Class Validator

## Project Structure

```
src/
├── common/                 # Shared interfaces and decorators
│   ├── decorators/        # Custom decorators
│   └── interfaces/        # TypeScript interfaces
├── config/                # Configuration files
├── modules/               # Feature modules
│   ├── auth/             # Authentication module
│   ├── users/            # User management module
│   ├── transactions/     # Transaction management module
│   └── wallet/           # Wallet management module
└── main.ts               # Application entry point
```

## Environment Variables

Copy `env.example` to `.env` and configure the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=bancao_admin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Application Configuration
PORT=3000
NODE_ENV=development

# Bcrypt Configuration
BCRYPT_ROUNDS=10
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up your PostgreSQL database and update the environment variables.

3. Run the application:
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login

### Users (Protected - Admin only)
- `POST /api/v1/users` - Create user
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Transactions (Protected)
- `POST /api/v1/transactions` - Create transaction
- `GET /api/v1/transactions` - Get user transactions
- `GET /api/v1/transactions/:id` - Get transaction by ID
- `GET /api/v1/transactions/stats` - Get transaction statistics
- `PATCH /api/v1/transactions/:id/status` - Update transaction status

### Wallet (Protected)
- `GET /api/v1/wallet/balance` - Get wallet balance
- `POST /api/v1/wallet/deposit` - Make a deposit
- `POST /api/v1/wallet/withdraw` - Make a withdrawal
- `GET /api/v1/wallet/history` - Get transaction history

## Clean Code & SOLID Principles Applied

### SOLID Principles:
- **Single Responsibility**: Each class has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Derived classes are substitutable for base classes
- **Interface Segregation**: Clients depend only on interfaces they use
- **Dependency Inversion**: Depend on abstractions, not concretions

### Clean Code Practices:
- Meaningful names for classes, methods, and variables
- Small, focused functions with single responsibilities
- Consistent formatting and code style
- Comprehensive error handling
- Input validation using DTOs
- Separation of concerns across layers

## Database Schema

The application uses the following entities:
- **User**: User information and authentication
- **Wallet**: User wallet with balance tracking
- **Transaction**: Financial transaction records

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Role-based access control
- Transaction integrity with database transactions

## Development

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
```
