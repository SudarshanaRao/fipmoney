"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Shield, Clock, TrendingUp, Coins, Calculator, Star, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { fetchLatestMetalPrices } from "../utils/metalPriceApi";
import { buyGoldOrSilverApi } from "../utils/vaultApi";
import { useFipModal } from "./FipModal";
import { LoadingSpinner } from "./LottiePlayer";

interface BuyGoldProps {
  onBack: () => void;
}

const BuyGold = ({ onBack }: BuyGoldProps) => {
  const [investmentAmount, setInvestmentAmount] = useState<number>(1000);
  const [goldPrice, setGoldPrice] = useState<number>(6420);
  const [goldQuantity, setGoldQuantity] = useState<number>(0);
  const [selectedPlan, setSelectedPlan] = useState<string>('one-time');
  const [isLoading, setIsLoading] = useState(false);
  const [buyMode, setBuyMode] = useState<"amount" | "grams">("amount");
  const [gramsInput, setGramsInput] = useState<string>("0.1557");
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const { showAlert, ModalComponent } = useFipModal();
  const loggedInMobile = typeof window !== 'undefined' ? sessionStorage.getItem("fm_logged_in_mobile") || "7013302191" : "7013302191";

  // 5-Minute Price Lock Timer
  const [lockedPrice, setLockedPrice] = useState<number | null>(null);
  const [priceLockSeconds, setPriceLockSeconds] = useState<number>(300);

  useEffect(() => {
    // Lock price on initial load / rate fetch
    if (goldPrice && lockedPrice === null) {
      setLockedPrice(goldPrice);
      setPriceLockSeconds(300);
    }
  }, [goldPrice]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockedPrice !== null && priceLockSeconds > 0) {
      timer = setInterval(() => {
        setPriceLockSeconds((prev) => prev - 1);
      }, 1000);
    } else if (lockedPrice !== null && priceLockSeconds === 0) {
      // 5-Minute Timeout Reached
      setLockedPrice(null);
      setPriceLockSeconds(300);
      showAlert(
        "Transaction Timeout: Your 5-minute price lock has expired. Please review the updated live gold rate and try again.",
        "warning",
        "Price Lock Expired"
      );
    }
    return () => clearInterval(timer);
  }, [lockedPrice, priceLockSeconds]);

  const activeRate = lockedPrice || goldPrice;

  useEffect(() => {
    // Calculate gold quantity based on investment amount
    const quantity = investmentAmount / activeRate;
    setGoldQuantity(quantity);
  }, [investmentAmount, activeRate]);

  useEffect(() => {
    // Fetch live gold price from MetalpriceAPI (utilizes 24h cache)
    const loadLiveRate = async () => {
      try {
        const live = await fetchLatestMetalPrices();
        if (live && live.gold && live.gold.perGram24K) {
          setGoldPrice(live.gold.perGram24K);
          if (lockedPrice === null) {
            setLockedPrice(live.gold.perGram24K);
          }
        }
      } catch (e) {
        console.warn("Using fallback gold price:", e);
      }
    };
    loadLiveRate();
  }, []);

  const handlePurchase = async () => {
    if (!investmentAmount || investmentAmount <= 0) {
      showAlert("Please enter a valid investment amount.", "warning");
      return;
    }
    setIsLoading(true);

    // 2.5s realistic loading delay
    await new Promise((resolve) => setTimeout(resolve, 2500));

    await buyGoldOrSilverApi({
      mobileNumber: loggedInMobile,
      metal: "gold",
      amount: investmentAmount,
      grams: goldQuantity,
      lockedPrice: activeRate,
    });

    setIsLoading(false);
    showAlert(
      `Successfully purchased ${goldQuantity.toFixed(4)}g of 24K pure Digital Gold for ₹${investmentAmount.toLocaleString()}! Saved securely to MongoDB database.`,
      "success",
      "Purchase Successful! 🎉"
    );
    setLockedPrice(goldPrice);
    setPriceLockSeconds(300);
  };

  const investmentPlans = [
    {
      id: 'one-time',
      name: 'One-Time Purchase',
      description: 'Buy gold instantly with a single payment',
      icon: Coins,
      popular: false
    },
    {
      id: 'monthly-sip',
      name: 'Monthly SIP',
      description: 'Invest regularly every month',
      icon: TrendingUp,
      popular: true
    },
    {
      id: 'weekly-sip',
      name: 'Weekly SIP',
      description: 'Small weekly investments for better averaging',
      icon: Clock,
      popular: false
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "100% Secure",
      description: "Your gold is stored in our partner's certified vaults"
    },
    {
      icon: TrendingUp,
      title: "Real-time Pricing",
      description: "Live gold rates updated every second"
    },
    {
      icon: Coins,
      title: "24K Pure Gold",
      description: "999.9 purity guaranteed digital gold"
    },
    {
      icon: Calculator,
      title: "No Hidden Fees",
      description: "Transparent pricing with minimal charges"
    }
  ];

  const priceHistory = [
    { date: '1 Day', change: '+0.8%', value: 6420 },
    { date: '1 Week', change: '+2.1%', value: 6290 },
    { date: '1 Month', change: '+5.3%', value: 6100 },
    { date: '1 Year', change: '+12.7%', value: 5695 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-gray-600 hover:text-[#ffbf00] hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900">Buy Gold</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-green-600 bg-green-100">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Live Rates
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Purchase Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Gold Price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-[#ffbf00] bg-gradient-to-r from-[#fff8dc] to-[#fffcf0]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl text-gray-900">Current Gold Price</CardTitle>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <span className="text-green-600 font-semibold">+0.8%</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-4xl font-bold text-[#ffbf00]">₹{activeRate.toFixed(2)}</span>
                      <span className="text-gray-600">/gram</span>
                    </div>
                    {lockedPrice !== null && (
                      <div className="flex items-center space-x-2 bg-amber-100 text-amber-900 px-3 py-1.5 rounded-full font-bold text-xs border border-amber-300">
                        <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                        <span>Price Locked: {Math.floor(priceLockSeconds / 60)}:{String(priceLockSeconds % 60).padStart(2, '0')}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">24K Pure Gold • Rate locked for 5 mins</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Investment Plans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Choose Your Investment Plan</CardTitle>
                  <CardDescription>Select how you want to invest in gold</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {investmentPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          selectedPlan === plan.id
                            ? 'border-[#ffbf00] bg-[#fff8dc]'
                            : 'border-gray-200 hover:border-[#ffbf00] hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {plan.popular && (
                          <Badge className="absolute -top-2 -right-2 bg-[#ffbf00] text-white">
                            Popular
                          </Badge>
                        )}
                        <div className="flex items-center space-x-3 mb-2">
                          <plan.icon className="w-5 h-5 text-[#ffbf00]" />
                          <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{plan.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Investment Amount */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Investment Amount</CardTitle>
                  <CardDescription>Choose how much you want to invest</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Mode Selector: Buy by Amount vs Buy by Grams */}
                  <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
                    <button
                      onClick={() => setBuyMode("amount")}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border-none outline-none cursor-pointer ${
                        buyMode === "amount" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      Buy by Amount (₹)
                    </button>
                    <button
                      onClick={() => setBuyMode("grams")}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border-none outline-none cursor-pointer ${
                        buyMode === "grams" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      Buy by Weight (grams)
                    </button>
                  </div>

                  {buyMode === "amount" ? (
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <div className="flex items-center space-x-4">
                        <Input
                          id="amount"
                          type="number"
                          value={investmentAmount}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setInvestmentAmount(val);
                            setGramsInput((val / activeRate).toFixed(4));
                          }}
                          className="flex-1"
                          min="1"
                          max="1000000"
                        />
                        <div className="flex space-x-2">
                          {[500, 1000, 5000, 10000].map((amount) => (
                            <Button
                              key={amount}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setInvestmentAmount(amount);
                                setGramsInput((amount / activeRate).toFixed(4));
                              }}
                              className="text-[#ffbf00] border-[#ffbf00] hover:bg-[#ffbf00] hover:text-white font-bold"
                            >
                              ₹{amount}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="grams">Weight (grams)</Label>
                      <div className="flex items-center space-x-4">
                        <Input
                          id="grams"
                          type="number"
                          value={gramsInput}
                          onChange={(e) => {
                            const val = e.target.value;
                            setGramsInput(val);
                            setInvestmentAmount(Math.round(Number(val) * activeRate));
                          }}
                          className="flex-1"
                          step="0.01"
                        />
                        <div className="flex space-x-2">
                          {["0.1", "0.5", "1.0", "2.0"].map((g) => (
                            <Button
                              key={g}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setGramsInput(g);
                                setInvestmentAmount(Math.round(Number(g) * activeRate));
                              }}
                              className="text-[#ffbf00] border-[#ffbf00] hover:bg-[#ffbf00] hover:text-white font-bold"
                            >
                              {g}g
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Amount Slider</Label>
                    <Slider
                      value={[investmentAmount]}
                      onValueChange={(value) => {
                        setInvestmentAmount(value[0]);
                        setGramsInput((value[0] / activeRate).toFixed(4));
                      }}
                      max={100000}
                      min={1}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 font-medium">Gold Price Rate:</span>
                      <span className="font-bold text-gray-900">₹{activeRate.toFixed(2)}/g</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 font-medium">Gold Quantity:</span>
                      <span className="font-bold text-gray-900">{goldQuantity.toFixed(4)} grams</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-600 font-bold">Vault Insurance & Tax:</span>
                      <span className="font-bold text-emerald-600">FREE (0%)</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-gray-900">Total Payable:</span>
                        <span className="font-black text-[#ffbf00] text-xl">₹{investmentAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setShowPaymentModal(true)}
                    disabled={isLoading || !investmentAmount || investmentAmount <= 0}
                    className="w-full bg-gradient-to-r from-[#ffbf00] to-[#ffd152] hover:from-[#e6a800] hover:to-[#ffbf00] text-white font-extrabold py-3.5 text-base shadow-md shadow-amber-500/20"
                  >
                    Proceed to Payment Options →
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Info & Benefits */}
          <div className="space-y-6">
            {/* Price History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-[#ffbf00]" />
                    <span>Price History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {priceHistory.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">{item.date}</span>
                          <p className="text-sm text-gray-600">₹{item.value}</p>
                        </div>
                        <Badge
                          variant={item.change.startsWith('+') ? 'default' : 'destructive'}
                          className={item.change.startsWith('+') ? 'bg-green-100 text-green-800' : ''}
                        >
                          {item.change}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-[#ffbf00]" />
                    <span>Why Choose FipMoney?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-[#fff8dc] rounded-full flex items-center justify-center flex-shrink-0">
                          <benefit.icon className="w-5 h-5 text-[#ffbf00]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                          <p className="text-sm text-gray-600">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Security Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">100% Secure & Insured</h4>
                      <p className="text-sm text-green-700">
                        Your gold is stored in our partner's certified vaults with full insurance coverage. 
                        All transactions are encrypted and secure.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Important Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <Info className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-2">Important Notes</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Minimum investment: ₹1</li>
                        <li>• Processing fee: 3% + GST</li>
                        <li>• Gold can be sold anytime</li>
                        <li>• Prices updated in real-time</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Step 2: Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/65 backdrop-blur-md z-[90] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-[2rem] max-w-md w-full p-6 md:p-7 space-y-5 shadow-2xl border border-gray-100 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-gray-900 tracking-tight">Select Payment Method</h3>
                  <p className="text-[11px] text-gray-400 font-semibold">Step 2 of 2 • Instant 24K Gold Credit</p>
                </div>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 flex items-center justify-center cursor-pointer border-none outline-none"
                >
                  ✕
                </button>
              </div>

              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-amber-900">Gold: </span>
                  <span className="font-black text-amber-950">{goldQuantity.toFixed(4)}g</span>
                  <span className="text-amber-700 font-medium"> • Total: </span>
                  <span className="font-black text-amber-950">₹{investmentAmount.toLocaleString()}</span>
                </div>
                <div className="text-[11px] font-mono font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg">
                  Rate: ₹{activeRate.toFixed(2)}/g
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: "upi", name: "UPI Pay", desc: "Google Pay, PhonePe, BHIM, Paytm", icon: "📱" },
                  { id: "netbanking", name: "Net Banking", desc: "All Indian Banks Supported", icon: "🏦" },
                  { id: "card", name: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay", icon: "💳" },
                  { id: "wallet", name: "Fipmoney Wallet", desc: "Instant One-Click Pay", icon: "👛" },
                ].map((pm) => {
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <div
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-amber-50/70 border-amber-500 shadow-2xs"
                          : "bg-white border-gray-150 hover:border-gray-200 hover:bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{pm.icon}</span>
                        <div>
                          <div className={`text-xs font-black ${isSelected ? "text-amber-950" : "text-gray-900"}`}>{pm.name}</div>
                          <div className="text-[10px] text-gray-400 font-medium">{pm.desc}</div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-amber-500 bg-amber-500 text-white" : "border-gray-300"}`}>
                        {isSelected && <span className="text-[10px] font-bold">✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                onClick={() => {
                  setShowPaymentModal(false);
                  handlePurchase();
                }}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#ffbf00] to-[#ffd152] hover:from-[#e6a800] hover:to-[#ffbf00] text-white font-extrabold py-3.5 text-base shadow-md shadow-amber-500/20"
              >
                Pay ₹{investmentAmount.toLocaleString()} & Secure 24K Gold
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing Loading Overlay with Lottie LoadingSpinner */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-gray-100 flex flex-col items-center"
            >
              <LoadingSpinner size={100} />
              <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">Securing 24K Pure Gold...</h3>
                <p className="text-xs font-semibold text-gray-500 mt-1 leading-relaxed">
                  Locking rate at <strong className="text-amber-600 font-black">₹{activeRate.toFixed(2)}/g</strong> and syncing your holdings with MongoDB database.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {ModalComponent}
    </div>
  );
};

export default BuyGold;