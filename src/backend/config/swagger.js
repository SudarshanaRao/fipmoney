import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FipMoney API Documentation & Interactive Testing Hub',
      version: '1.0.0',
      description: `
### 🔒 Security & Confidentiality Notice
This API documentation is hosted on an obfuscated secret route (\`/${process.env.SWAGGER_SECRET_PATH || 'docs-sec-9f8a3d7b2c'}\`) and protected by authentication.

---

### 🚀 Step-by-Step API Testing Walkthrough Guidelines

#### **Step 1: Check System & Database Connection Status**
1. Expand the **System Health** tag below.
2. Click on **\`GET /api/health\`** → **Try it out** → **Execute**.
3. Verify that the response status is \`200 OK\` and \`database.status\` shows **"Connected"** (Active DB: \`fipmoney-dev\`).

#### **Step 2: User Registration / Authentication Flow**
1. Expand the **User Management** tag below.
2. Click on **\`POST /api/users/auth\`** → **Try it out**.
3. In the Request Body, enter a 10-digit mobile number (e.g., \`{"mobile": "9876543210", "fullName": "Test User"}\`).
4. Click **Execute**.
5. Check the response body for \`success: true\` and copy the returned user \`id\` or \`mobile\`.

#### **Step 3: Fetch All Registered Users**
1. Click on **\`GET /api/users\`** → **Try it out** → **Execute**.
2. Review the list of users stored in the \`dev_users\` table/collection in MongoDB.

#### **Step 4: Fetch User Details by ID**
1. Click on **\`GET /api/users/{id}\`** → **Try it out**.
2. Paste the user \`id\` copied from Step 2 into the parameter field.
3. Click **Execute** and verify user profile details.

#### **Step 5: Digital Vault & Portfolio Operations**
1. Expand **Digital Vault & Portfolio Management** tag below.
2. Click **\`POST /api/users/vault/buy\`** to buy gold/silver and store holdings & transaction log in MongoDB.
3. Click **GET /api/users/vault/summary?mobile=...** to retrieve gold vault value, silver vault value, cash balance, and portfolio value.
      `,
      contact: {
        name: 'FipMoney API Support Team',
        email: 'support@fipmoney.com',
      },
    },
    servers: [
      {
        url: 'https://prod-server.fipmoney.com',
        description: 'Development Local Server',
      },
    ],
    components: {
      schemas: {
        HealthCheckResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'OK' },
            message: { type: 'string', example: 'FipMoney Backend Service is active' },
            timestamp: { type: 'string', example: '2026-07-27T11:45:00.000Z' },
            uptimeSeconds: { type: 'number', example: 120 },
            database: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'Connected' },
                databaseName: { type: 'string', example: 'fipmoney-dev' },
                host: { type: 'string', example: 'ac-qyseut3-shard-00-01.vgyqf0n.mongodb.net' },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66a4f91e92d2b4001e4a3b1a' },
            mobile: { type: 'string', example: '9876543210' },
            fullName: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            isVerified: { type: 'boolean', example: true },
            role: { type: 'string', example: 'user' },
            createdAt: { type: 'string', example: '2026-07-27T11:45:00.000Z' },
            updatedAt: { type: 'string', example: '2026-07-27T11:45:00.000Z' },
          },
        },
        AuthRequest: {
          type: 'object',
          required: ['mobile'],
          properties: {
            mobile: { type: 'string', example: '9876543210', description: '10-digit mobile number' },
            fullName: { type: 'string', example: 'John Doe', description: 'Optional user full name' },
            email: { type: 'string', example: 'john@example.com', description: 'Optional email address' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation completed successfully' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Resource not found or internal server error' },
            stack: { type: 'string', example: 'Error: ...' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js', './src/backend/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
