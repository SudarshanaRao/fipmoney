"use client";

import React from "react";
import HelpCenter from "./HelpCenter";

export default function HelpSupportPage() {
  return (
    <div className="flex-1 h-screen overflow-y-auto bg-white">
      <HelpCenter isDashboardTab={true} />
    </div>
  );
}
