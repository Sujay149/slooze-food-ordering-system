# Quick Start Guide

## Installation

### Backend
```bash
cd backend
npm install
npm run start:dev
```
Server runs on http://localhost:3001

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs on http://localhost:3000

## Test Credentials

| Email | Password | Role | Country |
|-------|----------|------|---------|
| admin@food.com | admin123 | Admin | India |
| manager.india@food.com | manager123 | Manager | India |
| manager.america@food.com | manager123 | Manager | America |
| member.india@food.com | member123 | Member | India |
| member.america@food.com | member123 | Member | America |

## Testing RBAC

### Test 1: Member Restrictions
1. Login as `member.india@food.com`
2. View restaurants (✅ Allowed)
3. Create order (✅ Allowed)
4. Try to place order (❌ Button hidden)
5. Try to cancel order (❌ Button hidden)

### Test 2: Manager Access
1. Login as `manager.india@food.com`
2. View only Indian restaurants
3. Create and place orders (✅ Allowed)
4. Cancel orders (✅ Allowed)
5. Try to update payment methods (❌ 403 Forbidden)

### Test 3: Admin Full Access
1. Login as `admin@food.com`
2. View ALL restaurants (India + America)
3. Full CRUD on all resources
4. Update payment methods (✅ Allowed)

## API Documentation

Visit http://localhost:3001/api for Swagger UI

## Postman Collection

Import `postman_collection.json` into Postman for easy API testing.
