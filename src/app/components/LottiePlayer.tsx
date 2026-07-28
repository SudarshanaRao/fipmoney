"use client";

import React from "react";
import Lottie from "lottie-react";
import spinnerData from "../../assets/loading-spinner.json";
import successTickData from "../../assets/success_green_tick.json";

interface LottieProps {
  size?: number;
  className?: string;
  loop?: boolean;
}

export function LoadingSpinner({ size = 80, className = "" }: LottieProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div style={{ width: size, height: size }}>
        <Lottie animationData={spinnerData} loop={true} autoplay={true} />
      </div>
    </div>
  );
}

export function SuccessTick({ size = 180, className = "" }: LottieProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div style={{ width: size, height: size }}>
        <Lottie animationData={successTickData} loop={false} autoplay={true} />
      </div>
    </div>
  );
}
