"use client";

import React, { useState } from "react";
import BuyMetalModal from "./BuyMetalModal";

interface BuyGoldProps {
  onBack: () => void;
}

export default function BuyGold({ onBack }: BuyGoldProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onBack();
  };

  const handleSuccess = (amount: number, grams: number) => {
    console.log(`Purchased ₹${amount} (${grams}g) of gold!`);
  };

  return (
    <div className="min-h-screen bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4">
      <BuyMetalModal
        isOpen={isOpen}
        onClose={handleClose}
        onSuccess={handleSuccess}
        metal="gold"
        basePrice={12452.85}
      />
    </div>
  );
}