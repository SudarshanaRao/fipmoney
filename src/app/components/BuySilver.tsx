"use client";

import React, { useState } from "react";
import BuyMetalModal from "./BuyMetalModal";

interface BuySilverProps {
  onBack: () => void;
}

export default function BuySilver({ onBack }: BuySilverProps) {
  const [isOpen, setIsOpen] = useState(true);

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
        metal="silver"
        basePrice={84.20}
      />
    </div>
  );
}
