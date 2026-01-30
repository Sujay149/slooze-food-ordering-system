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

### Role Overview

#### 🔴 Admin
- **Who**: System administrator with global privileges
- **Scope**: All countries
- **Permissions**: Full CRUD on all resources
- **Use Case**: Platform management, cross-country operations

#### 🟡 Manager
- **Who**: Restaurant/region manager
- **Scope**: Single country only
- **Permissions**: 
  - View restaurants, menus, orders within assigned country
  - Finalize orders (transition from CREATED → PLACED)
  - Cancel orders
  - Cannot modify payment methods
- **Use Case**: Regional order fulfillment and management

#### 🟢 Member
- **Who**: End-user customer
- **Scope**: Single country only
- **Permissions**: 
  - Browse restaurants and menus within assigned country
  - Create draft orders (status: CREATED)
  - View own orders
  - **Cannot** place, finalize, or cancel orders
  - **Cannot** manage payment methods
- **Use Case**: Browsing and creating orders for manager approval

> **Note**: Members represent customers who can add items to cart and create draft orders, but cannot complete checkout. This simulates a B2B scenario where orders require managerial approval before placement.

### Permission Matrix

| Action | Admin | Manager | Member |
|--------|-------|---------|--------|
| View restaurants & menus | ✅ All | ✅ Own country | ✅ Own country |
| Create order (draft) | ✅ | ✅ | ✅ |
| Place order (finalize) | ✅ | ✅ | ❌ |
| Cancel order | ✅ | ✅ | ❌ |
| View all orders | ✅ All | ✅ Own country | ✅ Own only |
| Manage payment methods | ✅ | ❌ | ❌ |

## 📦 Order Lifecycle

### Order States

```
CREATED (Draft)  →  PLACED (Finalized)  →  CANCELLED
```

#### State Descriptions

| State | Description | Who Can Create |
|-------|-------------|----------------|
| **CREATED** | Draft order, items selected but not finalized | All roles |
| **PLACED** | Order confirmed and submitted for processing | Admin, Manager only |
| **CANCELLED** | Order terminated | Admin, Manager only |

### State Transitions

```
┌─────────────────────────────────────────────────────────────┐
│ Member creates order                                         │
│ POST /orders  →  Status: CREATED                            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ (Member stops here)
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Manager/Admin finalizes order                                │
│ PATCH /orders/:id/place  →  Status: PLACED                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ (Optional)
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Manager/Admin cancels order                                  │
│ DELETE /orders/:id  →  Status: CANCELLED                    │
└─────────────────────────────────────────────────────────────┘
```

### Business Logic

- **Members** create orders but cannot finalize them (simulates order approval workflow)
- **Managers** handle order placement and fulfillment within their country
- **Admins** have override access for cross-country operations
- Orders include calculated `totalAmount` based on menu item prices

## 📁 Project Structure

```
food-ordering-system/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # JWT authentication
│   │   ├── guards/         # RolesGuard, AuthGuard
│   │   ├── order/          # Order CRUD + state management
│   │   ├── restaurant/     # Restaurant data
│   │   ├── menu/           # Menu items
│   │   ├── payment/        # Payment method stubs
│   │   ├── decorators/     # @Roles(), @CurrentUser()
│   │   └── common/         # Shared types & enums
│   └── package.json
│
└── frontend/               # Next.js frontend
    ├── src/
    │   ├── pages/          # File-based routing
    │   ├── components/     # ProtectedRoute, RoleBased
    │   ├── lib/            # API client, auth helpers
    │   └── types/          # TypeScript interfaces
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Quick Start

```bash
# Backend
cd backend
npm install
npm run start:dev    # Runs on http://localhost:3001

# Frontend (new terminal)
cd frontend
npm install
npm run dev          # Runs on http://localhost:3000
```

### Test Accounts

| Email | Password | Role | Country |
|-------|----------|------|---------|
| admin@food.com | admin123 | Admin | India |
| manager.india@food.com | manager123 | Manager | India |
| manager.america@food.com | manager123 | Manager | America |
| member.india@food.com | member123 | Member | India |
| member.america@food.com | member123 | Member | America |

## 📚 API Documentation

Once the backend is running, visit **http://localhost:3001/api** for interactive Swagger documentation.

### Core Endpoints

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST | `/auth/login` | Public | User login |
| GET | `/auth/profile` | All | Get current user |
| GET | `/restaurants` | All | List restaurants (country-filtered) |
| GET | `/menu/restaurant/:id` | All | Get menu items |
| POST | `/orders` | All | Create draft order |
| PATCH | `/orders/:id/place` | Admin, Manager | Finalize order |
| DELETE | `/orders/:id` | Admin, Manager | Cancel order |
| GET | `/orders` | All | List orders (filtered by role) |
| POST | `/payment-methods` | Admin | Add payment method |

## 🎯 Why This Architecture?

### NestJS for Backend
- **Built-in Guard system**: First-class support for RBAC via `@UseGuards()` and `@Roles()`
- **Dependency Injection**: Clean, testable service architecture
- **TypeScript-first**: Strong typing across DTOs, services, and controllers
- **Decorator-based**: Readable, declarative authorization rules

### Next.js for Frontend
- **File-based routing**: Simple, intuitive page structure
- **SSR Capability**: Better SEO and initial load performance
- **React Ecosystem**: Leverage existing component libraries
- **TypeScript Support**: End-to-end type safety

### JWT for Authentication
- **Stateless**: No server-side session storage required
- **Scalable**: Works across distributed systems
- **Portable**: Token contains user context (role, country)
- **Standard**: Industry-standard authentication mechanism

### Country-Based Filtering
- Implemented in **service layer**, not database queries
- Allows easy migration to real DB with WHERE clauses
- Centralizes multi-tenancy logic

## ⚠️ Assumptions & Constraints

### Technical Limitations

1. **In-Memory Data Store**
   - No database (MongoDB, PostgreSQL, etc.)
   - Data resets on server restart
   - Sufficient for demonstrating RBAC patterns

2. **Mock Payment System**
   - No real payment gateway integration (Stripe, PayPal)
   - Payment methods are stored objects, not processed

3. **One Country Per User**
   - Users cannot switch countries
   - Simplifies permission logic

4. **No Real-Time Features**
   - No WebSockets or push notifications
   - Standard REST API only

### Focus Areas

This project prioritizes:
- ✅ Backend architecture and RBAC implementation
- ✅ JWT authentication flow
- ✅ Multi-tenant data isolation
- ✅ TypeScript best practices

This project does NOT include:
- ❌ Production-grade UI/UX polish
- ❌ Comprehensive error handling for edge cases
- ❌ Unit/integration tests (can be added)
- ❌ Real database migrations
- ❌ Email notifications or third-party integrations

## 🔐 Security Considerations

### Current Implementation

1. **JWT in localStorage**
   - Tokens stored in browser `localStorage`
   - Vulnerable to XSS attacks if malicious scripts are injected

2. **Password Hashing**
   - Bcrypt with 10 salt rounds
   - Secure for demonstration purposes

3. **CORS Enabled**
   - Configured for `localhost:3000` and `localhost:3001`
   - Should be restricted in production

### Production Recommendations

For a production system, consider:

- **HttpOnly Cookies**: Store JWT in `HttpOnly` cookies instead of `localStorage` to prevent XSS access
- **CSRF Tokens**: Implement CSRF protection when using cookies
- **Refresh Tokens**: Short-lived access tokens + long-lived refresh tokens
- **Rate Limiting**: Prevent brute-force attacks on `/auth/login`
- **HTTPS Only**: Enforce TLS in production
- **Environment Secrets**: Store `JWT_SECRET` in environment variables or secret managers
- **Input Sanitization**: Add XSS protection middleware

> **Note**: This implementation favors simplicity and readability over production-grade security. For real applications, follow OWASP guidelines and use HttpOnly cookies for token storage.

## 📖 Implementation Highlights

### Backend Patterns

```typescript
// RolesGuard implementation
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get('roles', context.getHandler());
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some(role => user.role === role);
  }
}

// Usage in controller
@Post(':id/place')
@Roles(UserRole.ADMIN, UserRole.MANAGER)
@UseGuards(AuthGuard('jwt'), RolesGuard)
placeOrder(@Param('id') id: string) {
  // Only Admin and Manager reach here
}
```

### Frontend Patterns

```tsx
// Protected Route HOC
const ProtectedRoute = ({ children }) => {
  const token = getToken();
  if (!token) router.push('/login');
  return <>{children}</>;
};

// Role-based UI component
<RoleBased roles={[UserRole.ADMIN, UserRole.MANAGER]}>
  <button onClick={placeOrder}>Finalize Order</button>
</RoleBased>
```

## 🧪 Testing Scenarios

### Scenario 1: Member Workflow
1. Login as `member.india@food.com`
2. Browse Indian restaurants only
3. Add items to cart and create order
4. See order status as "CREATED"
5. **Cannot** see "Place Order" button (role-restricted)

### Scenario 2: Manager Workflow
1. Login as `manager.india@food.com`
2. See all orders in India (including Member orders)
3. Select a CREATED order
4. Click "Place Order" to finalize
5. Order status changes to "PLACED"

### Scenario 3: Admin Workflow
1. Login as `admin@food.com`
2. See restaurants and orders from **all countries**
3. Full CRUD access to all resources

## 📄 License

This project is for demonstration and educational purposes.

---

**Built with ❤️ using NestJS and Next.js**
