"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Coins,
  Activity,
  Download,
  Eye,
  MapPin,
  Smartphone,
  Monitor,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface AdminDashboardProps {
  onBack: () => void;
}

// Mock data for analytics
const userGrowthData = [
  { month: 'Jan', users: 12000, activeUsers: 8500, newUsers: 2100 },
  { month: 'Feb', users: 18000, activeUsers: 12800, newUsers: 6000 },
  { month: 'Mar', users: 25000, activeUsers: 17500, newUsers: 7000 },
  { month: 'Apr', users: 35000, activeUsers: 24500, newUsers: 10000 },
  { month: 'May', users: 48000, activeUsers: 33600, newUsers: 13000 },
  { month: 'Jun', users: 65000, activeUsers: 45500, newUsers: 17000 },
  { month: 'Jul', users: 85000, activeUsers: 59500, newUsers: 20000 },
  { month: 'Aug', users: 112000, activeUsers: 78400, newUsers: 27000 },
  { month: 'Sep', users: 145000, activeUsers: 101500, newUsers: 33000 },
  { month: 'Oct', users: 185000, activeUsers: 129500, newUsers: 40000 },
  { month: 'Nov', users: 235000, activeUsers: 164500, newUsers: 50000 },
  { month: 'Dec', users: 300000, activeUsers: 210000, newUsers: 65000 },
];

const investmentData = [
  { month: 'Jan', goldValue: 2.5, sipInvestments: 1.8, totalInvested: 45 },
  { month: 'Feb', goldValue: 3.2, sipInvestments: 2.5, totalInvested: 68 },
  { month: 'Mar', goldValue: 4.1, sipInvestments: 3.2, totalInvested: 89 },
  { month: 'Apr', goldValue: 5.8, sipInvestments: 4.5, totalInvested: 125 },
  { month: 'May', goldValue: 7.5, sipInvestments: 6.2, totalInvested: 167 },
  { month: 'Jun', goldValue: 9.8, sipInvestments: 8.1, totalInvested: 215 },
  { month: 'Jul', goldValue: 12.5, sipInvestments: 10.5, totalInvested: 285 },
  { month: 'Aug', goldValue: 16.2, sipInvestments: 13.8, totalInvested: 368 },
  { month: 'Sep', goldValue: 20.5, sipInvestments: 17.5, totalInvested: 445 },
  { month: 'Oct', goldValue: 25.8, sipInvestments: 22.1, totalInvested: 520 },
  { month: 'Nov', goldValue: 32.5, sipInvestments: 28.2, totalInvested: 615 },
  { month: 'Dec', goldValue: 41.2, sipInvestments: 35.8, totalInvested: 725 },
];

const deviceData = [
  { name: 'Mobile', value: 78, count: 234000 },
  { name: 'Desktop', value: 18, count: 54000 },
  { name: 'Tablet', value: 4, count: 12000 },
];

const geographicData = [
  { state: 'Maharashtra', users: 58000, percentage: 19.3 },
  { state: 'Karnataka', users: 45000, percentage: 15.0 },
  { state: 'Delhi', users: 39000, percentage: 13.0 },
  { state: 'Tamil Nadu', users: 33000, percentage: 11.0 },
  { state: 'Gujarat', users: 27000, percentage: 9.0 },
  { state: 'Uttar Pradesh', users: 24000, percentage: 8.0 },
  { state: 'West Bengal', users: 21000, percentage: 7.0 },
  { state: 'Others', users: 53000, percentage: 17.7 },
];

const transactionData = [
  { hour: '00', buys: 45, sells: 12, volume: 2.1 },
  { hour: '03', buys: 32, sells: 8, volume: 1.5 },
  { hour: '06', buys: 78, sells: 18, volume: 3.2 },
  { hour: '09', buys: 156, sells: 42, volume: 6.8 },
  { hour: '12', buys: 234, sells: 68, volume: 9.5 },
  { hour: '15', buys: 198, sells: 52, volume: 8.1 },
  { hour: '18', buys: 267, sells: 89, volume: 11.2 },
  { hour: '21', buys: 189, sells: 45, volume: 7.8 },
];

const recentActivities = [
  { id: 1, type: 'user_signup', user: 'Priya Sharma', details: 'New user registration from Mumbai', time: '2 minutes ago', status: 'success' },
  { id: 2, type: 'gold_purchase', user: 'Rahul Gupta', details: 'Purchased 2.5g digital gold worth ₹15,450', time: '5 minutes ago', status: 'success' },
  { id: 3, type: 'sip_started', user: 'Anita Patel', details: 'Started monthly SIP of ₹5,000', time: '8 minutes ago', status: 'success' },
  { id: 4, type: 'kyc_pending', user: 'Vikram Singh', details: 'KYC verification pending - documents uploaded', time: '12 minutes ago', status: 'warning' },
  { id: 5, type: 'gold_sell', user: 'Meera Krishnan', details: 'Sold 1.8g digital gold worth ₹11,250', time: '15 minutes ago', status: 'success' },
  { id: 6, type: 'support_ticket', user: 'Amit Kumar', details: 'Raised support ticket for transaction query', time: '18 minutes ago', status: 'info' },
  { id: 7, type: 'goal_achieved', user: 'Sneha Reddy', details: 'Achieved "Emergency Fund" goal of ₹1,00,000', time: '25 minutes ago', status: 'success' },
  { id: 8, type: 'failed_transaction', user: 'Ravi Joshi', details: 'Payment failed for ₹8,000 gold purchase', time: '32 minutes ago', status: 'error' },
];

const COLORS = ['#ffbf00', '#ffd152', '#ffe485', '#fff0b8'];

const MetricCard = ({ title, value, change, icon: Icon, color = 'gold' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
              <TrendingUp className="w-3 h-3 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-r ${color === 'gold' ? 'from-[#ffbf00] to-[#ffd152]' : 'from-blue-500 to-blue-600'} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  </motion.div>
);

const ActivityIcon = ({ type, status }) => {
  const getIcon = () => {
    switch (type) {
      case 'user_signup': return Users;
      case 'gold_purchase': case 'gold_sell': return Coins;
      case 'sip_started': return TrendingUp;
      case 'kyc_pending': return AlertTriangle;
      case 'support_ticket': return Activity;
      case 'goal_achieved': return CheckCircle;
      case 'failed_transaction': return XCircle;
      default: return Activity;
    }
  };
  
  const Icon = getIcon();
  const getColor = () => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getColor()}`}>
      <Icon className="w-4 h-4" />
    </div>
  );
};

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-[#ffbf00]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-600">FipMoney Analytics & Insights</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white p-1 rounded-xl shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#ffbf00] data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-[#ffbf00] data-[state=active]:text-white">Users</TabsTrigger>
            <TabsTrigger value="investments" className="data-[state=active]:bg-[#ffbf00] data-[state=active]:text-white">Investments</TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-[#ffbf00] data-[state=active]:text-white">Transactions</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[#ffbf00] data-[state=active]:text-white">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Users"
                value="3,00,000"
                change="+12.5%"
                icon={Users}
              />
              <MetricCard
                title="Total Investments"
                value="₹725 Cr"
                change="+18.3%"
                icon={TrendingUp}
              />
              <MetricCard
                title="Gold Holdings"
                value="41.2 Tons"
                change="+15.7%"
                icon={Coins}
              />
              <MetricCard
                title="Monthly Revenue"
                value="₹2.8 Cr"
                change="+22.1%"
                icon={DollarSign}
                color="blue"
              />
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* User Growth Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={userGrowthData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffbf00" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ffbf00" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#ffbf00" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorUsers)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* Investment Overview */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={investmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Line type="monotone" dataKey="totalInvested" stroke="#ffbf00" strokeWidth={2} name="Total Invested (₹Cr)" />
                    <Line type="monotone" dataKey="goldValue" stroke="#ffd152" strokeWidth={2} name="Gold Value (Tons)" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentActivities.slice(0, 6).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <ActivityIcon type={activity.type} status={activity.status} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{activity.user}</p>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard title="Active Users" value="2,10,000" change="+8.2%" icon={Users} />
              <MetricCard title="New Signups" value="65,000" change="+25.4%" icon={Users} />
              <MetricCard title="KYC Verified" value="2,85,000" change="+12.1%" icon={CheckCircle} color="blue" />
              <MetricCard title="Retention Rate" value="87.5%" change="+3.2%" icon={TrendingUp} color="blue" />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* User Growth */}
              <Card className="lg:col-span-2 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Acquisition & Retention</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stackId="1" stroke="#ffbf00" fill="#ffbf00" fillOpacity={0.6} name="Total Users" />
                    <Area type="monotone" dataKey="activeUsers" stackId="2" stroke="#ffd152" fill="#ffd152" fillOpacity={0.6} name="Active Users" />
                    <Area type="monotone" dataKey="newUsers" stackId="3" stroke="#ffe485" fill="#ffe485" fillOpacity={0.6} name="New Users" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* Device Distribution */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {deviceData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }}></div>
                        <span className="text-gray-700">{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Geographic Distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {geographicData.map((state) => (
                  <div key={state.state} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{state.state}</span>
                      <span className="text-sm text-gray-600">{state.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#ffbf00] to-[#ffd152] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${state.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{state.users.toLocaleString('en-IN')} users</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Investments Tab */}
          <TabsContent value="investments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard title="Total AUM" value="₹725 Cr" change="+18.3%" icon={TrendingUp} />
              <MetricCard title="Active SIPs" value="1,45,000" change="+28.7%" icon={Activity} />
              <MetricCard title="Avg Investment" value="₹24,167" change="+11.2%" icon={DollarSign} color="blue" />
              <MetricCard title="Gold Price" value="₹6,248/g" change="+2.1%" icon={Coins} />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Growth</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={investmentData}>
                    <defs>
                      <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffbf00" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ffbf00" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Area type="monotone" dataKey="totalInvested" stroke="#ffbf00" strokeWidth={2} fillOpacity={1} fill="url(#colorInvestment)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SIP vs One-time Investments</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={investmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Bar dataKey="sipInvestments" fill="#ffbf00" name="SIP Investments (₹Cr)" />
                    <Bar dataKey="goldValue" fill="#ffd152" name="One-time Purchases (Tons)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard title="Daily Transactions" value="12,450" change="+15.2%" icon={Activity} />
              <MetricCard title="Transaction Volume" value="₹8.5 Cr" change="+22.1%" icon={DollarSign} />
              <MetricCard title="Success Rate" value="98.7%" change="+0.5%" icon={CheckCircle} color="blue" />
              <MetricCard title="Avg Transaction" value="₹6,834" change="+8.3%" icon={TrendingUp} color="blue" />
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Transaction Pattern</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={transactionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip />
                  <Bar dataKey="buys" fill="#ffbf00" name="Buy Orders" />
                  <Bar dataKey="sells" fill="#ffd152" name="Sell Orders" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard title="App Downloads" value="10L+" change="+35.2%" icon={Download} />
              <MetricCard title="Daily Active Users" value="89,500" change="+12.8%" icon={Users} />
              <MetricCard title="Session Duration" value="8.5 min" change="+18.3%" icon={Clock} color="blue" />
              <MetricCard title="Customer Support" value="4.9/5" change="+0.2%" icon={Activity} color="blue" />
            </div>

            {/* Recent Activities Full List */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Activity Feed</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <ActivityIcon type={activity.type} status={activity.status} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{activity.user}</p>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}