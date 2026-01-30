# Food Ordering System

A full-stack web application demonstrating **Role-Based Access Control (RBAC)**, **JWT authentication**, and **multi-tenant data isolation** using NestJS and Next.js.

> **Purpose**: This project showcases enterprise-grade backend architecture, authentication patterns, and role-based authorization in a realistic food ordering context.

## 📋 Table of Contents
- [Overview](#overview)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Features](#-features)
- [Role Definitions & Permissions](#-role-definitions--permissions)
- [Order Lifecycle](#-order-lifecycle)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Why This Architecture?](#-why-this-architecture)
- [Assumptions & Constraints](#-assumptions--constraints)
- [Security Considerations](#-security-considerations)

## Overview

This application simulates a multi-tenant food ordering platform where:
- **Admins** have global access across all countries
- **Managers** can finalize and manage orders within their country
- **Members** (end-user customers) can browse menus and create draft orders

**Core Focus**: Demonstrating RBAC implementation, JWT-based authentication, and country-based data isolation using modern TypeScript frameworks.

## 🏛️ Architecture

### High-Level System Design
```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER (Port 3000)                │
│  Next.js Frontend                                            │
│  • Protected Routes    • Axios Interceptors                  │
│  • Role-based UI       • localStorage (JWT + User)           │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP (Bearer Token)
┌────────────────────────┴────────────────────────────────────┐
│                   APPLICATION LAYER (Port 3001)              │
│  NestJS Backend                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Controllers  │→ │   Guards     │→ │   Services   │      │
│  │ (Routes)     │  │ JWT + Roles  │  │ (Logic)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                      DATA LAYER (In-Memory)                  │
│  Mock Users, Restaurants, Menu Items, Orders                 │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow (Authenticated Endpoints)
```
1. Client sends request with Authorization: Bearer <JWT>
   ↓
2. AuthGuard('jwt') validates token → extracts user payload
   ↓
3. RolesGuard checks @Roles() decorator → verifies permission
   ↓
4. ValidationPipe validates DTOs
   ↓
5. Controller method executes
   ↓
6. Service applies country-based filtering (if applicable)
   ↓
7. Response returned to client
```

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | NestJS + TypeScript | Structured API with built-in guard system for RBAC |
| **Authentication** | Passport.js + JWT | Stateless, token-based authentication |
| **Frontend** | Next.js + React | SSR-capable UI with file-based routing |
| **Styling** | Tailwind CSS | Rapid UI development |
| **Validation** | class-validator | DTO validation at API layer |
| **Documentation** | Swagger/OpenAPI | Auto-generated, interactive API docs |

### Key Dependencies
- `@nestjs/passport`, `passport-jwt` - Authentication strategies
- `bcrypt` - Password hashing
- `axios` - HTTP client with interceptors
- `rxjs` - Reactive programming (NestJS core)

## 🔐 Features

### Authentication & Authorization
- JWT-based stateless authentication
- Password hashing with bcrypt (10 rounds)
- Role-based access control via NestJS Guards
- Country-based data isolation (multi-tenancy)

### Data Segregation
- **Admin**: Global access to all countries
- **Manager/Member**: Scoped to assigned country only
- Filtering implemented at service layer, not database

### Protected API Endpoints
All endpoints except `/auth/login` require valid JWT token in `Authorization: Bearer <token>` header.

## 👥 Role Definitions & Permissions

### 1. User Authentication Workflow
```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. Navigate to /login
       ↓
┌─────────────────┐
│  Login Page     │
│  - Email input  │
│  - Password     │
└──────┬──────────┘
       │ 2. Submit credentials
       ↓
┌──────────────────────────┐
│  Frontend: authAPI.login │
└──────┬───────────────────┘
       │ 3. POST /auth/login
       ↓
┌──────────────────────────────┐
│  Backend: AuthController     │
│  - Validate credentials      │
│  - Compare hashed password   │
└──────┬───────────────────────┘
       │ 4. Generate JWT token
       ↓
┌──────────────────────────────┐
│  AuthService.login()         │
│  - Create payload with:      │
│    • User ID                 │
│    • Email                   │
│    • Role (admin/mgr/member) │
│    • Country                 │
│  - Sign JWT with secret      │
└──────┬───────────────────────┘
       │ 5. Return { access_token, user }
       ↓
┌──────────────────────────────┐
│  Frontend: Save to storage   │
│  - localStorage.token        │
│  - localStorage.user         │
└──────┬───────────────────────┘
       │ 6. Redirect to dashboard
       ↓
┌──────────────────────────────┐
│  Protected Routes Active     │
│  - Token in Auth header      │
└──────────────────────────────┘
```

### 2. Order Creation Workflow
```
┌──────────────────┐
│ Restaurant Menu  │
│ Page (/menu/:id) │
└────┬─────────────┘
     │ 1. Browse menu items
     ↓
┌──────────────────┐
│ Add to Cart      │
│ - Select items   │
│ - Set quantity   │
└────┬─────────────┘
     │ 2. Click "Create Order"
     ↓
┌─────────────────────────────┐
│ Frontend: orderAPI.create   │
│ Payload: {                  │
│   restaurantId,             │
│   items: [{menuItemId, qty}]│
│ }                           │
└────┬────────────────────────┘
     │ 3. POST /orders with JWT token
     ↓
┌─────────────────────────────┐
│ Backend: Request Pipeline   │
│ ┌─────────────────────────┐ │
│ │ 1. CORS Middleware      │ │
│ └────┬────────────────────┘ │
│      ↓                       │
│ ┌─────────────────────────┐ │
│ │ 2. JWT Auth Guard       │ │
│ │ - Extract Bearer token  │ │
│ │ - Validate signature    │ │
│ │ - Attach user to req    │ │
│ └────┬────────────────────┘ │
│      ↓                       │
│ ┌─────────────────────────┐ │
│ │ 3. Roles Guard          │ │
│ │ - Check user.role       │ │
│ │ - Verify permissions    │ │
│ └────┬────────────────────┘ │
│      ↓                       │
│ ┌─────────────────────────┐ │
│ │ 4. Validation Pipe      │ │
│ │ - Validate DTO          │ │
│ │ - Transform data        │ │
│ └────┬────────────────────┘ │
└──────┼──────────────────────┘
       ↓
┌─────────────────────────────┐
│ OrderController.create()    │
│ - Extract user from request │
│ - Pass to service           │
└────┬────────────────────────┘
     ↓
┌─────────────────────────────┐
│ OrderService.create()       │
│ 1. Validate restaurant      │
│ 2. Validate menu items      │
│ 3. Calculate total amount   │
│ 4. Create order with:       │
│    - Draft status           │
│    - User country           │
│    - Item details           │
└────┬────────────────────────┘
     │ 5. Return created order
     ↓
┌─────────────────────────────┐
│ Frontend: Success Handler   │
│ - Show success message      │
│ - Redirect to /order/:id    │
└─────────────────────────────┘
```

### 3. Role-Based Access Control Workflow
```
Request with JWT Token
       ↓
┌─────────────────────────────┐
│ JWT Strategy validates      │
│ - Decode token              │
│ - Extract user payload      │
│ - Return user object:       │
│   { id, email, role,        │
│     country, name }         │
└────┬────────────────────────┘
     ↓
┌─────────────────────────────┐
│ RolesGuard.canActivate()    │
│ - Get required roles from   │
│   @Roles() decorator        │
│ - Check user.role matches   │
└────┬────────────────────────┘
     │
     ├─ ✅ Role matches
     │    ↓
     │  ┌──────────────────────┐
     │  │ Proceed to handler   │
     │  └──────────────────────┘
     │
     └─ ❌ Role doesn't match
          ↓
        ┌──────────────────────┐
        │ 403 Forbidden        │
        │ Access denied        │
        └──────────────────────┘
```

### 4. Country-Based Data Isolation Workflow
```
┌─────────────────────────────┐
│ User Request (e.g., orders) │
│ with JWT token              │
└────┬────────────────────────┘
     ↓
┌─────────────────────────────┐
│ Extract user.country        │
│ Extract user.role           │
└────┬────────────────────────┘
     │
     ├─ Is Admin?
     │  YES → Return all data (no filter)
     │
     └─ Is Manager/Member?
          YES ↓
        ┌──────────────────────┐
        │ Filter by country:   │
        │ data.filter(item =>  │
        │   item.country ===   │
        │   user.country)      │
        └──────────────────────┘
```

## �🔐 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Three user roles: Admin, Manager, Member
- Country-based data isolation (India & America)

### Access Control Matrix

| Feature | Admin | Manager | Member |
|---------|-------|---------|--------|
| View restaurants & menu | ✅ | ✅ | ✅ |
| Create order (add items) | ✅ | ✅ | ✅ |
| Place order (checkout) | ✅ | ✅ | ❌ |
| Cancel order | ✅ | ✅ | ❌ |
| Update payment method | ✅ | ❌ | ❌ |

### Country-Based Data Isolation
- **Admin**: Can view and manage all data across countries
- **Manager**: Can only view/manage data from their assigned country
- **Member**: Can only view/manage data from their assigned country

## 📦 Project Structure

```
food-ordering-system/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── restaurant/     # Restaurant module
│   │   ├── menu/           # Menu module
│   │   ├── order/          # Order module
│   │   ├── payment/        # Payment module
│   │   ├── guards/         # RBAC guards
│   │   ├── decorators/     # Custom decorators
│   │   └── common/         # Shared types & utilities
│   └── package.json
│
└── frontend/               # Next.js frontend
    ├── src/
    │   ├── pages/          # Next.js pages
    │   ├── components/     # React components
    │   ├── lib/            # Utilities & API client
    │   ├── types/          # TypeScript types
    │   └── styles/         # Global styles
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run start:dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 👥 Test Accounts

| Email | Password | Role | Country |
|-------|----------|------|---------|
| admin@food.com | admin123 | Admin | India |
| manager.india@food.com | manager123 | Manager | India |
| manager.america@food.com | manager123 | Manager | America |
| member.india@food.com | member123 | Member | India |
| member.america@food.com | member123 | Member | America |

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:3001/api

### Key Endpoints

#### Authentication
- `POST /auth/login` - User login
- `GET /auth/profile` - Get current user profile

#### Restaurants
- `GET /restaurants` - Get all restaurants (filtered by country)
- `GET /restaurants/:id` - Get restaurant by ID

#### Menu
- `GET /menu/restaurant/:restaurantId` - Get menu items for a restaurant
- `GET /menu/:id` - Get menu item by ID

#### Orders
- `POST /orders` - Create new order (All roles)
- `GET /orders` - Get all orders (filtered by country)
- `GET /orders/:id` - Get order by ID
- `PATCH /orders/:id/place` - Place order/Checkout (Admin & Manager only)
- `DELETE /orders/:id` - Cancel order (Admin & Manager only)

#### Payment Methods
- `GET /payment-methods` - Get user's payment methods
- `POST /payment-methods` - Add new payment method
- `PATCH /payment-methods/:id` - Update payment method (Admin only)
- `DELETE /payment-methods/:id` - Delete payment method

## 🔒 RBAC Implementation

### Backend Guards

#### RolesGuard
Located in `backend/src/guards/roles.guard.ts`
- Checks if user has required role to access endpoint
- Used with `@Roles()` decorator

#### JwtAuthGuard
- Validates JWT token
- Attaches user info to request

### Usage Example

```typescript
@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrderController {
  
  @Post(':id/place')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  placeOrder(@Param('id') id: string) {
    // Only Admin and Manager can access
  }
}
```

## 🌍 Country-Based Filtering

All services implement country-based filtering:

```typescript
// Example from RestaurantService
findAll(userCountry?: Country): Restaurant[] {
  if (!userCountry) {
    return mockRestaurants; // Admin sees all
  }
  return mockRestaurants.filter(r => r.country === userCountry);
}
```

## 🎨 Frontend Features

### Protected Routes
All pages except login are protected and require authentication.

### Role-Based UI Components
The `RoleBased` component conditionally renders UI based on user role:

```tsx
<RoleBased roles={[UserRole.ADMIN, UserRole.MANAGER]}>
  <button>Place Order</button>
</RoleBased>
```

### Pages
- **Login** (`/login`) - User authentication
- **Home** (`/`) - View restaurants
- **Menu** (`/menu/[restaurantId]`) - View menu and create order
- **Order Detail** (`/order/[orderId]`) - View order & checkout

## 🧪 Testing the Application

### Test Scenario 1: Manager (India)
1. Login as `manager.india@food.com`
2. See only Indian restaurants
3. Create an order
4. Place the order (checkout)
5. Cancel the order

### Test Scenario 2: Member (America)
1. Login as `member.america@food.com`
2. See only American restaurants
3. Create an order
4. **Cannot** place or cancel order (buttons hidden)

### Test Scenario 3: Admin
1. Login as `admin@food.com`
2. See restaurants from all countries
3. Full access to all operations
4. Can update payment methods

## 📝 Mock Data

The application uses in-memory mock data:
- 5 Users (1 Admin, 2 Managers, 2 Members)
- 4 Restaurants (2 India, 2 America)
- 10 Menu Items
- Dynamic Orders and Payment Methods

## 🔧 Environment Variables

### Backend (.env)
```env
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRATION=24h
PORT=3001
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🚢 Deployment (Optional)

### Backend Deployment
- Can be deployed to Heroku, Railway, or AWS
- Set environment variables in hosting platform
- Run `npm run build` and `npm run start:prod`

### Frontend Deployment
- Can be deployed to Vercel or Netlify
- Set `NEXT_PUBLIC_API_URL` to backend URL
- Run `npm run build`

## 🎯 Key Architectural Decisions

1. **NestJS Guards**: Used for enforcing RBAC at the endpoint level
2. **Custom Decorators**: `@Roles()` and `@CurrentUser()` for clean code
3. **Country Filtering**: Implemented in service layer, not at HTTP level
4. **JWT Storage**: Frontend stores JWT in localStorage
5. **Protected Routes**: HOC pattern for route protection
6. **Mock Data**: In-memory storage for simplicity (can be replaced with DB)

## 📖 API Design Principles

- RESTful conventions
- Consistent error responses
- Bearer token authentication
- Swagger documentation
- Validation using class-validator
- DTO pattern for type safety

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token expiration
- CORS enabled for frontend
- Input validation on all endpoints
- Role-based endpoint protection
- Country-based data isolation

## 📄 License

This project is created for demonstration purposes.

## 👨‍💻 Developer Notes

This application demonstrates:
- Full-stack TypeScript development
- RBAC implementation with NestJS Guards
- Multi-tenant data filtering
- JWT authentication flow
- Clean architecture & separation of concerns
- Type-safe API integration
- Conditional rendering based on roles
- Professional API documentation

## 🎓 Skills & Technologies Demonstrated

### Backend Development
- **NestJS Framework**
  - Dependency injection and IoC containers
  - Module architecture and feature organization
  - Middleware and interceptors
  - Custom decorators and guards
  - Pipes for validation and transformation

- **Authentication & Security**
  - JWT (JSON Web Tokens) implementation
  - Passport.js integration
  - Password hashing with bcrypt
  - Token-based authentication
  - Session management
  - CORS configuration

- **API Development**
  - RESTful API design
  - HTTP methods (GET, POST, PATCH, DELETE)
  - Request/Response handling
  - Error handling and exceptions
  - Input validation with class-validator
  - Data Transfer Objects (DTOs)

- **Authorization**
  - Role-Based Access Control (RBAC)
  - Guard implementation
  - Permission checking
  - Multi-tenant data isolation
  - Country-based filtering

- **Documentation**
  - OpenAPI/Swagger integration
  - API endpoint documentation
  - Schema definitions
  - Interactive API testing

### Frontend Development
- **React & Next.js**
  - Functional components
  - React Hooks (useState, useEffect, useRouter)
  - Server-Side Rendering (SSR)
  - File-based routing
  - Dynamic routes
  - Protected routes pattern

- **State Management**
  - Local state with useState
  - localStorage for persistence
  - Context management
  - Side effects with useEffect

- **HTTP Client**
  - Axios configuration
  - Request/Response interceptors
  - Bearer token authentication
  - Error handling
  - Async/await patterns

- **UI/UX Development**
  - Tailwind CSS utility classes
  - Responsive design
  - Component composition
  - Conditional rendering
  - Form handling and validation
  - User feedback (alerts, loading states)

### TypeScript Expertise
- **Type System**
  - Interfaces and types
  - Generics
  - Union types
  - Type guards
  - Enums
  - Type inference

- **Advanced TypeScript**
  - Decorator patterns
  - Type-safe DTOs
  - Interface segregation
  - Type composition

### Software Architecture
- **Design Patterns**
  - MVC (Model-View-Controller)
  - Repository pattern
  - Service layer pattern
  - Dependency injection
  - Decorator pattern
  - Guard pattern

- **Architectural Principles**
  - Separation of concerns
  - Single responsibility principle
  - DRY (Don't Repeat Yourself)
  - Modularity and reusability
  - Clean code practices

### DevOps & Tools
- **Development Tools**
  - Node.js and npm
  - Git version control
  - VS Code
  - Hot Module Replacement (HMR)
  - Watch mode development

- **Build Tools**
  - Webpack (via Next.js)
  - TypeScript compiler
  - NestJS CLI
  - PostCSS

### Database & Data Management
- **Data Modeling**
  - Entity relationships
  - In-memory data structures
  - Mock data generation
  - Data filtering and transformation

### Testing & Quality
- **Code Quality**
  - TypeScript type checking
  - ESLint configuration
  - Code formatting with Prettier
  - Input validation

### Security Best Practices
- Password encryption
- JWT token security
- CORS policy
- Input sanitization
- Authorization checks
- Role-based access control

### API Integration
- **HTTP Communication**
  - RESTful conventions
  - Status codes
  - Headers and authentication
  - Request/Response patterns
  - Error responses

### Real-World Concepts
- **Business Logic**
  - Multi-tenancy (country-based isolation)
  - Order management workflow
  - Payment processing flow
  - Role-based permissions
  - User authentication flow

- **Scalability Considerations**
  - Modular architecture
  - Stateless authentication
  - Service-based design
  - Extensible role system

### Soft Skills Demonstrated
- Problem-solving
- System design
- API design
- Documentation writing
- Code organization
- Best practices implementation

---

**Built with ❤️ using NestJS and Next.js**
#   s l o o z e - f o o d - o r d e r i n g - s y s t e m  
 