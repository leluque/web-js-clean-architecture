# WP2 Base API - Clean Architecture Example

## Overview

This project serves as a foundational example for my students (Web Programming II), demonstrating clean architecture principles in a Node.js environment. It showcases how to build a flexible, maintainable API that remains independent of frameworks and infrastructure choices.

The application implements a user management system with authentication, profile management, and email validation features. Its architecture allows developers to switch between different web frameworks (Express/Fastify) and database implementations (MongoDB/MySQL/TypeORM) without changing business logic.

## Key Features

- Framework Independence : Switch between Express and Fastify with a simple environment variable
- Database Flexibility : Choose between MongoDB (Mongoose), MySQL, or TypeORM implementations
- Clean Architecture : Separation of concerns with domain models, use cases, and infrastructure
- Authentication : JWT-based authentication system with protected routes
- File Uploads : Profile image upload functionality with proper storage
- Email Validation : User email verification system
- Docker Integration : Easy setup with containerized dependencies

## Project Structure
```plaintext
src/
├── business/                  # Domain and business logic
│   └── user/
│       ├── use-cases/         # Application business rules
│       │   ├── signUp.js
│       │   ├── signIn.js
│       │   ├── validateEmail.js
│       │   └── ...
│       ├── user.js            # User entity (domain model)
│       └── userRepository.js  # Repository interface
│
├── infrastructure/            # Framework-dependent code
│   ├── persistence/           # Database implementations
│   │   ├── mongoose/          # MongoDB implementation
│   │   ├── mysql/             # Raw MySQL implementation
│   │   ├── typeorm/           # TypeORM implementation
│   │   └── index.js           # Factory for repository selection
│   │
│   ├── web/                   # Web framework implementations
│   │   ├── common/            # Shared components
│   │   │   ├── requestWrapper.js
│   │   │   └── responseWrapper.js
│   │   ├── controller/        # Framework-agnostic controllers
│   │   ├── express/           # Express.js implementation
│   │   ├── fastify/           # Fastify implementation
│   │   └── index.js           # Framework selection logic
│   │
│   └── email/                 # Email service implementation
│
└── index.js                   # Application entry point
 ```

## API Endpoints

All endpoints are prefixed with /api/users

### Public Endpoints

The system has 3 public endpoints:
* /signup
* /signin
* /validate-email

### Protected Endpoints (Requires JWT)

All protected endpoints require a valid JWT token in the Authorization header.

## Getting Started

### Prerequisites

- Node.js (v14+)
- Docker and Docker Compose
- Yarn or npm

### Installation

1. Start the infrastructure services :
```bash
cd docker
docker-compose up -d
 ```

This will start:

- MySQL database
- MongoDB database
- phpMyAdmin (MySQL admin interface)
- Mailhog (SMTP testing server)

2. Install dependencies :
```bash
yarn install
 ```

3. Configure environment variables :
Create a .env file in the project root (see Configuration section below).

4. Run database migrations (if using MySQL):
```bash
yarn migrate
 ```

5. Start the application :
```bash
# Using Express (default)
yarn start:express

# Using Fastify
yarn start:fastify

# Development mode with hot reload
yarn dev:express
# or
yarn dev:fastify
 ```

## Configuration

The application is configured through environment variables. Create a .env file in the project root:

```plaintext
# Server Configuration
PORT=3000
APP_URL=http://localhost:3000

# Framework Selection
WEB_FRAMEWORK=express  # Options: express, fastify

# Database Selection
REPOSITORY_TYPE=mongoose  # Options: mongoose, mysql, typeorm

# MySQL Configuration (for mysql and typeorm)
DB_HOST=localhost
DB_USER=app_user
DB_PASSWORD=app_password
DB_NAME=app_db

# MongoDB Configuration (for mongoose)
MONGODB_URI=mongodb://localhost:27017/app_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_in_production

# Email Configuration
SMTP_FROM=sender@email.com
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=fake
SMTP_PASS=fake
 ```
```

## Architecture Principles
### Clean Architecture
This project follows Robert C. Martin's Clean Architecture principles:

1. Independence from frameworks : The business logic doesn't depend on any external framework
2. Testability : Business rules can be tested without UI, database, or external elements
3. Independence from UI : The UI can change without changing the business rules
4. Independence from database : The database can be swapped without affecting business rules
5. Independence from external agencies : Business rules don't know anything about interfaces to the outside world
### Dependency Rule
The dependency rule is strictly enforced: source code dependencies only point inward. Inner layers know nothing about outer layers.

- Entities : Enterprise-wide business rules (User domain model)
- Use Cases : Application-specific business rules
- Interface Adapters : Converts data between use cases and external formats
- Frameworks & Drivers : External frameworks and tools (Express, Fastify, Mongoose, etc.)
## Framework Independence
The application demonstrates framework independence through:

1. Common Request/Response Wrappers : Abstracts framework-specific request/response objects
2. Framework-Agnostic Controllers : Business logic is separated from framework details
3. Adapter Pattern : Framework-specific code adapts to the application's interfaces
4. Dependency Injection : Dependencies are injected rather than directly imported
## Database Independence
The repository pattern enables database independence:

1. Repository Interface : Defined in the business layer
2. Multiple Implementations : MongoDB, MySQL, and TypeORM implementations
3. Factory Pattern : Repository selection based on configuration
4. Domain Mapping : Conversion between domain models and database entities
## Testing
Run tests with:

```bash
# Run all tests
yarn test

# Run tests with watch mode
yarn test:watch
 ```

The project includes:

- Unit tests for business logic
- Integration tests for API endpoints
- Repository tests for database operations

## Development Guidelines

1. Business Logic : Add new features by creating use cases in the business layer
2. Repository Interface : Extend the repository interface for new data requirements
3. Controllers : Implement framework-agnostic controllers in the common layer
4. Framework Adapters : Update adapters for Express and Fastify as needed
5. Database Implementations : Update all repository implementations for new methods

## Learning Objectives

This project demonstrates several key concepts for the Web Programming II course:

1. Clean Architecture : Separation of concerns and dependency inversion
2. Domain-Driven Design : Focus on the core domain and business logic
3. Repository Pattern : Abstraction of data access
4. Dependency Injection : Loose coupling between components
5. Adapter Pattern : Adapting external interfaces to internal requirements
6. Factory Pattern : Creating objects without specifying concrete classes
7. Framework Independence : Building applications that aren't tied to specific frameworks
8. Testing Strategies : Unit, integration, and repository testing

## Improvements

[ ] Change all exports to use named exports
[ ] Add tests
[ ] Add more features
[ ] Add more documentation

## Contributing

This project is designed for educational purposes. Feel free to fork and extend it for your own learning.

## License

This project is licensed under the ISC License.
