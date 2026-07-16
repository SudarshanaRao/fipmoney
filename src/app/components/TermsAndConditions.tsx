"use client";

import { motion } from "framer-motion";
import { ArrowLeft, AlertTriangle, Shield, Users, CreditCard, Package, FileText, Scale, Gavel, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "./ui/button";


interface TermsAndConditionsProps {
  onBack: () => void;
}

export default function TermsAndConditions({ onBack }: TermsAndConditionsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <motion.div
        className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-[#ffbf00] transition-colors font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center space-x-2 md:space-x-3 cursor-pointer" onClick={onBack}>
              <img src="/fipmoney_logo_final.png" alt="FipMoney Logo" className="h-10 w-auto object-contain" />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-base md:text-lg font-extrabold text-gray-900 tracking-tight leading-none">FipMoney</span>
                <span className="block text-[7px] md:text-[8px] font-bold text-[#ffbf00] tracking-wider uppercase mt-0.5">GOLD SIP PLATFORM</span>
              </div>
            </div>
            <h1 className="text-base md:text-xl font-bold text-gray-900 tracking-tight uppercase border-l-2 border-[#ffbf00] pl-3">
              Terms & Conditions
            </h1>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              FipMoney Terms and Conditions
            </h1>
            <p className="text-gray-600 mb-2">Last Updated: January 15, 2025</p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#ffbf00] to-[#ffd152] mx-auto rounded-full"></div>
          </div>

          {/* Important Notice */}
          <motion.div
            className="bg-[#fff8dc] border border-[#ffd152] rounded-xl p-6 mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-semibold text-[#b38200] mb-3 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Important Notice
            </h2>
            <p className="text-[#b38200] leading-relaxed mb-4">
              These terms and conditions ("Terms and Conditions" or "Terms") mandate the terms on which the users ("You" or "Your" or "User") can access and register on the website https://www.fipmoney.com/ including its mobile application – FipMoney; collectively the platform ("Platform") operated and managed by Finpages Tech Pvt Ltd ("FipMoney" "We" or "Us") and Finpages Gold Retail Pvt Ltd ("FipMoney Gold" or "We" or "Us") collectively referred to as the company ("Company") to provide you the services.
            </p>
            <p className="text-[#b38200] font-semibold">
              IF YOU DO NOT AGREE TO THESE TERMS AND CONDITIONS, YOU MAY NOT USE THE PLATFORM AND SHOULD NOT PROCEED TO CREATE ANY ACCOUNTS OR ACQUIRE ANY SUBSCRIPTIONS TO THE PLATFORM. BY USING THE PLATFORM, YOU ARE AGREEING TO BE BOUND BY THESE TERMS AND CONDITIONS, INCLUDING ALL AMENDMENTS MADE HERETO FROM TIME TO TIME.
            </p>
          </motion.div>

          {/* Introduction */}
          <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6 mb-12">
            <p>
              This is an electronic record in the form of an electronic contract formed under the Information Technology Act, 2000 and the rules made thereunder, and does not require any physical or digital signatures. This is being published in accordance with Rule 3(1) of the Information Technology (Intermediaries Guidelines and Digital Media Ethics Code) Rules, 2011, that requires publishing the rules and regulations, privacy policy and terms of use for access or usage of the platform.
            </p>

            <p>
              The Platform is an online portal that facilitates the Users to purchase, sell or transfer gold and/or other precious metals in digital form backed by gold bullions and coins with purity as mentioned ("Precious Metal") operated and managed by Us (incorporated under the laws of India with corporate identification number U47733KA2023PTC181719). FipMoney Gold provides for purchase and sale of Precious Metal, and providing services of safe keeping, vaulting, delivery and fulfilment of Precious Metal and related services ("Services").
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 my-6">
              <p className="font-semibold text-blue-900 mb-2">DISCLAIMER:</p>
              <p className="text-blue-800">
                YOU UNDERSTAND THAT BY REGISTERING TO AND/OR USING THE PLATFORM AND/OR ACCESSING SERVICES DIRECTLY OR INDIRECTLY FROM THE PLATFORM, YOU ONLY RECEIVE THE ABILITY TO USE THE PLATFORM FOR PURCHASE OF PRECIOUS METAL FROM FIPMONEY GOLD OR SUCH OTHER PRODUCTS/SERVICES OFFERED BY US FROM TIME TO TIME.
              </p>
            </div>

            <p>
              You understand that the Precious Metal is being offered for purchase by FipMoney Gold, and the User can also sell the Precious Metal through the Platform. As per these Terms and Conditions, the Precious Metal purchased by You will be accounted in a customer account maintained by FipMoney Gold and the corresponding quantity of Precious Metal in physical form will be stored with Brink's India Pvt. Limited ("Custodian").
            </p>

            <p>
              In order to safeguard Your interest, FipMoney Gold has also appointed an Administrator, Vistra Corporate Services (India) Private Limited ("Administrator"), and You agree to the appointment of such Administrator and the Custodian, and also accede to the terms for such arrangement with the Administrator. The Administrator shall be responsible for monitoring the physical Precious Metal held on Your behalf with the Custodian.
            </p>

            <p>
              Please read the Terms and Conditions and Privacy Policy (available at https://www.fipmoney.com/terms-and-conditions and https://www.fipmoney.com/privacy-policy) carefully before registering on the Platform or accessing any material and/or information through the Platform.
            </p>

            <p>
              The Company retains an unconditional right to modify or amend these Terms and Conditions without any requirement to notify You. You can determine when these Terms and Conditions were last modified by referring to the "Last Updated" legend above. It is Your responsibility to check these Terms and Conditions periodically for changes. Your continued use of the Platform indicates acceptance of the amended Terms and Conditions and signifies Your consent to be legally bound by them.
            </p>

            <p>
              These Terms and Conditions, together with the terms and conditions of the Platform, apply to You once You avail of the Services and purchase Precious Metal.
            </p>

            <p>
              By using the Services, you acknowledge that FipMoney is not responsible for the quality of physical Precious Metal being offered and sold by FipMoney Gold and that any disputes in relation to the quality of physical gold shall be raised directly by You to FipMoney Gold.
            </p>
          </div>

          {/* Section 1: Eligibility */}
          <section id="eligibility" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="w-6 h-6 mr-3 text-[#ffbf00]" />
              1. ELIGIBILITY
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start">
                <span className="font-semibold mr-4">a.</span>
                <p>By using the Services, you represent and warrant that you are above 18 years of age and qualified to enter into a legally binding contract enforceable under Indian law, including the Indian Contract Act, 1872.</p>
              </div>
              <div className="flex items-start">
                <span className="font-semibold mr-4">b.</span>
                <p>If you are not eligible to enter into any contract, please discontinue use of the Platform immediately.</p>
              </div>
              <div className="flex items-start">
                <span className="font-semibold mr-4">c.</span>
                <p>If you are the parent or guardian of a child under 18 years of age, by registering or creating an account on the Platform, you provide your consent to your child's registration and agree to be bound by these Terms and Conditions in respect of their use of the Platform.</p>
              </div>
              <div className="flex items-start">
                <span className="font-semibold mr-4">d.</span>
                <p>By using this Platform you warrant that you have the legal ability to purchase and sell Precious Metals, and are capable of being bound by these Terms and Conditions.</p>
              </div>
              <div className="flex items-start">
                <span className="font-semibold mr-4">e.</span>
                <p>You confirm that you are not registered under any applicable Goods and Services Tax Act, 2017. If, during your relationship with the Platform and/or FipMoney Gold, you become registered under the Goods and Services Tax Act, 2017, you shall inform Us of your change in status within 24 hours and provide any requested information or documents.</p>
              </div>
              <div className="flex items-start">
                <span className="font-semibold mr-4">f.</span>
                <p>The Company shall not be liable for any actions arising from your GST registration status. If necessary, you shall seek independent tax advice; these Terms and Conditions do not constitute investment or tax advice.</p>
              </div>
            </div>
          </section>

          {/* Section 2: Registration */}
          <section id="registration" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-[#ffbf00]" />
              2. REGISTRATION
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                The Services are available only to those who have subscribed to the Platform by registering and creating an account with Us. You can register to the Platform by providing your personal information, including name, age, gender and registered mobile number. Registration will be validated by sending a one‑time password (OTP) to your registered mobile number.
              </p>
              
              <p>
                We may also ask You for certain financial information, including Your billing address, bank account details, or other payment‑related details or other standing instructions to process payments for the Platform Services. The Company may also ask You to provide certain additional information about Yourself on a case‑by‑case basis. If there is any change in Your account information, You shall promptly update Your account information on the Platform.
              </p>

              <p>
                If You provide any information that is untrue, inaccurate, not current or incomplete (or that becomes so), or if the Company has reasonable grounds to suspect such, the Company has the right to suspend or terminate Your Account and refuse any and all current or future use of the Platform (or any portion thereof) at its sole discretion, in addition to any rights the Company may have against You at law or in equity, for any misrepresentation.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 my-6">
                <p className="font-semibold mb-4">By registering on the Platform, You agree to:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="font-medium mr-2">(a)</span>
                    <span>provide correct details when prompted, noting that failure to do so may invalidate Your request to use Services;</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">(b)</span>
                    <span>authorise the Platform and the Company to retain the information shared by You for the purpose of using the Platform and/or accessing the Services and for any marketing campaign undertaken by the Company and/or third‑party service providers; and</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">(c)</span>
                    <span>abide by these Terms and Conditions and the Privacy Policy.</span>
                  </li>
                </ul>
              </div>

              <p>
                By registering, You agree that You will not allow others to use Your account and that You are fully responsible for all activities occurring under Your account. We may assume that any communications received under Your account have been made by You. By providing such personal information, You consent to receive all information, communication and instructions relating to the Platform, the Services offered, and special offers and promotional benefits. You shall be solely responsible for appropriate use of the same.
              </p>

              <p>
                You shall immediately notify the Company of any unauthorized use or breach of Your password or account, and ensure You exit from Your account at the end of each session. The Company reserves the right to refuse service, terminate accounts, remove or edit content, or cancel orders at its sole discretion. The Company cannot and will not be liable for any loss or damage arising from Your failure to comply with these Terms and Conditions. You may be held liable for losses incurred by the Company or any other user or visitor to the Platform due to authorized or unauthorized use of Your Account resulting from Your failure to keep Your account information secure and confidential.
              </p>
            </div>
          </section>

          {/* Section 3: Platform Services */}
          <section id="platform-services" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Package className="w-6 h-6 mr-3 text-[#ffbf00]" />
              3. PLATFORM SERVICES
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Company, at any time and at its sole discretion, may change the specifications of any functionality/feature utilized by individuals on the Platform. Company will not be liable for any inconvenience caused due to such changes in or discontinuation of any functionality/feature. By registering on the Platform, You are allowed to purchase Precious Metal pursuant to the collaboration between FipMoney and FipMoney Gold. FipMoney hereby grants You, a limited, non‑exclusive, non‑transferable, royalty‑free license to use the Platform for the purposes of availing the Services.
              </p>

              <div className="bg-blue-50 rounded-lg p-6 my-6">
                <p className="font-semibold mb-4 text-blue-900">The services offered on the Platform shall include but are not limited to the following facilitating buying and selling of Precious Metals ("Platform Services" or "Services"):</p>
                <ul className="space-y-2 text-blue-800">
                  <li>– purchase of digital Precious Metal</li>
                  <li>– sale of digital Precious Metal</li>
                  <li>– transfer of digital Precious Metal</li>
                </ul>
              </div>

              <p>
                Before placing an order and availing the Services, the User may be required to provide certain KYC documentation and other information as may be required by FipMoney in such form and manner as it may deem fit. This information may be requested from You:
              </p>

              <ul className="space-y-2 ml-6 text-gray-700">
                <li>• at the time of registration, or</li>
                <li>• at a later stage, including when
                  <ul className="ml-4 mt-2 space-y-1">
                    <li>◦ You withdraw your purchase of digital gold or balance of Your Precious Metal, and/or</li>
                    <li>◦ You wish to get Your Precious Metal delivered to Your doorstep (subject to sufficient balance).</li>
                  </ul>
                </li>
              </ul>

              <p>
                KYC verification shall be undertaken based on Your government identity card ("ID") including the PAN Card issued to You. You shall upload a clear picture of your ID or PAN Card, except where e‑PAN is provided. We shall verify Your details from the issuing authority's database, including through Digilocker. If You do not have an ID and/or PAN Card, You may submit Form 60 to Us.
              </p>

              <p>
                It is clarified that any Services offered (purchase, sale or transfer of Precious Metal on the Platform) are governed under the terms and conditions of FipMoney Gold, operated and managed by FipMoney Gold Retail Private Limited.
              </p>

              <p>
                You agree and acknowledge that the data and information provided on the Platform do not constitute advice of any nature whatsoever and shall not be relied upon by You in making decisions. You shall be solely responsible for any decisions and for the purchase of any Precious Metal on the Platform. In no event shall the Company be liable to You for any loss or damage arising from or in relation to these Terms and Conditions and/or use of the Platform.
              </p>

              <p>
                As part of the Platform Services, You agree to provide honest feedback or reviews about the Services if requested by the Company.
              </p>
            </div>
          </section>

          {/* Section 4: Placing of Order */}
          <section id="placing-order" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <CreditCard className="w-6 h-6 mr-3 text-[#ffbf00]" />
              4. PLACING OF ORDER
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                You can purchase Precious Metal on the Platform on a pre‑payment basis. Once you place the order and confirm the transaction for purchase of Precious Metal ("Customer Order"), the same shall be notified by the Company to FipMoney Gold.
              </p>

              <p>
                Once payments are received by FipMoney Gold and your KYC information is found acceptable, FipMoney Gold shall issue an invoice to You confirming the Customer Order within 3 (three) business days of placing such order, in a manner it may deem fit. Notwithstanding anything to the contrary contained herein, the Company shall be entitled to accept or reject any Customer Order, for any reason whatsoever, at its sole and exclusive discretion.
              </p>

              <p>
                After a Customer Order is placed, You are not entitled to cancel it, provided however that the Customer Order shall stand cancelled if the payment fails for any reason whatsoever. The Platform and/or FipMoney Gold reserve the right to cancel any Customer Order at their sole discretion if the information You provided prior to placing the order is not found acceptable or if they determine that You are not eligible to purchase Precious Metal.
              </p>

              <p>
                In case of rejection of any Customer Order for which payments have been received by FipMoney Gold, such payments shall be returned to You in accordance with these Terms and Conditions. Insurance premia is borne by FipMoney Gold. Pursuant to such insurance policy(ies), for any loss or damage to the Customer's Precious Metal stored in the vault, You authorize the Administrator to act as Your beneficiary under the insurance policy(ies) and to take all steps necessary to protect Your interests in the Precious Metal.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
                <p className="font-semibold text-green-800 mb-3">Insurance Coverage:</p>
                <p className="text-green-700 mb-3">
                  While the Custodian has taken the necessary insurance policy/ies, in case of occurrence of an event not covered in such insurance policy/ies, the Customer Precious Metal may be at risk. The insurance policy/ies obtained by the Custodian are in line with the global industry practices and cover losses due to:
                </p>
                <ul className="space-y-1 text-green-700 ml-4">
                  <li>• fire, lightning, theft and/or attempted theft</li>
                  <li>• cyclone, tornado, windstorm</li>
                  <li>• earthquake, flood, explosion</li>
                  <li>• malicious damage or collision or overturn of conveyance</li>
                </ul>
                <p className="text-green-700 mt-3">
                  but do not cover losses due to events such as war, revolution, derelict weapons of war, nuclear radiation, etc.
                </p>
              </div>

              <p>
                In the event of any expenses or charges remaining payable to the Custodian, the Administrator or such other person appointed by FipMoney Gold as an intermediary, or otherwise till actual delivery or fulfilment of any of Your Customer Orders for any reason, including where FipMoney Gold is unable to service such requests due to any event of default, thereby adversely affecting or jeopardizing the fulfilment of Your Customer Orders, then the Administrator will be entitled to sell part of the Customer Precious Metal and satisfy such outstanding expenses or charges as required in accordance with these Terms and Conditions read with the Administrator agreement.
              </p>
            </div>
          </section>

          {/* Section 5: Pricing and Payment Policy */}
          <section id="pricing-payment" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <CreditCard className="w-6 h-6 mr-3 text-[#ffbf00]" />
              5. PRICING AND PAYMENT POLICY
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Except where noted otherwise, the price displayed on the Platform represents the market‑linked price of Precious Metal as indicated by FipMoney Gold. "Market‑linked prices" means that these quotes are linked to the prices of Precious Metal in the commercial bullion market in India. However, it does not indicate that the Precious Metal prices displayed on the Platform will always be the same as those prevalent in other commercial bullion markets. As a purchaser, it is Your responsibility to compare the prices and take appropriate decisions after adequate diligence.
              </p>

              <p>
                Display of such price of Precious Metal shall not constitute a binding offer and is an invitation to offer to purchase Precious Metal at the said price to all customers. These prices may vary multiple times within a day, and accordingly Your payment obligations for any Customer Order will depend on the prices displayed at the relevant time.
              </p>

              <div className="bg-blue-50 rounded-lg p-6 my-6">
                <p className="font-semibold text-blue-800 mb-3">Payment Policy:</p>
                <p className="text-blue-700">
                  Payment will be accepted through the payment options made available on the Platform, which may include redirection to payment gateways and aggregators hosted by third‑party websites or applications, including UPI payments like PhonePe (https://www.phonepe.com/) and Paytm (https://paytm.com/), etc. At the time of purchase, fulfilment, sale and/or transfer of Precious Metal, the relevant taxes will be chargeable as applicable under Government regulations and applicable laws.
                </p>
              </div>

              <p>
                Transactions on the Platform will be completed only after successful transfer of money to FipMoney Gold's bank account, either from Your registered bank account or from the escrow account maintained by the Company. The corresponding Precious Metal quantity will be credited to Your Account maintained with the Company within 5 (five) business days from the date of successful transfer of such amount.
              </p>

              <p>
                Please understand the terms of custodian and administrator arrangement before making the saving.
              </p>

              <p>
                The quantity of Precious Metal purchased by You shall be stored with the Custodian in a vault on Your behalf. You hereby authorize FipMoney Gold to store such physical Precious Metal products purchased by You pursuant to the Customer Order, including, but not limited to, bullion and coins (as the case may be) in the secured vault maintained with the Custodian on Your behalf ("Customer Precious Metal").
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-6">
                <p className="font-semibold text-yellow-800 mb-3">Storage Terms:</p>
                <p className="text-yellow-700">
                  You will be provided with free storage for Your Customer Precious Metal for 5 years, or for such period as more particularly stipulated by FipMoney Gold in this regard from time to time at its sole discretion and notified to Customers on the Platform ("Free Storage Period"). After the expiry of the Free Storage Period, FipMoney Gold shall be entitled to levy storage charges ("storage charges") for such Customer Precious Metal at such rate as would be specified on the Platform, and which may be revised from time to time.
                </p>
              </div>

              <p>
                The charges would be levied by deducting the Precious Metal balance at the end of each month by a percentage amount at the specified rate. You are advised to periodically check the Platform to understand these storage charges. In the event FipMoney Gold is not able to deduct the storage charges because Your Precious Metal balance is too low, then FipMoney Gold shall be entitled to sell such portion of Your Customer Precious Metal stored with the Custodian that is necessary or required to recover the unpaid storage charges in question.
              </p>

              <p>
                Unclaimed rewards will expire 90 days from the date of credit.
              </p>
            </div>
          </section>

          {/* Section 6: Delivery of Precious Metal */}
          <section id="delivery" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Package className="w-6 h-6 mr-3 text-[#ffbf00]" />
              6. DELIVERY OF PRECIOUS METAL
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                For the purposes of making delivery to You, You are required to provide a valid address and/or any other documents/information/biometric identification that may be specified in this regard by Company on the Platform and/or any other website as specified from time to time. You are required to take delivery of Your Customer Precious Metal within such maximum period as shall be specified for this purpose by FipMoney Gold from time to time on the Platform ("Maximum Storage Period").
              </p>

              <p>
                In the event that no valid address has been provided by You during the Maximum Storage Period, then Platform and FipMoney Gold shall for a period of 1 (one) year commencing from the date of expiry of Maximum Storage Period (such period being the "Grace Period") attempt at least once to contact You using the contact information provided by You to obtain either (i) an address to which You would require the Precious Metal in question to be delivered or (ii) Your bank account details into which sale proceeds of the Customer Precious Metal shall be deposited.
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
                <p className="font-semibold text-red-800 mb-3">Unclaimed Precious Metal Policy:</p>
                <p className="text-red-700">
                  In the event that Platform and/or FipMoney Gold has not been able to contact You during the applicable Grace Period using the contact information provided by You or where You shall during the Grace Period either fail to take delivery of the physical Precious Metal in question for any reason whatsoever (including where You shall not have provided any address to take delivery of such physical Precious Metal), or provide the details for a valid bank account into which the proceeds of any sale of such Customer Precious Metal is to be deposited, then upon expiry of the applicable Grace Period for the Customer Precious Metal in question, FipMoney Gold shall be entitled to purchase such Customer Precious Metal with the purchase price being the applicable prevailing price displayed on the Platform for purchase of Precious Metal from Customers.
                </p>
              </div>

              <p>
                The purchase proceeds realized from such sale of Precious Metal on the Platform ("Final Sale Proceeds") after deducting any amounts payable to FipMoney Gold as storage charges after the free storage period, shall be deposited into a bank account operated by the Administrator who shall be the sole signatory to such bank account.
              </p>

              <p>
                In the event that You shall during a period of 3 (three) years commencing from the date of expiry of the applicable Grace Period (such period being the "Final Claim Period") notify either the Platform, FipMoney Gold and/or the Administrator that You are claiming the applicable Final Sale Proceeds, the Administrator shall issue suitable instructions to transfer the Final Sale Proceeds to such bank account as You shall notify for this purpose. Please note that to claim the Final Sale Proceeds You will be required to provide details of a valid bank account and that the Final Sale Proceeds will not be transferred in the absence of such details. At no time will the Final Sale Proceeds be paid to You in cash.
              </p>

              <p>
                In the event that You shall not claim Your Final Sale Proceeds within the Final Claim Period, then the Final Sale Proceeds shall be transferred to the Prime Minister's Relief Fund or such other fund as You may designate for this purpose at any time prior to the expiry of the Grace Period.
              </p>
            </div>
          </section>

          {/* Section 7: Return and Cancellation Policy */}
          <section id="return-cancellation" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-3 text-[#ffbf00]" />
              7. RETURN AND CANCELLATION POLICY
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                On use of any coupon or discount made available by us on the Platform or any other website or platform of any authorised third party for purchase of Precious Metal, the same shall be verified and adjusted, as may be necessary, within 7 (seven) days of use of such coupon or discount.
              </p>

              <p>
                Upon confirmation of the payment, You shall be permitted to withdraw the monies after 24 (twenty‑four) hours of making such purchase, and there is no minimum lock‑in period.
              </p>

              <p>
                Once the payment has been confirmed, the same shall be binding on You and cannot be cancelled.
              </p>

              <p>
                You can also pause Your roundup detection and savings for a defined period of time. You can find the option of pausing Your savings for 10 (ten) days to 1 (one) month in the settings of the mobile application.
              </p>
            </div>
          </section>

          {/* Section 8: Refund Policy */}
          <section id="refund" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <CreditCard className="w-6 h-6 mr-3 text-[#ffbf00]" />
              8. REFUND POLICY
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Once an order for purchase or sale has been confirmed by You, refunds or cancellation are not possible. All orders are final upon Your confirmation.
              </p>

              <p>
                For any queries, email us at support@fipmoney.com. We assure You that Your request will be addressed on priority.
              </p>
            </div>
          </section>

          {/* Section 9: Your Obligations and Responsibilities */}
          <section id="obligations" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="w-6 h-6 mr-3 text-[#ffbf00]" />
              9. YOUR OBLIGATIONS AND RESPONSIBILITIES
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>While accessing our Platform, You shall:</p>
              <ul className="space-y-2 ml-6">
                <li>– Comply with these Terms and Conditions and any special warnings or instructions posted on the Platform from time to time.</li>
                <li>– Not make any change or alteration to the Platform or any Content or Services on the Platform or on FipMoney Gold, nor impair in any way the integrity or operation of the Platform.</li>
                <li>– Always act in accordance with extant laws, customs and in good faith.</li>
                <li>– Not publish Precious Metal prices, descriptions, or any other Platform information on any other medium.</li>
                <li>– Use the Platform only for purposes permitted by these Terms and in accordance with applicable law.</li>
              </ul>

              <div className="bg-gray-50 rounded-lg p-6 my-6">
                <p className="font-semibold mb-4">You represent and warrant that:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="font-medium mr-2">a.</span>
                    <span>Payment for purchase of Services is made from Your bank account (primary holder's bank account in case of a jointly held investment account), from legitimate sources and remitted through approved banking channels;</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">b.</span>
                    <span>Before making the purchase, You shall seek independent financial, legal, accounting, tax or other professional advice, if required; and</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">c.</span>
                    <span>You will not sell, trade, or otherwise transfer Your registered account to another party or impersonate any other person for the purpose of creating an account with the Platform.</span>
                  </li>
                </ul>
              </div>

              <p>
                You agree, acknowledge and confirm that You alone, to the exclusion of the Company, are liable for all liabilities arising from acts of omission or commission attributable to You, including but not limited to providing inputs such as UPI details, phone number or email address, bank account details, and addresses.
              </p>

              <p>
                Without limiting any other provision of these Terms and Conditions, if You default on any obligation herein, You shall be liable for all losses and damages caused to the Platform, the Company, its partners or licensors.
              </p>
            </div>
          </section>

          {/* Section 10: Intellectual Property Rights */}
          <section id="intellectual-property" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-[#ffbf00]" />
              10. INTELLECTUAL PROPERTY RIGHTS
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                The Platform and all information, content, materials, products including, but not limited to text, photographs, graphics, video and audio content and computer code ("Content") on the Platform is owned and controlled by the Company. The design, structure, selection and arrangement of the Content is protected by copyright, patent and trademark laws and other applicable intellectual property rights either in favour of the Company or third parties from whom appropriate permissions have been obtained.
              </p>

              <p>
                The trademarks, logos and service marks displayed on the Platform ("Marks") are the property of the Company and/or its Affiliates or other third parties. You are not permitted to use the Marks without the express prior written consent of the owner. All information, except Your personal information and other data submitted by You for transacting on the Platform, shall be deemed the property of the Company, which shall be free to use any ideas, concepts, know‑how or techniques provided by You in any manner whatsoever.
              </p>

              <p>
                By initiating contact or query through the Platform, You agree to be contacted by the Company or its service partners.
              </p>

              <p>
                You acknowledge that the Platform Services constitute original works developed, compiled, prepared, revised, selected and arranged by the Company through the application of methods and standards of judgment developed and applied through the expenditure of substantial time, effort and money. You agree to protect the Company's proprietary rights during and after the term of these Terms.
              </p>
            </div>
          </section>

          {/* Section 11: Limitation of Liability */}
          <section id="limitation-liability" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-3 text-[#ffbf00]" />
              11. LIMITATION OF LIABILITY
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                The Content on this Platform is for your general information and use only and does not amount to any investment advice.
              </p>

              <p>
                The Customer hereby assumes the sole risk of making use of or relying on the information, materials and services relating to the products available on the Platform. The Company makes no representations about the suitability, completeness, timeliness, reliability, legality in Customer's jurisdiction, or accuracy of the information, materials and services relating to the products described or contained in the Platform for any purpose.
              </p>

              <p>
                You expressly understand and agree that, to the maximum extent permitted by applicable law, the Platform and Content are provided by the Company on an "as is" basis without any warranty of any kind, express, implied, statutory or otherwise, including the implied warranties of title, non‑infringement, merchantability or fitness for a particular purpose.
              </p>

              <p>
                The Company will have no liability related to any user Content arising under intellectual property rights, libel, privacy, publicity, obscenity or other applicable laws. The Company will not incur any liability with respect to the misuse, loss, modification or unavailability of any user Content.
              </p>

              <p>
                The Company shall not be responsible for the delay or inability to use the Platform or related functionalities, the provision of or failure to provide functionalities, or for any information, software, functionalities and related graphics obtained through the Platform, or otherwise arising out of the use of the Platform, whether based on contract, tort, negligence, strict liability or otherwise.
              </p>
            </div>
          </section>

          {/* Section 12: Indemnity */}
          <section id="indemnity" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-[#ffbf00]" />
              12. INDEMNITY
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                You agree to indemnify the Company, its Affiliates, their respective directors, officers and employees from any losses, damages, penalties, claims, costs and demands (including reasonable attorney fees and legal costs) arising out of breach or non-performance and/or non-observance of the duties and obligations, representations, warranties and covenants under the Terms and Conditions or due to Your acts or omissions.
              </p>

              <p>
                You further agree to hold the Company, its Affiliates, their respective directors, officers and employees harmless against any claims made by any third party due to, or arising out of, or in connection with, Your use of the Platform, any misrepresentation with respect to the data or information provided by You, Your violation of the Terms and Conditions, or Your violation of any rights of another, including any intellectual property rights.
              </p>

              <p>
                In no event shall the Company, its Affiliates, their respective directors, officers, partners, consultants, agents and employees be liable to You or any third party for any special, incidental, indirect, consequential or punitive damages whatsoever, arising out of or in connection with Your use of or access to the Platform or Content on the Platform.
              </p>
            </div>
          </section>

          {/* Section 13: Force Majeure */}
          <section id="force-majeure" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-3 text-[#ffbf00]" />
              13. FORCE MAJEURE
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                The Company shall not be liable for failure or error of any transaction on the Platform or for any failure on part of the Company to perform any of its obligations under these Terms and Conditions if performance is prevented, hindered or delayed by a Force Majeure event (as defined below) and in such case its obligations under these Terms and Conditions shall be suspended for so long as the Force Majeure event continues.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 my-6">
                <p className="font-semibold mb-3">The term "Force Majeure Event" means any event which occurred and is beyond the control of the Company, including without limitations:</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• unavailability of any communication systems</li>
                  <li>• breach, or virus in the processes or payment or delivery mechanism</li>
                  <li>• sabotage, fire, flood, explosion, acts of god, civil commotion, pandemic</li>
                  <li>• epidemic, strikes or industrial action of any kind, riots, insurrection, war</li>
                  <li>• acts of government, computer hacking, unauthorised access to computer data</li>
                  <li>• storage devices, computer crashes, malfunctioning in the computer terminal</li>
                  <li>• systems getting affected by any malicious, destructive or corrupting code</li>
                  <li>• mechanical or technical errors/failures or power shut down</li>
                  <li>• faults or failures in telecommunication etc.</li>
                </ul>
              </div>

              <p>
                The Company shall be discharged from such performance to the extent of and during the period of such Force Majeure Event, and such non-performance of its obligations shall, in no event whatsoever, amount to a breach of its obligations.
              </p>
            </div>
          </section>

          {/* Section 14: Suspension and Termination */}
          <section id="suspension-termination" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="w-6 h-6 mr-3 text-[#ffbf00]" />
              14. SUSPENSION AND TERMINATION
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                The Terms and Conditions will continue to apply until terminated by either You or the Company for reasons set forth below. If You object to the Terms and Conditions or are dissatisfied with the Platform and/or the Services, Your only recourse is to (i) close Your registered account on the Platform; and/or (ii) stop accessing the Platform.
              </p>

              <p>
                In case You violate these Terms and Conditions and/or any applicable law, the Company may, at any time and in its sole discretion, terminate Your Account and/or prevent You from accessing the Platform and the Platform Services. The Company may delist You or block Your future access to the Platform or suspend or terminate Your registered account if it believes, in its sole and absolute discretion, that You have infringed, breached, violated, abused, or unethically manipulated or exploited any term of these Terms and Conditions.
              </p>

              <p>
                Notwithstanding anything in this clause, these Terms and Conditions will survive indefinitely unless and until the Company or FipMoney Gold chooses to terminate or modify them.
              </p>

              <p>
                If You or the Company terminate Your use of the Platform, the Company may delete any content or other materials relating to You and the Company shall have no liability to You or any third party for doing so. However, Your transaction details may be preserved by the Company for purposes of tax or regulatory compliance.
              </p>

              <p>
                The Company may modify or amend these Terms and Conditions at any time.
              </p>
            </div>
          </section>

          {/* Section 15: Governing Laws */}
          <section id="governing-laws" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Scale className="w-6 h-6 mr-3 text-[#ffbf00]" />
              15. GOVERNING LAWS
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                The Terms of Use shall be governed and construed in accordance with the laws of India without reference to conflict of laws principles.
              </p>
            </div>
          </section>

          {/* Section 16: Disputes */}
          <section id="disputes" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Gavel className="w-6 h-6 mr-3 text-[#ffbf00]" />
              16. DISPUTES
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                With respect to any dispute regarding the Platform, all rights and obligations and all actions contemplated by these Terms and Conditions shall be governed by the laws of India and, subject to this Clause 16, the courts at Mumbai, India shall have exclusive jurisdiction to deal with such disputes.
              </p>

              <p>
                To the fullest extent permitted by applicable law, any dispute, differences or claim arising out of Your visit to this Platform or availing the Services, including Platform Services, shall be referred to and finally resolved by mediation and in accordance with the dispute resolution provisions under the Indian Consumer Protection Act, 2019.
              </p>

              <p>
                Please review our other policies, including the privacy policy (accessed at https://www.fipmoney.com/privacy-policy), posted on the Platform. The aforementioned policies also govern Your visit to the Platform. The Company reserves the right to modify the Platform and/or alter these Terms and Conditions and/or policies at any time and retains the right to deny access at any time, including the termination of membership and deletion of the account, to anyone who the Company believes has violated the provisions of the Terms and Conditions.
              </p>
            </div>
          </section>

          {/* Section 17: Communications */}
          <section id="communications" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Phone className="w-6 h-6 mr-3 text-[#ffbf00]" />
              17. COMMUNICATIONS
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                You hereby expressly agree to receive communication (including transactional messages) by way of SMS and/or e-mail or through WhatsApp from the Company or any third party in connection with the Platform Services or Your registration on the Platform.
              </p>

              <p>
                You can unsubscribe/opt-out from receiving communications through e-mail anytime by writing to support@fipmoney.com.
              </p>
            </div>
          </section>

          {/* Section 18: Grievances */}
          <section id="grievances" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="w-6 h-6 mr-3 text-[#ffbf00]" />
              18. GRIEVANCES
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We are committed to resolving all disputes in a fair, effective and cost-efficient manner. We seek to resolve any User concerns through our Grievance cell.
              </p>

              <p>
                All Grievances related to the use of Platform shall be addressed to Mr. Rajesh Kumar (Grievance Officer). Please write to us at grievance@fipmoney.com. The Grievance Officer will get back to You within 48 hours of the receipt of any complaint from You.
              </p>

              <p>
                Every grievance will be provided with a complaint or ticket number which can be used to track the status of the grievance. Redressal or closure of a grievance might take approximately one month from the date of receipt of complaint.
              </p>

              <p>
                However, if you are dissatisfied with our grievance redressal mechanism, the dispute will be resolved through mediation in accordance with Consumer Protection Act, 2019 and as provided in Clause 16 hereinabove.
              </p>
            </div>
          </section>

          {/* Section 19: Confidentiality */}
          <section id="confidentiality" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-[#ffbf00]" />
              19. CONFIDENTIALITY
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                All communications between You and the Company and all confidential information given to or received by You from the Company, and all information concerning the business transactions of the Company with any entity or person with whom it may or may not have a confidentiality obligation with regard to the matter in question, shall be kept confidential by You (whether or not such information or data has been marked as confidential) unless specifically permitted to the contrary in writing by the Company.
              </p>

              <p>
                This confidentiality obligation shall survive the termination of these Terms and Conditions and the User account of the concerned User.
              </p>
            </div>
          </section>

          {/* Section 20: General Provisions */}
          <section id="general-provisions" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-[#ffbf00]" />
              20. GENERAL PROVISIONS
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Notice:</strong> All notices from the Company will be served by email to Your registered email address or by general notification on the Platform. Any notice provided to the Company pursuant to the Terms and Conditions should be sent to legal@fipmoney.com.
              </p>

              <p>
                <strong>Assignment:</strong> You cannot assign or otherwise transfer the Terms and Conditions, or any rights granted hereunder to any third party. The Company's rights under the Terms and Conditions are freely transferable by the Company to any third party without Your consent.
              </p>

              <p>
                <strong>Severability:</strong> If, for any reason, a court of competent jurisdiction finds any provision of the Terms and Conditions, or any portion thereof, to be unenforceable, that provision shall be enforced to the maximum extent permissible so as to give effect to the intent of the parties as reflected by that provision, and the remainder of the Terms and Conditions shall continue in full force and effect.
              </p>

              <p>
                <strong>Waiver:</strong> Any failure by the Company to enforce or exercise any provision of the Terms and Conditions, or any related right, shall not constitute a waiver by the Company of that provision or right.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <div className="mt-12 p-8 bg-gradient-to-r from-[#fff8dc] to-[#ffbf00] rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Email Support
                </h4>
                <div className="space-y-2 text-gray-700">
                  <p><strong>General Support:</strong> support@fipmoney.com</p>
                  <p><strong>Legal Queries:</strong> legal@fipmoney.com</p>
                  <p><strong>Grievances:</strong> grievance@fipmoney.com</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Office Details
                </h4>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Phone:</strong> +91 94918 41941</p>
                  <p><strong>Address:</strong> #709, Gowra FountainHead, Huda techno Enclave, Hitec City, Hyderabad 500081</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="mt-8 text-center text-sm text-gray-500 space-y-2">
            <p>© 2025 Finpages Tech Pvt Ltd. All rights reserved.</p>
            <p>Corporate Identification Number: U47733KA2023PTC181719</p>
            <p>This document was last updated on January 15, 2025</p>
            <p>
              FipMoney, a platform used to encourage savings habits in Indians by helping them save on a daily basis.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}