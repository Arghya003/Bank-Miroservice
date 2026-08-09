export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Bank Microservices API Documentation",
    version: "1.0.0",
    description:
      "Interactive API documentation for Bank Microservices Ecosystem (Auth Service, Account Service, and Transaction Service via API Gateway).",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "API Gateway",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token obtained from `/api/v1/auth/login`",
      },
    },
    schemas: {
      RegisterDto: {
        type: "object",
        required: ["firstName", "lastName", "email", "password"],
        properties: {
          firstName: { type: "string", example: "John" },
          lastName: { type: "string", example: "Doe" },
          email: { type: "string", example: "john.doe@example.com" },
          password: { type: "string", example: "SecurePassword123!" },
        },
      },
      LoginDto: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "john.doe@example.com" },
          password: { type: "string", example: "SecurePassword123!" },
        },
      },
      CreateAccountDto: {
        type: "object",
        properties: {
          accountName: { type: "string", example: "Savings Account" },
          accountType: { type: "string", enum: ["SAVINGS", "CURRENT"], example: "SAVINGS" },
        },
      },
      InternalTransactionDto: {
        type: "object",
        required: ["accountNumber", "amount", "type"],
        properties: {
          accountNumber: { type: "string", example: "ACC17389201" },
          amount: { type: "number", example: 500 },
          type: { type: "string", enum: ["CREDIT", "DEBIT"], example: "CREDIT" },
        },
      },
      TransferDto: {
        type: "object",
        required: ["sourceAccountNumber", "destinationAccountNumber", "amount"],
        properties: {
          sourceAccountNumber: { type: "string", example: "ACC17389201" },
          destinationAccountNumber: { type: "string", example: "ACC98210344" },
          amount: { type: "number", example: 150 },
          transactionType: { type: "string", example: "transfer" },
          note: { type: "string", example: "Payment for services" },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        summary: "API Gateway Health Check",
        tags: ["System"],
        responses: {
          "200": { description: "API Gateway is running" },
        },
      },
    },
    "/api/v1/auth/register": {
      post: {
        summary: "Register a new user",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterDto" },
            },
          },
        },
        responses: {
          "201": { description: "User registered successfully" },
          "400": { description: "Invalid input or email already exists" },
        },
      },
    },
    "/api/v1/auth/login": {
      post: {
        summary: "Log in user and retrieve JWT token",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginDto" },
            },
          },
        },
        responses: {
          "200": { description: "Authentication successful, returns JWT token" },
          "401": { description: "Invalid credentials" },
        },
      },
    },
    "/api/v1/auth/logout": {
      post: {
        summary: "Log out user and invalidate session",
        tags: ["Authentication"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Logged out successfully" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/v1/accounts": {
      get: {
        summary: "List all bank accounts owned by the user",
        tags: ["Accounts"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Returns array of accounts" },
          "401": { description: "Unauthorized" },
        },
      },
      post: {
        summary: "Create a new bank account",
        tags: ["Accounts"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateAccountDto" },
            },
          },
        },
        responses: {
          "201": { description: "Account created successfully" },
          "400": { description: "Account already exists or invalid data" },
        },
      },
    },
    "/api/v1/accounts/{accountNumber}": {
      delete: {
        summary: "Delete an account by account number",
        tags: ["Accounts"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "accountNumber",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "ACC17389201",
          },
        ],
        responses: {
          "200": { description: "Account deleted successfully" },
          "404": { description: "Account not found" },
        },
      },
    },
    "/api/v1/accounts/internal/transaction": {
      post: {
        summary: "Perform direct manual deposit or withdrawal on an account",
        tags: ["Accounts"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/InternalTransactionDto" },
            },
          },
        },
        responses: {
          "200": { description: "Internal transaction completed" },
          "400": { description: "Insufficient balance or invalid data" },
        },
      },
    },
    "/api/v1/transaction/transfer": {
      post: {
        summary: "Initiate an event-driven fund transfer via Kafka Saga",
        tags: ["Transactions"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TransferDto" },
            },
          },
        },
        responses: {
          "201": { description: "Transaction initiated, returns transactionId" },
          "500": { description: "Failed to initiate transaction" },
        },
      },
    },
    "/api/v1/transaction/{transactionId}": {
      get: {
        summary: "Get current status and details of a transaction",
        tags: ["Transactions"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "transactionId",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "TXN_123456789",
          },
        ],
        responses: {
          "200": { description: "Transaction details returned" },
          "404": { description: "Transaction not found" },
        },
      },
    },
  },
};
