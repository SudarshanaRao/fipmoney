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

#### **3. Admin Dashboard & Telemetry**
- Detailed summary telemetry for Admin Dashboard tab (Active Investments, Total Investment sum, Gold Accumulated weight, Returns Generated, Avg User AMT Score, Plan Distribution, and Risk Telemetry).

#### **4. Referral Program & Advocate Rewards**
- Check referral code validity (\`POST /api/users/check-referral\`).
- Retrieve user referral tracking & aggregated earnings summary (\`GET /api/users/referrals\` & \`GET /api/users/referrals/summary\`).
- **Admin Control**: Fetch all advocate-referee referrals (\`GET /api/referrals/admin/all\`), live metrics (\`GET /api/referrals/admin/stats\`), update status (\`PUT /api/referrals/admin/update-status\`), and delete entries (\`DELETE /api/referrals/admin/{id}\`).

#### **5. KYC Verification Workflow**
- User identity submission, document verification, and Admin KYC review/approval.

#### **6. Agent Waitlist (DGA)**
- Digital Gold Agent waitlist registration, status checks, and Admin bulk status updates.

#### **7. Email & Notifications (AWS SES)**
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
      { name: 'Admin Dashboard & Security', description: 'Admin authentication, secret code verification, role management, and dashboard summary telemetry' },
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
        SipPlan: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66a4f91e92d2b4001e4a3b1c' },
            id: { type: 'string', example: 'SIP-101' },
            planId: { type: 'string', example: 'SIP-101' },
            name: { type: 'string', example: 'Daily Savings Plan' },
            minAmount: { type: 'number', example: 10 },
            category: { type: 'string', example: 'Daily Micro-SIP' },
            activeUsers: { type: 'integer', example: 4231 },
            totalInvested: { type: 'string', example: '₹4.23 Cr' },
            goldGram: { type: 'string', example: '1.125 kg' },
            returnsRate: { type: 'string', example: '9.32%' },
            status: { type: 'string', example: 'Active' },
            description: { type: 'string', example: 'Invest small amounts daily starting at just ₹10 into 24K pure gold.' },
            createdAt: { type: 'string', example: '2026-08-01T00:00:00.000Z' },
          },
        },
        BbpsTransaction: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66a4f91e92d2b4001e4a3b1d' },
            txnId: { type: 'string', example: 'BBPS-2026-9812' },
            userId: { type: 'string', example: 'USR-1092' },
            userName: { type: 'string', example: 'Rohan Verma' },
            userPhone: { type: 'string', example: '+91 98765 43210' },
            billerName: { type: 'string', example: 'Airtel India Prepaid' },
            category: { type: 'string', example: 'Mobile Recharge' },
            accountNumber: { type: 'string', example: '9876543210' },
            amount: { type: 'number', example: 349 },
            goldCashbackEarned: { type: 'number', example: 0.005 },
            goldCashbackFormatted: { type: 'string', example: '+0.005 g Gold (₹39)' },
            paymentGateway: { type: 'string', example: 'Setu BBPS NPCI' },
            bbpsRefNo: { type: 'string', example: 'CC01982736451' },
            status: { type: 'string', example: 'Success' },
            createdAt: { type: 'string', example: '2026-08-20T10:45:00.000Z' },
          },
        },
        GoldHolding: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66a4f91e92d2b4001e4a3b1e' },
            auditRefId: { type: 'string', example: 'VLT-2026-9812' },
            vaultLocation: { type: 'string', example: "Mumbai Brink's Vault" },
            custodian: { type: 'string', example: "Brink's India" },
            movementType: { type: 'string', example: 'Bullion Deposit' },
            weightKg: { type: 'number', example: 15.5 },
            weightFormatted: { type: 'string', example: '+15.500 kg' },
            purityCert: { type: 'string', example: 'BIS Hallmarked #MMTC-8921' },
            auditStatus: { type: 'string', example: 'Verified & Insured' },
            createdAt: { type: 'string', example: '2026-08-20T10:45:00.000Z' },
          },
        },
        Admin: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66a4f91e92d2b4001e4a3b1a' },
            name: { type: 'string', example: 'Super Admin' },
            email: { type: 'string', example: 'admin@fipmoney.com' },
            mobile: { type: 'string', example: '9876543210' },
            secretCode: { type: 'string', example: '2787' },
            role: { type: 'string', example: 'Super Admin' },
            status: { type: 'string', example: 'Active' },
            permissions: { type: 'array', items: { type: 'string' }, example: ['all'] },
            lastLogin: { type: 'string', example: '2026-08-20 10:30:00' },
            createdAt: { type: 'string', example: '2026-08-01' },
          },
        },
        AdminDashboardSummary: {
          type: 'object',
          properties: {
            metrics: {
              type: 'object',
              properties: {
                activeInvestments: {
                  type: 'object',
                  properties: {
                    count: { type: 'integer', example: 12458 },
                    growth: { type: 'string', example: '+8.42% vs last month' },
                  },
                },
                totalInvestment: {
                  type: 'object',
                  properties: {
                    numericAmount: { type: 'number', example: 124500000 },
                    formattedAmount: { type: 'string', example: '₹12.45 Cr' },
                    growth: { type: 'string', example: '+10.21% vs last month' },
                  },
                },
                goldAccumulated: {
                  type: 'object',
                  properties: {
                    numericGrams: { type: 'number', example: 3152 },
                    formattedWeight: { type: 'string', example: '3.152 kg' },
                    growth: { type: 'string', example: '+7.31% vs last month' },
                  },
                },
                returnsGenerated: {
                  type: 'object',
                  properties: {
                    numericAmount: { type: 'number', example: 7845000 },
                    formattedAmount: { type: 'string', example: '₹78.45 L' },
                    growth: { type: 'string', example: '+9.18% vs last month' },
                  },
                },
                avgUserAmtScore: {
                  type: 'object',
                  properties: {
                    score: { type: 'number', example: 88.4 },
                    maxScore: { type: 'integer', example: 100 },
                    riskProfile: { type: 'string', example: 'Low Risk Profile' },
                  },
                },
              },
            },
            planDistribution: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Daily Savings' },
                  value: { type: 'integer', example: 4231 },
                  percentage: { type: 'string', example: '33.9%' },
                  color: { type: 'string', example: '#7C3AED' },
                },
              },
            },
            kycStatusDistribution: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Verified' },
                  value: { type: 'integer', example: 6352 },
                  percentage: { type: 'string', example: '72.8%' },
                  color: { type: 'string', example: '#10B981' },
                },
              },
            },
            amtSecurityTelemetry: {
              type: 'object',
              properties: {
                highRiskCount: { type: 'integer', example: 1 },
                flaggedUsers: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string', example: 'Deepak Mehra' },
                      score: { type: 'number', example: 34 },
                      mobile: { type: 'string', example: '+91 95001 23456' },
                    },
                  },
                },
              },
            },
            overviewTrend: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  date: { type: 'string', example: '08 May' },
                  val: { type: 'number', example: 0.2 },
                },
              },
            },
            timestamp: { type: 'string', example: '2026-08-20T11:25:00.000Z' },
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
  apis: [
    './routes/*.js',
    './src/backend/routes/*.js',
    './controllers/*.js',
    './src/backend/controllers/*.js'
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
