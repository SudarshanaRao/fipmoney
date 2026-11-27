"use client";

import React, { useState } from "react";
import BuyMetalModal from "./BuyMetalModal";
import { getLiveSilverPrice } from "../utils/metalPriceConfig";
import { getLoggedInUser } from "../utils/userStorage";

interface BuySilverProps {
  onBack: () => void;
}

export default function BuySilver({ onBack }: BuySilverProps) {
  const [isOpen, setIsOpen] = useState(true);
  const loggedInUser = typeof window !== 'undefined' ? getLoggedInUser() : null;
  const loggedInMobile = loggedInUser?.mobileNumber || (typeof window !== 'undefined' ? (sessionStorage.getItem("fm_logged_in_mobile") || localStorage.getItem("fm_logged_in_mobile") || "") : "");

  const handleClose = () => {
    setIsOpen(false);
    onBack();
  };

  const handleSuccess = (amount: number, grams: number) => {
    console.log(`Purchased ₹${amount} (${grams}g) of silver!`);
  };

  return (
    <div className="min-h-screen bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4">
      <BuyMetalModal
        isOpen={isOpen}
        onClose={handleClose}
        onSuccess={handleSuccess}
        onNavigatePortfolio={() => {
          setIsOpen(false);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("fm_dashboard_tab", "portfolio");
            window.location.href = "/dashboard/portfolio";
          }
        }}
        onNavigateHome={() => {
          setIsOpen(false);
          onBack();
        }}
        metal="silver"
        basePrice={getLiveSilverPrice()}
        mobileNumber={loggedInMobile}
      />
    </div>
  );
}
