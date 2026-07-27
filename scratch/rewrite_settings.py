import sys
import re

with open('src/app/components/SettingsPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
content = content.replace(
    'Shield, Check, HelpCircle, PhoneOff, Camera, Video, Loader2\\n} from "lucide-react";',
    'Shield, Check, HelpCircle, PhoneOff, Camera, Video, Loader2, Save, Landmark, Lock, Trophy, Circle, Eye, Headset\\n} from "lucide-react";'
)

# 2. Header title and subtitle
content = content.replace(
    '<h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Settings</h1>',
    '<h1 className="text-3xl font-black text-gray-900 tracking-tight">Settings</h1>'
)
content = content.replace(
    '<p className="text-xs text-gray-400 font-semibold mt-1">Manage your financial profile and account configurations</p>',
    '<p className="text-sm text-gray-500 font-semibold mt-1">Manage your financial profile and account configurations</p>'
)

# 3. Save button
content = re.sub(
    r'<button\s*onClick=\{handleSave\}.*?</button>', 
    '''<button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 rounded-lg text-white text-sm font-bold shadow-sm hover:shadow-md disabled:bg-gray-300 disabled:shadow-none cursor-pointer outline-none border-none transition-all flex items-center justify-center gap-2 bg-[#d97706]"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : saveSuccess ? (
              <CheckCircle2 size={16} />
            ) : (
              <Save size={16} />
            )}
            {saveSuccess ? "Saved!" : "Save Changes"}
          </button>''', 
    content, count=1, flags=re.DOTALL
)

# 4. Tabs
new_tabs = '''{/* Sub Navigation Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto hide-scrollbar gap-4 mt-6">
          {[
            { id: "profile", label: "Profile Details", icon: User },
            { id: "bank", label: "Bank Account", icon: Landmark },
            { id: "nominee", label: "Nominee Setup", icon: Lock },
            { id: "security", label: "Security & KYC", icon: ShieldCheck }
          ].map((tab) => {
            const active = activeSubTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as SettingsTab)}
                className={`relative px-4 py-4 text-[13px] transition-all cursor-pointer outline-none border-none bg-transparent whitespace-nowrap flex items-center gap-2
                  ${active ? "text-[#d97706] font-bold" : "text-gray-500 font-semibold hover:text-gray-800"}`}
              >
                <Icon size={16} className={active ? "text-[#d97706]" : "text-gray-400"} />
                {tab.label}
                {active && (
                  <motion.div
                    layoutId="activeSubTabLine"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#d97706] rounded-t-full"
                  />
                )}
              </button>
            );
          })}
        </div>'''
content = re.sub(r'\{\/\* Sub Navigation Tabs.*?</div>\s*\n\s*\}\)\}\s*</div>', new_tabs, content, flags=re.DOTALL)

# 5. Profile Details Header
content = re.sub(
    r'<div>\s*<h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Profile</h3>\s*<p className="text-xs text-gray-400 mt-1 font-semibold">Update your photo and personal details here\.</p>\s*</div>',
    '''<div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-50 rounded-full border border-gray-100 text-gray-700">
                       <User size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">Profile Details</h3>
                      <p className="text-sm text-gray-500 font-medium mt-0.5">Update your photo and personal details here.</p>
                    </div>
                  </div>''',
    content
)

# 6. Green checkmarks for inputs
content = re.sub(
    r'<input(.*?)className="flex-1 px-3.5 py-2.5 text-sm font-medium text-gray-850 bg-white border-none outline-none"(.*?)/>',
    r'<input\1className="flex-1 px-3.5 py-2.5 text-sm font-medium text-gray-850 bg-white border-none outline-none"\2/>\n                        <div className="flex items-center px-3 bg-white text-emerald-500"><CheckCircle2 size={16} /></div>',
    content
)

content = re.sub(
    r'<input\s*type="text"\s*value=\{fullName\}(.*?)className="w-full max-w-lg (.*?)"\s*/>',
    r'''<div className="flex max-w-lg rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm focus-within:border-amber-500 transition-all">
                          <input type="text" value={fullName}\1className="flex-1 px-3.5 py-2.5 text-sm font-medium text-gray-850 bg-white border-none outline-none" />
                          <div className="flex items-center px-3 bg-white text-emerald-500"><CheckCircle2 size={16} /></div>
                        </div>''',
    content, count=1
)

# 7. Change Photo and Remove buttons
content = content.replace(
    '''<div className="flex gap-4">
                        <button
                          onClick={handleRemovePhoto}
                          className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer outline-none"
                        >
                          Delete
                        </button>
                        <button
                          onClick={handleUploadPhoto}
                          className="text-xs font-bold text-amber-600 hover:text-amber-800 transition-colors bg-transparent border-none cursor-pointer outline-none"
                        >
                          Update
                        </button>
                      </div>''',
    '''<div className="flex gap-4">
                        <button
                          onClick={handleUploadPhoto}
                          className="text-xs font-bold text-[#d97706] hover:bg-orange-50 border border-[#d97706] bg-transparent rounded-lg px-4 py-2 cursor-pointer transition-colors outline-none"
                        >
                          Change Photo
                        </button>
                        <button
                          onClick={handleRemovePhoto}
                          className="text-xs font-bold text-red-500 hover:bg-red-50 border border-red-500 bg-transparent rounded-lg px-4 py-2 cursor-pointer transition-colors outline-none"
                        >
                          Remove
                        </button>
                      </div>'''
)

# 8. Change buttons for Email/Mobile
content = content.replace(
    'className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-black px-5 py-2.5 rounded-xl transition-all cursor-pointer border-none shrink-0"',
    'className="bg-[#d97706] hover:bg-orange-600 text-white text-sm font-bold px-5 py-2 rounded-lg transition-all cursor-pointer border-none shrink-0"'
)

# 9. PAN and Aadhaar Tags
content = content.replace(
    'text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100',
    'text-xs font-bold px-3 py-1 rounded-md bg-emerald-50 text-emerald-600'
)

# 10. Right Column (Profile Completion and Security Compliance)
content = re.sub(
    r'\{\/\* Completion Percentage card \*\/\}.*?\{\/\* Quick security tips card \*\/\}.*?</div>\s*</div>\s*</div>',
    '''{/* Completion Percentage card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-150 shadow-sm flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-6 w-full justify-center">
                <Trophy size={18} className="text-[#d97706]" />
                <h3 className="text-sm font-extrabold text-gray-900 tracking-tight">Profile Completion</h3>
              </div>

              <div className="relative w-36 h-36 flex items-center justify-center p-1">
                <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90 overflow-visible">
                  <circle cx="60" cy="60" r="50" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="60" cy="60" r="50" stroke="#d97706" strokeWidth="8" fill="transparent"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={2 * Math.PI * 50 * (1 - percentage / 100)}
                    strokeLinecap="round" className="transition-all duration-500 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-gray-800 leading-none">{percentage}%</span>
                  <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wider mt-1.5">Completed</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <h4 className="text-[13px] font-bold text-gray-800">
                  {percentage === 100 ? "Perfect Profile Score! 🎉" : percentage >= 80 ? "Profile is almost ready!" : "Complete your profile details"}
                </h4>
                <p className="text-[11px] font-medium text-gray-500 leading-relaxed px-2">
                  {percentage === 100
                    ? "All information is successfully registered."
                    : "Fill in your Nominee and Bank account details to unlock premium gold vault features and get verified."
                  }
                </p>
              </div>

              {/* Progress checklist detail items */}
              <div className="w-full mt-6 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span className="text-gray-700 font-bold text-[13px]">Personal & Basic Info</span>
                  </div>
                  <span className="text-gray-500 text-xs font-bold">40%</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span className="text-gray-700 font-bold text-[13px]">Job Title & Income Range</span>
                  </div>
                  <span className="text-gray-500 text-xs font-bold">20%</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    {bankName.trim() && accountNumber.trim() && ifscCode.trim() ? (
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    ) : (
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    )}
                    <span className="text-gray-700 font-bold text-[13px]">Link Bank Account</span>
                  </div>
                  <span className="text-gray-500 text-xs font-bold">20%</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    {nomineeName.trim() && nomineeDob.trim() ? (
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    ) : (
                      <Circle size={16} className="text-[#d97706] shrink-0" />
                    )}
                    <span className="text-gray-700 font-bold text-[13px]">Nominee Verification</span>
                  </div>
                  <span className="text-gray-500 text-xs font-bold">20%</span>
                </div>
              </div>
            </div>

            {/* Security Compliance Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-150 shadow-sm flex flex-col relative overflow-hidden mt-6">
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <ShieldCheck size={18} className="text-[#d97706]" />
                <h3 className="text-sm font-extrabold text-gray-900 tracking-tight">Security Compliance</h3>
              </div>
              <p className="text-[12px] font-medium text-gray-500 leading-relaxed relative z-10">
                Fipmoney complies with SEBI digital asset registry codes. All PAN and bank details are encrypted locally before transfer.
              </p>
              
              {/* Decorative graphic */}
              <div className="mt-8 flex justify-center items-center relative h-32 w-full">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-50 rounded-full z-0 blur-3xl opacity-60" />
                 <Shield size={110} strokeWidth={1} className="text-orange-100 fill-orange-50 relative z-10" />
                 <Check size={40} strokeWidth={4} className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] z-20" />
                 <Lock size={36} strokeWidth={1.5} className="text-orange-200 fill-orange-50 absolute left-1/2 top-1/2 ml-4 mt-2 z-30 drop-shadow-sm bg-white rounded-md p-1" />
              </div>
            </div>

          </div>
        </div>''',
    content, flags=re.DOTALL
)

# 11. Footer info blocks
footer_content = '''
        {/* Footer info blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm mt-8">
           <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-50 rounded-full text-purple-600 shrink-0">
                 <Lock size={20} />
              </div>
              <div>
                 <h4 className="text-sm font-extrabold text-gray-900">Secure Data</h4>
                 <p className="text-[11px] text-gray-500 font-semibold mt-1">Your data is protected with bank-grade encryption.</p>
              </div>
           </div>
           <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-50 rounded-full text-orange-600 shrink-0">
                 <ShieldCheck size={20} />
              </div>
              <div>
                 <h4 className="text-sm font-extrabold text-gray-900">Verified Accounts</h4>
                 <p className="text-[11px] text-gray-500 font-semibold mt-1">All accounts are verified and linked for safe transactions.</p>
              </div>
           </div>
           <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-full text-blue-600 shrink-0">
                 <Eye size={20} />
              </div>
              <div>
                 <h4 className="text-sm font-extrabold text-gray-900">Privacy First</h4>
                 <p className="text-[11px] text-gray-500 font-semibold mt-1">We do not share your information with third parties.</p>
              </div>
           </div>
           <div className="flex items-start gap-4">
              <div className="p-3 bg-green-50 rounded-full text-green-600 shrink-0">
                 <Headset size={20} />
              </div>
              <div>
                 <h4 className="text-sm font-extrabold text-gray-900">Need Help?</h4>
                 <p className="text-[11px] text-gray-500 font-semibold mt-1">Our support team is available 24/7 to assist you.</p>
                 <button className="text-[11px] font-bold text-[#d97706] mt-2 bg-transparent border-none p-0 flex items-center gap-1 cursor-pointer">
                    Contact Support <ChevronRight size={12} />
                 </button>
              </div>
           </div>
        </div>

      </div>

      {/* Video KYC Call Overlay */}'''
content = content.replace('\n      </div>\n\n      {/* Video KYC Call Overlay */}', footer_content)

with open('src/app/components/SettingsPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied UI redesign cleanly!")
