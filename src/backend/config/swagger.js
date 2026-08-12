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

### 🚀 Structured API Directory & Workflow Guide

#### **1. System Health**
- Verify service uptime, server environment, and active MongoDB database connection.

#### **2. User Management & Authentication**
- Test OTP authentication, user registration, profile retrieval, user settings, and digital vault summary.

#### **3. Referral Program & Advocate Rewards**
- Check referral code validity (\`POST /api/users/check-referral\`).
- Retrieve user referral tracking & aggregated earnings summary (\`GET /api/users/referrals\` & \`GET /api/users/referrals/summary\`).
- **Admin Control**: Fetch all advocate-referee referrals (\`GET /api/referrals/admin/all\`), live metrics (\`GET /api/referrals/admin/stats\`), update status (\`PUT /api/referrals/admin/update-status\`), and delete entries (\`DELETE /api/referrals/admin/{id}\`).

#### **4. KYC Verification Workflow**
- User identity submission, document verification, and Admin KYC review/approval.

#### **5. Agent Waitlist (DGA)**
- Digital Gold Agent waitlist registration, status checks, and Admin bulk status updates.

#### **6. Email & Notifications (AWS SES)**
- Send transactional emails, OTP verification emails, and manage HTML email templates.
      `,
      contact: {
        name: 'FipMoney API Support Team',
        email: 'support@fipmoney.com',
      },
    },
    tags: [
      { name: 'System Health', description: 'System status and database diagnostic endpoints' },
      { name: 'User Management', description: 'User registration, OTP login, profile, and vault management' },
      { name: 'Referral Program', description: 'Referral code validation, reward tracking, and Admin Referral Management' },
      { name: 'KYC Verification', description: 'User KYC identity verification and Admin approval workflows' },
      { name: 'Agent Waitlist', description: 'Digital Gold Agent waitlist registration and Admin bulk management' },
      { name: 'Email Services', description: 'AWS SES email dispatch, OTP notifications, and HTML template management' },
      { name: 'FAQs & Feedback', description: 'FAQ knowledgebase and user feedback management' }
    ],
    servers: [
      {
        url: '/',
        description: 'Current Server',
      },
    ],
    components: {
      schemas: {
        HealthCheckResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'OK' },
            message: { type: 'string', example: 'FipMoney Backend Service is active' },
            timestamp: { type: 'string', example: '2026-08-12T00:00:00.000Z' },
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
            mobileNumber: { type: 'string', example: '9876543210' },
            fullName: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            referralCode: { type: 'string', example: 'FIP100' },
            referredBy: { type: 'string', example: 'ROHAN100' },
            status: { type: 'string', example: 'ACTIVE' },
            createdAt: { type: 'string', example: '2026-08-12T00:00:00.000Z' },
          },
        },
        Referral: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'REF-201' },
            _id: { type: 'string', example: '66a4f91e92d2b4001e4a3b1b' },
            referrer: { type: 'string', example: 'Rohan Verma' },
            referrerMobile: { type: 'string', example: '9811234567' },
            referee: { type: 'string', example: 'Vikas Sharma' },
            refereeMobile: { type: 'string', example: '9999900000' },
            code: { type: 'string', example: 'ROHAN100' },
            reward: { type: 'string', example: '₹100 Gold' },
            rewardAmount: { type: 'number', example: 100 },
            date: { type: 'string', example: '2026-08-08' },
            status: { type: 'string', example: 'Credited' },
            amlScore: { type: 'number', example: 98 }
          }
        },
        ReferralAdminStats: {
          type: 'object',
          properties: {
            totalBonusDistributed: { type: 'string', example: '₹4.85 Lakhs' },
            totalActiveAdvocates: { type: 'string', example: '2,340 Users' },
            conversionRate: { type: 'string', example: '24.8%' },
            totalReferrals: { type: 'integer', example: 3450 },
            flaggedFraudCount: { type: 'integer', example: 12 }
          }
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
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Resource not found or internal server error' },
            error: { type: 'string', example: 'Error details...' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js', './src/backend/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
