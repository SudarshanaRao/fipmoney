"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Users, BookOpen, Share2, Bookmark, ChevronRight, Star, Coins, TrendingUp, CreditCard, Calculator, Shield, CheckCircle, AlertCircle, Info, Lightbulb, Target, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface GuideReaderProps {
  onBack: () => void;
  onNavigateToGuide: (guideId: string) => void;
  guideId: string;
}

interface GuideContent {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  publishedDate: string;
  views: string;
  author: string;
  content: {
    introduction: string;
    sections: {
      title: string;
      content: string;
      steps?: string[];
      tips?: string[];
      warning?: string;
    }[];
    conclusion: string;
    keyTakeaways: string[];
  };
}

const guideContents: { [key: string]: GuideContent } = {
  '1': {
    id: '1',
    title: 'How to Start Your Digital Gold Investment Journey',
    description: 'A complete beginner\'s guide to investing in digital gold, understanding market dynamics, and building a strong foundation for wealth creation.',
    category: 'gold-investment',
    readTime: '8 min read',
    difficulty: 'Beginner',
    tags: ['Digital Gold', 'Investment Basics', 'Wealth Building'],
    publishedDate: '2024-01-15',
    views: '12.5K',
    author: 'FipMoney Investment Team',
    content: {
      introduction: 'Digital gold investment has revolutionized how Indians invest in precious metals. Unlike traditional gold investment methods, digital gold offers convenience, security, and flexibility that makes it perfect for modern investors.',
      sections: [
        {
          title: 'What is Digital Gold?',
          content: 'Digital gold represents physical gold stored in secure vaults, backed by actual gold reserves. Each gram you purchase is equivalent to physical gold, but stored digitally for easy management and trading.',
          tips: [
            'Digital gold is backed 1:1 with physical gold',
            'You can start investing with as little as ₹100',
            'All digital gold is stored in secure, insured vaults'
          ]
        },
        {
          title: 'Why Choose Digital Gold Over Physical Gold?',
          content: 'Digital gold eliminates the hassles of physical gold investment while retaining all the benefits. No storage concerns, no making charges, and instant liquidity make it superior for most investors.',
          steps: [
            'No storage or security concerns',
            'No making charges or wastage',
            'Instant buying and selling',
            'Fractional ownership possible',
            'Complete transparency in pricing'
          ]
        },
        {
          title: 'Getting Started with FipMoney',
          content: 'Starting your digital gold journey with FipMoney is simple and secure. Our platform is designed to make gold investment accessible to everyone.',
          steps: [
            'Download the FipMoney app and complete KYC',
            'Link your bank account for seamless transactions',
            'Start with a small investment (minimum ₹100)',
            'Set up regular SIP for systematic investment',
            'Monitor your portfolio growth over time'
          ]
        },
        {
          title: 'Investment Strategies for Beginners',
          content: 'The best approach for beginners is to start small and invest regularly. This strategy, known as rupee-cost averaging, helps reduce the impact of price volatility.',
          tips: [
            'Start with ₹1,000-5,000 monthly SIP',
            'Invest for at least 3-5 years for better returns',
            'Don\'t try to time the market',
            'Treat gold as 5-10% of your portfolio'
          ],
          warning: 'Never invest more than you can afford to lose. Gold prices can be volatile in the short term.'
        }
      ],
      conclusion: 'Digital gold investment through FipMoney offers a modern, secure way to build wealth through precious metals. Start small, invest regularly, and watch your golden portfolio grow over time.',
      keyTakeaways: [
        'Digital gold is backed by physical gold stored securely',
        'Start with small amounts and invest regularly',
        'Use SIP for systematic wealth building',
        'Keep gold as 5-10% of your total portfolio',
        'Focus on long-term investment for better returns'
      ]
    }
  },
  '2': {
    id: '2',
    title: 'Gold SIP vs Regular SIP: Which is Better?',
    description: 'Compare the benefits of Gold SIP with traditional mutual fund SIPs and learn when to choose each investment option.',
    category: 'gold-investment',
    readTime: '6 min read',
    difficulty: 'Intermediate',
    tags: ['Gold SIP', 'Comparison', 'Investment Strategy'],
    publishedDate: '2024-01-10',
    views: '8.2K',
    author: 'FipMoney Research Team',
    content: {
      introduction: 'Both Gold SIP and regular mutual fund SIPs are excellent investment tools, but they serve different purposes in your portfolio. Understanding their differences helps you make better investment decisions.',
      sections: [
        {
          title: 'Gold SIP: The Basics',
          content: 'Gold SIP allows you to invest a fixed amount in digital gold every month, helping you accumulate gold gradually while benefiting from rupee-cost averaging.',
          steps: [
            'Fixed monthly investment in gold',
            'Automatic gold accumulation',
            'Protection against inflation',
            'Portfolio diversification'
          ]
        },
        {
          title: 'Regular SIP: The Traditional Choice',
          content: 'Regular SIPs invest in mutual funds, offering exposure to equity and debt markets. They\'re designed for long-term wealth creation through market growth.',
          steps: [
            'Investment in equity/debt mutual funds',
            'Professional fund management',
            'Higher growth potential',
            'Tax benefits available'
          ]
        },
        {
          title: 'When to Choose Gold SIP',
          content: 'Gold SIP is ideal when you want portfolio diversification, inflation protection, or a stable store of value during market volatility.',
          tips: [
            'During high market volatility',
            'For portfolio diversification (5-10%)',
            'As hedge against inflation',
            'For cultural/emotional value'
          ]
        },
        {
          title: 'When to Choose Regular SIP',
          content: 'Regular SIP is better for long-term wealth creation, retirement planning, and when you can handle market volatility for higher returns.',
          tips: [
            'For long-term wealth creation',
            'When you have 10+ year investment horizon',
            'For retirement planning',
            'When you can handle market volatility'
          ]
        }
      ],
      conclusion: 'The ideal approach is to use both Gold SIP and regular SIP as complementary investment tools. Allocate 80-90% to regular SIP for growth and 10-20% to Gold SIP for stability and diversification.',
      keyTakeaways: [
        'Gold SIP provides stability and inflation protection',
        'Regular SIP offers higher growth potential',
        'Use both for optimal portfolio diversification',
        'Gold should be 5-10% of total portfolio',
        'Regular SIP should form the core of your investments'
      ]
    }
  },
  '3': {
    id: '3',
    title: 'Understanding Gold Price Movements and Market Trends',
    description: 'Learn how to analyze gold price patterns, understand market factors, and make informed investment decisions.',
    category: 'gold-investment',
    readTime: '10 min read',
    difficulty: 'Advanced',
    tags: ['Market Analysis', 'Price Trends', 'Technical Analysis'],
    publishedDate: '2024-01-08',
    views: '15.1K',
    author: 'FipMoney Market Analysis Team',
    content: {
      introduction: 'Gold prices are influenced by various global and domestic factors. Understanding these factors and price patterns can help you make better investment timing decisions.',
      sections: [
        {
          title: 'Factors Affecting Gold Prices',
          content: 'Gold prices are influenced by economic indicators, geopolitical events, currency movements, and market sentiment. Understanding these helps predict price directions.',
          steps: [
            'US Dollar strength/weakness',
            'Global economic uncertainties',
            'Inflation rates and expectations',
            'Central bank policies',
            'Geopolitical tensions'
          ]
        },
        {
          title: 'Reading Gold Price Charts',
          content: 'Technical analysis helps identify trends and potential entry/exit points. Learn to read basic chart patterns and indicators.',
          tips: [
            'Look for support and resistance levels',
            'Identify trend lines and breakouts',
            'Use moving averages for trend confirmation',
            'Watch for volume patterns'
          ]
        },
        {
          title: 'Seasonal Patterns in Gold',
          content: 'Gold prices often follow seasonal patterns influenced by festivals, wedding seasons, and harvest periods in India.',
          steps: [
            'Diwali and wedding season demand (Oct-Dec)',
            'Post-harvest buying (Apr-May)',
            'Akshaya Tritiya festival impact',
            'Monsoon season effects'
          ]
        },
        {
          title: 'Making Investment Decisions',
          content: 'Use fundamental and technical analysis together, but remember that SIP reduces the need for perfect timing.',
          warning: 'Never try to time the market perfectly. Even experts get it wrong. SIP helps average out price fluctuations.'
        }
      ],
      conclusion: 'While understanding gold price movements is valuable, the most successful strategy for retail investors is regular SIP investment regardless of short-term price movements.',
      keyTakeaways: [
        'Multiple factors influence gold prices',
        'Technical analysis helps but isn\'t foolproof',
        'Seasonal patterns exist but aren\'t guaranteed',
        'SIP reduces the need for market timing',
        'Focus on long-term trends, not daily fluctuations'
      ]
    }
  },
  '4': {
    id: '4',
    title: 'Digital Gold vs Physical Gold: Complete Comparison',
    description: 'Explore the differences between digital and physical gold investments, including costs, storage, and liquidity factors.',
    category: 'gold-investment',
    readTime: '7 min read',
    difficulty: 'Beginner',
    tags: ['Digital Gold', 'Physical Gold', 'Investment Options'],
    publishedDate: '2024-01-05',
    views: '18.7K',
    author: 'FipMoney Investment Team',
    content: {
      introduction: 'Choosing between digital and physical gold depends on your investment goals, storage capabilities, and liquidity needs. Both have unique advantages and considerations.',
      sections: [
        {
          title: 'Physical Gold: Traditional Investment',
          content: 'Physical gold includes jewelry, coins, and bars. It provides tangible ownership but comes with storage and security challenges.',
          steps: [
            'Tangible asset you can hold',
            'Cultural and emotional value',
            'No platform dependency',
            'Higher making charges',
            'Storage and security concerns'
          ]
        },
        {
          title: 'Digital Gold: Modern Convenience',
          content: 'Digital gold offers all benefits of gold investment without physical storage hassles. It\'s backed by physical gold stored securely.',
          steps: [
            'No storage or security concerns',
            'Instant buying and selling',
            'No making charges',
            'Fractional ownership possible',
            'Easy portfolio tracking'
          ]
        },
        {
          title: 'Cost Comparison',
          content: 'Digital gold typically has lower total costs due to absence of making charges, storage fees, and insurance costs.',
          tips: [
            'Physical gold: Making charges (8-25%)',
            'Physical gold: Storage and insurance costs',
            'Digital gold: Small transaction fees only',
            'Digital gold: No making or storage charges'
          ]
        },
        {
          title: 'Liquidity and Selling',
          content: 'Digital gold offers superior liquidity with instant selling at market rates, while physical gold may involve negotiation and verification.',
          warning: 'Physical gold selling often involves price negotiations and purity verification, which can reduce your returns.'
        }
      ],
      conclusion: 'For most investors, digital gold offers better convenience, lower costs, and superior liquidity. Physical gold is better for those who value tangible ownership and cultural significance.',
      keyTakeaways: [
        'Digital gold offers lower costs and better liquidity',
        'Physical gold provides tangible ownership',
        'Consider your storage and security capabilities',
        'Digital gold is better for regular investing',
        'Both forms have their place in a portfolio'
      ]
    }
  },
  '5': {
    id: '5',
    title: 'How to Calculate Your Ideal SIP Amount',
    description: 'Learn the step-by-step process to determine the right SIP amount based on your financial goals and income.',
    category: 'sip-planning',
    readTime: '5 min read',
    difficulty: 'Beginner',
    tags: ['SIP Planning', 'Financial Goals', 'Budget Planning'],
    publishedDate: '2024-01-12',
    views: '9.8K',
    author: 'FipMoney Planning Team',
    content: {
      introduction: 'Determining the right SIP amount is crucial for achieving your financial goals without straining your budget. Follow this systematic approach to find your ideal investment amount.',
      sections: [
        {
          title: 'Assess Your Financial Situation',
          content: 'Start by understanding your income, expenses, and existing financial commitments. This forms the foundation for SIP planning.',
          steps: [
            'Calculate your monthly net income',
            'List all fixed expenses (EMIs, rent, utilities)',
            'Account for variable expenses (food, transport)',
            'Identify discretionary spending',
            'Calculate available surplus'
          ]
        },
        {
          title: 'Apply the 50-30-20 Rule',
          content: 'Use this popular budgeting framework to allocate your income effectively for optimal financial health.',
          steps: [
            '50% for needs (rent, food, utilities)',
            '30% for wants (entertainment, dining)',
            '20% for savings and investments',
            'Start SIP with part of the 20% allocation'
          ]
        },
        {
          title: 'Set Clear Financial Goals',
          content: 'Define specific goals with timelines to determine required SIP amounts using financial calculators.',
          tips: [
            'Emergency fund: 6-12 months expenses',
            'Child education: Calculate future costs',
            'Retirement: Target 25x annual expenses',
            'House down payment: 20% of property value'
          ]
        },
        {
          title: 'Start Small and Increase Gradually',
          content: 'Begin with a comfortable amount and increase it annually to build a sustainable investment habit.',
          steps: [
            'Start with ₹1,000-2,000 per month',
            'Increase by 10-15% annually',
            'Use salary increments to boost SIP',
            'Review and adjust quarterly'
          ],
          warning: 'Never compromise on emergency fund or essential expenses for SIP investments.'
        }
      ],
      conclusion: 'The ideal SIP amount balances your financial goals with current capabilities. Start conservatively and increase gradually as your income grows.',
      keyTakeaways: [
        'Use 50-30-20 rule for budget allocation',
        'Start with affordable amounts',
        'Increase SIP with salary growth',
        'Set clear, measurable financial goals',
        'Review and adjust regularly'
      ]
    }
  },
  '6': {
    id: '6',
    title: 'Step-Up SIP Strategy: Maximize Your Returns',
    description: 'Discover how to use step-up SIP to accelerate wealth creation and align investments with salary increments.',
    category: 'sip-planning',
    readTime: '8 min read',
    difficulty: 'Intermediate',
    tags: ['Step-Up SIP', 'Wealth Creation', 'Investment Strategy'],
    publishedDate: '2024-01-07',
    views: '11.3K',
    author: 'FipMoney Strategy Team',
    content: {
      introduction: 'Step-up SIP is a powerful strategy that increases your investment amount periodically, helping you build wealth faster while keeping pace with inflation and income growth.',
      sections: [
        {
          title: 'Understanding Step-Up SIP',
          content: 'Step-up SIP automatically increases your investment amount by a predetermined percentage annually, typically 10-15%.',
          steps: [
            'Annual increase in SIP amount',
            'Percentage-based increments',
            'Automated implementation',
            'Aligned with salary increments'
          ]
        },
        {
          title: 'Benefits of Step-Up Strategy',
          content: 'This strategy helps you build larger corpus, beat inflation, and develop disciplined investing habits over time.',
          tips: [
            'Faster wealth accumulation',
            'Inflation protection',
            'Matches income growth',
            'Builds investment discipline',
            'Reduces lifestyle inflation'
          ]
        },
        {
          title: 'Choosing the Right Step-Up Percentage',
          content: 'Select a step-up percentage that aligns with your expected salary growth and inflation rates.',
          steps: [
            '10% step-up: Conservative approach',
            '15% step-up: Balanced strategy',
            '20% step-up: Aggressive growth',
            'Custom percentage: Based on salary increments'
          ]
        },
        {
          title: 'Implementation Strategy',
          content: 'Start with a comfortable base amount and implement step-up from the second year onwards.',
          warning: 'Ensure your salary increments can support the step-up increases to avoid financial strain.'
        }
      ],
      conclusion: 'Step-up SIP is an excellent way to accelerate wealth creation while maintaining disciplined investing. Choose a sustainable step-up percentage and review annually.',
      keyTakeaways: [
        'Step-up SIP accelerates wealth creation',
        'Align increases with salary growth',
        'Start with 10-15% annual increments',
        'Review and adjust annually',
        'Maintain financial discipline'
      ]
    }
  },
  '7': {
    id: '7',
    title: 'SIP Timing: When to Start and Stop Your Investments',
    description: 'Master the art of SIP timing with market cycles, economic indicators, and personal financial milestones.',
    category: 'sip-planning',
    readTime: '9 min read',
    difficulty: 'Advanced',
    tags: ['Market Timing', 'Investment Cycles', 'Strategy'],
    publishedDate: '2024-01-03',
    views: '7.6K',
    author: 'FipMoney Research Team',
    content: {
      introduction: 'While SIP reduces the need for market timing, understanding market cycles and personal financial situations can help optimize your investment strategy.',
      sections: [
        {
          title: 'The Best Time to Start SIP',
          content: 'The best time to start SIP is now. However, certain market and personal conditions can enhance your investment outcomes.',
          steps: [
            'Start as early as possible',
            'Market corrections offer better entry points',
            'After building emergency fund',
            'When you have stable income'
          ]
        },
        {
          title: 'Market Cycle Considerations',
          content: 'Understanding market cycles helps in making informed decisions about SIP timing and amount adjustments.',
          tips: [
            'Bear markets: Increase SIP amounts',
            'Bull markets: Continue regular SIP',
            'Market corrections: Opportunity to start',
            'Volatility: Stick to your plan'
          ]
        },
        {
          title: 'When to Stop or Pause SIP',
          content: 'There are specific situations when stopping or pausing SIP might be justified, but they should be temporary.',
          steps: [
            'Job loss or income reduction',
            'Major financial emergency',
            'Achieving specific financial goals',
            'Major life changes (marriage, children)'
          ],
          warning: 'Avoid stopping SIP due to short-term market volatility. This defeats the purpose of systematic investing.'
        },
        {
          title: 'Rebalancing and Review Strategy',
          content: 'Regular review and rebalancing ensure your SIP strategy remains aligned with your goals and market conditions.',
          tips: [
            'Review portfolio quarterly',
            'Rebalance annually',
            'Adjust for life changes',
            'Consider market valuations'
          ]
        }
      ],
      conclusion: 'The key to successful SIP timing is to start early, stay consistent, and make adjustments based on personal circumstances rather than market movements.',
      keyTakeaways: [
        'Start SIP as early as possible',
        'Don\'t stop for market volatility',
        'Increase during market corrections',
        'Review and rebalance regularly',
        'Align with personal financial goals'
      ]
    }
  },
  '8': {
    id: '8',
    title: 'How to Apply for Gold Loan in 5 Simple Steps',
    description: 'Get instant liquidity against your gold with our easy step-by-step guide to gold loan application process.',
    category: 'loans',
    readTime: '4 min read',
    difficulty: 'Beginner',
    tags: ['Gold Loan', 'Instant Loan', 'Application Process'],
    publishedDate: '2024-01-14',
    views: '14.2K',
    author: 'FipMoney Lending Team',
    content: {
      introduction: 'Gold loans offer quick access to funds against your gold ornaments or coins. FipMoney makes the process simple, transparent, and hassle-free.',
      sections: [
        {
          title: 'Step 1: Check Your Gold Eligibility',
          content: 'Verify that your gold meets our quality and weight requirements for loan processing.',
          steps: [
            'Gold purity: Minimum 18 karats',
            'Minimum weight: 5 grams',
            'Acceptable forms: Jewelry, coins, bars',
            'Age: No restrictions on gold age'
          ]
        },
        {
          title: 'Step 2: Calculate Loan Amount',
          content: 'Use our gold loan calculator to estimate the loan amount based on current gold prices and LTV ratios.',
          tips: [
            'LTV ratio: Up to 75% of gold value',
            'Current gold rate applies',
            'Additional charges clearly mentioned',
            'Instant calculation available'
          ]
        },
        {
          title: 'Step 3: Submit Application',
          content: 'Complete the online application with basic personal and gold details.',
          steps: [
            'Fill online application form',
            'Upload required documents',
            'Schedule gold evaluation appointment',
            'Provide bank account details'
          ]
        },
        {
          title: 'Step 4: Gold Evaluation and Verification',
          content: 'Our experts evaluate your gold using advanced testing methods to determine purity and value.',
          steps: [
            'Physical verification of gold',
            'Purity testing using modern equipment',
            'Weight measurement',
            'Final loan amount confirmation'
          ]
        },
        {
          title: 'Step 5: Loan Disbursement',
          content: 'Once approved, the loan amount is instantly transferred to your bank account.',
          tips: [
            'Instant bank transfer',
            'Secure gold storage',
            'Loan agreement signing',
            'Easy repayment options'
          ],
          warning: 'Ensure you understand the interest rates and repayment terms before signing the loan agreement.'
        }
      ],
      conclusion: 'FipMoney\'s gold loan process is designed for speed and convenience while ensuring complete security of your precious gold.',
      keyTakeaways: [
        'Minimum 18-karat gold required',
        'Up to 75% LTV ratio available',
        'Instant loan processing and disbursement',
        'Secure gold storage in certified vaults',
        'Flexible repayment options'
      ]
    }
  },
  '9': {
    id: '9',
    title: 'Understanding Interest Rates and EMI Calculations',
    description: 'Learn how loan interest rates work, calculate EMIs, and choose the best repayment options for your needs.',
    category: 'loans',
    readTime: '7 min read',
    difficulty: 'Intermediate',
    tags: ['Interest Rates', 'EMI Calculation', 'Loan Planning'],
    publishedDate: '2024-01-11',
    views: '6.9K',
    author: 'FipMoney Financial Team',
    content: {
      introduction: 'Understanding interest rates and EMI calculations helps you make informed borrowing decisions and choose the most cost-effective loan options.',
      sections: [
        {
          title: 'Types of Interest Rates',
          content: 'Different loans use different interest rate structures. Understanding these helps you compare loan offers effectively.',
          steps: [
            'Simple Interest: Interest on principal only',
            'Compound Interest: Interest on interest',
            'Reducing Balance: Interest on outstanding amount',
            'Flat Rate: Interest on original principal'
          ]
        },
        {
          title: 'EMI Calculation Formula',
          content: 'EMI calculation uses a standard mathematical formula that considers principal, interest rate, and tenure.',
          steps: [
            'EMI = P × r × (1 + r)^n / [(1 + r)^n - 1]',
            'P = Principal loan amount',
            'r = Monthly interest rate',
            'n = Number of monthly installments'
          ]
        },
        {
          title: 'Factors Affecting Interest Rates',
          content: 'Multiple factors influence the interest rate you\'ll be offered on loans.',
          tips: [
            'Credit score (most important factor)',
            'Income and employment stability',
            'Loan amount and tenure',
            'Collateral security (gold loans)',
            'Market interest rate conditions'
          ]
        },
        {
          title: 'Choosing the Right Repayment Option',
          content: 'Select repayment terms that balance your cash flow needs with total interest costs.',
          steps: [
            'Shorter tenure = Higher EMI, lower interest',
            'Longer tenure = Lower EMI, higher interest',
            'Prepayment options for early closure',
            'Part-payment to reduce interest burden'
          ],
          warning: 'Always factor in prepayment charges when considering early loan closure options.'
        }
      ],
      conclusion: 'Understanding interest calculations empowers you to make better loan decisions and potentially save thousands in interest costs.',
      keyTakeaways: [
        'Reducing balance method is most borrower-friendly',
        'Credit score significantly impacts interest rates',
        'Shorter tenure reduces total interest cost',
        'Use EMI calculators for accurate planning',
        'Consider prepayment options for savings'
      ]
    }
  },
  '10': {
    id: '10',
    title: 'Credit Score Impact on Loan Approval',
    description: 'Understand how your credit score affects loan approvals and learn tips to improve your creditworthiness.',
    category: 'loans',
    readTime: '6 min read',
    difficulty: 'Beginner',
    tags: ['Credit Score', 'Loan Approval', 'Financial Health'],
    publishedDate: '2024-01-09',
    views: '10.4K',
    author: 'FipMoney Credit Team',
    content: {
      introduction: 'Your credit score is one of the most important factors in loan approval and interest rate determination. Understanding and improving it can save you significant money.',
      sections: [
        {
          title: 'What is a Credit Score?',
          content: 'A credit score is a three-digit number that represents your creditworthiness based on your credit history and financial behavior.',
          steps: [
            'Range: 300-850 (CIBIL score)',
            'Calculated by credit bureaus',
            'Based on credit history',
            'Updated monthly'
          ]
        },
        {
          title: 'Credit Score Ranges and Impact',
          content: 'Different score ranges determine your loan eligibility and the interest rates you\'ll be offered.',
          steps: [
            '750-850: Excellent (best rates)',
            '700-749: Good (favorable terms)',
            '650-699: Fair (standard rates)',
            'Below 650: Poor (high rates/rejection)'
          ]
        },
        {
          title: 'Factors Affecting Your Credit Score',
          content: 'Understanding these factors helps you take actions to improve your score over time.',
          tips: [
            'Payment history (35% weightage)',
            'Credit utilization (30% weightage)',
            'Length of credit history (15%)',
            'Types of credit (10%)',
            'New credit inquiries (10%)'
          ]
        },
        {
          title: 'How to Improve Your Credit Score',
          content: 'Systematic efforts to improve these factors can boost your score within 3-6 months.',
          steps: [
            'Pay all bills on time, every time',
            'Keep credit utilization below 30%',
            'Don\'t close old credit cards',
            'Limit new credit applications',
            'Check credit report regularly for errors'
          ],
          warning: 'Credit score improvement takes time. Avoid companies promising instant score improvements.'
        }
      ],
      conclusion: 'A good credit score opens doors to better loan terms and lower interest rates. Invest time in building and maintaining good credit health.',
      keyTakeaways: [
        'Credit score significantly impacts loan terms',
        'Payment history is the most important factor',
        'Keep credit utilization below 30%',
        'Regularly monitor your credit report',
        'Building good credit takes time and consistency'
      ]
    }
  },
  '11': {
    id: '11',
    title: 'How to Use FipMoney\'s SIP Calculator Effectively',
    description: 'Master all features of our SIP calculator to plan your investments and achieve your financial goals.',
    category: 'calculators',
    readTime: '5 min read',
    difficulty: 'Beginner',
    tags: ['SIP Calculator', 'Investment Planning', 'Financial Tools'],
    publishedDate: '2024-01-13',
    views: '8.7K',
    author: 'FipMoney Product Team',
    content: {
      introduction: 'FipMoney\'s SIP calculator is a powerful tool for investment planning. Learning to use it effectively can help you make better financial decisions.',
      sections: [
        {
          title: 'Understanding Calculator Inputs',
          content: 'Each input field serves a specific purpose in calculating your investment outcomes accurately.',
          steps: [
            'Monthly SIP Amount: Your regular investment',
            'Investment Tenure: Time period in years',
            'Expected Return: Annual return percentage',
            'Step-up percentage: Annual increment (optional)'
          ]
        },
        {
          title: 'Setting Realistic Return Expectations',
          content: 'Use historical data and market conditions to set realistic return expectations for different asset classes.',
          tips: [
            'Equity funds: 10-12% long-term average',
            'Debt funds: 6-8% typical returns',
            'Gold: 8-10% historical average',
            'Hybrid funds: 8-10% balanced returns'
          ]
        },
        {
          title: 'Using Advanced Features',
          content: 'Explore advanced calculator features like step-up SIP and goal-based planning for better results.',
          steps: [
            'Enable step-up for growing investments',
            'Use goal amount to work backwards',
            'Compare different scenarios',
            'Save and track calculations'
          ]
        },
        {
          title: 'Interpreting Results',
          content: 'Understanding calculator results helps you make informed investment decisions and adjust strategies.',
          tips: [
            'Total investment vs. maturity amount',
            'Expected returns and growth',
            'Year-wise breakdown analysis',
            'Impact of different variables'
          ],
          warning: 'Calculator results are estimates based on assumed returns. Actual results may vary with market conditions.'
        }
      ],
      conclusion: 'Regular use of SIP calculators for different scenarios helps you optimize your investment strategy and stay on track with financial goals.',
      keyTakeaways: [
        'Set realistic return expectations',
        'Use step-up feature for better results',
        'Compare different investment scenarios',
        'Calculator results are estimates only',
        'Regular review and adjustment needed'
      ]
    }
  },
  '12': {
    id: '12',
    title: 'Gold Loan Calculator: Plan Your Borrowing',
    description: 'Learn to use our gold loan calculator to estimate loan amounts, interest rates, and repayment schedules.',
    category: 'calculators',
    readTime: '4 min read',
    difficulty: 'Beginner',
    tags: ['Gold Loan Calculator', 'Loan Planning', 'Financial Tools'],
    publishedDate: '2024-01-06',
    views: '5.3K',
    author: 'FipMoney Lending Team',
    content: {
      introduction: 'Our gold loan calculator helps you estimate loan amounts and plan repayments before applying, ensuring you make informed borrowing decisions.',
      sections: [
        {
          title: 'Calculator Input Parameters',
          content: 'Understanding each input helps you get accurate loan estimates for your specific gold holding.',
          steps: [
            'Gold weight in grams',
            'Gold purity (karats)',
            'Current gold rate per gram',
            'Desired loan tenure'
          ]
        },
        {
          title: 'Understanding LTV Ratios',
          content: 'Loan-to-Value ratio determines how much you can borrow against your gold\'s current market value.',
          tips: [
            'Standard LTV: 75% of gold value',
            'Premium customers: Up to 80%',
            'Lower purity gold: Reduced LTV',
            'Market conditions affect ratios'
          ]
        },
        {
          title: 'EMI Calculation Features',
          content: 'Use the EMI calculator to understand your monthly repayment obligations and choose suitable tenure.',
          steps: [
            'Select repayment tenure',
            'View monthly EMI amount',
            'Compare different tenures',
            'Understand total interest cost'
          ]
        },
        {
          title: 'Planning Your Gold Loan',
          content: 'Use calculator results to plan your borrowing strategy and ensure comfortable repayment.',
          warning: 'Always borrow only what you need and ensure EMI fits comfortably within your monthly budget.',
          tips: [
            'Keep EMI under 40% of income',
            'Consider prepayment options',
            'Factor in processing fees',
            'Plan for gold price fluctuations'
          ]
        }
      ],
      conclusion: 'The gold loan calculator is your first step toward informed borrowing. Use it to explore different scenarios before making final decisions.',
      keyTakeaways: [
        'LTV ratio determines borrowing capacity',
        'Higher purity gold gets better rates',
        'Compare different tenure options',
        'Keep EMI within comfortable limits',
        'Factor in all charges and fees'
      ]
    }
  },
  '13': {
    id: '13',
    title: 'Keeping Your FipMoney Account Secure',
    description: 'Essential security practices to protect your digital gold investments and personal financial information.',
    category: 'security',
    readTime: '6 min read',
    difficulty: 'Beginner',
    tags: ['Account Security', 'Digital Safety', 'Privacy Protection'],
    publishedDate: '2024-01-04',
    views: '7.1K',
    author: 'FipMoney Security Team',
    content: {
      introduction: 'Account security is crucial for protecting your digital gold investments and personal information. Follow these best practices to keep your account safe.',
      sections: [
        {
          title: 'Strong Password Management',
          content: 'A strong password is your first line of defense against unauthorized access to your account.',
          steps: [
            'Use 12+ character passwords',
            'Include uppercase, lowercase, numbers, symbols',
            'Avoid personal information',
            'Use unique passwords for each account',
            'Enable password manager'
          ]
        },
        {
          title: 'Two-Factor Authentication (2FA)',
          content: 'Enable 2FA for an additional layer of security beyond your password.',
          tips: [
            'Use authenticator apps over SMS',
            'Keep backup codes safe',
            'Enable on all financial accounts',
            'Regularly update phone numbers'
          ]
        },
        {
          title: 'Safe App Usage Practices',
          content: 'Follow these practices when using the FipMoney app to ensure maximum security.',
          steps: [
            'Download app only from official stores',
            'Keep app updated to latest version',
            'Use app lock features',
            'Don\'t save passwords on shared devices',
            'Log out after each session'
          ]
        },
        {
          title: 'Recognizing and Avoiding Scams',
          content: 'Learn to identify common scams targeting financial app users and protect yourself.',
          warning: 'FipMoney will never ask for your password, PIN, or OTP over phone or email.',
          tips: [
            'Verify communications directly with FipMoney',
            'Don\'t click suspicious links',
            'Never share OTP or PIN',
            'Report suspicious activities immediately'
          ]
        }
      ],
      conclusion: 'Security is a shared responsibility. While FipMoney implements robust security measures, following these practices ensures your account remains protected.',
      keyTakeaways: [
        'Use strong, unique passwords',
        'Enable two-factor authentication',
        'Keep app updated and secure',
        'Never share sensitive information',
        'Report suspicious activities immediately'
      ]
    }
  },
  '14': {
    id: '14',
    title: 'Understanding Digital Gold Storage and Insurance',
    description: 'Learn how your digital gold is stored securely and protected with comprehensive insurance coverage.',
    category: 'security',
    readTime: '5 min read',
    difficulty: 'Intermediate',
    tags: ['Digital Storage', 'Insurance', 'Asset Protection'],
    publishedDate: '2024-01-02',
    views: '4.8K',
    author: 'FipMoney Security Team',
    content: {
      introduction: 'Understanding how your digital gold is stored and insured provides confidence in your investment security and helps you make informed decisions.',
      sections: [
        {
          title: 'Secure Vault Storage',
          content: 'Your digital gold is backed by physical gold stored in highly secure, certified vaults with multiple layers of protection.',
          steps: [
            'Bank-grade security systems',
            'Climate-controlled environments',
            '24/7 surveillance and monitoring',
            'Authorized personnel access only',
            'Regular security audits'
          ]
        },
        {
          title: 'Insurance Coverage',
          content: 'Comprehensive insurance coverage protects your gold investment against various risks and uncertainties.',
          tips: [
            'Full replacement value coverage',
            'Protection against theft and damage',
            'Natural disaster coverage',
            'Transport insurance included',
            'Regular coverage reviews'
          ]
        },
        {
          title: 'Regulatory Compliance',
          content: 'Our storage and insurance practices comply with all regulatory requirements for maximum investor protection.',
          steps: [
            'RBI guidelines compliance',
            'SEBI regulatory framework',
            'Regular regulatory audits',
            'Transparent reporting practices'
          ]
        },
        {
          title: 'Your Investment Protection',
          content: 'Multiple layers of protection ensure your digital gold investment remains secure at all times.',
          tips: [
            'Segregated customer gold holdings',
            'Daily reconciliation processes',
            'Independent third-party audits',
            'Clear ownership documentation'
          ],
          warning: 'While digital gold is highly secure, understand the terms and conditions of storage and insurance coverage.'
        }
      ],
      conclusion: 'FipMoney\'s comprehensive security and insurance framework provides robust protection for your digital gold investments, giving you peace of mind.',
      keyTakeaways: [
        'Physical gold stored in secure vaults',
        'Comprehensive insurance coverage included',
        'Full regulatory compliance maintained',
        'Multiple layers of security protection',
        'Transparent and audited processes'
      ]
    }
  }
};

const relatedGuides = {
  'gold-investment': ['1', '2', '3', '4'],
  'sip-planning': ['5', '6', '7'],
  'loans': ['8', '9', '10'],
  'calculators': ['11', '12'],
  'security': ['13', '14']
};

export default function GuideReader({ onBack, onNavigateToGuide, guideId }: GuideReaderProps) {
  const guide = guideContents[guideId];
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollTop / docHeight) * 100, 100);
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!guide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gold-50 to-gold-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Guide not found</h1>
          <Button onClick={onBack} className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152]">
            Back to How To's
          </Button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'gold-investment':
        return Coins;
      case 'sip-planning':
        return TrendingUp;
      case 'loans':
        return CreditCard;
      case 'calculators':
        return Calculator;
      case 'security':
        return Shield;
      default:
        return BookOpen;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'gold-investment':
        return 'from-[#ffbf00] to-[#ffd152]';
      case 'sip-planning':
        return 'from-blue-500 to-blue-600';
      case 'loans':
        return 'from-green-500 to-green-600';
      case 'calculators':
        return 'from-purple-500 to-purple-600';
      case 'security':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const categoryGuides = relatedGuides[guide.category] || [];
  const otherGuides = categoryGuides.filter(id => id !== guideId).slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gold-50 to-gold-100">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-[#ffbf00] to-[#ffd152]"
          style={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Header */}
      <motion.div
        className="bg-white shadow-sm border-b border-gray-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="hover:bg-gold-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to How To's
              </Button>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Article Header */}
          <motion.div variants={itemVariants}>
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                {(() => {
                  const IconComponent = getCategoryIcon(guide.category);
                  return (
                    <div className={`w-12 h-12 bg-gradient-to-r ${getCategoryColor(guide.category)} rounded-full flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  );
                })()}
                <Badge className={getDifficultyColor(guide.difficulty)}>
                  {guide.difficulty}
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {guide.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
                {guide.description}
              </p>
              
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{guide.readTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{guide.views} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{guide.author}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {guide.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white shadow-xl border-0">
              <CardContent className="p-8">
                {/* Introduction */}
                <div className="mb-8">
                  <div className="w-1 h-12 bg-gradient-to-b from-[#ffbf00] to-[#ffd152] rounded-full float-left mr-4 mt-1"></div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {guide.content.introduction}
                  </p>
                </div>

                {/* Main Sections */}
                <div className="space-y-8">
                  {guide.content.sections.map((section, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="space-y-4"
                    >
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                        <span className="w-8 h-8 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </span>
                        <span>{section.title}</span>
                      </h2>
                      
                      <p className="text-gray-700 leading-relaxed">
                        {section.content}
                      </p>
                      
                      {/* Steps */}
                      {section.steps && (
                        <div className="bg-blue-50 p-6 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                            <span>Key Steps:</span>
                          </h4>
                          <ul className="space-y-2">
                            {section.steps.map((step, stepIndex) => (
                              <li key={stepIndex} className="flex items-start space-x-2">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5 flex-shrink-0">
                                  {stepIndex + 1}
                                </div>
                                <span className="text-gray-700">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Tips */}
                      {section.tips && (
                        <div className="bg-green-50 p-6 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                            <Lightbulb className="w-5 h-5 text-green-600" />
                            <span>Pro Tips:</span>
                          </h4>
                          <ul className="space-y-2">
                            {section.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="flex items-start space-x-2">
                                <Star className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Warning */}
                      {section.warning && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-red-800 mb-1">Important Warning:</h4>
                              <p className="text-red-700">{section.warning}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {index < guide.content.sections.length - 1 && (
                        <Separator className="my-8" />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Conclusion */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="mt-12 p-6 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-lg text-white"
                >
                  <h3 className="text-xl font-bold mb-3 flex items-center space-x-2">
                    <Target className="w-6 h-6" />
                    <span>Conclusion</span>
                  </h3>
                  <p className="leading-relaxed">{guide.content.conclusion}</p>
                </motion.div>

                {/* Key Takeaways */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="mt-8"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <Info className="w-6 h-6 text-[#ffbf00]" />
                    <span>Key Takeaways</span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {guide.content.keyTakeaways.map((takeaway, index) => (
                      <div key={index} className="flex items-start space-x-2 p-3 bg-gold-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-[#ffbf00] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Related Guides */}
          {otherGuides.length > 0 && (
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Guides</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {otherGuides.map((relatedId) => {
                  const relatedGuide = guideContents[relatedId];
                  if (!relatedGuide) return null;
                  
                  return (
                    <motion.div
                      key={relatedId}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group cursor-pointer"
                      onClick={() => onNavigateToGuide(relatedId)}
                    >
                      <Card className="bg-white shadow-lg border-0 overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={getDifficultyColor(relatedGuide.difficulty)} variant="secondary">
                              {relatedGuide.difficulty}
                            </Badge>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{relatedGuide.readTime}</span>
                            </div>
                          </div>
                          <CardTitle className="text-lg group-hover:text-[#ffbf00] transition-colors duration-300 line-clamp-2">
                            {relatedGuide.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-gray-600 mb-4 line-clamp-2">{relatedGuide.description}</p>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] hover:from-[#e6a800] hover:to-[#ffbf00] text-white w-full"
                          >
                            Read Guide
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* CTA Section */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] text-white shadow-xl border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-white/90 mb-6">
                  Put your knowledge into action and start your investment journey with FipMoney today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="bg-white text-[#ffbf00] hover:bg-gray-100">
                    Start Investing
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-[#ffbf00] hover:bg-white hover:text-[#ffbf00]">
                    Explore More Guides
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}