"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, AlertCircle, ChevronRight, Sparkles, UserCheck, ShieldCheck, ArrowRight
} from "lucide-react";
import { MongoUser } from "../utils/userStorage";
import { calculateProfileCompletion, ProfileTaskItem } from "../utils/profileCompletionCalculator";

interface ProfileCompletionWidgetProps {
  user: Partial<MongoUser> | null;
  onNavigate?: (tab: string) => void;
  compact?: boolean;
  overrideFields?: {
    fullName?: string;
    email?: string;
    mobileNumber?: string;
    dob?: string;
    gender?: string;
    hasAvatar?: boolean;
    panNumber?: string;
    upiId?: string;
  };
}

export default function ProfileCompletionWidget({
  user,
  onNavigate,
  compact = false,
  overrideFields
}: ProfileCompletionWidgetProps) {
  const [showTasksModal, setShowTasksModal] = useState(false);
  const result = calculateProfileCompletion(user, overrideFields);

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.percentage / 100) * circumference;

  return (
    <div className="w-full font-sans">
      {compact ? (
        /* Compact Card (Sidebar / Header Widget) */
        <div className="bg-white/90 backdrop-blur-md rounded-[24px] p-4 border border-purple-100 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5">
              {/* Radial Progress SVG */}
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r={radius / 1.6}
                    className="text-slate-100 stroke-current"
                    strokeWidth="3.5"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="24"
                    cy="24"
                    r={radius / 1.6}
                    className="text-purple-600 stroke-current"
                    strokeWidth="3.5"
                    strokeDasharray={2 * Math.PI * (radius / 1.6)}
                    initial={{ strokeDashoffset: 2 * Math.PI * (radius / 1.6) }}
                    animate={{
                      strokeDashoffset: (2 * Math.PI * (radius / 1.6)) - (result.percentage / 100) * (2 * Math.PI * (radius / 1.6))
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-[11px] font-black text-slate-900 tracking-tight">
                  {result.percentage}%
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-black text-slate-900 tracking-tight">Profile Completion</h4>
                  <Sparkles size={13} className="text-purple-500 shrink-0" />
                </div>
                <span className={`inline-block px-2 py-0.5 mt-0.5 rounded-full text-[9px] font-extrabold border ${result.statusBadgeBg}`}>
                  {result.statusLabel}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowTasksModal(!showTasksModal)}
              className="text-[11px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-0.5 border-none bg-transparent cursor-pointer outline-none"
            >
              <span>{result.percentage === 100 ? "View Details" : `${result.missingTasks.length} left`}</span>
              <ChevronRight size={13} strokeWidth={2.5} />
            </button>
          </div>

          {/* Animated Linear Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1 relative">
            <motion.div
              className={`h-full bg-gradient-to-r ${result.progressGradient} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${result.percentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>

          {/* Missing Task Callout Banner */}
          {result.missingTasks.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 truncate">
                <AlertCircle size={13} className="text-amber-500 shrink-0" />
                <span className="text-[10px] font-semibold text-slate-600 truncate">
                  Next: <strong className="text-slate-900 font-extrabold">{result.missingTasks[0].title}</strong> (+{result.missingTasks[0].weight}%)
                </span>
              </div>
              <button
                onClick={() => onNavigate && onNavigate(result.missingTasks[0].targetTab)}
                className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-[9px] transition-all border border-purple-200/60 shrink-0 cursor-pointer outline-none"
              >
                {result.missingTasks[0].actionText}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Full Expanded Dashboard Banner Widget */
        <div className="bg-gradient-to-br from-white via-purple-50/40 to-slate-50 rounded-[28px] p-6 border border-purple-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 w-full md:w-auto">
            {/* Radial Gauge */}
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="text-slate-100 stroke-current"
                  strokeWidth="6"
                  fill="transparent"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="text-purple-600 stroke-current"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-lg font-black text-slate-900 tracking-tight leading-none">
                  {result.percentage}%
                </span>
                <span className="text-[9px] font-bold text-slate-400 mt-0.5">Score</span>
              </div>
            </div>

            {/* Info Title */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Profile Strength & Completion
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${result.statusBadgeBg}`}>
                  {result.statusLabel}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1">
                {result.percentage === 100
                  ? "Awesome! Your profile is fully complete and 100% verified."
                  : `Complete your missing profile steps to unlock high limits and instant withdrawals (${result.completedTasksCount}/${result.totalTasksCount} done).`}
              </p>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
            {result.missingTasks.length > 0 ? (
              <button
                onClick={() => onNavigate && onNavigate(result.missingTasks[0].targetTab)}
                className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs sm:text-sm shadow-md shadow-purple-600/20 transition-all cursor-pointer flex items-center gap-1.5 border-none outline-none active:scale-95"
              >
                <span>{result.missingTasks[0].actionText} (+{result.missingTasks[0].weight}%)</span>
                <ArrowRight size={15} strokeWidth={3} />
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>Verified Partner Profile</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Task Breakdown Modal */}
      <AnimatePresence>
        {showTasksModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">Profile Completion Checklist</h3>
                  <p className="text-xs text-slate-500 font-medium">Complete tasks to reach 100% verification</p>
                </div>
                <button
                  onClick={() => setShowTasksModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm border-none cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Progress Summary Header */}
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-purple-900">Total Completion Score</span>
                <span className="text-sm font-black text-purple-700">{result.percentage}%</span>
              </div>

              {/* Task Items List */}
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {result.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                      task.isCompleted
                        ? "bg-slate-50/70 border-slate-100"
                        : "bg-white border-purple-100 shadow-2xs hover:border-purple-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {task.isCompleted ? (
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-purple-400 shrink-0" />
                      )}
                      <div className="truncate">
                        <div className={`text-xs font-bold ${task.isCompleted ? "text-slate-500 line-through" : "text-slate-900"}`}>
                          {task.title}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium truncate">{task.description}</div>
                      </div>
                    </div>

                    {!task.isCompleted ? (
                      <button
                        onClick={() => {
                          setShowTasksModal(false);
                          if (onNavigate) onNavigate(task.targetTab);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[10px] shrink-0 border-none cursor-pointer"
                      >
                        +{task.weight}% {task.actionText}
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 shrink-0">
                        +{task.weight}% Done
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
