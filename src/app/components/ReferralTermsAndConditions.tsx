import React from "react";
import { ArrowLeft, FileText, AlertCircle } from "lucide-react";

interface ReferralTermsAndConditionsProps {
  onBack: () => void;
}

export default function ReferralTermsAndConditions({ onBack }: ReferralTermsAndConditionsProps) {
  return (
    <div className="flex-1 h-screen overflow-y-auto bg-slate-50 pb-24 text-slate-800 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-[800px] mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer border-none outline-none"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Referral Terms & Conditions</h1>
            <p className="text-xs text-slate-500 font-medium">Rules and Eligibility</p>
          </div>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-8 space-y-8">

        {/* Eligibility Criteria */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Eligibility Criteria:</h2>
          <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2 mb-6">
            <li>Fipmoney referral program shall be applicable to all Full KYC (FKYC) customers.</li>
            <li>Fipmoney referral program shall be accessible only via the Fipmoney app/platform.</li>
          </ul>

          <div className="text-sm text-slate-700 space-y-2 mb-8">
            <p><strong className="text-slate-900">Referrer:</strong> The user who is sharing a referral.</p>
            <p><strong className="text-slate-900">Referee:</strong> The user who is being referred.</p>
          </div>

          {/* Terms & Conditions */}
          <h2 className="text-lg font-bold text-slate-800 mb-4">Terms & Conditions applicable to the Fipmoney Referral Program:</h2>
          <p className="text-sm text-slate-700 font-semibold mb-4">I agree/understand and accept:</p>
          <ul className="list-disc pl-5 text-sm text-slate-600 space-y-3">
            <li>Fipmoney FKYC customers are eligible for availing the benefits of the referral program.</li>
            <li>There is absolutely no limit to the number of friends you can refer and the rewards you can earn.</li>
            <li>The referrer is only entitled to a reward given that the referee creates a Fipmoney account, successfully purchases a minimum of ₹500 worth of digital gold, and both parties adhere to the guidelines and conditions set for this program.</li>
            <li>Both the Referrer and Referee will receive ₹50 worth of digital gold upon the successful completion of the referee's first purchase of ₹500+ digital gold.</li>
            <li>Fipmoney retains the right to award the reward to its eligible customers who complete all steps required for a successful referral.</li>
            <li>Fipmoney maintains the right to credit the reward directly to the user's digital gold vault within 72 hours of the successful transaction.</li>
            <li>Fipmoney is not responsible for any device or technical limitation or errors that limit the ability to claim the referral reward.</li>
            <li>Fipmoney reserves the right at all times to withdraw/discontinue the Referral Program without any prior notice to the customer.</li>
            <li>Fipmoney referral program will not be accessible to accounts which are marked freeze/lien or if the account is blocked.</li>
            <li>Fipmoney referral program for members is automatically terminated upon death or bankruptcy of the Member and upon membership termination, all rewards accrued shall expire immediately and the membership shall stand closed.</li>
            <li>This program shall remain in force till such time unless terminated by Fipmoney.</li>
            <li>Fipmoney at its discretion may terminate or close the program. Fipmoney shall in no way be responsible to provide any reason for closure or termination.</li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Disclaimer</h2>
          <ul className="list-disc pl-5 text-sm text-slate-600 space-y-3">
            <li>Fipmoney reserves the right, at its sole discretion, to decide whether the customer qualifies for the Referral program for earning a reward.</li>
            <li>Fipmoney reserves the right, at its sole discretion, to change the mode of accrual of one or any of the referrals offering.</li>
            <li>Fipmoney reserves the right to disqualify any User who does not meet the requirements or for any other reason including but not limited to any misuse of the program or on the ground of fraud or suspicious transaction/activity.</li>
            <li>Fipmoney reserves the right to discontinue or change or issue any new form of rewards offered at any time, at its sole discretion.</li>
            <li>The referral link shared with the referee has a 30-day expiry from the day of creation. Using this link post expiry will not entail a referral reward to either party.</li>
            <li>The referee MUST complete their first digital gold transaction of ₹500+ within 30 days of account creation. Transactions made after this period will not be eligible for the referral bonus.</li>
          </ul>
        </div>

        {/* General Provisions */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">General Provisions</h2>
          <ul className="list-disc pl-5 text-sm text-slate-600 space-y-3">
            <li>Fipmoney reserves the right to modify/change all or any of the terms and conditions applicable to the Program without assigning any reasons and/or without any prior intimation whatsoever to the Customers.</li>
            <li>The Terms and Conditions shall be in addition to and not in substitution/derogation of the Primary Terms and Conditions.</li>
            <li>Any changes to these Terms and Conditions of Use or any terms posted on this site shall be effective immediately.</li>
            <li>By continuing to use this site after any changes are posted, you are indicating your acceptance of those changes.</li>
            <li>Fipmoney reserves the right to undertake all necessary steps to ensure that the security, safety and integrity of the company's systems as well as its clients' interests are well-protected.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
