# 🚀 InvoiceZap API Documentation

## **Overview**
This document outlines all available API endpoints for the InvoiceZap application. All endpoints return JSON responses and use standard HTTP status codes.

---

## **🔐 Authentication APIs**

### **POST /api/auth/login**
Authenticate a user and return a token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "plan": "pro",
    "company": "Acme Corp"
  },
  "token": "mock_token_user_123_1234567890"
}
```

### **POST /api/auth/register**
Register a new user account.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "Jane Doe",
  "company": "Startup Inc",
  "plan": "free"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_456",
    "email": "newuser@example.com",
    "name": "Jane Doe",
    "plan": "free",
    "company": "Startup Inc"
  },
  "token": "mock_token_user_456_1234567890"
}
```

### **POST /api/auth/logout**
Logout user and invalidate token.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## **👥 Client Management APIs**

### **GET /api/clients**
Get all clients for a user with optional filtering.

**Query Parameters:**
- `userId` (required): User ID
- `search` (optional): Search term for client names
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "clients": [
    {
      "id": "client_123",
      "name": "Acme Corp",
      "email": "contact@acme.com",
      "phone": "+1-555-0123",
      "address": "123 Business St, City, State 12345"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### **POST /api/clients**
Create a new client.

**Request Body:**
```json
{
  "name": "New Client Inc",
  "email": "hello@newclient.com",
  "phone": "+1-555-9999",
  "address": "456 New St, City, State 12345",
  "userId": "user_123"
}
```

### **GET /api/clients/[id]**
Get a specific client by ID.

**Response:**
```json
{
  "id": "client_123",
  "name": "Acme Corp",
  "email": "contact@acme.com",
  "phone": "+1-555-0123",
  "address": "123 Business St, City, State 12345",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### **PUT /api/clients/[id]**
Update an existing client.

**Request Body:**
```json
{
  "name": "Updated Client Name",
  "email": "newemail@client.com"
}
```

### **DELETE /api/clients/[id]**
Delete a client.

**Response:**
```json
{
  "message": "Client deleted successfully"
}
```

---

## **📄 Invoice Management APIs**

### **GET /api/invoices**
Get all invoices for a user with optional filtering.

**Query Parameters:**
- `userId` (required): User ID
- `search` (optional): Search term
- `status` (optional): Invoice status (draft, sent, paid, overdue)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "invoices": [
    {
      "id": "inv_123",
      "number": "INV-001",
      "clientId": "client_123",
      "clientName": "Acme Corp",
      "amount": 1500.00,
      "status": "sent",
      "dueDate": "2024-02-15",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

### **POST /api/invoices**
Create a new invoice.

**Request Body:**
```json
{
  "clientId": "client_123",
  "userId": "user_123",
  "items": [
    {
      "description": "Web Development Services",
      "quantity": 1,
      "unitPrice": 1500.00,
      "amount": 1500.00
    }
  ],
  "dueDate": "2024-02-15",
  "notes": "Payment due within 30 days"
}
```

### **GET /api/invoices/[id]**
Get a specific invoice by ID.

### **PUT /api/invoices/[id]**
Update an existing invoice.

### **DELETE /api/invoices/[id]**
Delete an invoice.

---

## **🎨 Template Management APIs**

### **GET /api/templates**
Get all templates with optional filtering.

**Query Parameters:**
- `category` (optional): Template category
- `search` (optional): Search term
- `userId` (optional): User ID for custom templates

**Response:**
```json
{
  "templates": [
    {
      "id": "template_123",
      "name": "Professional Invoice",
      "category": "business",
      "isCustom": false,
      "preview": "base64_image_data",
      "config": { /* template configuration */ }
    }
  ]
}
```

### **POST /api/templates**
Create a new custom template.

**Request Body:**
```json
{
  "name": "My Custom Template",
  "userId": "user_123",
  "category": "creative",
  "config": {
    "colors": { "primary": "#3B82F6", "secondary": "#1F2937" },
    "layout": "modern",
    "sections": ["header", "items", "totals", "footer"]
  }
}
```

### **GET /api/templates/[id]**
Get a specific template by ID.

### **PUT /api/templates/[id]**
Update an existing template.

### **DELETE /api/templates/[id]**
Delete a custom template.

### **POST /api/templates/duplicate**
Duplicate an existing template.

**Request Body:**
```json
{
  "templateId": "template_123",
  "userId": "user_456",
  "newName": "Copy of Professional Invoice"
}
```

### **POST /api/templates/import**
Import a template from external source.

**Request Body:**
```json
{
  "templateData": {
    "name": "Imported Template",
    "config": { /* template configuration */ }
  },
  "userId": "user_123"
}
```

### **POST /api/templates/export**
Export a template.

**Request Body:**
```json
{
  "templateId": "template_123",
  "userId": "user_123",
  "format": "json"
}
```

---

## **🎯 Template Recommendations APIs**

### **POST /api/recommendations**
Get personalized template recommendations.

**Request Body:**
```json
{
  "userProfile": {
    "industry": "technology",
    "businessSize": "startup",
    "invoiceFrequency": "monthly",
    "designPreference": "modern",
    "colorScheme": "professional"
  },
  "limit": 5
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "templateId": "template_123",
      "name": "Professional Invoice",
      "score": 95,
      "reasons": ["Perfect for tech startups", "Modern design", "Professional color scheme"]
    }
  ],
  "userProfile": { /* user profile data */ },
  "generatedAt": "2024-01-15T10:00:00Z"
}
```

### **GET /api/recommendations/quick-start**
Get quick start profile recommendations.

**Query Parameters:**
- `profile` (optional): Specific profile type

**Response:**
```json
{
  "profiles": [
    {
      "id": "freelancer",
      "name": "Freelancer",
      "description": "Perfect for independent contractors",
      "attributes": { /* profile attributes */ }
    }
  ]
}
```

---

## **👤 User Profile APIs**

### **GET /api/user/profile**
Get user profile information.

**Query Parameters:**
- `userId` (required): User ID

**Response:**
```json
{
  "id": "user_123",
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Corp",
  "plan": "pro",
  "preferences": {
    "defaultCurrency": "USD",
    "defaultLanguage": "en",
    "timezone": "America/New_York"
  }
}
```

### **PUT /api/user/profile**
Update user profile information.

**Request Body:**
```json
{
  "userId": "user_123",
  "name": "John Smith",
  "company": "New Company Inc",
  "preferences": {
    "defaultCurrency": "EUR"
  }
}
```

---

## **📊 Analytics APIs**

### **GET /api/analytics/dashboard**
Get dashboard analytics and metrics.

**Query Parameters:**
- `userId` (required): User ID
- `period` (optional): Analysis period in days (default: 30)

**Response:**
```json
{
  "revenue": {
    "total": 15000.00,
    "thisMonth": 5000.00,
    "lastMonth": 4500.00,
    "growth": 11.11
  },
  "invoices": {
    "total": 45,
    "paid": 38,
    "pending": 5,
    "overdue": 2
  },
  "clients": {
    "total": 25,
    "active": 20,
    "newThisMonth": 3
  }
}
```

### **POST /api/analytics/reports**
Generate business reports.

**Request Body:**
```json
{
  "userId": "user_123",
  "reportType": "revenue",
  "filters": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31",
    "clientId": "client_123"
  }
}
```

**Report Types:**
- `revenue`: Revenue analysis and trends
- `clients`: Client performance and metrics
- `invoices`: Invoice statistics and patterns
- `templates`: Template usage analytics

---

## **💳 Stripe Payment APIs**

### **POST /api/stripe/create-checkout-session**
Create Stripe checkout session for subscriptions.

### **POST /api/stripe/create-payment-intent**
Create payment intent for one-time invoice payments.

### **POST /api/stripe/cancel-subscription**
Cancel Stripe subscription.

### **POST /api/stripe/webhook**
Handle Stripe webhook events.

---

## **📧 Email Service APIs**

### **POST /api/email/send-email**
Send general emails.

### **POST /api/email/send-invoice**
Send invoice emails to clients.

---

## **🔧 Error Handling**

All APIs return consistent error responses:

```json
{
  "error": "Error message description",
  "status": 400
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

---

## **🚀 Getting Started**

1. **Set up environment variables** in `.env.local`
2. **Start the development server** with `npm run dev`
3. **Test endpoints** using tools like Postman or curl
4. **Integrate with frontend** using fetch or axios

---

## **📝 Notes**

- All endpoints currently use mock data (localStorage)
- Replace mock implementations with real database calls when ready
- Add proper authentication middleware for production
- Implement rate limiting for production use
- Add request validation and sanitization
